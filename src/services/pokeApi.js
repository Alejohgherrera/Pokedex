const API_URL = 'https://pokeapi.co/api/v2';


const getPokemonIdFromUrl = (url) => Number(url.split('/').filter(Boolean).pop());

const getArtworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export async function getPokemonPage(offset, signal) {
  const response = await fetch(`${API_URL}/pokemon?limit=20&offset=${offset}`, { signal });
  if (!response.ok) throw new Error('No fue posible cargar la lista de Pokémon.');

  const data = await response.json();
  return {
    total: data.count,
    pokemon: data.results.map((item) => {
      const id = getPokemonIdFromUrl(item.url);
      return { id, name: item.name, image: getArtworkUrl(id) };
    }),
  };
}

export async function getPokemonByNameOrId(value, signal) {
  const term = String(value).trim().toLowerCase();
  const response = await fetch(`${API_URL}/pokemon/${encodeURIComponent(term)}`, { signal });

  
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No fue posible buscar el Pokémon.');
  return mapPokemon(await response.json());
}

export async function getPokemonDetail(id, signal) {
  const response = await fetch(`${API_URL}/pokemon/${id}`, { signal });
  if (!response.ok) throw new Error('No fue posible cargar la ficha del Pokémon.');
  return mapPokemon(await response.json());
}

function mapPokemon(data) {
  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
    height: data.height / 10,
    weight: data.weight / 10,
    types: data.types.map((item) => item.type.name),
    stats: data.stats.map((item) => ({ name: item.stat.name, value: item.base_stat })),
  };
}
