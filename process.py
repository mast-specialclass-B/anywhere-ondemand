from flask import Flask, request, jsonify
import werkzeug

app = Flask(__name__)

@app.route("/upload", methods=["POST"])
def process_file():
    file = request.files["file"]
    filename = werkzeug.secure_filename(file.filename)
    file.save(filename)

    result = process_your_file(filename)

    return jsonify(result)

def process_your_file(filename):
    result = {}
    return result

if __name__ == "__main__":
    app.run()
