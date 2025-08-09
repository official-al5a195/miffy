import os
import json
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "enchanted_love_garden_secret_key_2025")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)
CORS(app)

# Create tables
with app.app_context():
    db.create_all()

# Database Models
class Affirmation(db.Model):
    __tablename__ = 'affirmations'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    user_type = db.Column(db.String(50), nullable=False)
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DateIdea(db.Model):
    __tablename__ = 'date_ideas'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False, default='romantic')
    user_type = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DiaryEntry(db.Model):
    __tablename__ = 'diary_entries'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    mood = db.Column(db.String(50), nullable=False, default='happy')
    user_type = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class KoalaStats(db.Model):
    __tablename__ = 'koala_stats'
    id = db.Column(db.Integer, primary_key=True)
    happiness = db.Column(db.Integer, default=50)
    hunger = db.Column(db.Integer, default=50)
    energy = db.Column(db.Integer, default=50)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class GameScore(db.Model):
    __tablename__ = 'game_scores'
    id = db.Column(db.Integer, primary_key=True)
    game_type = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    time_taken = db.Column(db.Integer, default=0)
    user_type = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
    
    user_type = session.get('user_type', 'default')
    
    if request.method == 'GET':
        if section == 'affirmations':
            affirmations = Affirmation.query.filter_by(user_type=user_type).order_by(Affirmation.created_at.desc()).all()
            return jsonify([{
                'id': a.id, 
                'text': a.text, 
                'likes': a.likes, 
                'date': a.created_at.isoformat()
            } for a in affirmations])
        elif section == 'date_ideas':
            ideas = DateIdea.query.filter_by(user_type=user_type).order_by(DateIdea.created_at.desc()).all()
            return jsonify([{
                'id': d.id, 
                'title': d.title, 
                'description': d.description, 
                'category': d.category, 
                'date': d.created_at.isoformat()
            } for d in ideas])
        elif section == 'diary_entries':
            entries = DiaryEntry.query.filter_by(user_type=user_type).order_by(DiaryEntry.created_at.desc()).all()
            return jsonify([{
                'id': e.id, 
                'title': e.title, 
                'content': e.content, 
                'mood': e.mood, 
                'date': e.created_at.isoformat()
            } for e in entries])
        elif section == 'koala_stats':
            stats = KoalaStats.query.first()
            if not stats:
                stats = KoalaStats()
                db.session.add(stats)
                db.session.commit()
            return jsonify({
                'happiness': stats.happiness,
                'hunger': stats.hunger,
                'energy': stats.energy
            })
        else:
            return jsonify([])
    
    elif request.method == 'POST':
        content = request.get_json()
        
        if section == 'affirmations':
            affirmation = Affirmation(
                text=content.get('text', ''),
                user_type=user_type
            )
            db.session.add(affirmation)
            db.session.commit()
            return jsonify({"success": True, "id": affirmation.id})
            
        elif section == 'date_ideas':
            idea = DateIdea(
                title=content.get('title', ''),
                description=content.get('description', ''),
                category=content.get('category', 'romantic'),
                user_type=user_type
            )
            db.session.add(idea)
            db.session.commit()
            return jsonify({"success": True, "id": idea.id})
            
        elif section == 'diary_entries':
            entry = DiaryEntry(
                title=content.get('title', ''),
                content=content.get('content', ''),
                mood=content.get('mood', 'happy'),
                user_type=user_type
            )
            db.session.add(entry)
            db.session.commit()
            return jsonify({"success": True, "id": entry.id})
            
        elif section == 'koala_stats':
            stats = KoalaStats.query.first()
            if not stats:
                stats = KoalaStats()
                db.session.add(stats)
            
            stats.happiness = content.get('happiness', stats.happiness)
            stats.hunger = content.get('hunger', stats.hunger)
            stats.energy = content.get('energy', stats.energy)
            stats.updated_at = datetime.utcnow()
            db.session.commit()
            return jsonify({"success": True})
            
        elif section == 'game_score':
            game_type = content.get('game_type')
            score = GameScore(
                game_type=game_type,
                score=content.get('score', 0),
                time_taken=content.get('time', 0),
                user_type=user_type
            )
            db.session.add(score)
            db.session.commit()
            return jsonify({"success": True})
        
        return jsonify({"error": "Invalid section"}), 400

@app.route('/api/edit/<section>/<int:item_id>', methods=['PUT'])
def edit_item(section, item_id):
    """Edit an item in a section"""
    if not session.get('authenticated'):
        return jsonify({"error": "Not authenticated"}), 401
    
    content = request.get_json()
    
    if section == 'affirmations':
        affirmation = Affirmation.query.get(item_id)
        if not affirmation:
            return jsonify({"error": "Item not found"}), 404
        affirmation.text = content.get('text', affirmation.text)
        db.session.commit()
        return jsonify({"success": True})
    elif section == 'date_ideas':
        idea = DateIdea.query.get(item_id)
        if not idea:
            return jsonify({"error": "Item not found"}), 404
        idea.title = content.get('title', idea.title)
        idea.description = content.get('description', idea.description)
        idea.category = content.get('category', idea.category)
        db.session.commit()
        return jsonify({"success": True})
    elif section == 'diary_entries':
        entry = DiaryEntry.query.get(item_id)
        if not entry:
            return jsonify({"error": "Item not found"}), 404
        entry.title = content.get('title', entry.title)
        entry.content = content.get('content', entry.content)
        entry.mood = content.get('mood', entry.mood)
        db.session.commit()
        return jsonify({"success": True})
    
    return jsonify({"error": "Invalid section"}), 400

@app.route('/api/delete/<section>/<int:item_id>', methods=['DELETE'])
def delete_item(section, item_id):
    """Delete an item from a section"""
    if not session.get('authenticated'):
        return jsonify({"error": "Not authenticated"}), 401
    
    if section == 'affirmations':
        affirmation = Affirmation.query.get(item_id)
        if not affirmation:
            return jsonify({"error": "Item not found"}), 404
        db.session.delete(affirmation)
        db.session.commit()
        return jsonify({"success": True})
    elif section == 'date_ideas':
        idea = DateIdea.query.get(item_id)
        if not idea:
            return jsonify({"error": "Item not found"}), 404
        db.session.delete(idea)
        db.session.commit()
        return jsonify({"success": True})
    elif section == 'diary_entries':
        entry = DiaryEntry.query.get(item_id)
        if not entry:
            return jsonify({"error": "Item not found"}), 404
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"success": True})
    
    return jsonify({"error": "Invalid section"}), 400

@app.route('/api/like/<section>/<int:item_id>', methods=['POST'])
def like_item(section, item_id):
    """Like an item in a section"""
    if not session.get('authenticated'):
        return jsonify({"error": "Not authenticated"}), 401
    
    if section == 'affirmations':
        affirmation = Affirmation.query.get(item_id)
        if affirmation:
            affirmation.likes += 1
            db.session.commit()
            return jsonify({"success": True, "likes": affirmation.likes})
    
    return jsonify({"error": "Item not found"}), 404

@app.route('/api/save-game-score', methods=['POST'])
def save_game_score():
    """Save game score"""
    if not session.get('authenticated'):
        return jsonify({"error": "Not authenticated"}), 401
    
    content = request.get_json()
    user_type = session.get('user_type', 'default')
    
    score = GameScore(
        game_type=content.get('game_type'),
        score=content.get('score', 0),
        time_taken=content.get('time_taken', 0),
        user_type=user_type
    )
    db.session.add(score)
    db.session.commit()
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
