import { useContext } from "react"
import type { PokemonDetail } from "../types"
import { PokedexContext } from "../context/pokedexContext"
import PokemonCardIcon from "./PokemonTypeIcon"

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
    <div className="p-4 w-42 flex flex-col justify-center items-center bg-red-950 border-4 border-white">
      <h2 className="text-base capitalize">{detail?.id}. {name}</h2>
      <div className="text-base text-bold text-white">
        {detail?.abilities?.map((ability) => (
          <div key={ability.ability.name} className="capitalize">{ability.ability.name.replace('-', ' ')}</div>
        ))}
      </div>
      <img src={detail?.sprites?.front_default} className="h-24" alt={`${name} Sprite`} title={name} />
      <div className="types flex gap-2">
        {detail?.types.map(({type: {name}}) => <PokemonCardIcon key={name} typeName={name}></PokemonCardIcon>)}
      </div>
    </div>
  )
}

export default PokemonCard
