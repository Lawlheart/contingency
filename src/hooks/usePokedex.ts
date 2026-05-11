import { useState } from "react";
import type { PokemonListItem } from "../types";

import { tursoConnection } from '../helpers/turso'

export function usePokedex() {
  const [pokedex, setPokedex] = useState<PokemonListItem[]>([])
  // const pokedexCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

  const initializePokedex = async (): Promise<PokemonListItem[]> => {
    const cachedPokedex = await tursoConnection.exec(`
      CREATE TABLE IF NOT EXISTS pokedex (contents STRING);
    `);
    const pokemon = await cachedPokedex.all();
    console.log(pokemon);
    return pokemon
  }


  const loadFromCache = async (): Promise<PokemonListItem[] | undefined> => {
    try {
      const cachedPokedex = await tursoConnection.prepare("SELECT * FROM pokedex");
      const pokedexes = await cachedPokedex.all();
      console.log(pokedexes, typeof pokedexes)
      return JSON.parse([...pokedexes].pop().contents);
    } catch (e: {code: string, message: string}) {
      if (e?.code === "SQLITE_UNKNOWN" && e?.message.includes("no such table")) {
        console.log("No Table Found")
        return initializePokedex()
      }
    }
  }

  const savePokedex = async (pokedex: PokemonListItem[]) => {
    const query = `
      INSERT INTO pokedex (contents) VALUES ('${JSON.stringify(pokedex)}');
    `
    console.log(query)
    const savedPokemon = await tursoConnection.prepare(query)
    const saved = await savedPokemon.all()
    console.log(saved)
  }

  const loadPokedex = async (): Promise<PokemonListItem[]> => {
    const cached = await loadFromCache()
    let pokedexResults;
    console.log(cached)
    if(!cached || cached.length === 0) {
      const request = await fetch('https://pokeapi.co/api/v2/pokemon/')
      const response = await request.json()
      setPokedex(response.results)
      pokedexResults = response.results

      savePokedex(response.results)
    } else {
      pokedexResults = cached
    }
    setPokedex(pokedexResults)
    return pokedexResults
  }

  return {
    loadPokedex,
    pokedex
  }
}