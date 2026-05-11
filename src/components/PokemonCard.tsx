import { useContext } from "react"
import type { PokemonDetail } from "../types"
import { PokedexContext } from "../context/pokedexContext"
import { pokeTypes } from "../helpers/pokemonTypes"

interface PokemonCardProps {
  pokemon: {
    name: string
    url: string
  }
} 

function PokemonCard({pokemon: { name }}: PokemonCardProps) {
  const pokedex = useContext(PokedexContext)
  const detail: PokemonDetail = pokedex[name]

  return (
    <div className="p-4 w-42 flex flex-col justify-center items-center bg-red-950">
      <h2 className="text-base">{name}</h2>
      <div className="text-base text-bold">
        {detail?.abilities?.map((ability) => (
          <div key={ability.ability.name}>{ability.ability.name}</div>
        ))}
      </div>
      <img src={detail?.sprites?.front_default} className="h-24" alt={`${name} Sprite`} title={name} />
      <div className="types flex">
        {detail?.types.map(({type: {name}}) => {
          const color = pokeTypes.find(pokeType => pokeType.name === name)

          return <img
            src={`https://bifrost.loreheart.com/projects/pokedex/icons/gen-9-types-white/${name}.png`}
            key={name}
            alt={`${name} type icon`}
            title={`${name} type`}
            className=""
            style={{backgroundColor: color?.color}}
          />
        })}
      </div>
    </div>
  )
}

export default PokemonCard
