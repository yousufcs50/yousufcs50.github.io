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
    // Set styles for background container
    bgDiv.style.position = 'fixed';
    bgDiv.style.top = '0';
    bgDiv.style.left = '0';
    bgDiv.style.width = '100%';
    bgDiv.style.height = '100%';
    bgDiv.style.zIndex = '-1';
    bgDiv.style.pointerEvents = 'none';
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

    // Load Three.js library and initialize the 3D animation
    loadScript('https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js').then(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        bgDiv.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        // Skills list for spheres
        const skills = [
            'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
            'Predictive Modeling', 'Model Optimization', 'Time-Series Forecasting',
            'Generative AI', 'LLMs'
        ];
        const total = skills.length;
        const radius = 5;

        // Fibonacci sphere distribution
        for (let i = 0; i < total; i++) {
            const y = 1 - (i / (total - 1)) * 2;
            const radiusXY = Math.sqrt(1 - y * y);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const x = Math.cos(theta) * radiusXY;
            const z = Math.sin(theta) * radiusXY;

            const geometry = new THREE.SphereGeometry(0.15, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: 0x64ffda });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x * radius, y * radius, z * radius);
            group.add(sphere);
        }

        camera.position.z = 10;

        function animate() {
            requestAnimationFrame(animate);
            group.rotation.y += 0.002;
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    });
});
