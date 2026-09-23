/* ============================================================
   HASEEB H — 3D PORTFOLIO SCRIPTS
   Three.js particles, Typed.js, scroll reveals, 3D tilt,
   interactive demos (Dashboard, Containers, Pipeline, Arch)
   ============================================================ */

// ==================== THREE.JS PARTICLE NETWORK ====================
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const PARTICLE_COUNT = 120;
    const CONNECTION_DIST = 150;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
        velocities.push({
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
            z: (Math.random() - 0.5) * 0.2
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 2.5,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lines for connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
    });

    let linesMesh = null;
    const mouse = { x: 0, y: 0, active: false };

    camera.position.z = 400;

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse.active = true;
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const pos = particlesGeometry.attributes.position.array;

        // Move particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            pos[i * 3] += velocities[i].x;
            pos[i * 3 + 1] += velocities[i].y;
            pos[i * 3 + 2] += velocities[i].z;

            // Boundary wrap
            if (pos[i * 3] > 400) pos[i * 3] = -400;
            if (pos[i * 3] < -400) pos[i * 3] = 400;
            if (pos[i * 3 + 1] > 400) pos[i * 3 + 1] = -400;
            if (pos[i * 3 + 1] < -400) pos[i * 3 + 1] = 400;
            if (pos[i * 3 + 2] > 200) pos[i * 3 + 2] = -200;
            if (pos[i * 3 + 2] < -200) pos[i * 3 + 2] = 200;
        }

        particlesGeometry.attributes.position.needsUpdate = true;

        // Draw connections
        if (linesMesh) scene.remove(linesMesh);

        const linePositions = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < CONNECTION_DIST) {
                    linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                    linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                }
            }
        }

        if (linePositions.length > 0) {
            const linesGeometry = new THREE.BufferGeometry();
            linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
            scene.add(linesMesh);
        }

        // Mouse influence on camera
        if (mouse.active) {
            camera.position.x += (mouse.x * 50 - camera.position.x) * 0.02;
            camera.position.y += (mouse.y * 50 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
        }

        // Slow rotation
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;

        renderer.render(scene, camera);
    }

    animate();
})();


// ==================== TYPED.JS ANIMATION ====================
(function initTyped() {
    if (typeof Typed === 'undefined') return;
    const el = document.getElementById('typed-text');
    if (!el) return;

    new Typed('#typed-text', {
        strings: [
            'Cloud Engineer',
            'DevOps Specialist',
            'Infrastructure Architect',
            'CI/CD Pipeline Expert',
            'Container Orchestrator',
            'DevSecOps Enthusiast'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
})();


// ==================== CURSOR GLOW ====================
(function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
})();


// ==================== SCROLL PROGRESS BAR ====================
(function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        bar.style.width = progress + '%';
    });
})();


// ==================== NAVBAR SCROLL EFFECTS ====================
(function initNavEffects() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id], .hero');

    if (!nav) return;

    // Compact nav on scroll
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Active link highlighting
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id || 'hero';
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => observer.observe(s));

    // Smooth scroll + close mobile menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) menuToggle.checked = false;
        });
    });
})();


// ==================== THEME TOGGLE ====================
(function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    if (!btn) return;

    // Restore saved theme
    const saved = localStorage.getItem('theme');
    if (saved) {
        html.setAttribute('data-theme', saved);
        updateIcon(saved);
    }

    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcon(next);
    });

    function updateIcon(theme) {
        const icon = btn.querySelector('i');
        if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
})();


// ==================== SCROLL REVEAL ANIMATIONS ====================
(function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Also trigger skill progress bars
                const bars = entry.target.querySelectorAll('.skill-progress-fill');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    if (width) bar.style.width = width;
                });
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
})();


// ==================== ANIMATED COUNTERS ====================
(function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }
})();


// ==================== 3D TILT EFFECT ON CARDS ====================
(function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .stat-card, .cert-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -6;
            const rotateY = (x - centerX) / centerX * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
})();


// ==================== SKILL TABS ====================
(function initSkillTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const groups = document.querySelectorAll('.skill-group');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            groups.forEach(g => {
                g.classList.toggle('active', g.id === target);
            });

            // Re-trigger progress bars in newly visible group
            const activeGroup = document.getElementById(target);
            if (activeGroup) {
                activeGroup.querySelectorAll('.skill-progress-fill').forEach(bar => {
                    const w = bar.getAttribute('data-width');
                    bar.style.width = '0%';
                    setTimeout(() => { bar.style.width = w; }, 50);
                });
            }
        });
    });
})();


// ==================== DEMO MODALS ====================
function openDemo(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize the specific demo
    if (id === 'demo-dashboard') initDashboardDemo();
    if (id === 'demo-containers') initContainerDemo();
    if (id === 'demo-pipeline') initPipelineDemo();
    if (id === 'demo-architecture') initArchitectureDemo();
}

function closeDemo(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Cleanup
    if (id === 'demo-dashboard' && window._dashboardInterval) {
        clearInterval(window._dashboardInterval);
        window._dashboardInterval = null;
    }
    if (id === 'demo-pipeline' && window._pipelineInterval) {
        clearInterval(window._pipelineInterval);
        window._pipelineInterval = null;
    }
}

// Close modals on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('demo-modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});


// ==================== DASHBOARD DEMO ====================
let dashboardChartLine = null;
let dashboardChartDoughnut = null;

function initDashboardDemo() {
    if (typeof Chart === 'undefined') return;

    // Destroy old charts
    if (dashboardChartLine) { dashboardChartLine.destroy(); dashboardChartLine = null; }
    if (dashboardChartDoughnut) { dashboardChartDoughnut.destroy(); dashboardChartDoughnut = null; }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    // Line Chart - CPU & Memory over time
    const lineCtx = document.getElementById('chart-line');
    if (lineCtx) {
        const labels = Array.from({ length: 20 }, (_, i) => i + 's');
        const cpuData = Array.from({ length: 20 }, () => 30 + Math.random() * 40);
        const memData = Array.from({ length: 20 }, () => 40 + Math.random() * 30);

        dashboardChartLine = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'CPU %',
                        data: cpuData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        borderWidth: 2
                    },
                    {
                        label: 'Memory %',
                        data: memData,
                        borderColor: '#7b61ff',
                        backgroundColor: 'rgba(123, 97, 255, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                animation: { duration: 300 },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { min: 0, max: 100, ticks: { color: textColor }, grid: { color: gridColor } }
                },
                plugins: { legend: { labels: { color: textColor } } }
            }
        });
    }

    // Doughnut Chart - Disk Usage
    const doughnutCtx = document.getElementById('chart-doughnut');
    if (doughnutCtx) {
        dashboardChartDoughnut = new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Free'],
                datasets: [{
                    data: [67, 33],
                    backgroundColor: ['#00d4ff', isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '75%',
                plugins: { legend: { labels: { color: textColor } } }
            }
        });
    }

    // Live update
    const cpuEl = document.getElementById('dash-cpu');
    const memEl = document.getElementById('dash-mem');
    const netEl = document.getElementById('dash-net');

    window._dashboardInterval = setInterval(() => {
        const cpu = (30 + Math.random() * 50).toFixed(1);
        const mem = (40 + Math.random() * 35).toFixed(1);
        const net = (Math.random() * 100).toFixed(0);

        if (cpuEl) cpuEl.textContent = cpu + '%';
        if (memEl) memEl.textContent = mem + '%';
        if (netEl) netEl.textContent = net + ' Mbps';

        if (dashboardChartLine) {
            dashboardChartLine.data.datasets[0].data.shift();
            dashboardChartLine.data.datasets[0].data.push(parseFloat(cpu));
            dashboardChartLine.data.datasets[1].data.shift();
            dashboardChartLine.data.datasets[1].data.push(parseFloat(mem));
            dashboardChartLine.update('none');
        }
    }, 1500);
}


// ==================== CONTAINER VISUALIZER DEMO ====================
function initContainerDemo() {
    const containers = document.querySelectorAll('#demo-containers .docker-container');
    const log = document.getElementById('container-log');
    if (log) log.innerHTML = '';

    containers.forEach(c => {
        c.classList.remove('running', 'starting');
    });

    addLog(log, '$ docker-compose up -d');
    addLog(log, 'Creating network "app_default"...');

    const names = ['nginx-proxy', 'node-api', 'redis-cache', 'postgres-db', 'worker-1', 'worker-2'];

    containers.forEach((c, i) => {
        setTimeout(() => {
            c.classList.add('starting');
            addLog(log, `Creating ${names[i]}...`);

            setTimeout(() => {
                c.classList.remove('starting');
                c.classList.add('running');
                addLog(log, `✓ ${names[i]} started (healthy)`);
            }, 800 + Math.random() * 500);
        }, i * 600);
    });
}

function resetContainers() {
    const containers = document.querySelectorAll('#demo-containers .docker-container');
    const log = document.getElementById('container-log');

    const names = ['nginx-proxy', 'node-api', 'redis-cache', 'postgres-db', 'worker-1', 'worker-2'];

    containers.forEach((c, i) => {
        setTimeout(() => {
            c.classList.remove('running');
            c.classList.add('starting');
            addLog(log, `Stopping ${names[i]}...`);

            setTimeout(() => {
                c.classList.remove('starting');
                addLog(log, `✗ ${names[i]} stopped`);
            }, 400);
        }, i * 300);
    });

    setTimeout(() => {
        addLog(log, '$ All containers stopped.');
    }, containers.length * 300 + 500);
}

function addLog(logEl, text) {
    if (!logEl) return;
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = text;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
}


// ==================== CI/CD PIPELINE DEMO ====================
function initPipelineDemo() {
    if (window._pipelineInterval) {
        clearInterval(window._pipelineInterval);
        window._pipelineInterval = null;
    }

    const stages = document.querySelectorAll('#demo-pipeline .pipeline-stage');
    stages.forEach(s => {
        s.classList.remove('active', 'complete', 'failed');
        const fill = s.querySelector('.pipeline-progress-fill');
        if (fill) fill.style.width = '0%';
        const status = s.querySelector('.stage-status');
        if (status) status.textContent = 'Pending';
    });
}

function runPipeline() {
    const stages = document.querySelectorAll('#demo-pipeline .pipeline-stage');
    // Reset
    stages.forEach(s => {
        s.classList.remove('active', 'complete', 'failed');
        const fill = s.querySelector('.pipeline-progress-fill');
        if (fill) fill.style.width = '0%';
        const status = s.querySelector('.stage-status');
        if (status) status.textContent = 'Pending';
    });

    let current = 0;

    function runStage() {
        if (current >= stages.length) return;

        const stage = stages[current];
        stage.classList.add('active');
        const status = stage.querySelector('.stage-status');
        const fill = stage.querySelector('.pipeline-progress-fill');
        if (status) status.textContent = 'Running...';

        let progress = 0;
        const dur = 1500 + Math.random() * 1000;
        const step = 16;
        const increment = (step / dur) * 100;

        window._pipelineInterval = setInterval(() => {
            progress += increment;
            if (fill) fill.style.width = Math.min(progress, 100) + '%';

            if (progress >= 100) {
                clearInterval(window._pipelineInterval);
                stage.classList.remove('active');
                stage.classList.add('complete');
                if (status) status.textContent = '✓ Passed';
                if (fill) fill.style.width = '100%';
                current++;
                setTimeout(runStage, 400);
            }
        }, step);
    }

    runStage();
}


// ==================== ARCHITECTURE DEMO ====================
function initArchitectureDemo() {
    const nodes = document.querySelectorAll('#demo-architecture .arch-node');
    const info = document.getElementById('arch-info');
    nodes.forEach(n => n.classList.remove('connected'));
}

function selectArchNode(el) {
    const nodes = document.querySelectorAll('#demo-architecture .arch-node');
    nodes.forEach(n => n.classList.remove('connected'));
    el.classList.add('connected');

    // Show connected nodes
    const connects = el.getAttribute('data-connects');
    if (connects) {
        connects.split(',').forEach(id => {
            const node = document.getElementById(id);
            if (node) node.classList.add('connected');
        });
    }

    // Show info
    const info = document.getElementById('arch-info');
    const infoTitle = document.getElementById('arch-info-title');
    const infoDesc = document.getElementById('arch-info-desc');

    if (info && infoTitle && infoDesc) {
        infoTitle.textContent = el.getAttribute('data-title') || '';
        infoDesc.textContent = el.getAttribute('data-desc') || '';
        info.classList.add('visible');
    }
}
