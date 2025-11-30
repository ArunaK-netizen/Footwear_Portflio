import * as THREE from 'three';

export function createTextTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = 1024;
    const height = 1024;
    canvas.width = width;
    canvas.height = height;

    if (ctx) {
        ctx.fillStyle = '#000000'; // Black background
        ctx.fillRect(0, 0, width, height);

        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = '#333333'; // Dark grey text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text = "JUST DO IT";
        const stepY = 120;
        const stepX = 400;

        ctx.save();
        ctx.rotate(-Math.PI / 6); // Slight rotation for style

        for (let y = -height; y < height * 2; y += stepY) {
            for (let x = -width; x < width * 2; x += stepX) {
                // Offset every other row
                const offsetX = (Math.floor(y / stepY) % 2 === 0) ? 0 : stepX / 2;
                ctx.fillText(text, x + offsetX, y);
            }
        }
        ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}
