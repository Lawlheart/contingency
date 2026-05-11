import type { Dispatch, SetStateAction } from "react";
import { pokeTypes } from "../helpers/pokemonTypes"
import PokemonCardIcon from "./PokemonTypeIcon"

interface TypeFilterProps {
  typeFilter: string;
  setTypeFilter: Dispatch<SetStateAction<string>>
}

function TypeFilter({typeFilter, setTypeFilter}: TypeFilterProps) {
  return (
    <div className="type-filter flex flex-wrap gap-4 p-4 justify-center">
      {typeFilter !== '' && <div className="w-full flex justify-center items-center gap-4">
        Active Filter: <PokemonCardIcon
          key={typeFilter}
          typeName={typeFilter}
        ></PokemonCardIcon>
        <button onClick={() => setTypeFilter('')} className="p-2 bg-red-950 border-4 border-white max-w-40 self-center hover:scale-110">Clear</button>
      </div>}
      <div className="types flex flex-wrap gap-1 justify-center">
        {pokeTypes.map(({name}) => name).map((typeName) => (
          <button onClick={() => setTypeFilter(typeName)} key={typeName}>
            <PokemonCardIcon
              typeName={typeName}
              active={typeName === typeFilter}
            ></PokemonCardIcon>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TypeFilter
