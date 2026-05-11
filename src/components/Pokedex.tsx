import { useEffect } from "react"
import { usePokedex } from "../hooks/usePokedex"
import PokemonCard from "./PokemonCard"


function Pokedex() {
  const { loadPokedex, pokedex, page, loadPage, pagination } = usePokedex()

  useEffect(() => {
    const load = async () => {
      await loadPokedex()
    }
    load()
  }, [])

  const lastPage = Math.floor(1350 / 20) // 1350 is last pokemon as of 5/10/26

  return (
    <>
      <h1>Pokedex</h1>
      <div>
        {page > 1 && <button onClick={() => loadPage('previous')} className="prev p-2 cursor-pointer">&larr; Prev</button>}
        {page < lastPage && <button onClick={() => loadPage('next')} className="next p-2 cursor-pointer">Next &rarr;</button>}
      </div>
      <div>
        {pokedex.map(pokemon => (
          <PokemonCard pokemon={pokemon} key={pokemon.name} />
        ))}
      </div>
    </>
  )
}

export default Pokedex
