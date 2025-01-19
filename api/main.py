from flask import Flask, jsonify, request
from ollama import chat, ChatResponse
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/generate": {"origins": "*"}})

@app.route("/generate", methods=["POST"])
def generate():
    # Parse JSON data from the POST request
    data = request.get_json()

    # Check if the 'message' key is present in the request
    if not data or 'message' not in data:
        return jsonify({"error": "Missing 'message' in request body"}), 400

    user_input = data['message']
    prompt = '''
        Based on what I tell you, summarize how I'm feeling in one sentence. Keep it personal and warm, 
        reflecting my emotions in a way that's easy to relate to.

        On a new line, write "hex code:" followed directly by the hex code of a color that corresponds to my feeling.
    '''
    # Interact with the LLM model
    response: ChatResponse = chat(model="llama3.2", messages=[
        {
            "role": "system",
            "content": prompt,
        },
        {
            "role": "user",
            "content": user_input,
        },
    ])
    
    llm_response = response.message.content
    try:
        sentiment, hex_code = llm_response.split("hex code:")

    except ValueError:
        # If the response format is unexpected
        sentiment = "Unknown"
        hex_code = "#000000"

    return jsonify({
        "sentiment": sentiment,
        "hex_code": hex_code
    }), 200
  


if __name__ == "__main__":
    app.run(port=5000)
