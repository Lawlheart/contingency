import { useState } from "react";
import type { PokemonListItem, PokemonPagination } from "../types";

import { tursoConnection } from '../helpers/turso'

export function usePokedex() {
  const [pokedex, setPokedex] = useState<PokemonListItem[]>([])
  const [pagination, setPagination] = useState<PokemonPagination>()
  const [page, setPage] = useState<number>(1)

  const initializePokedex = async (): Promise<PokemonPagination> => {
    const cachedPokedex = await tursoConnection.prepare(`
      CREATE TABLE IF NOT EXISTS pokedex (page STRING, contents STRING);
    `);
    const pokemon = await cachedPokedex.all();
    // console.log(pokemon);
    return pokemon[0]
  }


  const loadFromCache = async (page=1): Promise<PokemonPagination | undefined> => {
    try {
      const cachedPokedex = await tursoConnection.prepare(`
        SELECT * FROM pokedex WHERE page = ${page};  
      `);
      const pokedexes = await cachedPokedex.all();
      console.log(pokedexes)
      return JSON.parse(pokedexes[0].contents)
    } catch (e: {code: string, message: string}) {
      if (e?.code === "SQLITE_UNKNOWN" && e?.message.includes("no such table")) {
        console.log("No Table Found")
        return initializePokedex()
      }
    }
  }

  const savePokedex = async (response: PokemonPagination, page=1) => {
    const query = `
      INSERT INTO pokedex (page, contents) VALUES ('${page}', '${JSON.stringify(response)}');
    `
    const savedPokemon = await tursoConnection.prepare(query)
    const saved: PokemonPagination[] = await savedPokemon.all()
    console.log('SAVED PAGE ', page)
    return saved
  }

  const fetchPokemon = async (page=1): Promise<PokemonPagination> => {
    const request = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${(page - 1) * 20}`)
    const response: PokemonPagination = await request.json()

    console.log(response)
    return response
  }

  const loadPokedex = async (page=1): Promise<PokemonListItem[]> => {
    const cached = await loadFromCache(page)
    let pokedexResults: PokemonListItem[];
    console.log(cached)
    if(!cached || !cached?.results) {
      const fetchedPokemon = await fetchPokemon(page)
      setPokedex(fetchedPokemon.results)
      pokedexResults = fetchedPokemon.results
      setPagination(fetchedPokemon)

      savePokedex(fetchedPokemon, page)
    } else {
      console.log('LOADED CACHED PAGE ', page)
      pokedexResults = cached.results
    }
    setPokedex(pokedexResults)
    return pokedexResults
  }

  const loadPage = async (direction: 'previous' | 'next') => {
    const lastPage = Math.floor(1350 / 20) // 1350 is last pokemon as of 5/10/26

    if (direction === 'previous' && page > 1) {
      setPage(page - 1)
      await loadPokedex(page - 1)
    } else if (direction === 'next' && page < lastPage) {
      setPage(page + 1)
      await loadPokedex(page + 1)
    }

  }

  return {
    loadPokedex,
    pokedex,
    page,
    loadPage,
    pagination,
  }
}