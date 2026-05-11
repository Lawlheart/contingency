import { useEffect, useState } from "react"
import { usePokedex } from "../hooks/usePokedex"
import PokemonCard from "./PokemonCard"
import { PokedexContext } from "../context/pokedexContext"
import { POKEAPI_CONFIG } from "../config/pokeapi"
import TypeFilter from "./TypeFilter"
import SearchFilter from "./SearchFilter"
import PokemonPagination from "./PokemonPagination"
import LoadMore from "./LoadMore"


function Pokedex() {
  const { loadPokedex, pokedexPage, page, loadPage, pokedex, typeFilter, setTypeFilter, searchFilter, setSearchFilter } = usePokedex()
  const [paginated, setPaginated] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await loadPokedex()
      setLoading(false)
    }
    load()
  }, [])

  const onLoadPage = async (direction: string) => {
    setLoading(true)
    await loadPage(direction)
      setLoading(false)
    
  }

  const {dexLimit, lastPage } = POKEAPI_CONFIG
  const pagePokemonNames = paginated ? pokedexPage.map(({name}) => name) : Object.keys(pokedex)

  let pagePokedex = pagePokemonNames.map(key => pokedex[key])
  if (typeFilter !== '') {
    pagePokedex = pagePokedex.filter((pokemon) => pokemon?.types?.map(({type}) => type?.name).includes(typeFilter))
  } 
  if (searchFilter !== '') {
    pagePokedex = pagePokedex.filter(({name}) => name.includes(searchFilter))
  }

  return (
    <PokedexContext.Provider value={pokedex}>
      <h1>Pokedex ({Object.keys(pokedex).length})</h1>
      <div className="settings flex justify-center gap-4">
        <button
          className="p-2 bg-red-950 border-4 border-white max-w-40 self-center hover:scale-110"
          onClick={() => {
            setPaginated(!paginated)
            onLoadPage('first')
          }}>Pagination: {paginated ? 'On' : 'Off'}</button>
          {!paginated && <LoadMore dexLimit={dexLimit} pokedex={pokedex} loadPage={onLoadPage} ></LoadMore>}
          <SearchFilter searchFilter={searchFilter} onSearchFilter={(newSearch) => setSearchFilter(newSearch)}></SearchFilter>
      </div>
      <TypeFilter typeFilter={typeFilter} setTypeFilter={setTypeFilter}></TypeFilter>
      
      
      {paginated && <PokemonPagination page={page} lastPage={lastPage} loadPage={onLoadPage}></PokemonPagination>}
      <div className="flex flex-wrap p-4 gap-4 justify-center">
        {pagePokedex.map(pokemon => !!pokemon && (
          <PokemonCard pokemon={pokemon} key={pokemon.name} />
        ))}
        {(pagePokedex.length === 0 && !loading) &&
          <div className="m-2 p-2 bg-red-950 text-white max-w-96 self-center border-4 border-white">
            {paginated && !!pagePokemonNames ?
              <div className="message">
                No pokemon found on page {page}
              </div> :
              <div>
                No pokemon found on in pokedex, {Object.keys(pokedex).length} Pokemon in memory.
              </div>
            }
            <div>
              Active Filters:
              {typeFilter && <div>TypeFilter: {typeFilter}</div>}
              {searchFilter && <div>searchFilter: {searchFilter}</div>}
            </div>

          </div>
        }
      </div>
      {loading && <div className="loader self-center h-42"></div>}
      {!paginated &&
        <LoadMore dexLimit={dexLimit} pokedex={pokedex} loadPage={onLoadPage} ></LoadMore>
      }
    </PokedexContext.Provider>
  )
}

export default Pokedex
