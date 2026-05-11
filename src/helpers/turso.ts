import { connect } from "@tursodatabase/serverless";

console.log(import.meta.env)

const conn = connect({
  url: import.meta.env.VITE_TURSO_DATABASE_URL,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});

export const tursoConnection = conn

export const loadTurso = async () => {
  const checkCache = async () => {

    const stmt = await conn.prepare("SELECT * FROM pokedex");
    const pokemon = await stmt.all();
    console.log(pokemon);
  }

  checkCache()
}