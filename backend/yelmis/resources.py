from flask_restful import Resource

class Post(Resource):
    def get(self):
        return {"foo": "bar"}
