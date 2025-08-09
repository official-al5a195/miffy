class EnchantedLoveGardenApp {
    constructor() {
        this.currentUser = null;
        this.currentTheme = 'keychain';
        this.currentSection = 'affirmations';
        this.authenticated = false;
        this.data = {};
        
        this.init();
    }

    init() {
        console.log('Initializing Enchanted Love Garden App...');
        this.setupEventListeners();
        this.checkAuthenticationStatus();
    }

    setupEventListeners() {
        // Passcode form
        const passcodeForm = document.getElementById('passcode-form');
        if (passcodeForm) {
            passcodeForm.addEventListener('submit', (e) => this.handlePasscodeSubmit(e));
        }

        // Character selection
        document.addEventListener('click', (e) => {
            if (e.target.matches('.select-character')) {
                this.selectCharacter(e.target.dataset.character);
            }
        });

        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-section]') || e.target.closest('[data-section]')) {
                e.preventDefault();
                const sectionElement = e.target.matches('[data-section]') ? e.target : e.target.closest('[data-section]');
                this.showSection(sectionElement.dataset.section);
            }
        });

        // Theme switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('.theme-switch')) {
                e.preventDefault();
                this.switchTheme(e.target.dataset.theme);
            }
        });

        // Dynamic form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.section-form')) {
                e.preventDefault();
                this.handleSectionForm(e.target);
            }
        });

        // Like buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.like-btn') || e.target.closest('.like-btn')) {
                e.preventDefault();
                const btn = e.target.matches('.like-btn') ? e.target : e.target.closest('.like-btn');
                this.likeItem(btn.dataset.section, btn.dataset.id);
            }
        });

        // Edit buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.edit-btn') || e.target.closest('.edit-btn')) {
                e.preventDefault();
                const btn = e.target.matches('.edit-btn') ? e.target : e.target.closest('.edit-btn');
                this.editItem(btn.dataset.section, btn.dataset.id);
            }
        });

        // Delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.delete-btn') || e.target.closest('.delete-btn')) {
                e.preventDefault();
                const btn = e.target.matches('.delete-btn') ? e.target : e.target.closest('.delete-btn');
                this.deleteItem(btn.dataset.section, btn.dataset.id);
            }
        });
    }

    async handlePasscodeSubmit(e) {
        e.preventDefault();
        
        const passcode = document.getElementById('passcode-input').value;
        const errorDiv = document.getElementById('passcode-error');
        
        try {
            const formData = new FormData();
            formData.append('passcode', passcode);
            
            const response = await fetch('/auth', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.authenticated = true;
                this.showUserSelection();
            } else {
                errorDiv.textContent = 'Invalid passcode. Please try again.';
                errorDiv.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.classList.remove('d-none');
        }
    }

    showUserSelection() {
        this.showScreen('user-selection-screen');
    }

    async selectCharacter(character) {
        try {
            const response = await fetch('/set_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_type: character,
                    theme: character
                })
            });
            
            if (response.ok) {
                this.currentUser = character;
                this.currentTheme = character;
                this.switchTheme(character);
                this.showGarden();
            }
        } catch (error) {
            console.error('Error setting user:', error);
            this.showNotification('Error setting user profile', 'error');
        }
    }

    showGarden() {
        this.showScreen('garden-screen');
        this.showSection('affirmations');
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    switchTheme(theme) {
        this.currentTheme = theme;
        
        // Update theme via animation system
        if (window.animationSystem) {
            window.animationSystem.setTheme(theme);
        }
        
        // Update navbar title based on theme
        const title = document.getElementById('garden-title');
        if (title) {
            const icons = {
                keychain: '🐰',
                bug: '🐨',
                dark: '🌙'
            };
            title.innerHTML = `<i class="fas fa-seedling"></i> ${icons[theme]} Enchanted Love Garden`;
        }
        
        this.showNotification(`Switched to ${theme} theme`, 'success');
    }

    async showSection(sectionName) {
        this.currentSection = sectionName;
        
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Load section content
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';
            
            try {
                const content = await this.loadSectionContent(sectionName);
                contentArea.innerHTML = '';
                contentArea.appendChild(content);
                
                // Add fade in animation
                if (window.animationSystem) {
                    window.animationSystem.fadeInContent(content);
                }
            } catch (error) {
                console.error('Error loading section:', error);
                contentArea.innerHTML = '<div class="alert alert-danger">Error loading section</div>';
            }
        }
    }

    async loadSectionContent(sectionName) {
        switch (sectionName) {
            case 'affirmations':
                return await this.createAffirmationsSection();
            case 'date-ideas':
                return await this.createDateIdeasSection();
            case 'diary':
                return await this.createDiarySection();
            case 'heart-game':
                return this.createHeartGameSection();
            case 'koala':
                return await this.createKoalaSection();
            case 'spotify':
                return this.createSpotifySection();
            case 'cardmatch':
                return gameManager.createCardMatch();
            default:
                return this.createDefaultSection();
        }
    }

    async createAffirmationsSection() {
        const container = document.createElement('div');
        container.className = 'container';
        
        // Load existing affirmations
        const affirmations = await this.loadData('affirmations');
        
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="section-card card p-4">
                        <h2 class="text-center mb-4"><i class="fas fa-heart"></i> Love Affirmations</h2>
                        
                        <form class="section-form mb-4" data-section="affirmations">
                            <div class="mb-3">
                                <label for="affirmation-text" class="form-label">Share a love note or affirmation:</label>
                                <textarea class="form-control" id="affirmation-text" name="text" rows="3" 
                                         placeholder="Write something sweet..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-heart"></i> Share Love
                            </button>
                        </form>
                        
                        <div id="affirmations-list">
                            ${this.renderAffirmations(affirmations)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    renderAffirmations(affirmations) {
        if (!affirmations || affirmations.length === 0) {
            return '<p class="text-muted text-center">No affirmations yet. Share the first one!</p>';
        }
        
        return affirmations.map(affirmation => `
            <div class="card mb-3 affirmation-card" data-id="${affirmation.id}">
                <div class="card-body">
                    <p class="card-text affirmation-text">${this.escapeHtml(affirmation.text)}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${new Date(affirmation.date).toLocaleDateString()}</small>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-danger like-btn" 
                                    data-section="affirmations" data-id="${affirmation.id}">
                                <i class="fas fa-heart"></i> ${affirmation.likes || 0}
                            </button>
                            <button class="btn btn-sm btn-outline-primary edit-btn" 
                                    data-section="affirmations" data-id="${affirmation.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" 
                                    data-section="affirmations" data-id="${affirmation.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async createDateIdeasSection() {
        const container = document.createElement('div');
        container.className = 'container';
        
        const dateIdeas = await this.loadData('date_ideas');
        
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="section-card card p-4">
                        <h2 class="text-center mb-4"><i class="fas fa-calendar-heart"></i> Date Ideas</h2>
                        
                        <form class="section-form mb-4" data-section="date_ideas">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="idea-title" class="form-label">Date Title:</label>
                                        <input type="text" class="form-control" id="idea-title" name="title" 
                                               placeholder="Romantic dinner..." required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="idea-category" class="form-label">Category:</label>
                                        <select class="form-control" id="idea-category" name="category">
                                            <option value="romantic">Romantic</option>
                                            <option value="adventure">Adventure</option>
                                            <option value="cozy">Cozy</option>
                                            <option value="creative">Creative</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="idea-description" class="form-label">Description:</label>
                                <textarea class="form-control" id="idea-description" name="description" rows="3" 
                                         placeholder="Describe the perfect date..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Add Date Idea
                            </button>
                        </form>
                        
                        <div id="date-ideas-list">
                            ${this.renderDateIdeas(dateIdeas)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    renderDateIdeas(dateIdeas) {
        if (!dateIdeas || dateIdeas.length === 0) {
            return '<p class="text-muted text-center">No date ideas yet. Add the first one!</p>';
        }
        
        return dateIdeas.map(idea => `
            <div class="card mb-3 date_idea-card" data-id="${idea.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title date_idea-text">${this.escapeHtml(idea.title)}</h5>
                        <span class="badge bg-primary">${idea.category}</span>
                    </div>
                    <p class="card-text date_idea-description">${this.escapeHtml(idea.description)}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${new Date(idea.date).toLocaleDateString()}</small>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary edit-btn" 
                                    data-section="date_ideas" data-id="${idea.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" 
                                    data-section="date_ideas" data-id="${idea.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async createDiarySection() {
        const container = document.createElement('div');
        container.className = 'container';
        
        const diaryEntries = await this.loadData('diary_entries');
        
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="section-card card p-4">
                        <h2 class="text-center mb-4"><i class="fas fa-book"></i> Love Diary</h2>
                        
                        <form class="section-form mb-4" data-section="diary_entries">
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="mb-3">
                                        <label for="diary-title" class="form-label">Entry Title:</label>
                                        <input type="text" class="form-control" id="diary-title" name="title" 
                                               placeholder="Today's memory..." required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="diary-mood" class="form-label">Mood:</label>
                                        <select class="form-control" id="diary-mood" name="mood">
                                            <option value="happy">😊 Happy</option>
                                            <option value="love">💕 In Love</option>
                                            <option value="excited">🎉 Excited</option>
                                            <option value="peaceful">😌 Peaceful</option>
                                            <option value="grateful">🙏 Grateful</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="diary-content" class="form-label">Share your thoughts:</label>
                                <textarea class="form-control" id="diary-content" name="content" rows="5" 
                                         placeholder="Write about your day, feelings, or memories..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-pen"></i> Save Memory
                            </button>
                        </form>
                        
                        <div id="diary-entries-list">
                            ${this.renderDiaryEntries(diaryEntries)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    renderDiaryEntries(entries) {
        if (!entries || entries.length === 0) {
            return '<p class="text-muted text-center">No diary entries yet. Write your first memory!</p>';
        }
        
        const moodEmojis = {
            happy: '😊',
            love: '💕',
            excited: '🎉',
            peaceful: '😌',
            grateful: '🙏'
        };
        
        return entries.slice().reverse().map(entry => `
            <div class="card mb-3 diary_entry-card" data-id="${entry.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title diary_entry-text">${this.escapeHtml(entry.title)}</h5>
                        <span class="badge bg-secondary">${moodEmojis[entry.mood] || '😊'}</span>
                    </div>
                    <p class="card-text diary_entry-content">${this.escapeHtml(entry.content)}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${new Date(entry.date).toLocaleDateString()}</small>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary edit-btn" 
                                    data-section="diary_entries" data-id="${entry.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" 
                                    data-section="diary_entries" data-id="${entry.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    createHeartGameSection() {
        const container = document.createElement('div');
        container.className = 'container';
        
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="section-card card p-4">
                        <h2 class="text-center mb-4"><i class="fas fa-gamepad"></i> Heart Collection Game</h2>
                        
                        <div class="text-center mb-4">
                            <div class="mb-3">
                                <h4>Score: <span id="heart-score">0</span></h4>
                                <button class="btn btn-primary" onclick="app.startHeartGame()">
                                    <i class="fas fa-play"></i> Start Game
                                </button>
                                <button class="btn btn-outline-secondary ms-2" onclick="app.stopHeartGame()">
                                    <i class="fas fa-stop"></i> Stop
                                </button>
                            </div>
                        </div>
                        
                        <div class="heart-game-area" id="heart-game-area">
                            <div class="text-center pt-5">
                                <i class="fas fa-heart" style="font-size: 3rem; color: #ccc;"></i>
                                <p class="mt-3 text-muted">Click "Start Game" to begin collecting hearts!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    startHeartGame() {
        const gameArea = document.getElementById('heart-game-area');
        const scoreElement = document.getElementById('heart-score');
        
        if (!gameArea || !scoreElement) return;
        
        // Clear game area
        gameArea.innerHTML = '';
        
        // Initialize game state
        this.heartGameState = {
            score: 0,
            active: true,
            interval: null
        };
        
        scoreElement.textContent = '0';
        
        // Start spawning hearts
        this.heartGameState.interval = setInterval(() => {
            if (this.heartGameState.active) {
                this.spawnHeart();
            }
        }, 1500);
        
        // Stop game after 30 seconds
        setTimeout(() => {
            this.stopHeartGame();
        }, 30000);
    }

    spawnHeart() {
        const gameArea = document.getElementById('heart-game-area');
        if (!gameArea || !this.heartGameState.active) return;
        
        const heart = document.createElement('div');
        heart.className = 'heart floating';
        heart.innerHTML = '💖';
        heart.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
        heart.style.top = Math.random() * (gameArea.offsetHeight - 50) + 'px';
        
        heart.addEventListener('click', () => {
            this.collectHeart(heart);
        });
        
        gameArea.appendChild(heart);
        
        // Remove heart after 3 seconds if not collected
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 3000);
    }

    collectHeart(heartElement) {
        this.heartGameState.score++;
        document.getElementById('heart-score').textContent = this.heartGameState.score;
        
        // Animate heart collection
        if (window.animationSystem) {
            window.animationSystem.animateHeartCollection(heartElement);
        }
    }

    stopHeartGame() {
        if (this.heartGameState) {
            this.heartGameState.active = false;
            if (this.heartGameState.interval) {
                clearInterval(this.heartGameState.interval);
            }
            
            // Save score
            this.saveHeartGameScore(this.heartGameState.score);
            
            // Show final score
            const gameArea = document.getElementById('heart-game-area');
            if (gameArea) {
                gameArea.innerHTML = `
                    <div class="text-center pt-5">
                        <i class="fas fa-trophy" style="font-size: 3rem; color: gold;"></i>
                        <h3 class="mt-3">Game Over!</h3>
                        <p>Final Score: ${this.heartGameState.score}</p>
                        <button class="btn btn-primary" onclick="app.startHeartGame()">Play Again</button>
                    </div>
                `;
            }
        }
    }

    async saveHeartGameScore(score) {
        try {
            await this.saveData('heart_game_score', { score });
        } catch (error) {
            console.error('Error saving heart game score:', error);
        }
    }

    async createKoalaSection() {
        const container = document.createElement('div');
        container.className = 'container';
        
        const koalaStats = await this.loadData('koala_stats');
        const defaultStats = { happiness: 50, hunger: 50, energy: 50 };
        const stats = { ...defaultStats, ...koalaStats };
        
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="section-card card p-4">
                        <h2 class="text-center mb-4"><i class="fas fa-paw"></i> Koala Care</h2>
                        
                        <div class="text-center mb-4">
                            <div style="font-size: 6rem;">🐨</div>
                            <h4>Meet your virtual koala!</h4>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <div class="text-center">
                                    <i class="fas fa-smile" style="font-size: 2rem; color: #ffd700;"></i>
                                    <h6>Happiness</h6>
                                    <div class="progress">
                                        <div class="progress-bar bg-warning" style="width: ${stats.happiness}%"></div>
                                    </div>
                                    <small>${stats.happiness}/100</small>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="text-center">
                                    <i class="fas fa-drumstick-bite" style="font-size: 2rem; color: #28a745;"></i>
                                    <h6>Hunger</h6>
                                    <div class="progress">
                                        <div class="progress-bar bg-success" style="width: ${stats.hunger}%"></div>
                                    </div>
                                    <small>${stats.hunger}/100</small>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="text-center">
                                    <i class="fas fa-bolt" style="font-size: 2rem; color: #007bff;"></i>
                                    <h6>Energy</h6>
                                    <div class="progress">
                                        <div class="progress-bar bg-info" style="width: ${stats.energy}%"></div>
                                    </div>
                                    <small>${stats.energy}/100</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-center">
                            <button class="btn btn-success me-2" onclick="app.feedKoala()">
                                <i class="fas fa-leaf"></i> Feed
                            </button>
                            <button class="btn btn-primary me-2" onclick="app.playWithKoala()">
                                <i class="fas fa-gamepad"></i> Play
                            </button>
                            <button class="btn btn-info" onclick="app.restKoala()">
                                <i class="fas fa-bed"></i> Rest
                            </button>
                        </div>
                        
                        <div id="koala-message" class="mt-3 text-center"></div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    async feedKoala() {
        await this.updateKoalaStat('hunger', 20);
        this.showKoalaMessage('🍃 Yummy eucalyptus leaves! Your koala is happier!');
    }

    async playWithKoala() {
        await this.updateKoalaStat('happiness', 15);
        await this.updateKoalaStat('energy', -10);
        this.showKoalaMessage('🎮 Your koala had fun playing but is a bit tired now!');
    }

    async restKoala() {
        await this.updateKoalaStat('energy', 25);
        this.showKoalaMessage('😴 Your koala had a nice nap and feels refreshed!');
    }

    async updateKoalaStat(stat, change) {
        try {
            const currentStats = await this.loadData('koala_stats') || { happiness: 50, hunger: 50, energy: 50 };
            currentStats[stat] = Math.max(0, Math.min(100, currentStats[stat] + change));
            
            await this.saveData('koala_stats', currentStats);
            
            // Update UI
            this.showSection('koala');
        } catch (error) {
            console.error('Error updating koala stats:', error);
        }
    }

    showKoalaMessage(message) {
        const messageDiv = document.getElementById('koala-message');
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="alert alert-info">${message}</div>`;
        }
    }

    createSpotifySection() {
        const container = document.createElement('div');
        container.className = 'container';
        
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="section-card card p-4">
                        <h2 class="text-center mb-4"><i class="fab fa-spotify"></i> Our Love Playlist</h2>
                        
                        <div class="text-center mb-4">
                            <p class="lead">Listen to our special songs together 💕</p>
                        </div>
                        
                        <div class="spotify-embed">
                            <iframe data-testid="embed-iframe" style="border-radius:12px" 
                                    src="https://open.spotify.com/embed/playlist/1iPA0mTP93BTOwzcz006UV?utm_source=generator" 
                                    width="100%" height="352" frameBorder="0" allowfullscreen="" 
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                    loading="lazy"></iframe>
                        </div>
                        
                        <div class="text-center mt-4">
                            <p class="text-muted">
                                <i class="fas fa-headphones"></i> 
                                Enjoy our curated playlist of love songs!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    createDefaultSection() {
        const container = document.createElement('div');
        container.className = 'container';
        
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="section-card card p-4 text-center">
                        <h2><i class="fas fa-seedling"></i> Welcome to Your Love Garden</h2>
                        <p class="lead">Choose a section from the navigation to start exploring!</p>
                        <div class="row mt-4">
                            <div class="col-md-6 mb-3">
                                <div class="card">
                                    <div class="card-body">
                                        <i class="fas fa-heart fa-2x mb-2"></i>
                                        <h5>Affirmations</h5>
                                        <p>Share love notes and affirmations</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="card">
                                    <div class="card-body">
                                        <i class="fas fa-calendar-heart fa-2x mb-2"></i>
                                        <h5>Date Ideas</h5>
                                        <p>Plan romantic adventures together</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    async handleSectionForm(form) {
        const section = form.dataset.section;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            await this.saveData(section, data);
            form.reset();
            this.showNotification('Saved successfully!', 'success');
            
            // Refresh the section
            setTimeout(() => {
                this.showSection(this.currentSection);
            }, 1000);
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error saving data', 'error');
        }
    }

    async editItem(section, id) {
        try {
            const card = document.querySelector(`.${section.slice(0, -1)}-card[data-id="${id}"]`);
            
            if (section === 'affirmations') {
                const textElement = card.querySelector(`.${section.slice(0, -1)}-text`);
                const currentText = textElement.textContent;
                
                const newText = prompt('Edit your affirmation:', currentText);
                if (newText && newText !== currentText) {
                    const response = await fetch(`/api/edit/${section}/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ text: newText })
                    });
                    
                    if (response.ok) {
                        await this.showSection(section);
                        this.showNotification('Updated successfully!', 'success');
                    }
                }
            } else if (section === 'date_ideas') {
                const titleElement = card.querySelector('.date_idea-text');
                const descriptionElement = card.querySelector('.date_idea-description');
                const currentTitle = titleElement.textContent;
                const currentDescription = descriptionElement.textContent;
                
                const newTitle = prompt('Edit title:', currentTitle);
                if (newTitle && newTitle !== currentTitle) {
                    const newDescription = prompt('Edit description:', currentDescription);
                    if (newDescription !== null) {
                        const response = await fetch(`/api/edit/${section}/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ 
                                title: newTitle, 
                                description: newDescription || currentDescription 
                            })
                        });
                        
                        if (response.ok) {
                            await this.showSection(section);
                            this.showNotification('Updated successfully!', 'success');
                        }
                    }
                }
            } else if (section === 'diary_entries') {
                const titleElement = card.querySelector('.diary_entry-text');
                const contentElement = card.querySelector('.diary_entry-content');
                const currentTitle = titleElement.textContent;
                const currentContent = contentElement.textContent;
                
                const newTitle = prompt('Edit title:', currentTitle);
                if (newTitle && newTitle !== currentTitle) {
                    const newContent = prompt('Edit content:', currentContent);
                    if (newContent !== null) {
                        const response = await fetch(`/api/edit/${section}/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ 
                                title: newTitle, 
                                content: newContent || currentContent 
                            })
                        });
                        
                        if (response.ok) {
                            await this.showSection(section);
                            this.showNotification('Updated successfully!', 'success');
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error editing item:', error);
            this.showNotification('Error editing item', 'error');
        }
    }

    async deleteItem(section, id) {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`/api/delete/${section}/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    await this.showSection(section);
                    this.showNotification('Deleted successfully!', 'success');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                this.showNotification('Error deleting item', 'error');
            }
        }
    }

    async likeItem(section, itemId) {
        try {
            const response = await fetch(`/api/like/${section}/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Update the like count in UI
                    const likeBtn = document.querySelector(`[data-section="${section}"][data-id="${itemId}"]`);
                    if (likeBtn) {
                        likeBtn.innerHTML = `<i class="fas fa-heart"></i> ${result.likes}`;
                    }
                    this.showNotification('Liked!', 'success');
                }
            }
        } catch (error) {
            console.error('Error liking item:', error);
            this.showNotification('Error liking item', 'error');
        }
    }

    async loadData(section) {
        try {
            const response = await fetch(`/api/data/${section}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
        return [];
    }

    async saveData(section, data) {
        const response = await fetch(`/api/data/${section}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save data');
        }
        
        return await response.json();
    }

    showNotification(message, type = 'info') {
        const toast = document.getElementById('notification-toast');
        const toastBody = toast.querySelector('.toast-body');
        
        if (toast && toastBody) {
            toastBody.textContent = message;
            toast.className = `toast ${type === 'error' ? 'bg-danger text-white' : type === 'success' ? 'bg-success text-white' : ''}`;
            
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    checkAuthenticationStatus() {
        // This would normally check session status
        // For now, assume not authenticated
        this.authenticated = false;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EnchantedLoveGardenApp();
    console.log('Enchanted Love Garden App initialized');
});
