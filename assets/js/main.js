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
  // Create full-page background container for the 3D animation
  const bgDiv = document.createElement('div');
  bgDiv.id = 'bg-3d';
  bgDiv.style.position = 'fixed';
  bgDiv.style.top = '0';
  bgDiv.style.left = '0';
  bgDiv.style.width = '100%';
  bgDiv.style.height = '100%';
  bgDiv.style.zIndex = '-1';
  bgDiv.style.pointerEvents = 'none';
  document.body.prepend(bgDiv);

  // Inject custom CSS for gradient background and improved layout
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    body {
      background: linear-gradient(180deg, #0a192f 0%, #112240 100%);
    }
    section {
      background-color: rgba(17,34,64,0.8);
      padding: 40px 20px;
      margin: 20px 0;
      border: 1px solid #233554;
      border-radius: 8px;
    }
    section h2 {
      color: #64ffda;
      margin-bottom: 20px;
    }
    section h3 {
      color: #8892b0;
    }
    section p,
    section ul li {
      color: #ccd6f6;
    }
    a {
      color: #64ffda;
    }
    a:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(styleTag);

  // Helper to load external scripts
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(script);
    });
  };

  // Load Three.js and initialize 3D background
  loadScript('https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js').then(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, bgDiv.clientWidth / bgDiv.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(bgDiv.clientWidth, bgDiv.clientHeight);
    bgDiv.appendChild(renderer.domElement);

    // Create sphere group for skills
    const skills = [
      'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
      'Predictive Modeling', 'Optimization', 'Generative AI',
      'LLM Tools', 'Engineering & Cloud', 'Programming'
    ];
    const group = new THREE.Group();
    const radius = 2;
    const N = skills.length;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const geometry = new THREE.SphereGeometry(0.08, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x64ffda });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      );
      group.add(sphere);
    }
    scene.add(group);
    camera.position.z = 5;

    const animate = function() {
      requestAnimationFrame(animate);
      group.rotation.y += 0.001;
      group.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      renderer.setSize(bgDiv.clientWidth, bgDiv.clientHeight);
      camera.aspect = bgDiv.clientWidth / bgDiv.clientHeight;
      camera.updateProjectionMatrix();
    });
  }).catch((err) => {
    console.error(err);
  });
})
