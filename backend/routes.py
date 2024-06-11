# backend/routes.py

from flask import request, jsonify, current_app, session, send_from_directory, url_for
from werkzeug.utils import secure_filename
import os
from __init__ import db
from .models import User, Photo, Message

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@current_app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    new_user = User(username=data['username'], password=data['password'], nickname=data['nickname'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@current_app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        session['user_id'] = user.id
        print(f"User {user.username} logged in. Session ID: {session['user_id']}")  # 디버깅 코드
        return jsonify({'message': 'Signin successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@current_app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'}), 200

@current_app.route('/user', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if not user_id:
        current_app.logger.debug('User not authenticated')
        return jsonify({'message': 'Not authenticated'}), 401
    user = User.query.get(user_id)
    return jsonify({'nickname': user.nickname}), 200

@current_app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@current_app.route('/photos', methods=['POST'])
def upload_photo():
    if 'user_id' not in session:
        return jsonify({'message': 'Not authenticated'}), 401

    user_id = session['user_id']
    user = User.query.get(user_id)
    
    files = request.files.getlist('file')
    content = request.form.get('content')
    keyword = request.form.get('keyword')

    for file in files:
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        new_photo = Photo(user_id=user_id, description=content, keywords=keyword, filename=filename)
        db.session.add(new_photo)
    
    db.session.commit()
    return jsonify({'message': 'Photo uploaded successfully'}), 201

@current_app.route('/posts', methods=['GET'])
def get_posts():
    posts = Photo.query.all()
    post_list = [{'id': photo.id, 'imgSrcList': [url_for('uploaded_file', filename=photo.filename)], 'uploader': photo.user.nickname, 'uploader_id': photo.user_id, 'content': photo.description, 'keywords': photo.keywords.split(',')} for photo in posts]
    return jsonify(post_list), 200

@current_app.route('/posts/<int:post_id>', methods=['PUT'])
def edit_post(post_id):
    if 'user_id' not in session:
        return jsonify({'message': 'Not authenticated'}), 401

    post = Photo.query.get(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404

    user_id = session['user_id']
    if post.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    content = request.form.get('content')
    keyword = request.form.get('keyword')
    files = request.files.getlist('images')

    if content:
        post.description = content
    if keyword:
        post.keywords = keyword

    if files:
        for file in files:
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            post.filename = filename
    
    db.session.commit()
    return jsonify({'message': 'Post updated successfully'}), 200

@current_app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    if 'user_id' not in session:
        return jsonify({'message': 'Not authenticated'}), 401

    post = Photo.query.get(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404

    user_id = session['user_id']
    if post.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted successfully'}), 200

@current_app.route('/posts/search', methods=['GET'])
def search_posts():
    keyword = request.args.get('keyword')
    if keyword:
        posts = Photo.query.filter(Photo.keywords.contains(keyword)).all()
    else:
        posts = Photo.query.all()
    post_list = [{'id': photo.id, 'imgSrcList': [url_for('uploaded_file', filename=photo.filename)], 'uploader': photo.user.nickname, 'uploader_id': photo.user_id, 'content': photo.description, 'keywords': photo.keywords.split(',')} for photo in posts]
    return jsonify(post_list), 200

@current_app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [user.nickname for user in users]
    return jsonify(user_list), 200

@current_app.route('/messages', methods=['POST'])
def send_message():
    data = request.json
    current_app.logger.debug(f'Received data: {data}')
    sender_id = session.get('user_id')
    recipient_id = data.get('recipient_id')
    content = data.get('content')

    if not sender_id:
        return jsonify({'message': 'Not authenticated'}), 401

    if not recipient_id or not content:
        return jsonify({'message': 'Invalid data'}), 400

    new_message = Message(sender_id=sender_id, recipient_id=recipient_id, content=content)
    db.session.add(new_message)
    db.session.commit()

    return jsonify({'message': 'Message sent successfully'}), 201

@current_app.route('/messages', methods=['GET'])
def get_messages():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'Not authenticated'}), 401

    received_messages = Message.query.filter_by(recipient_id=user_id).all()
    sent_messages = Message.query.filter_by(sender_id=user_id).all()
    
    messages = []

    for message in received_messages:
        messages.append({
            'id': message.id,
            'sender': User.query.get(message.sender_id).nickname,
            'sender_id': message.sender_id,
            'content': message.content,
            'timestamp': message.timestamp,
            'direction': 'received'
        })

    for message in sent_messages:
        messages.append({
            'id': message.id,
            'recipient': User.query.get(message.recipient_id).nickname,
            'recipient_id': message.recipient_id,
            'content': message.content,
            'timestamp': message.timestamp,
            'direction': 'sent'
        })

    messages.sort(key=lambda x: x['timestamp'], reverse=True)

    return jsonify(messages), 200


@current_app.route('/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'Not authenticated'}), 401

    message = Message.query.get(message_id)
    if not message:
        return jsonify({'message': 'Message not found'}), 404

    if message.sender_id != user_id and message.recipient_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(message)
    db.session.commit()
    return jsonify({'message': 'Message deleted successfully'}), 200
