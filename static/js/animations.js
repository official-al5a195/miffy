class AnimationSystem {
    constructor() {
        this.isFlowerIntroComplete = false;
        this.theme = 'default';
        this.particles = [];
        this.init();
    }

    init() {
        this.startFlowerIntro();
    }

    startFlowerIntro() {
        // Start the flower animation sequence
        console.log('Starting flower intro animation...');
        
        // Set a timer to complete the intro after animation
        setTimeout(() => {
            this.completeFlowerIntro();
        }, 6000); // 6 seconds for full flower animation
    }

    completeFlowerIntro() {
        console.log('Completing flower intro...');
        
        const flowerIntro = document.getElementById('flower-intro');
        const mainApp = document.getElementById('main-app');
        const body = document.body;
        
        if (flowerIntro && mainApp) {
            // Fade out flower intro
            flowerIntro.style.transition = 'opacity 1s ease-out';
            flowerIntro.style.opacity = '0';
            
            setTimeout(() => {
                // Hide flower intro and show main app
                flowerIntro.style.display = 'none';
                body.classList.remove('flower-animation-body');
                mainApp.classList.remove('d-none');
                
                // Add fade in effect to main app
                mainApp.style.opacity = '0';
                mainApp.style.transition = 'opacity 1s ease-in';
                
                setTimeout(() => {
                    mainApp.style.opacity = '1';
                }, 100);
                
                this.isFlowerIntroComplete = true;
                
                // Start theme particles
                this.startThemeParticles();
                
            }, 1000);
        }
    }

    setTheme(theme) {
        this.theme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Clear existing particles
        this.clearParticles();
        
        // Start new theme particles
        if (this.isFlowerIntroComplete) {
            this.startThemeParticles();
        }
        
        // Add theme transition effect
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    }

    startThemeParticles() {
        // Clear existing particles first
        this.clearParticles();
        
        switch(this.theme) {
            case 'keychain':
                this.createFloatingFlowers();
                break;
            case 'bug':
                this.createFireflies();
                break;
            case 'dark':
                this.createMagicStars();
                break;
        }
    }

    createFloatingFlowers() {
        const flowers = ['🌸', '🌺', '🌼', '🌻', '🌷'];
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const flower = document.createElement('div');
                flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
                flower.className = 'floating-particles';
                flower.style.cssText = `
                    position: fixed;
                    font-size: 2rem;
                    pointer-events: none;
                    z-index: 1;
                    opacity: 0.7;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    animation: float-particle 8s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                `;
                
                document.body.appendChild(flower);
                this.particles.push(flower);
                
                // Remove after animation cycle
                setTimeout(() => {
                    if (flower.parentNode) {
                        flower.parentNode.removeChild(flower);
                    }
                }, 8000);
            }, i * 500);
        }
    }

    createFireflies() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const firefly = document.createElement('div');
                firefly.className = 'firefly';
                firefly.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    animation-delay: ${Math.random() * 4}s;
                `;
                
                document.body.appendChild(firefly);
                this.particles.push(firefly);
                
                // Remove after animation cycle
                setTimeout(() => {
                    if (firefly.parentNode) {
                        firefly.parentNode.removeChild(firefly);
                    }
                }, 8000);
            }, i * 300);
        }
    }

    createMagicStars() {
        const stars = ['✨', '⭐', '🌟', '💫', '🔮'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.textContent = stars[Math.floor(Math.random() * stars.length)];
                star.className = 'magic-star';
                star.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    animation-delay: ${Math.random() * 3}s;
                    pointer-events: none;
                `;
                
                document.body.appendChild(star);
                this.particles.push(star);
                
                // Remove after animation cycle
                setTimeout(() => {
                    if (star.parentNode) {
                        star.parentNode.removeChild(star);
                    }
                }, 6000);
            }, i * 200);
        }
    }

    clearParticles() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
        
        // Clear any remaining particles
        const existingParticles = document.querySelectorAll('.floating-particles, .firefly, .magic-star');
        existingParticles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
    }

    // Heart collection animation
    animateHeartCollection(heartElement) {
        heartElement.classList.add('collected-heart');
        
        setTimeout(() => {
            if (heartElement.parentNode) {
                heartElement.parentNode.removeChild(heartElement);
            }
        }, 500);
    }

    // Button hover effects
    addButtonHoverEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    // Card hover effects
    addCardHoverEffects() {
        const cards = document.querySelectorAll('.section-card, .character-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // Fade in animation for content
    fadeInContent(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    // Refresh particle animations
    refreshParticles() {
        if (this.isFlowerIntroComplete) {
            this.startThemeParticles();
        }
    }
}

// Initialize animation system
const animationSystem = new AnimationSystem();

// Export for global use
window.animationSystem = animationSystem;
