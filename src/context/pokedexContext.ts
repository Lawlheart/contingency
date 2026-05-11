import { createContext } from "react";
import type { Pokedex } from "../types";



export const PokedexContext = createContext<Pokedex>({})