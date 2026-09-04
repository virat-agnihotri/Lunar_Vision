import * as THREE from 'three';

/**
 * Creates a high-fidelity Earth Day equirectangular texture (2048x1024).
 * Features realistic deep oceans, continental shelf turquoise gradients,
 * accurate landmasses, deserts, vegetation, and polar ice caps.
 */
export function createEarthDayTexture() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Deep Ocean Base with Depth Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0.0, '#040e24');
  oceanGrad.addColorStop(0.2, '#082046');
  oceanGrad.addColorStop(0.5, '#0b2b5c');
  oceanGrad.addColorStop(0.8, '#082046');
  oceanGrad.addColorStop(1.0, '#040e24');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  const toXY = (lon, lat) => [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height,
  ];

  const drawPolygon = (points, fillColor, shelfColor = 'rgba(14, 116, 144, 0.45)') => {
    if (shelfColor) {
      ctx.beginPath();
      points.forEach(([lon, lat], i) => {
        const [x, y] = toXY(lon, lat);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.lineWidth = 14;
      ctx.strokeStyle = shelfColor;
      ctx.stroke();
    }

    ctx.beginPath();
    points.forEach(([lon, lat], i) => {
      const [x, y] = toXY(lon, lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  };

  // Africa
  drawPolygon([
    [-17, 32], [-5, 36], [12, 37], [25, 32], [32, 31], [35, 28],
    [43, 12], [51, 12], [45, 2], [40, -10], [35, -20], [32, -28],
    [28, -34], [18, -34], [12, -20], [8, -5], [4, 4], [-8, 4],
    [-17, 15], [-17, 28]
  ], '#295424');
  // Sahara Desert
  drawPolygon([
    [-15, 30], [5, 34], [30, 31], [32, 22], [34, 15], [15, 14],
    [-10, 16], [-15, 22]
  ], '#a17a40', null);

  // Arabian Peninsula
  drawPolygon([
    [35, 30], [45, 30], [55, 25], [60, 22], [55, 15], [45, 12], [38, 22]
  ], '#b38845', 'rgba(14, 116, 144, 0.35)');

  // Europe
  drawPolygon([
    [-10, 36], [0, 44], [-4, 48], [4, 54], [8, 56], [18, 54],
    [28, 60], [30, 70], [20, 70], [10, 62], [0, 50], [-8, 44]
  ], '#365f2a');
  drawPolygon([[5, 58], [15, 56], [22, 65], [28, 71], [15, 68], [6, 62]], '#274b24');

  // Asia & Siberia
  drawPolygon([
    [35, 38], [50, 42], [60, 55], [75, 68], [105, 78], [140, 72],
    [170, 66], [180, 64], [180, 50], [145, 45], [130, 38], [120, 32],
    [105, 20], [90, 22], [75, 28], [55, 35], [40, 36]
  ], '#315827');

  // Indian Subcontinent (prominent focus)
  drawPolygon([
    [68, 24], [72, 30], [77, 36], [88, 28], [92, 25], [88, 21],
    [80, 13], [77, 8], [76, 10], [72, 18], [68, 22]
  ], '#256320', 'rgba(56, 189, 248, 0.65)');

  // Himalayas (Snow ridge)
  drawPolygon([
    [75, 35], [82, 36], [90, 32], [95, 30], [88, 28], [78, 30]
  ], '#e2e8f0', null);

  // Southeast Asia & Australia
  drawPolygon([[98, 22], [105, 12], [108, 10], [104, 2], [98, 8]], '#1a491a');
  drawPolygon([[95, 4], [105, -5], [115, -8], [125, -8], [115, 0], [100, 2]], '#1a491a');
  drawPolygon([
    [114, -22], [125, -15], [138, -12], [150, -22], [152, -34],
    [142, -38], [130, -32], [115, -34]
  ], '#96632f');

  // North America
  drawPolygon([
    [-168, 65], [-140, 70], [-95, 74], [-75, 62], [-60, 48], [-75, 35],
    [-80, 25], [-97, 26], [-105, 20], [-120, 34], [-124, 48], [-140, 58], [-165, 60]
  ], '#345e28');

  // South America
  drawPolygon([
    [-75, 11], [-60, 8], [-35, -5], [-38, -15], [-50, -30], [-65, -54],
    [-74, -45], [-72, -18], [-80, -2], [-78, 8]
  ], '#1e4f1a');

  // Antarctica Ice Cap
  drawPolygon([
    [-180, -70], [180, -70], [180, -90], [-180, -90]
  ], '#f8fafc', 'rgba(255, 255, 255, 0.5)');

  // Subtle noise for terrain variation
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 16) {
    const noise = (Math.random() - 0.5) * 14;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Earth Night-Side City Lights Texture (2048x1024).
 * Matches the reference image where glowing gold city light clusters
 * illuminate populated continents on the unlit side of Earth.
 */
export function createEarthNightTexture() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Pitch black night base
  ctx.fillStyle = '#010308';
  ctx.fillRect(0, 0, width, height);

  const toXY = (lon, lat) => [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height,
  ];

  // Helper to draw realistic urban light clusters with warm golden glow
  const drawCityCluster = (lon, lat, radius, intensity = 1.0) => {
    const [x, y] = toXY(lon, lat);
    const grad = ctx.createRadialGradient(x, y, 1, x, y, radius);
    grad.addColorStop(0, `rgba(255, 243, 196, ${0.95 * intensity})`);
    grad.addColorStop(0.3, `rgba(251, 191, 36, ${0.75 * intensity})`);
    grad.addColorStop(0.7, `rgba(245, 158, 11, ${0.35 * intensity})`);
    grad.addColorStop(1, 'rgba(217, 119, 6, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Secondary micro-sparkles inside cluster
    for (let i = 0; i < 6; i++) {
      const sx = x + (Math.random() - 0.5) * radius * 0.8;
      const sy = y + (Math.random() - 0.5) * radius * 0.8;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
  };

  // Indian Subcontinent (Dense Golden Web - Mumbai, Delhi, Bengaluru, Chennai, Kolkata)
  drawCityCluster(72.87, 19.07, 16, 1.0); // Mumbai
  drawCityCluster(77.20, 28.61, 18, 1.0); // Delhi / NCR
  drawCityCluster(77.59, 12.97, 15, 1.0); // Bengaluru
  drawCityCluster(80.27, 13.08, 14, 0.95); // Chennai
  drawCityCluster(88.36, 22.57, 15, 0.95); // Kolkata
  drawCityCluster(78.48, 17.38, 13, 0.9); // Hyderabad
  drawCityCluster(72.57, 23.02, 12, 0.85); // Ahmedabad
  // Indo-Gangetic Plain Light Belt
  for (let lon = 75; lon <= 86; lon += 1.2) {
    const lat = 25 + Math.sin((lon - 75) * 0.3) * 3;
    drawCityCluster(lon, lat, Math.random() * 6 + 4, 0.85);
  }

  // Europe (Dense Network - London, Paris, Ruhr, Milan, Madrid, Berlin)
  drawCityCluster(-0.12, 51.50, 18, 1.0); // London
  drawCityCluster(2.35, 48.85, 18, 1.0); // Paris
  drawCityCluster(7.0, 51.4, 22, 1.0); // Rhine-Ruhr
  drawCityCluster(9.19, 45.46, 15, 0.95); // Milan
  drawCityCluster(-3.70, 40.41, 14, 0.9); // Madrid
  drawCityCluster(13.40, 52.52, 14, 0.9); // Berlin
  drawCityCluster(37.61, 55.75, 18, 1.0); // Moscow

  // East Asia (Tokyo, Shanghai, Beijing, Seoul, Pearl River Delta)
  drawCityCluster(139.69, 35.68, 22, 1.0); // Tokyo Megalopolis
  drawCityCluster(121.47, 31.23, 20, 1.0); // Shanghai
  drawCityCluster(116.40, 39.90, 18, 1.0); // Beijing
  drawCityCluster(126.97, 37.56, 18, 1.0); // Seoul
  drawCityCluster(113.26, 23.12, 22, 1.0); // Guangzhou / Shenzhen

  // Middle East
  drawCityCluster(55.27, 25.20, 16, 1.0); // Dubai
  drawCityCluster(31.23, 30.04, 18, 1.0); // Nile River & Cairo

  // North America (Eastern Seaboard, Chicago, California, Texas)
  drawCityCluster(-74.00, 40.71, 24, 1.0); // New York / BosWash
  drawCityCluster(-87.62, 41.87, 18, 1.0); // Chicago
  drawCityCluster(-118.24, 34.05, 20, 1.0); // Los Angeles
  drawCityCluster(-122.41, 37.77, 16, 0.95); // San Francisco
  drawCityCluster(-95.36, 29.76, 16, 0.9); // Houston

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Earth Rotating Cloud Deck Texture (2048x1024).
 */
export function createEarthCloudsTexture() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  const drawCloudSwirl = (cx, cy, rx, ry, opacity = 0.55) => {
    const grad = ctx.createRadialGradient(cx, cy, rx * 0.1, cx, cy, rx);
    grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    grad.addColorStop(0.5, `rgba(240, 248, 255, ${opacity * 0.6})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.4 - 0.2, 0, Math.PI * 2);
    ctx.fill();
  };

  for (let y = 80; y < height - 80; y += 40) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const x = (i / count) * width + (Math.random() * 80 - 40);
      const rx = Math.random() * 95 + 50;
      const ry = Math.random() * 24 + 10;
      drawCloudSwirl(x, y + (Math.random() * 30 - 15), rx, ry, 0.48);
    }
  }

  // Major Cyclones (Indian Ocean / Bay of Bengal & Pacific)
  drawCloudSwirl(width * 0.35, height * 0.42, 140, 95, 0.75);
  drawCloudSwirl(width * 0.72, height * 0.35, 160, 110, 0.7);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates Custom Earth Day/Night + Atmospheric Limb Scatter Shader Material.
 * Renders realistic daytime continents/oceans on the sunlit side,
 * glowing golden city lights on the night side, and Rayleigh cyan atmosphere scattering!
 */
export function createEarthShaderMaterial(dayTex, nightTex, cloudsTex, sunDir) {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDay: { value: dayTex },
      tNight: { value: nightTex },
      tClouds: { value: cloudsTex },
      uSunDirection: { value: sunDir.clone().normalize() },
      uCloudOffset: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDay;
      uniform sampler2D tNight;
      uniform sampler2D tClouds;
      uniform vec3 uSunDirection;
      uniform float uCloudOffset;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        // Sun alignment for day/night transition
        float NdotL = dot(vNormal, uSunDirection);
        float dayFactor = smoothstep(-0.12, 0.18, NdotL);

        vec4 dayColor = texture2D(tDay, vUv);
        vec4 nightColor = texture2D(tNight, vUv);

        // Animated cloud texture coordinates
        vec2 cloudUv = vec2(vUv.x + uCloudOffset, vUv.y);
        vec4 cloudColor = texture2D(tClouds, cloudUv);

        // Surface blend: day vs night city lights
        vec3 surfaceColor = mix(nightColor.rgb * 1.85, dayColor.rgb, dayFactor);

        // Ocean specular sun glint (only on water where dayColor is predominantly blue)
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 reflectDir = reflect(-uSunDirection, vNormal);
        float spec = pow(max(0.0, dot(reflectDir, viewDir)), 36.0);
        float isWater = step(0.1, dayColor.b - dayColor.g);
        vec3 sunGlint = vec3(1.0, 0.95, 0.85) * spec * isWater * dayFactor * 0.55;
        surfaceColor += sunGlint;

        // Cloud blend (prominent on sunlit hemisphere)
        surfaceColor = mix(surfaceColor, vec3(0.96, 0.98, 1.0), cloudColor.a * dayFactor * 0.72);

        // Atmospheric Rayleigh Scattering Rim (Fresnel Glow)
        float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.8);
        vec3 atmosGlow = vec3(0.24, 0.68, 1.0) * fresnel * (dayFactor * 1.6 + 0.35);

        gl_FragColor = vec4(surfaceColor + atmosGlow, 1.0);
      }
    `,
  });
}

/**
 * Creates High-Detail Moon Albedo Texture (2048x1024).
 * Includes authentic dark basaltic maria, Tycho & Copernicus crater ray complexes,
 * central crater peaks, and high-contrast regolith albedo variations.
 */
export function createMoonTexture() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b4b7bd';
  ctx.fillRect(0, 0, width, height);

  // High-frequency granular noise
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 40;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const toXY = (lon, lat) => [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height,
  ];

  const drawMare = (lon, lat, rx, ry, angle = 0, darkness = 0.68) => {
    const [cx, cy] = toXY(lon, lat);
    const grad = ctx.createRadialGradient(cx, cy, 6, cx, cy, rx);
    grad.addColorStop(0, `rgba(38, 42, 50, ${darkness})`);
    grad.addColorStop(0.65, `rgba(54, 59, 68, ${darkness * 0.85})`);
    grad.addColorStop(0.88, `rgba(84, 89, 98, ${darkness * 0.45})`);
    grad.addColorStop(1, 'rgba(120, 125, 135, 0)');

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Major Basaltic Maria (Near Side)
  drawMare(-50, 20, 175, 150, 0.2, 0.74); // Oceanus Procellarum
  drawMare(-20, 35, 128, 98, -0.1, 0.70); // Mare Imbrium
  drawMare(15, 30, 98, 80, 0.3, 0.66);   // Mare Serenitatis
  drawMare(30, 10, 108, 85, 0.1, 0.70);  // Mare Tranquillitatis
  drawMare(58, 16, 70, 58, 0, 0.74);     // Mare Crisium
  drawMare(35, -5, 88, 70, -0.2, 0.60);  // Mare Fecunditatis
  drawMare(-20, -15, 100, 78, 0.2, 0.60);// Mare Nubium

  // 1. Tycho Crater & Extensive Radial Ray Web
  const [tychoX, tychoY] = toXY(-11, -43);
  ctx.save();
  const rayAngles = [
    0.08, 0.28, 0.52, 0.78, 1.05, 1.32, 1.58, 1.85, 2.15, 2.45, 2.75, 3.05, 3.35, 3.65, 3.95, 4.25, 4.55, 4.85, 5.15, 5.45, 5.75, 6.05
  ];
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  rayAngles.forEach((ang) => {
    ctx.lineWidth = Math.random() * 2.8 + 1.2;
    ctx.beginPath();
    ctx.moveTo(tychoX, tychoY);
    const len = Math.random() * 380 + 240;
    ctx.lineTo(tychoX + Math.cos(ang) * len, tychoY + Math.sin(ang) * len);
    ctx.stroke();
  });

  // Tycho Terraced Rim
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(tychoX, tychoY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#374151';
  ctx.beginPath();
  ctx.arc(tychoX, tychoY, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(tychoX, tychoY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Copernicus Crater & Secondary Ray Filaments
  const [copX, copY] = toXY(-20, 10);
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * Math.PI * 2 + 0.1;
    ctx.lineWidth = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.moveTo(copX, copY);
    ctx.lineTo(copX + Math.cos(ang) * (Math.random() * 140 + 80), copY + Math.sin(ang) * (Math.random() * 140 + 80));
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(copX, copY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2d3748';
  ctx.beginPath();
  ctx.arc(copX, copY, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(copX, copY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Kepler Crater
  const [kepX, kepY] = toXY(-38, 8);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(kepX, kepY, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2d3748';
  ctx.beginPath();
  ctx.arc(kepX, kepY, 7, 0, Math.PI * 2);
  ctx.fill();

  // 4. Procedural multi-scale craters across the globe
  for (let i = 0; i < 550; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = Math.random() * 7 + 1.5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(22, 26, 35, 0.7)';
    ctx.beginPath();
    ctx.arc(cx - 0.6, cy - 0.6, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates High-Contrast Moon Bump Map for true 3D surface crater relief.
 */
export function createMoonBumpMap() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  // Fine terrain noise
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  // Multi-scale craters
  for (let i = 0; i < 480; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 10 + 2;

    // Raised rim (white highlight)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, r + 2, 0, Math.PI * 2);
    ctx.fill();

    // Depressed floor (dark shadow)
    ctx.fillStyle = '#181818';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
