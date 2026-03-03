// ===========================
// Neural Network Background Animation
// ===========================
class NeuralNetwork {
    constructor() {
        this.canvas = document.getElementById('neuralCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.nodeCount = 80;
        this.maxDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Create nodes
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw nodes
        this.nodes.forEach((node, i) => {
            // Move nodes
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = this.mouse.x - node.x;
                const dy = this.mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    node.x -= dx * force * 0.03;
                    node.y -= dy * force * 0.03;
                }
            }
            
            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
            this.ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[j].x - node.x;
                const dy = this.nodes[j].y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    const opacity = (1 - distance / this.maxDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===========================
// Typing Animation
// ===========================
class TypingEffect {
    constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===========================
// Navigation
// ===========================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupActiveLink();
    }
    
    setupScrollEffect() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    setupMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
    }
    
    setupActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
}

// ===========================
// Projects Data & Rendering
// ===========================
const projectsData = [
    {
        title: "Clinic Management System",
        description: "Comprehensive healthcare management system for clinics with patient records, appointments, and billing features. Built with modern web technologies.",
        tags: ["HTML", "CSS", "JavaScript", "Healthcare"],
        image: "project1",
        github: "https://github.com/AbdurrabKhan198/clinic-management",
        demo: "https://github.com/AbdurrabKhan198/clinic-management"
    },
    {
        title: "Algerian Forest Fire Prediction",
        description: "Machine learning model trained on Algerian Forest Fire data to predict fire occurrence based on temperature, humidity, and other environmental factors.",
        tags: ["Python", "Machine Learning", "Scikit-learn", "Jupyter"],
        image: "project2",
        github: "https://github.com/AbdurrabKhan198/ML-Model---Algerian-Forest-Fire",
        demo: "https://github.com/AbdurrabKhan198/ML-Model---Algerian-Forest-Fire"
    },
    {
        title: "Maternal Health Risk Prediction",
        description: "Deep learning model to assess maternal health risks during pregnancy using clinical data, helping healthcare providers make informed decisions.",
        tags: ["Python", "Deep Learning", "Healthcare", "Jupyter Notebook"],
        image: "project3",
        github: "https://github.com/AbdurrabKhan198/maternal-health-risk",
        demo: "https://github.com/AbdurrabKhan198/maternal-health-risk"
    },
    {
        title: "KMCLU - Python Project",
        description: "Advanced Python application demonstrating data processing and analysis capabilities with modern Python libraries and best practices.",
        tags: ["Python", "Data Analysis", "Pandas", "NumPy"],
        image: "project4",
        github: "https://github.com/AbdurrabKhan198/kmclu",
        demo: "https://github.com/AbdurrabKhan198/kmclu"
    },
    {
        title: "Hand Gesture Detection",
        description: "Computer vision project using OpenCV and MediaPipe to detect and recognize hand gestures in real-time for interactive applications.",
        tags: ["Python", "OpenCV", "Computer Vision", "MediaPipe"],
        image: "project5",
        github: "https://github.com/AbdurrabKhan198/hand-gesture-detector",
        demo: "#"
    },
    {
        title: "Data Science Portfolio Projects",
        description: "Collection of data science and machine learning projects showcasing skills in predictive modeling, data visualization, and statistical analysis.",
        tags: ["Python", "Machine Learning", "Data Science", "Analytics"],
        image: "project6",
        github: "https://github.com/AbdurrabKhan198",
        demo: "https://github.com/AbdurrabKhan198"
    }
];

const clientsData = [
    {
        name: "E-Commerce Analytics Platform",
        type: "Data Science Consulting",
        description: "Built a comprehensive analytics pipeline processing 10M+ daily transactions, providing real-time insights and customer segmentation.",
        logo: "🛒",
        tech: ["Python", "Apache Spark", "AWS", "Tableau"]
    },
    {
        name: "Healthcare Prediction System",
        type: "Machine Learning",
        description: "Developed ML models for early disease detection with 92% accuracy, helping healthcare providers make data-driven decisions.",
        logo: "🏥",
        tech: ["TensorFlow", "Scikit-learn", "Docker", "Flask"]
    },
    {
        name: "Financial Trading Bot",
        type: "Algorithmic Trading",
        description: "Created automated trading system using reinforcement learning for portfolio optimization and risk management.",
        logo: "💹",
        tech: ["Python", "RL", "Keras", "PostgreSQL"]
    },
    {
        name: "Smart City IoT Platform",
        type: "Full-Stack Development",
        description: "Designed and deployed IoT data collection and visualization platform for urban infrastructure monitoring.",
        logo: "🌆",
        tech: ["Node.js", "MongoDB", "React", "MQTT"]
    }
];

// ===========================
// Project Cards Rendering
// ===========================
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    
    projectsData.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="https://via.placeholder.com/400x220/667eea/ffffff?text=${encodeURIComponent(project.title)}" 
                 alt="${project.title}" 
                 class="project-image">
            <div class="project-content">
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    <a href="${project.github}" class="project-link" target="_blank">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Code
                    </a>
                    <a href="${project.demo}" class="project-link" target="_blank">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Demo
                    </a>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(card);
    });
}

// ===========================
// Client Cards Rendering
// ===========================
function renderClients() {
    const clientsGrid = document.getElementById('clientsGrid');
    
    clientsData.forEach((client, index) => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="client-header">
                <div class="client-logo">${client.logo}</div>
                <div class="client-info">
                    <h3>${client.name}</h3>
                    <span class="client-type">${client.type}</span>
                </div>
            </div>
            <p class="client-description">${client.description}</p>
            <div class="client-tech">
                ${client.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
        `;
        
        clientsGrid.appendChild(card);
    });
}

// ===========================
// Intersection Observer for Animations
// ===========================
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        this.observeElements();
    }
    
    observeElements() {
        const elements = document.querySelectorAll('.project-card, .client-card, .expertise-card');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
}

// ===========================
// Contact Form Handler
// ===========================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.setupFormSubmission();
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simulate form submission
            this.showNotification('Message sent successfully! I\'ll get back to you soon. 🚀', 'success');
            this.form.reset();
            
            // In a real application, you would send this to a backend
            console.log('Form submitted:', formData);
        });
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===========================
// Smooth Scroll
// ===========================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===========================
// Add CSS animations dynamically
// ===========================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// GitHub Contribution Graph
// ===========================
class GitHubContributions {
    constructor() {
        this.generateContributionGraph();
        this.animateStats();
    }
    
    generateContributionGraph() {
        const graph = document.getElementById('contributionGraph');
        if (!graph) return;
        
        const weeks = 53;
        const daysPerWeek = 7;
        const totalDays = weeks * daysPerWeek;
        
        // Generate realistic contribution data
        const contributions = [];
        for (let i = 0; i < totalDays; i++) {
            // Create realistic patterns with some randomness
            const dayOfWeek = i % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            let level;
            const rand = Math.random();
            
            if (isWeekend) {
                // Less activity on weekends
                if (rand < 0.4) level = 0;
                else if (rand < 0.7) level = 1;
                else if (rand < 0.9) level = 2;
                else level = 3;
            } else {
                // More activity on weekdays
                if (rand < 0.1) level = 0;
                else if (rand < 0.3) level = 1;
                else if (rand < 0.5) level = 2;
                else if (rand < 0.8) level = 3;
                else level = 4;
            }
            
            contributions.push(level);
        }
        
        // Create contribution cells
        contributions.forEach((level, index) => {
            const day = document.createElement('div');
            day.className = 'contribution-day';
            day.setAttribute('data-level', level);
            day.style.animationDelay = `${index * 0.002}s`;
            
            // Add tooltip on hover
            const contributionCount = level * Math.floor(Math.random() * 5 + 1);
            day.title = `${contributionCount} contributions`;
            
            graph.appendChild(day);
        });
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    this.countUp(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    countUp(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
}

// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize neural network background
    new NeuralNetwork();
    
    // Initialize typing effect
    const typingTexts = [
        'Predictive Analytics',
        'Custom ML Solutions',
        'AI-Powered Automation',
        'Deep Learning Models',
        'Data-Driven Insights',
        'Smart Recommendations',
        'Computer Vision Apps',
        'NLP Solutions',
        'End-to-End AI Systems'
    ];
    new TypingEffect(document.getElementById('typingText'), typingTexts);
    
    // Initialize navigation
    new Navigation();
    
    // Render projects and clients
    renderProjects();
    renderClients();
    
    // Initialize GitHub contributions
    new GitHubContributions();
    
    // Initialize animation observer
    new AnimationObserver();
    
    // Initialize contact form
    new ContactForm();
    
    // Setup smooth scroll
    setupSmoothScroll();
    
    console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with ❤️ by Abdurrab Khan', 'color: #4facfe; font-size: 14px;');
});
