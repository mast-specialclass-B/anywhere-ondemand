function errorRaise(errorMessage){
    loadCircleSwitch(false);
    alert(errorMessage);
}

function isError(json, property, errorMessage1, errorMessage2){
    if (json == null){
        errorRaise(errorMessage1);
        return true;
    } else if (!json.hasOwnProperty(property)){
        console.log(json);
        console.log(property);
        errorRaise(errorMessage2);
        return true;
    }
    return false;
}

function loadCircleSwitch(bool){
    const loader = document.getElementById('loadCircle');
    if(bool == true && loader.classList.contains("done") == true){
        loader.classList.remove("done")
    }else if(bool == false && loader.classList.contains("done") == false){
        loader.classList.add("done")
    }
}

async function uploadFile() {
	const fileInput=document.getElementById("fileInput");
	const file = fileInput.files[0];
	const formData=new FormData();
    
	formData.append("file", file);
    
	const response = await fetch("http://127.0.0.1:5000/api/upload", {
        method: "POST",
		body: formData,
	});
    
	if (response.ok) {
        const result = await response.json();
		console.log("success");
        return result;
	} else {
        console.error("File upload failed");
        return null;
	}
}

function removePreContent(id) {
    const preContent = document.getElementById(id);
    if (preContent != null)
        preContent.remove();
}

function generateAllText(json) {
    const errorMessage1 = "文字起こしの生成に失敗しました。もう一度お試しください。";
    const errorMessage2 = "文字起こしの生成に失敗しました。もう一度お試しください。"
    if (isError(json, 'transcript', errorMessage1, errorMessage1)){
        return ;
    } else if (isError(json['transcript'], 'text', errorMessage1, errorMessage1)){
        return ;
    }
    removePreContent('allTextContent');
    //p要素を作成
    var allText = document.createElement('p');
    allText.setAttribute('id', 'allTextContent');
    //文字要素を追加
    allText.textContent = json['transcript']['text'];
    document.getElementById("AllText").appendChild(allText);
}

function generateSummary(json) {
    const errorMessage1 = "要約の生成に失敗しました。もう一度お試しください。";
    //const errorMessage2 = "要約の生成に失敗しました。もう一度お試しください。"
    if (isError(json, 'text', errorMessage1, errorMessage1)){
        return ;
    } 
    removePreContent('Summary');
    var SumText = document.createElement("p");
    SumText.setAttribute('id', 'Summary');
    SumText.textContent = json['text'];
    document.getElementById("summary").appendChild(SumText);
}

async function letGenerateSummary(){
    loadCircleSwitch(true);
    const json = await requestSummary();
    generateSummary(json);
    loadCircleSwitch(false);
}

async function requestSummary(){  
    const text_element = document.getElementById("AllText");
    const text = text_element.textContent;

<<<<<<< HEAD
    data = {'text': text, 'tone': 'normal'};
=======
    data = {'text': text, 'tone': 'gal'};
>>>>>>> origin
    
    const response = await fetch("http://127.0.0.1:5000/api/summary", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    
    if (response.ok) {
        const json = await response.json();
        console.log("success");
        return json;
    } else {
        console.error("File upload failed");
        return null;
    }
}

function generateTranslate(json) {
    const errorMessage1 = "翻訳の生成に失敗しました。もう一度お試しください。";
    //const errorMessage2 = "翻訳こんにゃくが故障しました。もう一度お試しください。"
    if (isError(json, 'translated_text', errorMessage1, errorMessage1)){
        return ;
    } 
    removePreContent('TransContent');
    var Ext = document.createElement("p");
    Ext.setAttribute('id', 'TransContent');
    Ext.textContent = json['translated_text'];
    document.getElementById("translatedText").appendChild(Ext);
}

async function preGenerateTrans(){
    loadCircleSwitch(true);
    const json = await requestTrans();
    generateTranslate(json);
    loadCircleSwitch(false);
}

async function requestTrans(){  
    const text_element = document.getElementById("AllText");
    const text = text_element.textContent;

    data = {'text': text,'target_language' : '英語'};
    
    const response = await fetch("http://127.0.0.1:5000/api/translate", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    
    if (response.ok) {
        const json = await response.json();
        console.log("success");
        return json;
    } else {
        console.error("File upload failed");
        return null;
    }
}

const reloadSummaryButton = document.getElementById("reloadSummaryButton");
reloadSummaryButton.disabled = true;

const reloadTranslateButton = document.getElementById("reloadTranslateButton");
reloadTranslateButton.disabled = true;

async function generateIndex(){
    loadCircleSwitch(true);
    const uploadButton = document.getElementById("uploadButton");
    uploadButton.disabled = true;
    const json = await uploadFile();
    //generateIndexTable(json);
    generateAllText(json);
    loadCircleSwitch(false);
    const reloadSummaryButton = document.getElementById("reloadSummaryButton");
    if (reloadSummaryButton.disabled == true){
        reloadSummaryButton.disabled = false;
    }
    const reloadTranslateButton = document.getElementById("reloadTranslateButton");
    if (reloadTranslateButton.disabled == true){
        reloadTranslateButton.disabled = false;
    }
}

async function translateText() {
    const text_element = document.getElementById("AllText");
    const language_element = document.getElementById("TargetLanguage");
    const text = text_element.textContent;
    const target_language = language_element.value;

    data = {'text': text, 'target_language': target_language};

    const response = await fetch("http://127.0.0.1:5000/api/translate", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        const result = await response.json();
        console.log("Translation success");
        return result;
    } else {
        console.error("Translation failed");
        return null;
    }
}

const record = document.getElementById('startRecord');
const stop = document.getElementById('stopRecord');

stop.disabled = true;

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    //visualize(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
        onStopRecording(chunks);
    }
    
    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
    }
}

let onError = function(err) {
    console.log('The following error occured: ' + err);
}

navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
    console.log('サポート外のブラウザです');
}

async function onStopRecording(chunks) {
    console.log("data available after MediaRecorder.stop() called.");
    const audio = document.createElement('audio');
    
    audio.controls = true;
    const blob = new Blob(chunks, { 'type' : 'audio/webm; codecs=opus' });
    chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    audio.src = audioURL;
    console.log("recorder stopped");
    console.log(audioURL);
    result = await uploadRecordingFile(blob);
    generate(result);
}

async function uploadRecordingFile(fileURI) {
	const file = fileURI;
	const formData=new FormData();

	formData.append("file", file);

	const response = await fetch("http://127.0.0.1:5000/api/upload-blob", {
		method: "POST",
		body: formData,
	});

	if (response.ok) {
		const result = await response.json();
		console.log("success");
		return result;
	} else {
		console.error("File upload failed");
        return null;
	}
}

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startRecord');
    const stopButton = document.getElementById('stopRecord');
    const statusDiv = document.getElementById('status');

    // 録音開始ボタンをクリックしたときのイベント
    startButton.addEventListener('click', function() {
        statusDiv.innerHTML = '<span class="recording-dot"></span> 録音中';
        statusDiv.classList.add('recording');
    });

    // 録音停止ボタンをクリックしたときのイベント
    stopButton.addEventListener('click', function() {
        statusDiv.textContent = '録音中でない';
        statusDiv.classList.remove('recording');
    });
});

async function generate(json){
    generateAllText(json);
    const reloadSummaryButton = document.getElementById("reloadSummaryButton");
    if (reloadSummaryButton.disabled == true){
        reloadSummaryButton.disabled = false;
    }
    const reloadTranslateButton = document.getElementById("reloadTranslateButton");
    if (reloadTranslateButton.disabled == true){
        reloadTranslateButton.disabled = false;
    }
}