import { pokeTypes } from "../helpers/pokemonTypes"

interface PokemonCardProps {
  typeName: string
  active?: boolean
} 

function PokemonCardIcon({typeName, active = false}: PokemonCardProps) {
  const color = pokeTypes.find(pokeType => pokeType.name === typeName)
  return (
    <img
      src={`https://bifrost.loreheart.com/projects/pokedex/icons/gen-9-types-white/${typeName}.png`}
      key={typeName}
      alt={`${typeName} type icon`}
      title={`${typeName} type`}
      className={`h-12 w-12 rounded-full ${active && 'border-4 border-amber-700'}`}
      style={{backgroundColor: color?.color}}
    />
  )
}

export default PokemonCardIcon
