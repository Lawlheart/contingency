interface PokemonCardProps {
  pokemon: {
    name: string
    url: string
  }
} 

function PokemonCard({pokemon: { name }}: PokemonCardProps) {
  return (
    <>
      <h2 className="text-base">{name}</h2>
    </>
  )
}

export default PokemonCard
