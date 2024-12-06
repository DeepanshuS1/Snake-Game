import { createData, readData, highscore, playerscore, games, updateBestScore, fetchData, updateGames } from '/JS/firebase.js';

let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('/music/food.mp3')
const gameOverSound = new Audio('/music/gameover.aac')
const movieSound = new Audio('/music/move.mp3')
const musicSound = new Audio('/music/music.mp3')
let playerName;
let speed = 5;
let score = 0;
let updateScore = 1;
let specialCount = true;
let lastPaintTime = 0;
let special = 0;
let snakeArr = [
    { x: Math.round(2 + (14 * Math.random())), y: Math.round(2 + (14 * Math.random())) }
]

let sbtn = document.querySelector('.signup')
let lbtn = document.querySelector('.login')

sbtn.addEventListener('click', (event) => {
    sbtn.style.backgroundColor = '#0015ff'
    sbtn.style.color = 'white'
    lbtn.style.backgroundColor = 'transparent'
    lbtn.style.color = 'black'
    loginform.style.display = 'none'
    signupform.style.display = 'flex'
})

lbtn.addEventListener('click', (event) => {
    lbtn.style.backgroundColor = '#0015ff'
    lbtn.style.color = 'white'
    sbtn.style.backgroundColor = 'transparent'
    sbtn.style.color = 'black'
    loginform.style.display = 'flex'
    signupform.style.display = 'none'
})

export async function updateData() {
    try {
        let userData = await fetchData();
        playerName = userData['username'];
        bestsbar.innerHTML = 'Best Score:' + userData['score'];
        player.innerHTML = playerName
    } catch (error) {
        console.error('Error in updateData:', error);
    } finally {
        loader.style.display = 'none';
    }
}


// Turbo button Function
function speedUp() {
    if (turboBtn.innerHTML === 'Turbo Mode') {
        turboBtn.innerHTML = 'Normal Mode';
        document.documentElement.style.setProperty('--turboColor', 'rgb(0, 136, 255)')
        speed = 10
        turboOn = true;
    } else {
        speed = 5
        turboBtn.innerHTML = 'Turbo Mode';
        document.documentElement.style.setProperty('--turboColor', 'blueviolet')
        turboOn = false
    }
}

// Play button Function
function playbgmusic() {
    if (playbtn.innerHTML === 'Play Music') {
        musicSound.play();
        playbtn.style.color = "Red"
        playbtn.innerHTML = 'Pause Music'
    } else {
        musicSound.pause();
        playbtn.style.color = "#0015ff"
        playbtn.innerHTML = 'Play Music'
    }
}

// hiding console
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});
document.addEventListener("keydown", function (event) {
    if (event.key === "F12") {
        event.preventDefault();
    }
    // if ((event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "J")) || (event.ctrlKey && event.key === "U")) {
    //     event.preventDefault();
    // }
    if (event.key === 'T' || event.key === 't') {
        speedUp()
    }
    if (event.key === 'M' || event.key === 'm') {
        playbgmusic()
    }
})

let playbtn = document.querySelector('.playMusic');
playbtn.addEventListener('click', playbgmusic)
let turboOn = false
let turboBtn = document.querySelector('.turbo');
turboBtn.addEventListener('click', speedUp)

let food = { x: Math.round(2 + (14 * Math.random())), y: Math.round(2 + (14 * Math.random())) }
let specialfood = { x: Math.round(2 + (14 * Math.random())), y: Math.round(2 + (14 * Math.random())) }

// game Function
function main(ctime) {
    window.requestAnimationFrame(main)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return
    }
    lastPaintTime = ctime
    gameEngine()
}

function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x > 18 || snake[0].x <= 0 || snake[0].y > 18 || snake[0].y <= 0) {
        return true;
    }
}

// updating data
setInterval(() => {
    readData()
}, 1000);

let yel;
let gren;

function specialEffect(check) {
    if (check) {
        for (let rule of styleSheet[0].cssRules) {
            if (rule.selectorText === '.snake') {
                yel = setInterval(() => {
                    rule.style.backgroundColor = 'rgb(246, 255, 0)'
                }, 100);
                gren = setInterval(() => {
                    rule.style.backgroundColor = 'rgb(36, 113, 28)'
                }, 200);
            }
        }
    }else{
        clearInterval(yel)
        clearInterval(gren)
    }
}


function gameEngine() {
    // updating the snake array
    if (isCollide(snakeArr)) {
        gameOverSound.play()
        musicSound.pause()
        special = 0;
        playbtn.style.color = "#0015ff"
        playbtn.innerHTML = 'Play Music'
        let totalgames = games
        updateGames(totalgames + 1)
        if (playerscore < score) {
            updateBestScore(score)
        }
        if (highscore < score) {
            createData(score, playerName)
        }
        score = 0
        inputDir = { x: 0, y: 0 }
        alert("Game over press Enter key to play again")
        snakeArr = [{ x: 13, y: 15 }]
        score = 0
    }

    // when snake its food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y })
        food = { x: Math.round(2 + (14 * Math.random())), y: Math.round(2 + (14 * Math.random())) }
        foodSound.play()
        score += updateScore;
        if (special < 5 && specialCount) {
            special++;
            special == 5 ? specialfood = { x: Math.round(2 + (14 * Math.random())), y: Math.round(2 + (14 * Math.random())) } : specialfood = { x: 0, y: 0 }
        }
    }

    // when snake eats special food
    if (snakeArr[0].y === specialfood.y && snakeArr[0].x === specialfood.x) {
        foodSound.play()
        specialEffect(true)
        specialfood = { x: 0, y: 0 }
        updateScore = 2;
        speed = turboOn ? speed : 7;
        specialCount = false;
        special = 0;
        setTimeout(() => {
            specialEffect(false)
            updateScore = 1;
            speed = turboOn ? speed : 5;
            specialCount = true;
        }, 10000);
    }

    // moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render the snake and food
    bord.innerHTML = ""
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = e.y
        snakeElement.style.gridColumnStart = e.x
        if (index === 0) {
            snakeElement.classList.add('head')
        } else {
            snakeElement.classList.add('snake')
        }
        bord.appendChild(snakeElement)
    })

    scorebar.innerHTML = "Score:" + score;
    let foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    bord.appendChild(foodElement)

    if (special === 5) {
        let specialfoodElement = document.createElement('div')
        specialfoodElement.style.gridRowStart = specialfood.y
        specialfoodElement.style.gridColumnStart = specialfood.x
        specialfoodElement.classList.add('specialfood')
        bord.appendChild(specialfoodElement)
    }
}

const styleSheet = document.styleSheets;
function rotateHead(angle) {
    for (let rule of styleSheet[0].cssRules) {
        if (rule.selectorText === '.head') {
            rule.style.transform = `rotate(${angle}deg)`;
        }
    }
}
// game Logic
window.requestAnimationFrame(main)
window.addEventListener('keydown', e => {
    let rotationAngle;
    switch (e.key) {
        case "ArrowUp":
            rotationAngle = 180;
            inputDir.x = 0
            inputDir.y = -1
            movieSound.play()
            break;
        case "ArrowDown":
            rotationAngle = 0;
            inputDir.x = 0
            inputDir.y = 1
            movieSound.play()
            break;
        case "ArrowLeft":
            rotationAngle = 90;
            inputDir.x = -1
            inputDir.y = 0
            movieSound.play()
            break;
        case "ArrowRight":
            rotationAngle = 270;
            inputDir.x = 1
            inputDir.y = 0
            movieSound.play()
            break;
        default:
            break;
    }
    rotateHead(rotationAngle)
});

// // running snake with arrow keys
let arrowKeys = document.querySelectorAll('.arrows');

arrowKeys.forEach(arrow => {
    arrow.addEventListener('click', () => {
        let rotationAngle;
        movieSound.play()
        switch (arrow.dataset.direction) {
            case "Up":
                rotationAngle = 180;
                inputDir.x = 0
                inputDir.y = -1
                break;
            case "Down":
                rotationAngle = 0;
                inputDir.x = 0
                inputDir.y = 1
                break;
            case "Left":
                rotationAngle = 90;
                inputDir.x = -1
                inputDir.y = 0
                break;
            case "Right":
                rotationAngle = 270;
                inputDir.x = 1
                inputDir.y = 0
                break;
            default:
                break;
        }
        rotateHead(rotationAngle)
    })
})

// Display Leaderbord

let leader = document.querySelector('.highscore')
let crossbtn = document.querySelector('.bordcross')

leaderbord.addEventListener('click', () => {
    leader.classList.toggle('show')
})
crossbtn.addEventListener('click', () => {
    leader.classList.toggle('show')
})

profile.addEventListener('click', () => {
    alert('Feature Coming Soon')
})