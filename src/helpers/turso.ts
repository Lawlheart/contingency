import { connect } from "@tursodatabase/serverless";

console.log(import.meta.env)

const conn = connect({
  url: import.meta.env.VITE_TURSO_DATABASE_URL,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});

export const tursoConnection = conn

export const loadTurso = async () => {
  const checkCache = async () => {
    const pokedexDBSetup = await conn.prepare(`
      CREATE TABLE IF NOT EXISTS pokedex (page STRING, contents STRING);
    `);
    const pokedex = await pokedexDBSetup.all();

    const pokemonDBSetup = await conn.prepare(`
      CREATE TABLE IF NOT EXISTS pokemon (species STRING, detail STRING);
    `);
    
    const pokemon = await pokemonDBSetup.all();
    return {
      pokedex,
      pokemon,
    }
  }

  return checkCache()
}