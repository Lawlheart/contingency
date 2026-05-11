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
  const { loadPokedex, pokedexPage, page, loadPage, pagination, pokedex, typeFilter, setTypeFilter, searchFilter, setSearchFilter } = usePokedex()
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
    pagePokedex = pagePokedex.filter((pokemon) => pokemon?.types?.map(({type}) => type?.name).includes(typeFilter))
  } 
  if (searchFilter !== '') {
    pagePokedex = pagePokedex.filter(({name}) => name.includes(searchFilter))
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
      <SearchFilter searchFilter={searchFilter} onSearchFilter={(newSearch) => setSearchFilter(newSearch)}></SearchFilter>
      
      {paginated ?
        <PokemonPagination page={page} lastPage={lastPage} loadPage={loadPage}></PokemonPagination> :
        <LoadMore dexLimit={dexLimit} pokedex={pokedex} loadPage={loadPage} ></LoadMore>
      }
      <div className="flex flex-wrap p-4 gap-4 justify-center">
        {pagePokedex.map(pokemon => !!pokemon && (
          <PokemonCard pokemon={pokemon} key={pokemon.name} />
        ))}
      </div>
      {!paginated &&
        <LoadMore dexLimit={dexLimit} pokedex={pokedex} loadPage={loadPage} ></LoadMore>
      }
    </PokedexContext.Provider>
  )
}

export default Pokedex
