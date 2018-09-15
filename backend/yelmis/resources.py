from datetime import datetime

from flask import Blueprint, request, current_app, jsonify
from bson.json_util import dumps

from yelmis.errors import ApiError


posts_api = Blueprint("posts", __name__)


@posts_api.route("/", methods=["GET"])
def list_posts():
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))

    posts_query = current_app.mongo.db.posts.find().skip(
            offset).limit(limit).sort("timestamp")
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
def insert_post():
    raw_post = request.json
    try:
        username = raw_post["username"]
        message = raw_post["message"]
    except KeyError as exc:
        raise ApiError(f"Missing field {exc} in JSON body")

    if len(message) != 2:
        raise ApiError("Exactly 2 characters needed for post message")

    post = {
        "username": username,
        "message": message,
        "timestamp": datetime.now(),
        "reactions": [],
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


@posts_api.route("/<ObjectId:post_id>/reaction", methods=["POST"])
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
