# backend/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import logging
from flask_migrate import Migrate
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('backend.config.Config')
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
    
    logging.basicConfig(level=logging.DEBUG)
    
    with app.app_context():
        from backend import routes
        db.create_all()

    return app


