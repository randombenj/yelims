import itertools
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

    for post in posts:
        post["reaction_summary"] = sorted([
                (k, len(list(v))) for k, v
                in itertools.groupby(sorted(post["reactions"], key=lambda x: x["message"]), key=lambda x: x["message"])
                ], key=lambda x: x[1], reverse=True)

    return dumps({
        "_links": {
            "self": {"href": f"/posts?offset={offset}&limit={limit}"},
            "next": {"href": f"/posts?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": total_posts,
        "posts": posts
    })


@posts_api.route("/near", methods=["GET"])
def list_near_posts():
    raw_args = request.args
    try:
        longitude = float(raw_args["longitude"])
        latitude = float(raw_args["latitude"])
        radius = float(raw_args.get("radius", 5))
    except KeyError as exc:
        raise ApiError(f"Missing URL parameter {exc}")

    METERS_PER_MILE = 1609.34
    posts_query = current_app.mongo.db.posts.find({
        "location": {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "$maxDistance": radius * METERS_PER_MILE
            }
        }
    })
    total_posts = current_app.mongo.db.posts.count()
    posts = list(posts_query)

    for post in posts:
        post["reaction_summary"] = sorted([
                (k, len(list(v))) for k, v
                in itertools.groupby(sorted(post["reactions"], key=lambda x: x["message"]), key=lambda x: x["message"])
                ], key=lambda x: x[1], reverse=True)

    return dumps({
        "total": total_posts,
        "posts": posts
    })


@posts_api.route("/", methods=["POST"])
@jwt_required
def insert_post():
    current_user = get_jwt_identity()
    raw_post = request.json
    try:
        message = raw_post["message"]
        longitude = float(raw_post["longitude"])
        latitude = float(raw_post["latitude"])
    except KeyError as exc:
        raise ApiError(f"Missing field {exc} in JSON body")

    if emoji.emoji_count(message) != 2:
        raise ApiError("Exactly 2 emojis needed for post message")

    username = current_user["username"]

    post = {
        "username": username,
        "message": message,
        "timestamp": datetime.now(),
        "location": {
            "type": "Point",
            "coordinates": [longitude, latitude]
        },
        "reactions": [],
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


@posts_api.route("/<ObjectId:post_id>/reaction", methods=["POST"])
@jwt_required
def add_reaction(post_id):
    raw_reaction = request.json
    current_user = get_jwt_identity()
    username = current_user["username"]
    try:
        reaction = {
            "username": username,
            "message": raw_reaction["message"],
            "timestamp": datetime.now()
        }
    except KeyError as exc:
        raise ApiError(f"Missing field {exc} in JSON body")

    user_already_reacted = current_app.mongo.db.posts.find_one(
            {"_id": post_id, "reactions.username": username})
    if user_already_reacted:
        current_app.mongo.db.posts.update_one(
                {"_id": post_id},
                {"$pull": {"reactions": {
                    "username": username}}})

    current_app.mongo.db.posts.update_one(
            {"_id": post_id}, {"$push": {"reactions": reaction}})

    post = current_app.mongo.db.posts.find_one({"_id": post_id})
    post["reaction_summary"] = sorted([
            (k, len(list(v))) for k, v
            in itertools.groupby(
                sorted(post["reactions"], key=lambda x: x["message"]), key=lambda x: x["message"])
            ], key=lambda x: x[1], reverse=True)
    return dumps(post)


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

    for post in posts:
        post["reaction_summary"] = sorted([
                (k, len(list(v))) for k, v
                in itertools.groupby(
                    sorted(post["reactions"], key=lambda x: x["message"]), key=lambda x: x["message"])
                ], key=lambda x: x[1], reverse=True)

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

    for post in posts:
        post["reaction_summary"] = sorted([
                (k, len(list(v))) for k, v
                in itertools.groupby(sorted(post["reactions"], key=lambda x: x["message"]), key=lambda x: x["message"])
                ], key=lambda x: x[1], reverse=True)

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
@jwt_required
def search_user():
    current_user = get_jwt_identity()
    username = request.args.get("username", "")
    following = list(current_app.mongo.db.users.find(
        {"username": current_user["username"]},
        {"following": 1, "_id": 0}))[0]["following"]


    users_raw = current_app.mongo.db.users.find(
            {"username": {"$regex": username, "$options": "i"}}).sort("username")
    users = []
    for user in users_raw:
        users.append({
            "username": user["username"],
            "following": user["username"] in following
        })

    return dumps({
        "users": users
    })


@users_api.route("/<string:username>", methods=["GET"])
@jwt_required
def user_profile(username):
    posts = list(current_app.mongo.db.posts.find({"username": username}))
    attention_points = sum(len(x["reactions"]) for x in posts)
    following = list(current_app.mongo.db.users.find(
        {"username": username}))[0]["following"]
    return dumps({
        "username": username,
        "post_count": len(posts),
        "attention_points": attention_points,
        "following": following
    })


@users_api.route("/<string:new_follow_username>/follow", methods=["PUT"])
@jwt_required
def follow(new_follow_username):
    username = get_jwt_identity()["username"]
    current_app.mongo.db.users.update_one({"username": username}, {
        "$push": {"following": new_follow_username}}, upsert=True)
    return jsonify({}), 201


@users_api.route("/<string:follow_username>/follow", methods=["DELETE"])
@jwt_required
def unfollow(follow_username):
    username = get_jwt_identity()["username"]
    current_app.mongo.db.users.update_one({"username": username}, {
        "$pull": {"following": follow_username}})
    return jsonify({}), 200
