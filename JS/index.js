import { createData, readData, highscore } from '/JS/firebase.js';

let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('/music/food.mp3')
const gameOverSound = new Audio('/music/gameover.aac')
const movieSound = new Audio('/music/move.mp3')
const musicSound = new Audio('/music/music.mp3')
let speed = 4;
let score = 0
let lastPaintTime = 0;
let snakeArr = [
    { x: Math.round(2 + (14 * Math.random())), y: Math.round(2 + (14 * Math.random())) }
]

// hiding console
// document.addEventListener("contextmenu",function(event){
//     event.preventDefault();
// });
document.addEventListener("keydown", function (event) {
    if (event.key === "F12") {
        event.preventDefault();
    }
    if ((event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "J")) || (event.ctrlKey && event.key === "U")) {
        event.preventDefault();
    }
})

let food = { x: Math.round(2 + (14 * Math.random())), y: Math.round(2 + (14 * Math.random())) }

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
    if (snake[0].x > 18 || snake[0].x < 0 || snake[0].y > 18 || snake[0].y < 0) {
        return true;
    }
}

async function gameEngine() {
    // updating High Score
    await readData()

    // updating the snake array
    if (isCollide(snakeArr)) {
        gameOverSound.play()
        musicSound.pause()
        if (highscore < score) {
            let userName = prompt('You Beats the HighScore Enter your Name')
            createData(score, userName)
        }
        score = 0
        inputDir = { x: 0, y: 0 }
        alert("Game over press Enter key to play again")
        snakeArr = [{ x: 13, y: 15 }]
        score = 0
        musicSound.play()
    }

    // when snake its food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y })
        food = { x: Math.round(2 + (14 * Math.random())), y: Math.round(2 + (14 * Math.random())) }
        foodSound.play()
        score += 1;
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

    scorebar.innerHTML = "Score: " + score;
    let foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    bord.appendChild(foodElement)
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
    let rotationAngle = 0;
    inputDir = { x: 0, y: 0 }
    movieSound.play()
    switch (e.key) {
        case "ArrowUp":
            rotationAngle = 180;
            inputDir.x = 0
            inputDir.y = -1
            break;
        case "ArrowDown":
            rotationAngle = 0;
            inputDir.x = 0
            inputDir.y = 1
            break;
        case "ArrowLeft":
            rotationAngle = 90;
            inputDir.x = -1
            inputDir.y = 0
            break;
        case "ArrowRight":
            rotationAngle = 270;
            inputDir.x = 1
            inputDir.y = 0
            break;
        default:
            break;
    }
    rotateHead(rotationAngle)
});