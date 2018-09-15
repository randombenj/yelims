import os
from datetime import timedelta

from flask import Flask, jsonify, request, current_app
from flask_pymongo import PyMongo
from flask_jwt_extended import (
    JWTManager, jwt_required,
    create_access_token, create_refresh_token,
    get_jwt_identity,
    jwt_refresh_token_required
)
from flask_bcrypt import Bcrypt

from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


from yelims.errors import ApiError
from yelims.schemas import user_schema
from yelims.resources import posts_api, timeline_api, users_api


def validate_user(data):
    try:
        validate(data, user_schema)
    except ValidationError as e:
        return {"ok": False, "message": e}
    except SchemaError as e:
        return {"ok": False, "message": e}
    else:
        return {"ok": True, "data": data}


def make_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.debug = True

    # MongoDB
    app.config["MONGO_URI"] = os.environ["DB"]
    mongo = PyMongo(app)
    app.mongo = mongo

    # JWT
    app.config["JWT_SECRET_KEY"] = "super-secret"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
    jwt = JWTManager(app)

    # BCrypt
    flask_bcrypt = Bcrypt(app)

    app.register_blueprint(posts_api, url_prefix="/posts")
    app.register_blueprint(timeline_api, url_prefix="/timeline")
    app.register_blueprint(users_api, url_prefix="/users")

    @app.route("/register", methods=["POST"])
    def register():
        data = validate_user(request.get_json())
        if data["ok"]:
            data = data["data"]
            # check if user exists
            if current_app.mongo.db.users.find({"username": data["username"]}).count() >= 1:
                raise ApiError(f"User with name {data['username']} already exists")

            data["password"] = flask_bcrypt.generate_password_hash(
                                data["password"])
            data["following"] = []
            current_app.mongo.db.users.insert_one(data)
            return jsonify({
                "ok": True,
                "message": "User created successfully!"}), 200
        else:
            raise ApiError(f"Bad request parameters: {data['message']}", status_code=400)

    @app.route("/auth", methods=["POST"])
    def login():
        data = validate_user(request.get_json())
        if data["ok"]:
            data = data["data"]
            user = current_app.mongo.db.users.find_one(
                    {"username": data["username"]}, {"_id": 0})
            if user and flask_bcrypt.check_password_hash(user["password"], data["password"]):
                del data["password"]
                del user["password"]
                access_token = create_access_token(identity=data)
                refresh_token = create_refresh_token(identity=data)
                user["token"] = access_token
                user["refresh"] = refresh_token
                return jsonify({"ok": True, "data": user}), 200
            else:
                raise ApiError("Invalid username or password", status_code=401)
        else:
            raise ApiError(f"Bad request parameters: {data['message']}", status_code=400)

    @app.route("/refresh", methods=["POST"])
    @jwt_refresh_token_required
    def refresh():
        current_user = get_jwt_identity()
        ret = {
            "token": create_access_token(identity=current_user)
        }
        return jsonify({"ok": True, "data": ret}), 200

    @app.errorhandler(ApiError)
    def handle_invalid_usage(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    return app
