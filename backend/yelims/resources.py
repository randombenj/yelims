from datetime import datetime

import emoji
import pymongo
from flask import Blueprint, request, jsonify
from flask import current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.json_util import dumps

from yelims.errors import ApiError


posts_api = Blueprint("posts", "posts")
timeline_api = Blueprint("timeline", "timeline")
users_api = Blueprint("users", "users")


@posts_api.route("/", methods=["GET"])
# @jwt_required
def list_posts():
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))

    posts_query = current_app.mongo.db.posts.find().skip(
            offset).limit(limit).sort("timestamp", pymongo.DESCENDING)
    total_posts = current_app.mongo.db.posts.count()
    posts = list(posts_query)

    return dumps({
        "_links": {
            "self": {"href": f"/posts?offset={offset}&limit={limit}"},
            "next": {"href": f"/posts?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": total_posts,
        "posts": posts
    })


@posts_api.route("/", methods=["POST"])
@jwt_required
def insert_post():
    raw_post = request.json
    try:
        username = raw_post["username"]
        message = raw_post["message"]
    except KeyError as exc:
        raise ApiError(f"Missing field {exc} in JSON body")

    if emoji.emoji_count(message) != 2:
        raise ApiError("Exactly 2 emojis needed for post message")

    post = {
        "username": username,
        "message": message,
        "timestamp": datetime.now(),
        "reactions": [],
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


@posts_api.route("/<ObjectId:post_id>/reaction", methods=["POST"])
@jwt_required
def add_reaction(post_id):
    raw_reaction = request.json
    try:
        reaction = {
            "username": raw_reaction["username"],
            "message": raw_reaction["message"],
            "timestamp": datetime.now()
        }
    except KeyError as exc:
        raise ApiError(f"Missing field {exc} in JSON body")

    current_app.mongo.db.posts.update_one(
            {"_id": post_id}, {"$push": {"reactions": reaction}})
    return jsonify({"post_id": str(post_id)}), 204


@timeline_api.route("/", methods=["GET"])
@jwt_required
def following_timeline():
    current_user = get_jwt_identity()
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))

    following = list(current_app.mongo.db.users.find(
        {"username": current_user["username"]},
        {"following": 1, "_id": 0}))[0]["following"]

    posts_query = current_app.mongo.db.posts.find(
            {"username": {"$in": following}}).skip(
                    offset).limit(limit).sort(
                            "timestamp", pymongo.DESCENDING)
    total_posts = current_app.mongo.db.posts.count()
    posts = list(posts_query)

    return dumps({
        "_links": {
            "self": {"href": f"/timeline?offset={offset}&limit={limit}"},
            "next": {"href": f"/timeline?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": total_posts,
        "posts": posts
    })


@timeline_api.route("/<string:username>", methods=["GET"])
@jwt_required
def user_timeline(username):
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))

    posts_query = current_app.mongo.db.posts.find({"username": username}).skip(
            offset).limit(limit).sort("timestamp", pymongo.DESCENDING)
    total_posts = current_app.mongo.db.posts.count()
    posts = list(posts_query)

    return dumps({
        "_links": {
            "self": {"href": f"/timeline/{username}?offset={offset}&limit={limit}"},
            "next": {"href": f"/timeline/{username}?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": total_posts,
        "posts": posts
    })


@users_api.route("/", methods=["GET"])
# @jwt_required
def search_user():
    username = request.args.get("username", "")

    users = current_app.mongo.db.users.find(
            {"username": {"$regex": username}}).sort("username")
    return dumps({
        "users": [u["username"] for u in users]
    })


@users_api.route("/<string:username>/follow/<string:new_follow_username>", methods=["PUT"])
@jwt_required
def new_follow(username, new_follow_username):
    current_app.mongo.db.users.update_one({"username": username}, {
        "$push": {"following": new_follow_username}}, upsert=True)
    return jsonify({}), 201
