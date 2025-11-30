import * as THREE from 'three';

export function createLogoTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = 512;
    const height = 512;
    canvas.width = width;
    canvas.height = height;

    if (ctx) {
        // Clear background (transparent)
        ctx.clearRect(0, 0, width, height);

        // Draw Nike Tick (Swoosh)
        ctx.fillStyle = '#FFFFFF'; // White logo
        ctx.beginPath();
        // Approximate Swoosh shape
        ctx.moveTo(50, 200);
        ctx.bezierCurveTo(50, 350, 250, 450, 450, 150);
        ctx.bezierCurveTo(300, 350, 100, 300, 50, 200);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
