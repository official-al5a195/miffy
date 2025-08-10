
class AnimationSystem {
    constructor() {
        this.currentTheme = 'keychain';
        this.init();
    }

    init() {
        console.log('Starting flower intro animation...');
        this.showFlowerIntro();
    }

    showFlowerIntro() {
        const flowerIntro = document.getElementById('flower-intro');
        const mainApp = document.getElementById('main-app');
        
        if (flowerIntro && mainApp) {
            // Show flower animation for 4 seconds
            setTimeout(() => {
                this.completeFlowerIntro();
            }, 4000);
        }
    }

    completeFlowerIntro() {
        console.log('Completing flower intro...');
        const flowerIntro = document.getElementById('flower-intro');
        const mainApp = document.getElementById('main-app');
        
        if (flowerIntro && mainApp) {
            flowerIntro.style.opacity = '0';
            flowerIntro.style.transition = 'opacity 1s ease-out';
            
            setTimeout(() => {
                flowerIntro.style.display = 'none';
                mainApp.classList.remove('d-none');
                this.fadeInContent(mainApp);
            }, 1000);
        }
    }

    fadeInContent(element) {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 1s ease-out';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Add theme-specific animations
        this.addThemeAnimations(theme);
    }

    addThemeAnimations(theme) {
        // Remove existing theme classes
        document.body.classList.remove('keychain-particles', 'bug-fireflies', 'dark-magic');
        
        // Add new theme class
        switch (theme) {
            case 'keychain':
                document.body.classList.add('keychain-particles');
                this.createMatchaParticles();
                break;
            case 'bug':
                document.body.classList.add('bug-fireflies');
                this.createFireflies();
                break;
            case 'dark':
                document.body.classList.add('dark-magic');
                this.createMagicParticles();
                break;
        }
    }

    createMatchaParticles() {
        // Create floating matcha/flower particles for keychain theme
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'matcha-particle';
            particle.innerHTML = ['🌸', '🍃', '💕', '🌺'][Math.floor(Math.random() * 4)];
            particle.style.cssText = `
                position: fixed;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 1000;
                opacity: 0.7;
                animation: float-particle 8s ease-in-out infinite;
                animation-delay: ${i * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            document.body.appendChild(particle);
            
            // Remove after animation cycle
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000 + (i * 2000));
        }
        
        // Add CSS animation
        if (!document.getElementById('matcha-animations')) {
            const style = document.createElement('style');
            style.id = 'matcha-animations';
            style.textContent = `
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
                    25% { transform: translateY(-20px) rotate(90deg); opacity: 1; }
                    50% { transform: translateY(-40px) rotate(180deg); opacity: 0.8; }
                    75% { transform: translateY(-20px) rotate(270deg); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createFireflies() {
        // Create firefly effect for bug theme
        for (let i = 0; i < 8; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly';
            firefly.innerHTML = '✨';
            firefly.style.cssText = `
                position: fixed;
                font-size: 0.8rem;
                pointer-events: none;
                z-index: 1000;
                animation: firefly-dance 6s ease-in-out infinite;
                animation-delay: ${i * 0.8}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            document.body.appendChild(firefly);
            
            setTimeout(() => {
                if (firefly.parentNode) {
                    firefly.parentNode.removeChild(firefly);
                }
            }, 6000 + (i * 800));
        }
        
        if (!document.getElementById('firefly-animations')) {
            const style = document.createElement('style');
            style.id = 'firefly-animations';
            style.textContent = `
                @keyframes firefly-dance {
                    0%, 100% { transform: translate(0, 0); opacity: 0.8; }
                    25% { transform: translate(100px, -50px); opacity: 1; }
                    50% { transform: translate(-50px, -100px); opacity: 0.6; }
                    75% { transform: translate(-100px, 50px); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createMagicParticles() {
        // Create magical particles for dark theme
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'magic-particle';
            particle.innerHTML = ['🔮', '⭐', '💜', '🌙'][Math.floor(Math.random() * 4)];
            particle.style.cssText = `
                position: fixed;
                font-size: 1.2rem;
                pointer-events: none;
                z-index: 1000;
                animation: magic-float 7s ease-in-out infinite;
                animation-delay: ${i * 1.2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 7000 + (i * 1200));
        }
        
        if (!document.getElementById('magic-animations')) {
            const style = document.createElement('style');
            style.id = 'magic-animations';
            style.textContent = `
                @keyframes magic-float {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
                    33% { transform: translateY(-30px) scale(1.2); opacity: 1; }
                    66% { transform: translateY(-60px) scale(0.8); opacity: 0.9; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    animateHeartCollection(heartElement) {
        if (heartElement) {
            heartElement.classList.add('collected-heart');
            setTimeout(() => {
                if (heartElement.parentNode) {
                    heartElement.parentNode.removeChild(heartElement);
                }
            }, 500);
        }
    }

    addHeartBeat(element) {
        if (element) {
            element.classList.add('heart-beat');
        }
    }

    removeHeartBeat(element) {
        if (element) {
            element.classList.remove('heart-beat');
        }
    }
}

// Initialize animation system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationSystem = new AnimationSystem();
});
