from .app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime # Ensure datetime is imported

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)

    bio = db.Column(db.String(250), nullable=True)
    profile_picture_url = db.Column(db.String(200), nullable=True, default='https://via.placeholder.com/150/0000FF/FFFFFF?Text=User')
    full_name = db.Column(db.String(100), nullable=True)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow, nullable=False) # Added date_joined

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email, # Consider if email should always be public
            'bio': self.bio,
            'profile_picture_url': self.profile_picture_url,
            'full_name': self.full_name,
            'date_joined': self.date_joined.isoformat() + 'Z' if self.date_joined else None # Format as ISO string
        }

    def __repr__(self):
        return f'<User {self.username}>'

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Post {self.content[:50]}...>'

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat() + 'Z',
            'user_id': self.user_id,
            'author_username': self.author.username if self.author else 'Unknown'
        }
