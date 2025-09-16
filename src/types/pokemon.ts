export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  baseExperience: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
};

export type Team = {
  id: string;
  name: string;
  pokemons: Pokemon[];
};
