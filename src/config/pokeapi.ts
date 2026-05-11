const pageSize = 20
const dexLimit = 1025 // 1025 is last pokemon, 1350 is max with all forms as of 5/10/26
const lastPage = Math.ceil(dexLimit / pageSize)

export const POKEAPI_CONFIG = {
  apiUrl: "https://pokeapi.co/api/v2",
  pageSize,
  dexLimit,
  lastPage,
}