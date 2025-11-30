uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec2 uv = vUv * 2.0; // Scale text
    uv.x += uTime * 0.1; // Scroll text
    
    vec4 color = texture2D(uTexture, uv);
    
    gl_FragColor = color;
}
