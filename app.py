import os
import json
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "enchanted_love_garden_secret_key_2025")
CORS(app)

# Data storage file
DATA_FILE = 'data/storage.json'

def load_data():
    """Load data from JSON file"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        logging.error(f"Error loading data: {e}")
    
    # Return default structure
    return {
        "users": {},
        "global_data": {
            "affirmations": [],
            "date_ideas": [],
            "diary_entries": [],
            "heart_game_scores": [],
            "koala_stats": {"happiness": 50, "hunger": 50, "energy": 50},
            "game_scores": {"sudoku": [], "tictactoe": [], "cardmatch": []}
        }
    }

def save_data(data):
    """Save data to JSON file"""
    try:
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        logging.error(f"Error saving data: {e}")
        return False

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/auth', methods=['POST'])
def authenticate():
    """Authenticate user with passcode"""
    passcode = request.form.get('passcode', '').strip()
    if passcode == '1207':
        session['authenticated'] = True
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid passcode"})

@app.route('/set_user', methods=['POST'])
def set_user():
    """Set user profile and theme"""
    if not session.get('authenticated'):
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.get_json()
    user_type = data.get('user_type')  # 'keychain' or 'bug'
    theme = data.get('theme', 'keychain')
    
    if user_type not in ['keychain', 'bug']:
        return jsonify({"error": "Invalid user type"}), 400
    
    session['user_type'] = user_type
    session['theme'] = theme
    
    return jsonify({"success": True})

@app.route('/api/data/<section>', methods=['GET', 'POST'])
def handle_data(section):
    """Handle data for different sections"""
    if not session.get('authenticated'):
        return jsonify({"error": "Not authenticated"}), 401
    
    data = load_data()
    user_id = session.get('user_type', 'default')
    
    # Ensure user data exists
    if user_id not in data['users']:
        data['users'][user_id] = {
            "affirmations": [],
            "date_ideas": [],
            "diary_entries": [],
            "heart_game_scores": [],
            "game_scores": {"sudoku": [], "tictactoe": [], "cardmatch": []},
            "theme": session.get('theme', 'keychain')
        }
    
    user_data = data['users'][user_id]
    
    if request.method == 'GET':
        if section == 'koala_stats':
            return jsonify(data['global_data']['koala_stats'])
        elif section in user_data:
            return jsonify(user_data[section])
        else:
            return jsonify([])
    
    elif request.method == 'POST':
        content = request.get_json()
        
        if section == 'affirmations':
            affirmation = {
                "id": len(user_data['affirmations']) + 1,
                "text": content.get('text', ''),
                "date": datetime.now().isoformat(),
                "likes": 0
            }
            user_data['affirmations'].append(affirmation)
            
        elif section == 'date_ideas':
            idea = {
                "id": len(user_data['date_ideas']) + 1,
                "title": content.get('title', ''),
                "description": content.get('description', ''),
                "category": content.get('category', 'romantic'),
                "date": datetime.now().isoformat()
            }
            user_data['date_ideas'].append(idea)
            
        elif section == 'diary_entries':
            entry = {
                "id": len(user_data['diary_entries']) + 1,
                "title": content.get('title', ''),
                "content": content.get('content', ''),
                "mood": content.get('mood', 'happy'),
                "date": datetime.now().isoformat()
            }
            user_data['diary_entries'].append(entry)
            
        elif section == 'heart_game_score':
            score = {
                "score": content.get('score', 0),
                "date": datetime.now().isoformat()
            }
            user_data['heart_game_scores'].append(score)
            
        elif section == 'koala_stats':
            data['global_data']['koala_stats'].update(content)
            
        elif section == 'game_score':
            game_type = content.get('game_type')
            if game_type in user_data['game_scores']:
                score_entry = {
                    "score": content.get('score', 0),
                    "time": content.get('time', 0),
                    "date": datetime.now().isoformat()
                }
                user_data['game_scores'][game_type].append(score_entry)
        
        if save_data(data):
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/like/<section>/<int:item_id>', methods=['POST'])
def like_item(section, item_id):
    """Like an item in a section"""
    if not session.get('authenticated'):
        return jsonify({"error": "Not authenticated"}), 401
    
    data = load_data()
    user_id = session.get('user_type', 'default')
    
    if user_id in data['users'] and section in data['users'][user_id]:
        items = data['users'][user_id][section]
        for item in items:
            if item.get('id') == item_id:
                item['likes'] = item.get('likes', 0) + 1
                if save_data(data):
                    return jsonify({"success": True, "likes": item['likes']})
                break
    
    return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
