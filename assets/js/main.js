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
  // Create the skills constellation section and placeholder
  const footer = document.querySelector('footer');
  if (footer) {
    const section = document.createElement('section');
    section.id = 'skills-constellation';
    section.className = 'section';
    const container = document.createElement('div');
    container.className = 'container';
    const h2 = document.createElement('h2');
    h2.textContent = 'Interactive Skills Constellation';
    const div3d = document.createElement('div');
    div3d.id = 'skills3d';
    container.appendChild(h2);
    container.appendChild(div3d);
    section.appendChild(container);
    footer.parentNode.insertBefore(section, footer);
  }

  // Helper to dynamically load Three.js
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r157/three.min.js').then(() => {
    const div3d = document.getElementById('skills3d');
    if (!div3d) return;
    const width = div3d.clientWidth || div3d.offsetWidth || (div3d.parentElement && div3d.parentElement.clientWidth) || window.innerWidth;
    const height = 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    div3d.appendChild(renderer.domElement);

    const skills = ['Machine Learning','Deep Learning','NLP','Computer Vision','Generative AI','RAG Pipelines','Cloud ML','Python'];
    const group = new THREE.Group();

    skills.forEach((skill, i) => {
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const mesh = new THREE.Mesh(geometry, material);
      const phi = Math.acos(1 - 2 * (i + 0.5) / skills.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const radius = 3;
      mesh.position.set(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      group.add(mesh);
    });

    scene.add(group);
    camera.position.z = 8;

    function animate() {
      requestAnimationFrame(animate);
      group.rotation.y += 0.003;
      group.rotation.x += 0.0015;
      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      const newWidth = div3d.clientWidth || div3d.offsetWidth || (div3d.parentElement && div3d.parentElement.clientWidth) || window.innerWidth;
      renderer.setSize(newWidth, height);
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
    });
  }).catch((err) => {
    console.error('Failed to load Three.js', err);
  });
});
