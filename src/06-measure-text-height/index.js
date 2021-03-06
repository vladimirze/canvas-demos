const canvas = document.getElementById('canvas');
const scene = canvas.getContext('2d');
window.canvasWidth = canvas.width;
window.canvasHeight = canvas.height;
window.scene = scene;

function* pixels(imageData) {
    for (let i = 0; i < imageData.data.length; i += 4) {
        yield {
            red: imageData.data[i],
            green: imageData.data[i + 1],
            blue: imageData.data[i + 2],
            alpha: imageData.data[i + 3],
        }
    }
}

function take(iter, n) {
    let i = 0;
    const items = [];

    while (i < n) {
         items.push(iter.next());
         i += 1;
    }

    return items;
}

function* lines(scene, width, height) {
    const imageData = scene.getImageData(0, 0, width, height);
    const iterator = pixels(imageData);

    for (let i = 0; i < width * height; i += width) {
        yield take(iterator, width).map((pixel) => pixel.value);
    }
}

function readNthPixel(imageData, nth) {
    return {
        red: imageData.data[nth * 4],
        green: imageData.data[nth * 4 + 1],
        blue: imageData.data[nth * 4 + 2],
        alpha: imageData.data[nth * 4 + 3],
    }
}

function isSamePixel(pixel1, pixel2) {
    return Object.keys(pixel1).every((color) => pixel1[color] === pixel2[color]);
}

// read pixels line by line
// calculate top by finding pixels matching the text color
// calculate bottom by finding the pixels matching the background color
function calcTextBounds(scene,
                        canvasWidth,
                        canvasHeight,
                        textColor = {red: 0, green: 0, blue: 0, alpha: 255},
                        backgroundColor = {red: 255, green: 255, blue: 255, alpha: 255}) {
    const iterator = lines(scene, canvasWidth, canvasHeight);

    let line = iterator.next();
    let top = 0;
    while (!line.done) {
        if (line.value.some((pixel) => isSamePixel(pixel, textColor))) {
            break;
        }

        line = iterator.next();
        top += 1;
    }

    line = iterator.next();
    let bottom = top + 1;
    while (!line.done) {
        if (line.value.every((pixel) => isSamePixel(pixel, backgroundColor))) {
            break;
        }

        line = iterator.next();
        bottom += 1;
    }

    return {top, bottom};
}

function draw() {
    // background
    scene.fillStyle = 'rgba(255, 255, 255, 1)'
    scene.fillRect(0, 0, canvas.width, canvas.height);

    // text
    scene.fillStyle = 'rgba(0, 0, 0, 1)';
    scene.font = '16px monospace';
    const text = 'abcdefghijklmnopqrstuvwxyz';
    const metrics = scene.measureText(text);
    scene.fillText(text, (canvas.width - metrics.width) / 2, canvas.height / 2);

    const rect = calcTextBounds(scene, canvas.width, canvas.height);
    console.log(rect, rect.bottom - rect.top);

    scene.beginPath();
    scene.strokeStyle = 'green';
    scene.moveTo(10, rect.top);
    scene.lineTo(10, rect.bottom);
    scene.stroke();
}

draw();