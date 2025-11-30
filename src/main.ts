import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';
import './style.css';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
camera.position.z = 1; // Move camera back
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures
const loader = new THREE.TextureLoader();

// Update image resolution once loaded
const updateResolution = () => {
    if (texture.image) {
        console.log('Image Resolution:', texture.image.width, texture.image.height);
        material.uniforms.uImageResolution.value.set(texture.image.width, texture.image.height);
    }
};

const texture = loader.load('/shoe4.png', (tex) => {
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    updateResolution();
});
const depthMap = loader.load('/shoe4_depth.png', (tex) => {
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
});

const texture2 = loader.load('/shoe5.png', (tex) => {
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
});
const depthMap2 = loader.load('/shoe5_depth.png', (tex) => {
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
});

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: texture },
        uDepthMap: { value: depthMap },
        uTexture2: { value: texture2 },
        uDepthMap2: { value: depthMap2 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uImageResolution: { value: new THREE.Vector2(1, 1) }, // Default
        uTime: { value: 0 },
        uVelocity: { value: 0 }
    },
    vertexShader,
    fragmentShader
});

// Geometry
const geometry = new THREE.PlaneGeometry(2, 2);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Mouse interaction
const mouse = new THREE.Vector2();
const targetMouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();
const lastMouse = new THREE.Vector2();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    // Smooth mouse
    mouse.lerp(targetMouse, 0.05);
    material.uniforms.uMouse.value.copy(mouse);

    // Calculate velocity
    const velocity = mouse.distanceTo(lastMouse);
    material.uniforms.uVelocity.value = velocity;
    lastMouse.copy(mouse);

    renderer.render(scene, camera);
}

animate();
