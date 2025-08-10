class EnchantedLoveGardenApp {
    constructor() {
        // --- START: CONFIGURATION ---
        // PASTE YOUR FIREBASE CONFIGURATION HERE
        this.firebaseConfig = {
    apiKey: "AIzaSyA7SstnCUmmv23TEIunQgCSizFvEZVXLOI",
    authDomain: "miffy-9bf5b.firebaseapp.com",
    projectId: "miffy-9bf5b",
    storageBucket: "miffy-9bf5b.firebasestorage.app",
    messagingSenderId: "407027405062",
    appId: "1:407027405062:web:7d012efde99f62cbb1ce87",
    measurementId: "G-JY06KFK2V8"
    };
        
        // PASTE YOUR EMAILJS CONFIGURATION HERE
        this.emailJSConfig = {
            serviceID: 'service_t9mupwp',
            templateID: 'template_ek0oyrb',
            publicKey: 'QoCQbg9gv8bU5rOfy'
        };
        // --- END: CONFIGURATION ---

        this.db = null;
        this.storage = null;
        this.currentUser = 'keychain';
        this.currentTheme = 'keychain';
        this.currentSection = 'affirmations';
        this.editingDiaryId = null; // To track which diary entry is being edited

        this.predefinedAffirmations = [
            "You are my greatest adventure, my dearest love.",
            "Your strength and kindness inspire me always.",
            "In your eyes, I found my home. In your heart, I found my peace.",
            "You are the most beautiful person, inside and out.",
            "Thank you for making every moment brighter.",
            "I love you more than words can express."
        ];

        this.init();
    }

    async init() {
        console.log('Initializing Enchanted Love Garden App...');
        this.setupEventListeners();
        this.initializeFirebase();
        this.initializeEmailJS();
        
        // Wait for intro animation
        setTimeout(() => {
            this.showPasscodeScreen();
        }, 5000);
    }

    initializeFirebase() {
        try {
            firebase.initializeApp(this.firebaseConfig);
            this.db = firebase.firestore();
            this.storage = firebase.storage();
            console.log("Firebase Initialized Successfully.");
        } catch (error) {
            console.error("Firebase initialization failed:", error);
            this.showNotification("Could not connect to the database.", "error");
        }
    }

    initializeEmailJS() {
        try {
            emailjs.init(this.emailJSConfig.publicKey);
            console.log("EmailJS Initialized Successfully.");
        } catch (error) {
            console.error("EmailJS initialization failed:", error);
        }
    }

    setupEventListeners() {
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#passcode-form')) {
                e.preventDefault();
                this.handlePasscodeSubmit();
            }
            if (e.target.matches('#diary-form')) {
                e.preventDefault();
                this.handleDiaryFormSubmit(e.target);
            }
             if (e.target.matches('#affirmation-form')) {
                e.preventDefault();
                this.handleAddAffirmation(e.target);
            }
        });

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('.select-character')) {
                this.selectCharacter(target.dataset.character);
            }
            if (target.closest('[data-section]')) {
                e.preventDefault();
                this.showSection(target.closest('[data-section]').dataset.section);
            }
            if (target.matches('.theme-switch')) {
                e.preventDefault();
                this.switchTheme(target.dataset.theme);
            }
            if (target.matches('.delete-btn')) {
                e.preventDefault();
                this.handleDeleteItem(target.dataset.id, target.dataset.collection);
            }
             if (target.matches('.edit-btn')) {
                e.preventDefault();
                this.handleEditDiary(target.dataset.id);
            }
            if(target.matches('#random-affirmation-btn')) {
                this.showRandomAffirmation();
            }
        });
    }

    handlePasscodeSubmit() {
        const passcodeInput = document.getElementById('passcode-input');
        const errorDiv = document.getElementById('passcode-error');
        const correctPasscode = '1207'; // Your passcode
        
        if (passcodeInput.value.trim() === correctPasscode) {
            this.showNotification('Welcome to your garden! 🌸', 'success');
            this.showUserSelection();
        } else {
            errorDiv.textContent = 'Invalid passcode. Please try again.';
            errorDiv.classList.remove('d-none');
        }
    }

    selectCharacter(character) {
        this.currentUser = character;
        this.currentTheme = character;
        this.switchTheme(character);
        this.showGarden();
    }

    showGarden() {
        this.showScreen('garden-screen');
        this.showSection('affirmations');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId)?.classList.add('active');
    }
    
    switchTheme(theme) {
        this.currentTheme = theme;
        if (window.animationSystem) {
            window.animationSystem.setTheme(theme);
        }
        const title = document.getElementById('garden-title');
        if (title) {
            const icons = { keychain: '🐰', bug: '🐨', dark: '🌙' };
            title.innerHTML = `<i class="fas fa-seedling"></i> ${icons[theme]} Enchanted Love Garden`;
        }
        this.showNotification(`Switched to ${theme} theme`, 'success');
    }

    async showSection(sectionName) {
        this.currentSection = sectionName;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');
        
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = '<div class="text-center p-5"><div class="spinner-border" role="status"></div></div>';
        
        let content;
        try {
            switch (sectionName) {
                case 'affirmations':
                    content = await this.createAffirmationsSection();
                    break;
                case 'diary':
                    content = await this.createDiarySection();
                    break;
                case 'cardmatch':
                    content = gameManager.createCardMatch();
                    break;
                default:
                    content = document.createElement('div');
                    content.innerHTML = '<p class="text-center p-4">Section not found.</p>';
            }
            contentArea.innerHTML = '';
            contentArea.appendChild(content);
            window.animationSystem?.fadeInContent(content);
        } catch (error) {
            console.error('Error loading section:', error);
            contentArea.innerHTML = `<div class="alert alert-danger m-4">Error loading content: ${error.message}</div>`;
        }
    }

    // --- AFFIRMATIONS ---
    async createAffirmationsSection() {
        const container = document.createElement('div');
        container.className = 'container py-4';
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="section-card card p-4 mb-4">
                        <h2 class="text-center mb-4"><i class="fas fa-heart"></i> Love Affirmations</h2>
                        <div id="random-affirmation-display" class="text-center p-3 mb-3 bg-light rounded">
                           <p class="lead fst-italic">Click the button for a message!</p>
                        </div>
                        <div class="text-center mb-4">
                            <button id="random-affirmation-btn" class="btn btn-secondary">Get a Random Affirmation</button>
                        </div>
                    </div>

                    <div class="section-card card p-4">
                        <h3 class="text-center mb-3">Share Your Own</h3>
                        <form id="affirmation-form">
                            <textarea name="text" class="form-control mb-3" rows="3" placeholder="Write a love note..." required></textarea>
                            <button type="submit" class="btn btn-primary">Add Affirmation</button>
                        </form>
                        <hr class="my-4">
                        <div id="affirmations-list"></div>
                    </div>
                </div>
            </div>
        `;

        const affirmationListDiv = container.querySelector('#affirmations-list');
        this.db.collection('affirmations').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            affirmationListDiv.innerHTML = '';
            if (snapshot.empty) {
                affirmationListDiv.innerHTML = '<p class="text-muted text-center">No affirmations shared yet.</p>';
                return;
            }
            snapshot.forEach(doc => {
                const affirmation = doc.data();
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="card-body">
                        <p class="card-text">${affirmation.text}</p>
                        <div class="d-flex justify-content-between align-items-center">
                           <small class="text-muted">${new Date(affirmation.createdAt.toDate()).toLocaleString()}</small>
                           <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${doc.id}" data-collection="affirmations">
                                <i class="fas fa-trash"></i>
                           </button>
                        </div>
                    </div>
                `;
                affirmationListDiv.appendChild(card);
            });
        });
        
        return container;
    }

    showRandomAffirmation() {
        const display = document.getElementById('random-affirmation-display');
        if(display) {
            const randomIndex = Math.floor(Math.random() * this.predefinedAffirmations.length);
            display.innerHTML = `<p class="lead fst-italic">"${this.predefinedAffirmations[randomIndex]}"</p>`;
        }
    }

    async handleAddAffirmation(form) {
        const textarea = form.querySelector('textarea[name="text"]');
        const text = textarea.value;
        const newAffirmation = {
            text: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            const docRef = await this.db.collection('affirmations').add(newAffirmation);
            this.showNotification('Affirmation added!', 'success');
            form.reset();
            this.sendChangeNotification('Affirmations', 'Created', JSON.stringify(newAffirmation, null, 2));
        } catch (error) {
            console.error("Error adding affirmation: ", error);
            this.showNotification('Failed to add affirmation.', 'error');
        }
    }


    // --- DIARY ---
    async createDiarySection() {
        this.editingDiaryId = null; // Reset editing state
        const container = document.createElement('div');
        container.className = 'container py-4';
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-9">
                    <div class="section-card card p-4 mb-4">
                        <h2 id="diary-form-title" class="text-center mb-4"><i class="fas fa-book-open"></i> Share a Memory</h2>
                        <form id="diary-form">
                            <div class="mb-3">
                                <label for="diary-title" class="form-label">Title</label>
                                <input type="text" id="diary-title" name="title" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="diary-content" class="form-label">Content</label>
                                <textarea id="diary-content" name="content" class="form-control" rows="5" required></textarea>
                            </div>
                             <div class="mb-3">
                                <label for="diary-image" class="form-label">Add a Picture (Optional)</label>
                                <input type="file" id="diary-image" name="image" class="form-control" accept="image/*">
                                <div id="image-upload-progress" class="progress mt-2 d-none"><div class="progress-bar"></div></div>
                            </div>
                            <button type="submit" id="diary-submit-btn" class="btn btn-primary">Save Memory</button>
                        </form>
                    </div>
                    <hr>
                    <h2 class="text-center my-4">Our Diary</h2>
                    <div id="diary-entries-list" class="row"></div>
                </div>
            </div>
        `;
        
        const diaryListDiv = container.querySelector('#diary-entries-list');
        this.db.collection('diary').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            diaryListDiv.innerHTML = '';
             if (snapshot.empty) {
                diaryListDiv.innerHTML = '<p class="text-muted text-center col-12">No diary entries yet. Share the first memory!</p>';
                return;
            }
            snapshot.forEach(doc => {
                const entry = doc.data();
                const col = document.createElement('div');
                col.className = 'col-lg-6 mb-4';
                let imageHtml = entry.imageUrl ? `<img src="${entry.imageUrl}" class="card-img-top" alt="${entry.title}">` : '';

                col.innerHTML = `
                    <div class="card h-100 diary-card">
                        ${imageHtml}
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${entry.title}</h5>
                            <p class="card-text flex-grow-1">${entry.content.replace(/\n/g, '<br>')}</p>
                            <div class="mt-auto">
                                <small class="text-muted d-block mb-2">${new Date(entry.createdAt.toDate()).toLocaleString()}</small>
                                <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${doc.id}">Edit</button>
                                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${doc.id}" data-collection="diary">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                diaryListDiv.appendChild(col);
            });
        });
        return container;
    }

    async handleDiaryFormSubmit(form) {
        const submitBtn = form.querySelector('#diary-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

        const title = form.querySelector('#diary-title').value;
        const content = form.querySelector('#diary-content').value;
        const imageFile = form.querySelector('#diary-image').files[0];

        let imageUrl = form.dataset.editingImageUrl || null; // Preserve old image url if not changed

        if (imageFile) {
            try {
                imageUrl = await this.uploadImage(imageFile);
            } catch (error) {
                this.showNotification(`Image upload failed: ${error.message}`, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Memory';
                return;
            }
        }
        
        const entryData = { title, content, imageUrl };

        try {
            if (this.editingDiaryId) {
                // Update existing entry
                entryData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                await this.db.collection('diary').doc(this.editingDiaryId).update(entryData);
                this.showNotification('Memory updated!', 'success');
                this.sendChangeNotification('Diary', 'Updated', JSON.stringify({id: this.editingDiaryId, ...entryData}, null, 2));
            } else {
                // Create new entry
                entryData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await this.db.collection('diary').add(entryData);
                this.showNotification('Memory saved!', 'success');
                this.sendChangeNotification('Diary', 'Created', JSON.stringify(entryData, null, 2));
            }
        } catch (error) {
             this.showNotification(`Failed to save memory: ${error.message}`, 'error');
        } finally {
            this.editingDiaryId = null;
            form.reset();
            form.querySelector('#diary-form-title').textContent = 'Share a Memory';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Memory';
            form.dataset.editingImageUrl = '';
            document.getElementById('image-upload-progress').classList.add('d-none');
        }
    }
    
    async handleEditDiary(id) {
        try {
            const doc = await this.db.collection('diary').doc(id).get();
            if (!doc.exists) {
                this.showNotification("Diary entry not found.", 'error');
                return;
            }
            const entry = doc.data();
            this.editingDiaryId = id;

            document.getElementById('diary-form-title').textContent = 'Edit Your Memory';
            document.getElementById('diary-title').value = entry.title;
            document.getElementById('diary-content').value = entry.content;
            document.getElementById('diary-submit-btn').textContent = 'Update Memory';
            document.querySelector('#diary-form').dataset.editingImageUrl = entry.imageUrl || '';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.getElementById('diary-title').focus();
        } catch (error) {
            this.showNotification(`Error loading entry for editing: ${error.message}`, 'error');
        }
    }

    async handleDeleteItem(id, collectionName) {
        if (!confirm('Are you sure you want to delete this? This cannot be undone.')) return;
        
        try {
            // If deleting a diary entry with an image, delete the image from storage first
            if (collectionName === 'diary') {
                const doc = await this.db.collection(collectionName).doc(id).get();
                if (doc.exists && doc.data().imageUrl) {
                    const imageRef = this.storage.refFromURL(doc.data().imageUrl);
                    await imageRef.delete();
                }
            }
            
            await this.db.collection(collectionName).doc(id).delete();
            this.showNotification('Item deleted successfully.', 'success');
            this.sendChangeNotification(collectionName, 'Deleted', JSON.stringify({id: id}, null, 2));

        } catch (error) {
            this.showNotification(`Failed to delete item: ${error.message}`, 'error');
        }
    }

    uploadImage(file) {
        return new Promise((resolve, reject) => {
            const filePath = `diary-images/${Date.now()}_${file.name}`;
            const fileRef = this.storage.ref(filePath);
            const uploadTask = fileRef.put(file);

            const progressDiv = document.getElementById('image-upload-progress');
            const progressBar = progressDiv.querySelector('.progress-bar');
            progressDiv.classList.remove('d-none');
            
            uploadTask.on('state_changed', 
                (snapshot) => { // Progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.style.width = progress + '%';
                    progressBar.textContent = Math.round(progress) + '%';
                }, 
                (error) => { // Error
                    progressDiv.classList.add('d-none');
                    reject(error);
                }, 
                () => { // Complete
                    progressDiv.classList.add('d-none');
                    uploadTask.snapshot.ref.getDownloadURL().then(resolve);
                }
            );
        });
    }

    // --- UTILITIES ---
    showNotification(message, type = 'info') {
        const toastEl = document.getElementById('notification-toast');
        const toastBody = toastEl.querySelector('.toast-body');
        
        toastBody.textContent = message;
        toastEl.className = `toast show ${type === 'error' ? 'bg-danger text-white' : type === 'success' ? 'bg-success text-white' : 'bg-light'}`;
        
        const bsToast = new bootstrap.Toast(toastEl);
        bsToast.show();
    }

    sendChangeNotification(section, action, data) {
        if (!this.emailJSConfig.serviceID) return; // Don't send if not configured

        const templateParams = { section, action, data };
        
        emailjs.send(this.emailJSConfig.serviceID, this.emailJSConfig.templateID, templateParams)
            .then((response) => {
               console.log('Notification email sent!', response.status, response.text);
            }, (error) => {
               console.log('Failed to send notification email.', error);
            });
    }

    showPasscodeScreen() { this.showScreen('passcode-screen'); }
    showUserSelection() { this.showScreen('user-selection-screen'); }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new EnchantedLoveGardenApp();
});