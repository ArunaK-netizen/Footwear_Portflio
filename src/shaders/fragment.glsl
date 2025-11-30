uniform sampler2D uTexture;
uniform sampler2D uDepthMap;
uniform sampler2D uTexture2;
uniform sampler2D uDepthMap2;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uTime;
uniform float uVelocity;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// FBM
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    for (int i = 0; i < 3; i++) {
        value += amplitude * snoise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
  vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
  );

  vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  // Calculate Parallax for Shoe 1
  vec4 depthDistortion = texture2D(uDepthMap, uv);
  float parallaxMult = depthDistortion.r;
  vec2 parallax = (uMouse) * parallaxMult * 0.03;
  vec2 finalUv = uv + parallax;
  vec4 color1 = texture2D(uTexture, finalUv);

  // Calculate Parallax for Shoe 2
  vec4 depthDistortion2 = texture2D(uDepthMap2, uv);
  float parallaxMult2 = depthDistortion2.r;
  vec2 parallax2 = (uMouse) * parallaxMult2 * 0.03;
  vec2 finalUv2 = uv + parallax2;
  vec4 color2 = texture2D(uTexture2, finalUv2);

  // Blob Effect
  vec2 mouseUv = uMouse * 0.5 + 0.5;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  
  vec2 diff = (vUv - mouseUv) * aspect;
  float dist = length(diff);
  float angle = atan(diff.y, diff.x);
  
  // Velocity reaction: stretch or increase radius based on velocity
  // uVelocity is roughly 0 to 0.1 depending on speed.
  float velFactor = clamp(uVelocity * 50.0, 0.0, 1.0);
  
  // Base radius + velocity expansion
  float baseRadius = 0.15 + velFactor * 0.1;
  
  // Noise distortion
  // Animate noise with time
  float noise = fbm(diff * 5.0 + uTime * 0.5 + vec2(cos(uTime * 0.2), sin(uTime * 0.2)));
  
  // Distort distance field
  float distortedDist = dist - noise * 0.05;
  
  float softness = 0.05 + velFactor * 0.05; // Softer edges when moving fast
  
  float mask = 1.0 - smoothstep(baseRadius - softness, baseRadius, distortedDist);

  // Mix colors based on mask
  vec4 finalColor = mix(color1, color2, mask);
  
  gl_FragColor = finalColor;
}
