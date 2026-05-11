export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonDetail extends PokemonListItem {
  id: number;
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    }
  }[],
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    }
  }[],
  sprites: {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  }
}

export interface Pokedex {
  [name: string]: PokemonDetail
}

export interface PokemonPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}