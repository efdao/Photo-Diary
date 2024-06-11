# backend/run.py

import sys
import os

# 현재 디렉토리를 sys.path에 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from __init__ import create_app, db

app = create_app()

# 데이터베이스 초기화
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
