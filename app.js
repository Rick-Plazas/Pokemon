const listaPokemon = document.querySelector("#lista-pokemon");
const botones = document.querySelectorAll(".btn-header");
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#submit");

const URL = "https://pokeapi.co/api/v2/pokemon/";


function mostrarPokemon(poke) {
    let tipos = poke.types.map(
        type => `<p class="${type.type.name} tipo">${type.type.name}</p>`
    ).join('');

    let pokeId = poke.id.toString().padStart(3, '0'); // siempre 3 dígitos

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <div class="pokemon-imagen">
            <img src="${poke.sprites.front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}M</p>
                <p class="stat">${poke.weight}KG</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}


async function traerPokemones() {
    const promesas = [];

    for (let i = 1; i <= 700; i++) {
        promesas.push(fetch(URL + i).then(res => res.json()));
    }

    const resultados = await Promise.all(promesas);

    //Ordenar por Id antes de mostrra
    resultados.sort((a, b) => a.id - b.id);

    resultados.forEach(poke => mostrarPokemon(poke));
}

botones.forEach(boton =>
    boton.addEventListener("click", (event) => {
        const botonId = event.currentTarget.id;
        listaPokemon.innerHTML = "";

        fetchPokemonesPorTipo(botonId);
    })
);

async function fetchPokemonesPorTipo(tipo) {
    const promesas = [];

    for (let i = 1; i <= 151; i++) {
        promesas.push(fetch(URL + i).then(res => res.json()));
    }

    const resultados = await Promise.all(promesas);

    resultados
        .filter(p => p.types.some(t => t.type.name.includes(tipo)) || tipo === "all")
        .sort((a, b) => a.id - b.id) // mantener orden
        .forEach(p => mostrarPokemon(p));
}


searchBtn.addEventListener("click", async () => {
    const valor = searchInput.value.toLowerCase().trim();
    if (!valor) return;

    try {
        const res = await fetch(URL + valor);
        if (!res.ok) throw new Error("No encontrado");
        const data = await res.json();

        listaPokemon.innerHTML = "";
        mostrarPokemon(data);
    } catch (err) {
        listaPokemon.innerHTML = `<p class="error">${valor}? Esa mondá qué es</p>`;
    }
});

traerPokemones();
