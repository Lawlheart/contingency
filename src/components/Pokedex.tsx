import { useEffect, useState } from "react"
import { usePokedex } from "../hooks/usePokedex"
import PokemonCard from "./PokemonCard"
import { PokedexContext } from "../context/pokedexContext"
import { POKEAPI_CONFIG } from "../config/pokeapi"
import TypeFilter from "./TypeFilter"


function Pokedex() {
  const { loadPokedex, pokedexPage, page, loadPage, pagination, pokedex, typeFilter, setTypeFilter } = usePokedex()
  const [paginated, setPaginated] = useState(true)

  useEffect(() => {
    const load = async () => {
      await loadPokedex()
    }
    load()
  }, [])

  const dexLimit = pagination?.count || POKEAPI_CONFIG.dexLimit
  const lastPage = Math.ceil(dexLimit / POKEAPI_CONFIG.pageSize)
  const pagePokemonNames = paginated ? pokedexPage.map(({name}) => name) : Object.keys(pokedex)

  let pagePokedex = pagePokemonNames.map(key => pokedex[key])
  if (typeFilter !== '') {
    pagePokedex = pagePokedex.filter(({types}) => types.map(({type}) => type.name).includes(typeFilter))
  }

  return (
    <PokedexContext.Provider value={pokedex}>
      <h1>Pokedex ({Object.keys(pokedex).length})</h1>
      <div className="settings">
        <button onClick={() => {
          setPaginated(!paginated)
          loadPage('first')
        }}>Pagination: {paginated ? 'On' : 'Off'}</button>
      </div>
      <TypeFilter typeFilter={typeFilter} setTypeFilter={setTypeFilter}></TypeFilter>
      
      {paginated ? <div>
        {page !== 1 && <button onClick={() => loadPage('first')} className="first p-2 hover:scale-110">First</button>}
        {page > 1 && <button onClick={() => loadPage('previous')} className="prev p-2 hover:scale-110">&larr; Prev</button>}
        {page < lastPage && <button onClick={() => loadPage('next')} className="next p-2 hover:scale-110">Next &rarr;</button>}
        {page < lastPage && <button onClick={() => loadPage('last')} className="last p-2 hover:scale-110">Last</button>}
      </div> : <div>
        {Object.keys(pokedex).length < dexLimit && <button onClick={() => loadPage('more')} className="more p-2">
          Load More&nbsp;
          {Math.round(Object.keys(pokedex).length / dexLimit * 100)}%
          </button>}
      </div>}
      <div className="flex flex-wrap p-4 gap-4 justify-center">
        {pagePokedex.map(pokemon => !!pokemon && (
          <PokemonCard pokemon={pokemon} key={pokemon.name} />
        ))}
      </div>
      {!paginated && <div>
        {Object.keys(pokedex).length < dexLimit && <button onClick={() => loadPage('more')} className="more p-2">
          Load More&nbsp;
          {Math.round(Object.keys(pokedex).length / dexLimit * 100)}%
          </button>}
      </div>}
    </PokedexContext.Provider>
  )
}

export default Pokedex
