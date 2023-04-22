from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def generate_index():
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
        index.append({'index': splited[1]})

    result = jsonify({'transcript': {'text': transcript}, 'index': index})

    return result

@app.route("/pull-out", methods=["POST"])
def pull_out_by_index():
    request_json = request.json
    index = request_json['index']
    text = request_json['text']

    content = "以下の文章について、この目次に該当する部分を抜き出してください。\n目次: " + index + "\n文章: " + text

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": content}])

    completion_content = completion.choices[0].message.content
    print(completion_content)

    result = jsonify({'text': completion_content})
    print(result)

    return result

def transcript_file(filename):
    openai.api_key = os.environ['OPENAI_API_KEY']
    filename = open(filename, "rb")
    transcript = openai.Audio.transcribe("whisper-1", filename)
    return transcript['text']

if __name__ == "__main__":
    app.run()
