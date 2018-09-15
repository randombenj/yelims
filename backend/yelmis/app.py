from flask import Flask


def make_app():
    app = Flask(__name__)

    @app.route('/')
    def homepage():
        return 'Hello, world!'

    return app
