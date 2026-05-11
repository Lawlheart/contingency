import { useEffect } from "react"
import { usePokedex } from "../hooks/usePokedex"
import PokemonCard from "./PokemonCard"
import { PokedexContext } from "../context/pokedexContext"


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
    <PokedexContext.Provider value={pokedex}>
      <h1>Pokedex ({Object.keys(pokedex).length})</h1>
      <div>
        {page > 1 && <button onClick={() => loadPage('previous')} className="prev p-2 cursor-pointer">&larr; Prev</button>}
        {page < lastPage && <button onClick={() => loadPage('next')} className="next p-2 cursor-pointer">Next &rarr;</button>}
      </div>
      <div className="flex flex-wrap p-4 gap-4 justify-center">
        {pokedexPage.map(pokemon => (
          <PokemonCard pokemon={pokemon} key={pokemon.name} />
        ))}
      </div>
    </PokedexContext.Provider>
  )
}

export default Pokedex
