user_schema = {
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "minLength": 3
        },
        "password": {
            "type": "string",
            "minLength": 6
        }
    },
    "required": ["username", "password"],
    "additionalProperties": False
}
