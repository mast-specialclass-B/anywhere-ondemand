from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import base64

app = Flask(__name__)
CORS(app)

@app.route("/api/upload", methods=["POST"])
def generate():
    file = request.files["file"]
    filename = file.filename
    file.save(filename)

    transcript = transcript_file(filename)#ここにテキストを置いている
    result = jsonify({'transcript': {'text': transcript}})

    os.remove(filename)
    return result

@app.route("/api/upload-blob", methods=["POST"])
def generate_from_blob():
    file = request.files["file"].read()
    filename = "file.webm"
    
    blob_to_webm(file, filename)
    
    transcript = transcript_file(filename)

    result = jsonify({'transcript': {'text': transcript}})

    os.remove(filename)#保存した音声ファイルを削除

    return result

@app.route("/api/pull-out", methods=["POST"])#目次の生成
def pull_out_by_index():
    request_json = request.json
    index = request_json['index']
    text = request_json['text']

    content = "以下の文章について、この目次に該当する部分を抜き出してください。出力は該当部分の抜出しのみにしてください。\n目次: " + index + "\n文章: " + text

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", temperature=1.5, messages=[{"role": "user", "content": content}])
    completion_content = completion.choices[0].message.content

    result = jsonify({'text': completion_content})
    print(result)

    return result

@app.route("/api/reloadIndex", methods=["POST"])
def reload_index():
    request_json = request.json
    text = request_json['text']

    index = generate_index(text)

    result = jsonify({'transcript': {'text': text}, 'index': index})

    return result

@app.route("/api/search", methods=["POST"])
def search_by_keyword():
    request_json = request.json
    text = request_json['text']
    keyword = request_json['keyword']

    content = "以下の文章について、このキーワードに該当する部分を抜き出してください。出力は該当部分の抜出しのみにし、'目次: 'などを含まないようにしてください。\nキーワード: " + keyword + "\n検索する文章: " + text
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", temperature=1.5, messages=[{"role": "user", "content": content}])
    completion_content = completion.choices[0].message.content

    result = jsonify({'text': completion_content})
    print(result)

    return result


@app.route("/api/summary", methods=["POST"])#要約作成
def summary():
    request_json = request.json
    text = request_json['text']
    tone =request_json['tone']#選択肢はnormal,gal,ojisanでお願いします。
   
    if  tone == "gal" or tone == "ojisan":
        f = open('{}ToneRule.txt'.format(tone), 'r')#変数toneとテキストファイル〇〇tone.txtの名前を揃えてください。
        tone_rule = f.read()
        f.close()
    else:
        tone=""

    content = "以下の文章について、要約を作成してください。\n作成の際は以下のルールを守ってください" + tone_rule + "出力は'要約: 'などを含まないようにしてください。\n要約する文章: " + text
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", temperature=1.5, messages=[{"role": "user", "content": content}])
    completion_content = completion.choices[0].message.content

    result = jsonify({'text': completion_content})
    print(result)

    return result

@app.route("/api/translate", methods=["POST"])
def translateText():
    request_json = request.json
    text = request_json['text']
    target_language = request.json["target_language"]

    content = f"以下の文章を英語に翻訳してください:{text}"
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", temperature=1, messages=[{"role": "user", "content": content}])
    translated_text = completion.choices[0].message.content

    result = jsonify({'original_text': text, 'translated_text': translated_text})
    return result

def transcript_file(filename):
    print(filename)
    openai.api_key = os.environ['OPENAI_API_KEY']
    file = open(filename, "rb")
    transcript = openai.Audio.transcribe("whisper-1", file)
    return transcript['text']

def generate_index(transcript):
    content = "以下の文章についての目次を作成してください。また、出力は'1,○○\n2,××\n...'という形で出力してください。" + transcript

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", temperature=1.5, messages=[{"role": "user", "content": content}])

    completion_content = completion.choices[0].message.content

    index = []
    indexs = completion_content.splitlines()
    for item in indexs:
        splited = item.split(',')
        index.append({'index': splited[1]})

    return index

def blob_to_webm(file, filename):
    with open(filename, 'wb') as f_vid:
        f_vid.write(file)

if __name__ == "__main__":
    app.run()
