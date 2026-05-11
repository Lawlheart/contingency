import { useState } from "react";
import type { Pokedex, PokemonDetail, PokemonListItem, PokemonPagination } from "../types";

import { tursoConnection } from '../helpers/turso'
import { POKEAPI_CONFIG } from "../config/pokeapi";

export function usePokedex() {
  const [pokedex, setPokedex] = useState<Pokedex>({})
  const [pokedexPage, setPokedexPage] = useState<PokemonListItem[]>([])
  const [pagination, setPagination] = useState<PokemonPagination>()
  const [page, setPage] = useState<number>(1)
  const [typeFilter, setTypeFilter] = useState('')

  // creates pokedexp page database table with Turso
  const initializePokedex = async (): Promise<PokemonPagination> => {
    const cachedPokedex = await tursoConnection.prepare(`
      CREATE TABLE IF NOT EXISTS pokedex (page STRING, contents STRING);
    `);
    const pokemon = await cachedPokedex.all();
    
    const pokemonDBSetup = await tursoConnection.prepare(`
      CREATE TABLE IF NOT EXISTS pokemon (species STRING, detail STRING);
    `);
    await pokemonDBSetup.all();
    return pokemon[0]
  }


  // Loads pokedex page from database with Turso
  const loadFromCache = async (page=1): Promise<PokemonPagination | undefined> => {
    try {
      const cachedPokedex = await tursoConnection.prepare(`
        SELECT * FROM pokedex WHERE page = ${page};  
      `);
      const pokedexes = await cachedPokedex.all();
      return JSON.parse(pokedexes[0].contents)
    } catch (e: {code: string, message: string}) {
      if (e?.code === "SQLITE_UNKNOWN" && e?.message.includes("no such table")) {
        console.log("No Table Found")
        return initializePokedex()
      }
    }
  }

  // Saves pokedex page to database with Turso
  const savePokedex = async (response: PokemonPagination, page=1) => {
    const query = `
      INSERT INTO pokedex (page, contents) VALUES ('${page}', '${JSON.stringify(response)}');
    `
    const savedPokemon = await tursoConnection.prepare(query)
    const saved: PokemonPagination[] = await savedPokemon.all()
    console.log('SAVED PAGE ', page)
    return saved
  }

  // Saves pokedex page to database with Turso
  const savePokemon = async (pokemon: PokemonDetail) => {
    const query = `
      INSERT INTO pokemon (species, detail) VALUES ('${pokemon.name}', '${JSON.stringify(pokemon)}');
    `
    const savedPokemon = await tursoConnection.prepare(query)
    const saved: PokemonPagination[] = await savedPokemon.all()
    console.log('SAVED POKEMON ', pokemon.name)
    return saved
  }

  // Queries POKEAPI for pokemon list, paginated
  const fetchPokemon = async (page=1): Promise<PokemonPagination> => {
    const request = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${POKEAPI_CONFIG.pageSize}&offset=${(page - 1) * POKEAPI_CONFIG.pageSize}`)
    const response: PokemonPagination = await request.json()

    savePokedex(response, page)
    console.log(response)
    return response
  }

  // Checks for cached pokemon with Turso
  // launches savePokemon if no cached entity exists
  // Loads new or cached entity to Pokedex
  const loadPokemonDetail = async ({ name, url}: PokemonListItem) => {
    let loadedPokemon: PokemonDetail;
    try {
      const cachedPokemon = await tursoConnection.prepare(`
        SELECT * FROM pokemon WHERE species='${name}';  
      `);
      const pokemon: {species: string, detail: string}[] = await cachedPokemon.all();
      loadedPokemon = JSON.parse(pokemon[0].detail)
    } catch(e) {
      // console.error(e)
      console.log("Pokemon detail not cached, attempting to save")

      const request = await fetch(url)
      const { id, name, stats, types, sprites, abilities, is_default } = await request.json()

      const newPokemonDetail: PokemonDetail = {
        id,
        name,
        stats,
        types,
        sprites,
        url,
        abilities,
        is_default,
      }
      console.log(newPokemonDetail)
      await savePokemon(newPokemonDetail)

      loadedPokemon = newPokemonDetail
    }
    setPokedex((pokedex) => ({
      ...pokedex,
      [name]: loadedPokemon
    }))
  }

  // Checks for cached pokemon with Turso
  // launches fetchPokemon if no cached entity exists
  // Loads new or cached entity to Pokedex, updates pagination
  const loadPokedex = async (page=1): Promise<PokemonListItem[]> => {
    const cached = await loadFromCache(page)
    let pokedexResults: PokemonListItem[];
    console.log(cached)
    if(!cached || !cached?.results) {
      const fetchedPokemon = await fetchPokemon(page)
      pokedexResults = fetchedPokemon.results
    } else {
      console.log('LOADED CACHED PAGE ', page)
      pokedexResults = cached.results
    }
    await pokedexResults.filter(({name}) => !pokedex[name]).forEach(async (pokedexEntry) => {
      await loadPokemonDetail(pokedexEntry)
    })
    console.log(pokedexResults)

    setPokedexPage(pokedexResults)
    setPagination(cached)
    return pokedexResults
  }

  // For pagination
  const loadPage = async (direction: 'previous' | 'next' | 'first' | 'last' | 'more') => {
    const lastPage = Math.ceil((pagination?.count || POKEAPI_CONFIG.dexLimit) / POKEAPI_CONFIG.pageSize)
    let newPage

    switch (direction) {
      case 'previous':
        newPage = page - 1;
        break;
      case 'next':
        newPage = page + 1;
        break;
      case 'last':
        newPage = lastPage;
        break;
      case 'more':
        newPage = Math.ceil(Object.keys(pokedex).length / POKEAPI_CONFIG.pageSize) + 1
        break;
      case 'first':
      default:
        newPage = 1;
        break;
    }

    setPage(newPage)
    await loadPokedex(newPage)
  }

  return {
    loadPokedex,
    pokedexPage,
    page,
    loadPage,
    pagination,
    pokedex,
    typeFilter,
    setTypeFilter,
  }
}