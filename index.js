function cardClick(event, flippedCards) {
    let target = event.currentTarget;


    target.classList.toggle('flipped')
    let checkImage = $(target).find(".pokeImg")[0]
    flippedCards.push(target)
    $(target).off('click');

    if (flippedCards.length === 2) {
        console.log(" 2 flipped")
        let index = 0;
        let firstCheck, secondCheck;
        flippedCards.forEach(card => {
            if (index === 0) {
                firstCheck = $(card).find(".pokeImg")[0]
            } else {
                secondCheck = $(card).find(".pokeImg")[0]
            }
            index++
        })

        if ($(firstCheck).attr("src") == $(secondCheck).attr("src")) {
            console.log("Match")
        } else {
            console.log("No match")
        }
        flippedCards.forEach(card => {
            setTimeout(() => {
                $(card).toggleClass('flipped')
                $(card).on('click', (event) => {
                    cardClick(event, flippedCards)
                })
            }, 1000)

        })
        flippedCards.length = 0
    }
}


const setup = async () => {
    const randomPokemon = Math.floor(Math.random() * 100) + 1;
    let pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`)
    let pokemon = pokemonResponse.data
    let cardBack = `https://velvety-mousse-38f1cf.netlify.app/back.webp`
    // Test image: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png
    let pokemonImg = pokemon.sprites.front_default
    let flippedCards = [];

    $(".pokeCard").on("click", (event) => {
        cardClick(event, flippedCards)
    });


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