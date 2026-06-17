from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3
import bcrypt
from datetime import date, timedelta

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "super-secret-key-change-in-production"
jwt = JWTManager(app)

DB_PATH = "tasks.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'todo',
            priority TEXT DEFAULT 'medium',
            deadline TEXT,
            position INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

# --- AUTH ---

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username', '').strip()
    password = data.get('password', '')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    try:
        conn = get_db()
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed))
        conn.commit()
        conn.close()
        token = create_access_token(identity=username)
        return jsonify({'token': token, 'username': username}), 201
    except:
        return jsonify({'error': 'Username already exists'}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username', '').strip()
    password = data.get('password', '')
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()
    if not user or not bcrypt.checkpw(password.encode(), user['password'].encode()):
        return jsonify({'error': 'Invalid credentials'}), 401
    token = create_access_token(identity=username)
    return jsonify({'token': token, 'username': username})

# --- TASKS ---

@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    username = get_jwt_identity()
    conn = get_db()
    user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    
    search = request.args.get('search', '')
    status = request.args.get('status', '')
    priority = request.args.get('priority', '')
    date_filter = request.args.get('date_filter', '')

    query = "SELECT * FROM tasks WHERE user_id = ?"
    params = [user['id']]

    if search:
        query += " AND title LIKE ?"
        params.append(f'%{search}%')
    if status:
        query += " AND status = ?"
        params.append(status)
    if priority:
        query += " AND priority = ?"
        params.append(priority)
    if date_filter == 'today':
        query += " AND deadline = ?"
        params.append(str(date.today()))
    elif date_filter == 'week':
        week_later = str(date.today() + timedelta(days=7))
        query += " AND deadline BETWEEN ? AND ?"
        params.extend([str(date.today()), week_later])
    elif date_filter == 'overdue':
        query += " AND deadline < ? AND status != 'done'"
        params.append(str(date.today()))

    query += " ORDER BY position ASC, created_at DESC"
    tasks = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(t) for t in tasks])

@app.route('/tasks', methods=['POST'])
@jwt_required()
def add_task():
    username = get_jwt_identity()
    data = request.json
    conn = get_db()
    user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    conn.execute(
        "INSERT INTO tasks (user_id, title, description, status, priority, deadline) VALUES (?, ?, ?, ?, ?, ?)",
        (user['id'], data['title'], data.get('description', ''),
         data.get('status', 'todo'), data.get('priority', 'medium'), data.get('deadline') or None)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task created'}), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    data = request.json
    conn = get_db()
    conn.execute(
        "UPDATE tasks SET title=?, description=?, status=?, priority=?, deadline=? WHERE id=?",
        (data['title'], data.get('description', ''), data['status'],
         data.get('priority', 'medium'), data.get('deadline') or None, task_id)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task updated'})

@app.route('/tasks/<int:task_id>/status', methods=['PATCH'])
@jwt_required()
def update_status(task_id):
    data = request.json
    conn = get_db()
    conn.execute("UPDATE tasks SET status=? WHERE id=?", (data['status'], task_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Status updated'})

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    conn = get_db()
    conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task deleted'})

@app.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    username = get_jwt_identity()
    conn = get_db()
    user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    uid = user['id']
    
    total = conn.execute("SELECT COUNT(*) FROM tasks WHERE user_id=?", (uid,)).fetchone()[0]
    done = conn.execute("SELECT COUNT(*) FROM tasks WHERE user_id=? AND status='done'", (uid,)).fetchone()[0]
    in_progress = conn.execute("SELECT COUNT(*) FROM tasks WHERE user_id=? AND status='in progress'", (uid,)).fetchone()[0]
    todo = conn.execute("SELECT COUNT(*) FROM tasks WHERE user_id=? AND status='todo'", (uid,)).fetchone()[0]
    overdue = conn.execute("SELECT COUNT(*) FROM tasks WHERE user_id=? AND deadline < ? AND status != 'done'",
                           (uid, str(date.today()))).fetchone()[0]
    high = conn.execute("SELECT COUNT(*) FROM tasks WHERE user_id=? AND priority='high'", (uid,)).fetchone()[0]
    medium = conn.execute("SELECT COUNT(*) FROM tasks WHERE user_id=? AND priority='medium'", (uid,)).fetchone()[0]
    low = conn.execute("SELECT COUNT(*) FROM tasks WHERE user_id=? AND priority='low'", (uid,)).fetchone()[0]
    
    conn.close()
    return jsonify({
        'total': total, 'done': done, 'in_progress': in_progress,
        'todo': todo, 'overdue': overdue,
        'by_priority': {'high': high, 'medium': medium, 'low': low}
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True)