document.addEventListener('DOMContentLoaded', () => {
  // Sidebar Toggle
  const toggleButton = document.getElementById('toggle-btn');
  const sidebar = document.getElementById('sidebar');
  
  toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('close');
  });
  
  // Active navigation item
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');
  
  function setActiveNavItem() {
    let current = '';
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= (sectionTop - 100)) {
        current = section.getAttribute('id');
      }
    });
    
    navItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', setActiveNavItem);
  
  // Back to top bar
  const backToTopBar = document.getElementById('back-to-top-bar');
  
  function toggleBackToTopBar() {
    // Check if we're near the bottom of the page
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Show when we're within 300px of the bottom or at least 500px from the top
    if (scrollPosition + windowHeight >= documentHeight - 100 || scrollPosition > 10000) {
      backToTopBar.classList.add('visible');
    } else {
      backToTopBar.classList.remove('visible');
    }
  }
  
  window.addEventListener('scroll', toggleBackToTopBar);
  
  backToTopBar.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Document filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const docCards = document.querySelectorAll('.doc-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(button => button.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Get filter value
      const filterValue = btn.getAttribute('data-filter');
      
      // Filter documents
      docCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          // Add animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Form submission handling
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });
      
      // Here you would typically send the data to a server
      // For now, we'll just add some visual feedback
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'Envoyé !';
        submitBtn.style.backgroundColor = 'var(--color-secondary)';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
  
  // Hero Section - Tech Network Animation
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Animation config
    const config = {
      particleCount: 100,
      particleColor: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#4f46e5',
      particleSizeMin: 2,
      particleSizeMax: 4,
      connectionDistance: 150,
      speed: 0.5,
      lineWidth: 0.5,
      responsive: true,
      mouseInteraction: true,
      mouseRadius: 150,
      mouseForce: 0.5
    };
    
    // Particle class
    class Particle {
      constructor() {
        this.size = Math.random() * (config.particleSizeMax - config.particleSizeMin) + config.particleSizeMin;
        this.position = {
          x: Math.random() * width,
          y: Math.random() * height
        };
        this.velocity = {
          x: (Math.random() - 0.5) * config.speed,
          y: (Math.random() - 0.5) * config.speed
        };
        this.isFixed = Math.random() < 0.05; // 5% chance of being fixed
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseSize = Math.random() * 0.5 + 0.5;
        this.originalSize = this.size;
        this.life = Math.random() * 100 + 150;
      }
      
      // Update particle position
      update(mouse) {
        // Skip movement for fixed particles
        if (this.isFixed) return;
        
        // Move particle
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Bounce off edges
        if (this.position.x < 0 || this.position.x > width) {
          this.velocity.x = -this.velocity.x;
        }
        if (this.position.y < 0 || this.position.y > height) {
          this.velocity.y = -this.velocity.y;
        }
        
        // Apply rotation to velocity (creates curved movement)
        if (Math.random() > 0.95) {
          const angle = Math.random() * 0.1 - 0.05;
          const vx = this.velocity.x * Math.cos(angle) - this.velocity.y * Math.sin(angle);
          const vy = this.velocity.x * Math.sin(angle) + this.velocity.y * Math.cos(angle);
          this.velocity.x = vx;
          this.velocity.y = vy;
        }
        
        // Pulsate size
        this.size = this.originalSize + Math.sin(Date.now() * this.pulseSpeed) * this.pulseSize;
        
        // React to mouse
        if (config.mouseInteraction && mouse.x && mouse.y) {
          const dx = mouse.x - this.position.x;
          const dy = mouse.y - this.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.mouseRadius) {
            const force = (config.mouseRadius - distance) / config.mouseRadius * config.mouseForce;
            this.velocity.x -= (dx / distance) * force;
            this.velocity.y -= (dy / distance) * force;
          }
        }
        
        // Gradually slow down
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
      }
      
      // Draw particle
      draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.fill();
      }
    }
    
    // Create particles
    const particles = [];
    
    function createParticles() {
      // Clear existing particles
      particles.length = 0;
      
      // Create new particles
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    }
    
    createParticles();
    
    // Connect particles with lines
    function connectParticles() {
      const opacityStep = 0.5 / config.connectionDistance;
      
      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const otherParticle = particles[j];
          const dx = particle.position.x - otherParticle.position.x;
          const dy = particle.position.y - otherParticle.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.connectionDistance) {
            // Calculate opacity based on distance
            const opacity = (config.connectionDistance - distance) * opacityStep;
            
            ctx.beginPath();
            ctx.moveTo(particle.position.x, particle.position.y);
            ctx.lineTo(otherParticle.position.x, otherParticle.position.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
            ctx.lineWidth = config.lineWidth;
            ctx.stroke();
          }
        }
      });
    }
    
    // Track mouse position
    const mouse = { x: null, y: null };
    
    document.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    
    // Hide mouse position when mouse leaves canvas
    document.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    // Handle window resize
    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    }
    
    if (config.responsive) {
      window.addEventListener('resize', handleResize);
    }
    
    // Add coding symbols to the background
    const techSymbols = ['{', '}', '(', ')', '<', '>', '/', '*', '=', ';', '[]', '&&', '||', '=>', '!=', '=='];
    const symbols = [];
    
    function createSymbols() {
      symbols.length = 0;
      const symbolCount = Math.max(15, Math.floor(width * height / 20000));
      
      for (let i = 0; i < symbolCount; i++) {
        symbols.push({
          value: techSymbols[Math.floor(Math.random() * techSymbols.length)],
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 14 + 10,
          opacity: Math.random() * 0.08 + 0.02,
          speed: Math.random() * 0.5 + 0.1
        });
      }
    }
    
    createSymbols();
    
    // Animation loop
    function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw faint background symbols
      symbols.forEach(symbol => {
        ctx.fillStyle = `rgba(79, 70, 229, ${symbol.opacity})`;
        ctx.font = `${symbol.size}px monospace`;
        ctx.fillText(symbol.value, symbol.x, symbol.y);
        
        symbol.y += symbol.speed;
        if (symbol.y > height) {
          symbol.y = 0;
          symbol.x = Math.random() * width;
        }
      });
      
      // Update particles
      particles.forEach(particle => {
        particle.update(mouse);
        particle.draw();
      });
      
      // Connect particles
      connectParticles();
      
      // Request next frame
      requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
  }
  
  // Typing Animation for the hero section
  const typingTextElement = document.getElementById('typing-text');
  if (typingTextElement) {
    const textToType = ["Linux", "Windows Server", "Active Directory", "Proxmox", "Réseaux", "Zabbix", "GLPI", "PowerShell", "Bash"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 150;
    
    function typeText() {
      const currentText = textToType[textIndex];
      
      if (isDeleting) {
        typingTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 80;
      } else {
        typingTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 150;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = 1000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textToType.length;
        typingDelay = 300;
      }
      
      setTimeout(typeText, typingDelay);
    }
    
    setTimeout(typeText, 1500);
  }
  
  // Veille Technologique animations
  const veilleItems = document.querySelectorAll('.veille-item');
  
  // Add animation when scrolling to veille items
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const veilleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        veilleObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Set up initial state and observe
  veilleItems.forEach((item, index) => {
    // Set initial state
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `all 0.4s ease ${index * 0.1}s`;
    
    // Observe item
    veilleObserver.observe(item);
  });
  
  // Add click listener for veille tags to filter content
  const veilleTags = document.querySelectorAll('.veille-tag');
  
  veilleTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const tagText = this.textContent.trim().toLowerCase();
      console.log(`Filter by: ${tagText}`);
      // Future enhancement: implement filtering by tag
    });
  });
  
  // Initialize
  setActiveNavItem();
  toggleBackToTopBar();
});