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
  
  // Back to top button
  const backToTopButton = document.getElementById('back-to-top');
  
  function toggleBackToTopButton() {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  }
  
  window.addEventListener('scroll', toggleBackToTopButton);
  
  backToTopButton.addEventListener('click', () => {
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
  
  // Hero Section Animation
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Particle system
    class Particle {
      constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.originalSize = size;
        this.originalX = x;
        this.originalY = y;
      }
      
      update(mouseX, mouseY) {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary check
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
        
        // Interactive effect with mouse
        if (mouseX && mouseY) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;
            
            this.speedX -= forceDirectionX * force * 0.6;
            this.speedY -= forceDirectionY * force * 0.6;
            
            // Limit speed
            const maxSpeed = 3;
            this.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedX));
            this.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedY));
          }
        }
        
        // Apply some friction
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        
        // Gradually return to original size
        this.size += (this.originalSize - this.size) * 0.1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    // Create particles
    const particles = [];
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#4f46e5';
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary') || '#10b981';
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent') || '#f59e0b';
    
    function createParticles() {
      const totalParticles = Math.min(width * height / 15000, 150);
      
      for (let i = 0; i < totalParticles; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        const colorNum = Math.floor(Math.random() * 3);
        
        let color;
        switch (colorNum) {
          case 0:
            color = primaryColor;
            break;
          case 1:
            color = secondaryColor;
            break;
          case 2:
            color = accentColor;
            break;
        }
        
        color = color.trim();
        
        particles.push(new Particle(x, y, size, color, speedX, speedY));
      }
    }
    
    createParticles();
    
    // Track mouse position
    let mouseX, mouseY;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles.length = 0;
      createParticles();
    });
    
    // Connect particles with lines
    function connectParticles() {
      const maxDistance = 100;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw();
      });
      
      connectParticles();
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  // Typing animation
  const typingTextElement = document.getElementById('typing-text');
  if (typingTextElement) {
    const textToType = ["React", "Angular", "Vue.js", "JavaScript", "CSS3", "HTML5", "Node.js", "Express"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 200;
    
    function typeText() {
      const currentText = textToType[textIndex];
      
      if (isDeleting) {
        typingTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 100;
      } else {
        typingTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 200;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = 1000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textToType.length;
        typingDelay = 500;
      }
      
      setTimeout(typeText, typingDelay);
    }
    
    setTimeout(typeText, 2500);
  }
  
  // Initialize
  setActiveNavItem();
  toggleBackToTopButton();
});