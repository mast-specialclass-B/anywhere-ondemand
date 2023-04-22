from flask import Flask, request, jsonify
from flask_cors import CORS
import werkzeug
import openai

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def process_file():
    file = request.files["file"]
    filename = file.filename
    file.save(filename)
    print(filename)

    result = process_your_file(filename)

    return jsonify(result)

def process_your_file(filename):
    result = {}
    return result

if __name__ == "__main__":
    app.run()
