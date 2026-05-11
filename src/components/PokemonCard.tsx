interface PokemonCardProps {
  pokemon: {
    name: string
    url: string
  }
} 

function PokemonCard({pokemon: { name }}: PokemonCardProps) {

  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

export default PokemonCard
