from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def process_file():
    file = request.files["file"]
    filename = file.filename
    file.save(filename)

    transcript = transcript_file(filename)

    content = "以下の文章についての目次を作成してください。また、出力は'1,○○\n2,××\n...'というような形で出力してください。" + transcript

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": content}])

    completion_content = completion.choices[0].message.content

    index = []
    indexs = completion_content.splitlines()
    for item in indexs:
        splited = item.split(',')
        index.append({'index': splited[1], 'index_num': splited[0]})

    result = jsonify({'transcript': {'text': transcript}, 'index': index})

    return result

def transcript_file(filename):
    openai.api_key = os.environ['OPENAI_API_KEY']
    filename = open(filename, "rb")
    transcript = openai.Audio.transcribe("whisper-1", filename)
    return transcript['text']

if __name__ == "__main__":
    app.run()
