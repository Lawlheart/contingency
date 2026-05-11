import { pokeTypes } from "../helpers/pokemonTypes"
import PokemonCardIcon from "./PokemonTypeIcon"

interface TypeFilterProps {
  typeFilter: string;
  setTypeFilter: (typeName: string) => null
}

function TypeFilter({typeFilter, setTypeFilter}: TypeFilterProps) {


  return (
    <div className="type-filter flex flex-wrap gap-4 p-4 justify-center">
        {typeFilter !== '' && <div className="w-full flex justify-center items-center gap-4">
          Active Filter: <PokemonCardIcon
            key={typeFilter}
            typeName={typeFilter}
          ></PokemonCardIcon>
          <button onClick={() => setTypeFilter('')} className="p-2 hover:scale-110">Clear</button>
        </div>}
        {pokeTypes.map(({name}) => name).map((typeName) => (
          
          <button onClick={() => setTypeFilter(typeName)} key={typeName}>
            <PokemonCardIcon
              typeName={typeName}
              active={typeName === typeFilter}
            ></PokemonCardIcon>

          </button>
        ))}
      </div>
  )
}

export default TypeFilter
