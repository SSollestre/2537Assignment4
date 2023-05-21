const setup = async () => {
    console.log("Hello world")
    const randomPokemon = Math.floor(Math.random() * 100) + 1;
    let pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`)
    let pokemon = pokemonResponse.data
    let cardBack = `https://velvety-mousse-38f1cf.netlify.app/back.webp`
    console.log("Pokemon")
    console.log(pokemon)
    // Test image: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png
    let pokemonImg = pokemon.sprites.front_default

    // for (let index = 0; index < 6; index++) {
    //     $('#cardGame').append(`
    //     <div class="card">
    //     <img src="${pokemonImg}">
    //     <img src="${cardBack}">
    //         Potato
    //     </div>
    //     `)

    // }
}


$(document).ready(setup);