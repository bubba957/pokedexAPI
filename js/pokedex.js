const cache = {}; // remember what we've already fetched

async function getPokemon(name) {
    if (cache[name]) return cache[name];
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) return null; // 404 means no Pokémon with that name
    const data = await response.json();
    cache[name] = data;
    return data;
}

function show(pokemon) {
    const result = document.getElementById("result");
    if (!pokemon) {
    result.innerHTML = `<p class="message">Pokémon not found. Check the spelling.</p>`;
    return;
    }
    const types = pokemon.types
    .map(t => `<span class="type">${t.type.name}</span>`)
    .join("");
    const stats = pokemon.stats
    .map(s => {
        const label = s.stat.name === "hp" ? "HP" : s.stat.name.replace("-", " ");
        return `<li>${label}: ${s.base_stat}</li>`;
    })
    .join("");
    const image = pokemon.sprites.other["official-artwork"].front_default
    || pokemon.sprites.front_default;
    result.innerHTML = `
    <div class="card">
        <h2>${pokemon.name}</h2>
        <img src="${image}" alt="${pokemon.name}">
        <div class="types">${types}</div>
        <ul>${stats}</ul>
    </div>`;
}

async function search() {
    const name = document.getElementById("search").value.trim().toLowerCase();
    if (!name) return;
    show(await getPokemon(name));
}

document.getElementById("go").addEventListener("click", search);
document.getElementById("search").addEventListener("keydown", e => {
    if (e.key === "Enter") search();
});