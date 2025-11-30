uniform sampler2D uTexture;
uniform float uRevealProgress;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vUv);
    
    // Reveal from left to right
    float alpha = step(vUv.x, uRevealProgress);
    
    gl_FragColor = vec4(color.rgb, color.a * alpha);
}
