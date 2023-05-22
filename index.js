function cardClick(event, flippedCards, matches, totalPairs) {
    let target = event.currentTarget;

    target.classList.toggle('flipped')
    $(target).addClass("disabled")

    flippedCards.push(target)

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
            matches[0]++

            $('#totalMatches').html(`
            <h3 id="totalMatches">Total number of Matches: ${matches[0]}</h3>
            `)

            $('#pairsLeft').html(`
             <h3 id="pairsLeft">Number of pairs left: ${totalPairs - matches[0]}</h3>
            `)

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
    $('#time').html(`
        Initial time: ${initialMinutes}: ${initialSeconds}. Time remaining: ${initialMinutes} : ${initialSeconds}
        `)

    let intervalId = setInterval(() => {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds
        $('#time').html(`
        Initial time: ${initialMinutes}: ${initialSeconds}. Time remaining: ${minutes} : ${seconds}
        `)
        if (--timer < 0) {
            clearInterval(intervalId)
            console.log("Timer expired")
        }
    }, 1000)
    return intervalId
}


function updateTotalClicks(totalClicks) {
    $('#totalClicks').html(`
    <h3 id="totalClicks">Number of clicks: ${totalClicks}</h3>
`)
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function getPokemon(difficulty) {
    let cardPairs
    let pokeCards = []
    let usedPokemon = []

    if (difficulty === "easy") {
        cardPairs = 3
    } else if (difficulty === "medium") {
        cardPairs = 6
        $('#cardGame').css("width", "33em")
    } else if (difficulty === "hard") {
        cardPairs = 10
        $('#cardGame').css("width", "41em")
    }

    $('#totalPairs').html(`
    <h3 id="totalPairs">Total number of Pairs: ${cardPairs}</h3>
    `)
    $('#pairsLeft').html(`
     <h3 id="pairsLeft">Number of pairs left: ${cardPairs}</h3> 
    `)


    // Make a pair of cards for each card pair
    for (let i = 0; i < cardPairs; i++) {
        let randomPokemon = Math.floor(Math.random() * 100) + 1;

        // If that pokemon is not in use, use that pokemon
        if (!usedPokemon.includes(randomPokemon)) {
            usedPokemon.push(randomPokemon)
            let pokemonPromise = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`)
            let pokemon = pokemonPromise.data
            pokeCards.push(pokemon)
        } else {
            i--
        }
    }
    return pokeCards
}


function initializeGame(pokeCards, timer) {
    let totalClicks = 0;
    let flippedCards = [];
    let win = false;
    let matches = [0];

    // Get your array of pokeCards
    pokeCards = pokeCards.flatMap(pokeObject => {
        return [pokeObject.sprites.front_default, pokeObject.sprites.front_default]
    })

    // Shuffle your pokemon cards
    pokeCards = shuffleArray(pokeCards)

    // Populate your game with cards
    $("#cardGame").empty()
    $("#cardGame").append(`
    ${pokeCards.map(image => `
                <div class="pokeCard">
                <img src="${image}"
                    class="pokeImg">
                <img src="https://velvety-mousse-38f1cf.netlify.app/back.webp" class="pokeBack">
            </div>
    `).join('')}
    `)

    $(".pokeCard").on("click", (event) => {
        totalClicks++
        updateTotalClicks(totalClicks)
        cardClick(event, flippedCards, matches, pokeCards.length / 2)
        win = checkWin()
        if (win) {
            setTimeout(function () {
                alert("You have won!")
                console.log("Stopping timer")
                clearInterval(timer)
            }, 1000)
        }
    });
}


function getTime(difficulty) {
    if (difficulty === "easy") {
        return 30
    } else if (difficulty === "medium") {
        return 60
    } else if (difficulty === "hard") {
        return 90
    }
}


const setup = async () => {
    let pokeCards;
    let timer


    $(".btn-group .btn").click(function () {
        $(this).addClass('active').addClass('focus').siblings().removeClass('active')
    })

    $('#reset').on('click', () => {
        location.reload()
    })

    $('#start').on('click', async function () {
        let difficulty = $('.btn-group .btn.active').attr('value')
        pokeCards = await getPokemon(difficulty)
        let duration = getTime(difficulty)
        timer = startTimer(duration)
        initializeGame(pokeCards, timer)

        $('#cardGame').removeClass('d-none')
        $('#gameInfo').removeClass('d-none')
        $(this).addClass('d-none')
    })
}


$(document).ready(setup);