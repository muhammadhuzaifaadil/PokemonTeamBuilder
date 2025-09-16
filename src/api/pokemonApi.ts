import type { Pokemon } from "@/types/pokemon";
export async function fetchPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error("Not found");
  const data = await res.json();

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default,
    types: data.types.map((t: any) => t.type.name),
    baseExperience: data.base_experience,
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      specialAttack: data.stats[3].base_stat,
      specialDefense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
    },
  };
}
