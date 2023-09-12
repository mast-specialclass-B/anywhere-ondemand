from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

@app.route("/api/upload", methods=["POST"])#アップロードされたファイルをフロントから受け取り、音声を文章化して目次を生成しまたフロントに返す
def generate_index():
    file = request.files["file"]
    filename = file.filename
    file.save(filename)

    transcript = transcript_file(filename)#ここにテキストを置いている

    content = "以下の文章についての目次を作成してください。また、出力は'1,○○\n2,××\n...'という形で出力してください。" + transcript#実際にchatGPTに投げるスクリプト

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", temperature=1.5, messages=[{"role": "user", "content": content}])

    completion_content = completion.choices[0].message.content#19行目のコンテンツの内容を取り出して保存

    index = []
    indexs = completion_content.splitlines()#completion_contentを1行ごとに分けている
    for item in indexs:
        splited = item.split(',')
        index.append({'index': splited[1]})

    result = jsonify({'transcript': {'text': transcript}, 'index': index})#JSON形式でクライアントに返す

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

@app.route("/api/reloadIndex", methods=["POST"])#pull-outでの目次が気に入らないときに、もう一度生成できる
def reloadIndex():
    request_json = request.json
    text = request_json['text']

    content = "以下の文章についての目次を作成してください。また、出力は'1,○○\n2,××\n...'というような形で出力してください。" + text

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", temperature=1.5, messages=[{"role": "user", "content": content}])
    completion_content = completion.choices[0].message.content

    index = []
    indexs = completion_content.splitlines()
    for item in indexs:
        splited = item.split(',')
        index.append({'index': splited[1]})

    result = jsonify({'transcript': {'text': text}, 'index': index})

    return result

@app.route("/api/search", methods=["POST"])#キーワードの抜き出し
def searchKeyword():
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

    content = "以下の文章について、要約を作成してください。出力は'要約: 'などを含まないようにしてください。\n要約する文章: " + text
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
    if not tone or tone == "normal":
        tone=""
    else:
        f = open('{}ToneRule.txt'.format(tone), 'r')#変数toneとテキストファイル〇〇tone.txtの名前を揃えてください。
        tone_rule = f.read()
        f.close()

    content = "以下の文章について、要約を作成してください。\n作成の際は以下のルールを守ってください" + tone_rule + "出力は'要約: 'などを含まないようにしてください。\n要約する文章: " + text
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", temperature=1.5, messages=[{"role": "user", "content": content}])
    completion_content = completion.choices[0].message.content

    result = jsonify({'text': completion_content})
    print(result)

    return result

def transcript_file(filename):#ここでファイルの受け取りおよび文字起こし
    openai.api_key = os.environ['OPENAI_API_KEY']
    filename = open(filename, "rb")
    transcript = openai.Audio.transcribe("whisper-1", filename)
    return transcript['text']

if __name__ == "__main__":
    app.run()
