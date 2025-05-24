from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from .models import db, User, Post # Import db, User, and Post from models.py
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a strong secret key

db.init_app(app) # Initialize db with the app

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Redirect to login page if user is not authenticated
# For API-focused app, might want to return 401 instead of redirect for login_view
# login_manager.unauthorized_handler(lambda: (jsonify(message="Unauthorized"), 401))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Missing username, email, or password'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST']) # Changed to POST as per common practice
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/create_post', methods=['POST'])
@login_required
def create_post():
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'message': 'Content is required'}), 400

    new_post = Post(content=content, user_id=current_user.id)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully', 'post': new_post.to_dict()}), 201

@app.route('/get_posts', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.timestamp.desc()).all()
    return jsonify([post.to_dict() for post in posts]), 200

# New Profile Endpoints
@app.route('/api/profile/<username>', methods=['GET'])
def get_profile(username):
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({'message': 'User not found'}), 404

@app.route('/api/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    
    # Fields that can be updated
    bio = data.get('bio')
    full_name = data.get('full_name')
    profile_picture_url = data.get('profile_picture_url')

    user_updated = False
    if bio is not None: # Allow empty string for bio
        current_user.bio = bio
        user_updated = True
    
    if full_name is not None: # Allow empty string for full_name
        current_user.full_name = full_name
        user_updated = True

    if profile_picture_url is not None: # Allow empty string for profile_picture_url
        current_user.profile_picture_url = profile_picture_url
        user_updated = True
    
    if user_updated:
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully', 'user': current_user.to_dict()}), 200
    else:
        return jsonify({'message': 'No profile data provided to update'}), 400


@app.route('/')
def hello_world():
    if current_user.is_authenticated:
        return f'Hello, {current_user.username}!'
    return 'Hello, World! Please login or register.'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)
