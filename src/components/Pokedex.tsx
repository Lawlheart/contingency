import { useEffect } from "react"
import { usePokedex } from "../hooks/usePokedex"
import PokemonCard from "./PokemonCard"


function Pokedex() {
  const { loadPokedex, pokedexPage, page, loadPage, pagination, pokedex } = usePokedex()

  useEffect(() => {
    const load = async () => {
      await loadPokedex()
    }
    load()
  }, [])

  const lastPage = Math.ceil((pagination?.count || 1350) / 20) // 1350 is last pokemon as of 5/10/26

  return (
    <>
      <h1>Pokedex ({Object.keys(pokedex).length})</h1>
      <div>
        {page > 1 && <button onClick={() => loadPage('previous')} className="prev p-2 cursor-pointer">&larr; Prev</button>}
        {page < lastPage && <button onClick={() => loadPage('next')} className="next p-2 cursor-pointer">Next &rarr;</button>}
      </div>
      <div>
        {pokedexPage.map(pokemon => (
          <PokemonCard pokemon={pokemon} key={pokemon.name} />
        ))}
      </div>
    </>
  )
}

export default Pokedex
