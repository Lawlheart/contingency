import { useEffect, useState } from "react"
import { usePokedex } from "../hooks/usePokedex"
import PokemonCard from "./PokemonCard"
import { PokedexContext } from "../context/pokedexContext"
import { POKEAPI_CONFIG } from "../config/pokeapi"


function Pokedex() {
  const { loadPokedex, pokedexPage, page, loadPage, pagination, pokedex } = usePokedex()
  const [paginated, setPaginated] = useState(true)

  useEffect(() => {
    const load = async () => {
      await loadPokedex()
    }
    load()
  }, [])

  const dexLimit = pagination?.count || POKEAPI_CONFIG.dexLimit
  const lastPage = Math.ceil(dexLimit / 20)

  return (
    <PokedexContext.Provider value={pokedex}>
      <h1>Pokedex ({Object.keys(pokedex).length})</h1>
      <div className="settings">
        <button onClick={() => {
          setPaginated(!paginated)
          loadPage('first')
        }}>Pagination: {paginated ? 'On' : 'Off'}</button>
      </div>
      {paginated ? <div>
        {page !== 1 && <button onClick={() => loadPage('first')} className="first p-2">First</button>}
        {page > 1 && <button onClick={() => loadPage('previous')} className="prev p-2">&larr; Prev</button>}
        {page < lastPage && <button onClick={() => loadPage('next')} className="next p-2">Next &rarr;</button>}
        {page < lastPage && <button onClick={() => loadPage('last')} className="last p-2">Last</button>}
      </div> : <div>
        {Object.keys(pokedex).length < dexLimit && <button onClick={() => loadPage('more')} className="more p-2">Load More</button>}
      </div>}
      <div className="flex flex-wrap p-4 gap-4 justify-center">
        {(paginated ? pokedexPage : Object.keys(pokedex).map(key => pokedex[key])).map(pokemon => (
          <PokemonCard pokemon={pokemon} key={pokemon.name} />
        ))}
      </div>
      <div>
        {Object.keys(pokedex).length < dexLimit && <button onClick={() => loadPage('more')} className="more p-2">Load More</button>}
      </div>
    </PokedexContext.Provider>
  )
}

export default Pokedex
