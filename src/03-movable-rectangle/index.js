const log = (...args) => {
    console.log(...args);
};

const rectangle = (x, y, width, height, color) => {
    const speed = 2;

    return {
        x,
        y,
        width,
        height,
        color,

        move(x, y) {
            this.x = x;
            this.y = y;
        },

        moveLeft() {
            this.x -= speed;
        },

        moveRight() {
            this.x += speed;
        },

        draw(scene) {
            scene.fillStyle = this.color;
            scene.fillRect(this.x, this.y, this.width, this.height);
        }
    }
};

const canvas = document.getElementById("canvas");
const scene = canvas.getContext("2d");
const debug = (f) => {
    return (...args) => {
        console.log(`${f.name}()`);
        f(...args);
    }
}

const player = rectangle(0, canvas.height - 100, 100, 100, 'magenta');

let isRightKeyPressed = false;
let isLeftKeyPressed = false;

const handleKeyDownPress = (event) => {
    log(`handleKeyDownPress: ${event.key}`);
    switch (event.key) {
        case 'Right':
        case 'ArrowRight': {
            isRightKeyPressed = true;
            break;
        }

        case 'Left':
        case 'ArrowLeft': {
            isLeftKeyPressed = true;
            break;
        }

        default:
            break;

    }
}

const handleKeyUpPress = (event) => {
    log(`handleKeyUpPress: ${event.key}`);
    switch (event.key) {
        case 'Right':
        case 'ArrowRight': {
            isRightKeyPressed = false;
            break;
        }

        case 'Left':
        case 'ArrowLeft': {
            isLeftKeyPressed = false;
            break;
        }

        default:
            break;

    }
};


document.addEventListener('keydown', handleKeyDownPress);
document.addEventListener('keyup', handleKeyUpPress);


function draw() {
    requestAnimationFrame(draw);

    scene.clearRect(0, 0, canvas.width, canvas.height);

    player.draw(scene);

    if (isRightKeyPressed) {
        player.moveRight();
    }

    if (isLeftKeyPressed) {
        player.moveLeft();
    }
}

draw();