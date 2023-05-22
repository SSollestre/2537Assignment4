function cardClick(event, flippedCards) {
    let target = event.currentTarget;

    target.classList.toggle('flipped')
    $(target).addClass("disabled")

    flippedCards.push(target)
    console.log(flippedCards)

    // If there are two flipped cards, check and then flip them back if they do not match
    if (flippedCards.length === 2) {
        let firstImg, secondImg
        for (let i = 0; i < flippedCards.length; i++) {
            if (i === 0) {
                firstImg = $($(flippedCards[i]).find(".pokeImg")[0]).attr("src")
            } else {
                secondImg = $($(flippedCards[i]).find(".pokeImg")[0]).attr("src")
            }
        }

        // Check if they are the same image
        if (firstImg === secondImg) {
            console.log("Match")
            flippedCards.length = 0
        } else {
            console.log("No Match")

            // Disable neighbors until animation stops
            console.log("Disabling...")
            $(target).siblings().addBack().addClass("disabled")

            // Re-enable neighbors
            setTimeout(() => {
                console.log("Enabling...")
                $(target).removeClass("disabled")
                $(target).siblings().removeClass("disabled")

                // Flip images back after a delay so that animation plays
                console.log(flippedCards)
                flippedCards.forEach(element => {
                    element.classList.toggle('flipped')
                })
                // Reset the card checking array
                flippedCards.length = 0
            }, 1000)
        }
    }
}

function checkWin() {
    let win = true
    $("#cardGame").children().each((index, element) => {
        if (!$(element).hasClass("flipped")) {
            win = false;
        }
    })
    return win
}


function startTimer(duration) {
    let timer = duration
    let minutes, seconds

    let initialMinutes = parseInt(timer / 60, 10)
    let initialSeconds = parseInt(timer % 60, 10)
    initialMinutes = initialMinutes < 10 ? "0" + initialMinutes : initialMinutes
    initialSeconds = initialSeconds < 10 ? "0" + initialSeconds : initialSeconds

    let intervalId = setInterval(() => {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds
        console.log(minutes + ":" + seconds)
        $('#time').html(`
        Initial time: ${initialMinutes}: ${initialSeconds}. Time remaining: ${minutes} : ${seconds}
        `)
        if (--timer < 0) {
            clearInterval(intervalId)
            console.log("Timer expired")
        }
    }, 1000)
    console.log(intervalId)
    return intervalId
}


const setup = async () => {
    const randomPokemon = Math.floor(Math.random() * 100) + 1;
    let pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`)
    let pokemon = pokemonResponse.data
    let cardBack = `https://velvety-mousse-38f1cf.netlify.app/back.webp`
    // Test image: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png
    let pokemonImg = pokemon.sprites.front_default
    let flippedCards = [];
    let win = false;
    let timer


    $(".pokeCard").on("click", (event) => {
        cardClick(event, flippedCards, win, timer)
        win = checkWin()
        console.log(win)
        if (win) {
            setTimeout(function () {
                console.log(win)
                alert("You have won!")
                console.log("Stopping timer")
                clearInterval(timer)
            }, 1000)
        }
    });

    $(".btn-group .btn").click(function () {
        $(this).addClass('active').addClass('focus').siblings().removeClass('active')
    })

    $('#reset').on('click', () => {
        location.reload()
    })

    $('#start').on('click', function () {
        timer = startTimer(65)
        $('#cardGame').removeClass('d-none')
        $(this).addClass('d-none')
    })


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