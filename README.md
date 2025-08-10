
# Enchanted Love Garden - Static Demo

A beautiful, romantic-themed web application built with pure HTML, CSS, and JavaScript. This is a static demo version designed for GitHub Pages deployment.

## Features

- **Flower Animation Intro** - Beautiful animated flowers welcome you to the garden
- **Character Selection** - Choose between Keychain (bunny) and Bug (koala) themes
- **Multiple Sections**:
  - Love Affirmations
  - Date Ideas
  - Personal Diary
  - Heart Collection Game
  - Virtual Koala Care
  - Music Player (Spotify integration)
  - Card Memory Game
- **Theme System** - Switch between Keychain, Bug, and Dark Magic themes
- **Responsive Design** - Works on all devices

## Demo Limitations

Since this is a static version for GitHub Pages:
- **No data persistence** - All data resets on page refresh
- **No user authentication** - Passcode system removed
- **Local storage only** - No server-side database
- **Demo data** - Comes with sample content

## Live Demo

You can view the live demo at: `https://yourusername.github.io/enchanted-love-garden`

## Deployment Instructions

### GitHub Pages Deployment

1. **Create a new repository** on GitHub
2. **Upload these files** to your repository:
   ```
   index.html
   css/styles.css
   css/themes.css
   js/animations.js
   js/games.js
   js/app.js
   README.md
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)"
   - Click Save

4. **Access your site** at `https://yourusername.github.io/repository-name`

### Local Development

To run locally:
1. Download all files
2. Open `index.html` in a web browser
3. Or use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve .
   ```

## File Structure

```
├── index.html          # Main HTML file
├── css/
│   ├── styles.css      # Main styles and animations
│   └── themes.css      # Theme-specific styles
├── js/
│   ├── animations.js   # Animation system
│   ├── games.js        # Game logic
│   └── app.js          # Main application logic
└── README.md           # This file
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Technologies Used

- **HTML5** - Structure and semantics
- **CSS3** - Styling, animations, and themes
- **Vanilla JavaScript** - All functionality
- **Bootstrap 5** - Responsive layout
- **Font Awesome** - Icons

## Original Flask Version

This static version is derived from a full-featured Flask application. If you need:
- Data persistence
- User authentication
- Server-side features
- Database integration

Consider deploying the original Flask version on platforms like Replit, Heroku, or Railway.

## Credits

- Flower animations inspired by CSS art techniques
- Love theme design for romantic applications
- Bootstrap for responsive layout
- Font Awesome for beautiful icons

## License

This project is open source and available under the [MIT License](LICENSE).
