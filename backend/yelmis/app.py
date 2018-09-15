from flask import Flask
from flask_restful import Api

from yelmis.resources import Post


def make_app():
    app = Flask(__name__)
    api = Api(app)

    api.add_resource(Post, "/")

    return app
