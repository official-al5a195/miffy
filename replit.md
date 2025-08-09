# Overview

Enchanted Love Garden is a Flask-based web application that combines a romantic-themed virtual garden experience with interactive games and personal features. The application serves as a personalized digital companion offering affirmations, date ideas, diary functionality, virtual pet care (koala), and mini-games including Sudoku, Tic-tac-toe, and card matching. The project emphasizes a whimsical, love-themed aesthetic with customizable themes and animated user interfaces.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Static File Organization**: CSS, JavaScript, and HTML templates are organized in dedicated directories (`static/css/`, `static/js/`, `templates/`)
- **Responsive Design**: Bootstrap 5.3.0 integration for mobile-friendly layouts with custom CSS overlays
- **Animation System**: Custom JavaScript animation engine with flower intro sequences and theme-based visual effects
- **Theme Management**: Dynamic theme switching system with CSS custom properties supporting multiple visual themes (default, keychain/bunny-matcha)
- **Single Page Application (SPA)**: JavaScript-driven section navigation without page reloads using screen management system

## Backend Architecture
- **Flask Framework**: Lightweight Python web framework serving as the primary backend
- **Session Management**: Flask sessions with configurable secret keys for user state persistence
- **CORS Support**: Cross-origin resource sharing enabled for potential API consumption
- **File-based Storage**: JSON file storage system (`data/storage.json`) for persistent data management
- **Modular Structure**: Separation of concerns with dedicated modules for games, animations, and core application logic

## Data Storage Design
- **JSON-based Persistence**: Flat-file JSON storage avoiding database complexity while maintaining data structure
- **Hierarchical Data Model**: User-specific data and global application data separated with nested structure
- **Game State Management**: Dedicated storage sections for different game types and scoring systems
- **Virtual Pet System**: Persistent koala stats (happiness, hunger, energy) with numerical state tracking

## Authentication & Access Control
- **Passcode-based Authentication**: Simple passcode system for application access without complex user registration
- **Character Selection**: User persona system allowing character-based customization and preferences
- **Session Persistence**: Server-side session management for maintaining user state across requests

# External Dependencies

## Frontend Libraries
- **Bootstrap 5.3.0**: UI framework for responsive design and component styling
- **Font Awesome 6.4.0**: Icon library for consistent iconography throughout the application
- **Google Fonts (Comfortaa)**: Custom typography for enhanced visual appeal

## Python Dependencies
- **Flask**: Core web framework for routing and request handling
- **Flask-CORS**: Cross-origin resource sharing middleware for API compatibility

## Development Tools
- **Python Logging**: Built-in logging system for debugging and error tracking
- **Environment Variables**: Configuration management through environment variables for secrets

## File System Dependencies
- **Local JSON Storage**: Direct file system access for data persistence in `data/` directory
- **Static Asset Serving**: Flask's built-in static file serving for CSS, JavaScript, and media assets