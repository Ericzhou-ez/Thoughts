from flask import Flask, jsonify, request


app = Flask(__name__)

@app.route("/")
def home_page():
    user_input = request.get_json()

    return jsonify({"llm_response": "Thanks for sharing that with me."}), 200

if __name__ == "__main__":
    app.run(port=5000)