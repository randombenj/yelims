import os

from flask import Flask, jsonify
from flask_pymongo import PyMongo

from yelmis.errors import ApiError
from yelmis.resources import posts_api


def make_app():
    app = Flask(__name__)
    app.debug = True
    app.config["MONGO_URI"] = os.environ["DB"]
    mongo = PyMongo(app)
    app.mongo = mongo

    app.url_map.strict_slashes = False
    app.register_blueprint(posts_api, url_prefix="/posts")

    @app.errorhandler(ApiError)
    def handle_invalid_usage(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    return app
