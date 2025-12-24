document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Create a full-page background container for the 3D animation
  const bgDiv = document.createElement('div');
  bgDiv.id = 'bg-3d';
  document.body.prepend(bgDiv);

  // Helper to load external scripts
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load script: ' + src));
      document.head.appendChild(script);
    });
  };

  // Load Three.js and initialize the background animation
  loadScript('https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js').then(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    bgDiv.appendChild(renderer.domElement);

    // Create a group of spheres using a Fibonacci sphere algorithm
    const group = new THREE.Group();
    const count = 40;
    const radius = 80;
    const phi = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.SphereGeometry(1.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const sphere = new THREE.Mesh(geometry, material);
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = 2 * Math.PI * i / phi;
      sphere.position.set(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius);
      group.add(sphere);
    }
    scene.add(group);
    camera.position.z = 200;

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.0015;
      group.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
  }).catch((error) => {
    console.error(error);
  });
});
