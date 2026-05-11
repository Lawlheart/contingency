import { useEffect } from "react"
import { usePokedex } from "../hooks/usePokedex"
import PokemonCard from "./PokemonCard"


function Pokedex() {
  const { loadPokedex, pokedex } = usePokedex()

  useEffect(() => {
    const load = async () => {
      await loadPokedex()
      console.log(pokedex)
    }
    load()
  }, [])


  return (
    <>
      <h1>Pokedex</h1>
      <div>
        {pokedex.map(pokemon => (
          <PokemonCard pokemon={pokemon} key={pokemon.name} />
        ))}
      </div>
    </>
  )
}

export default Pokedex
