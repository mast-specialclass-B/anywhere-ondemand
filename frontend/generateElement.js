function errorRaise(errorMessage){
    loadCircleSwitch(false);
    alert(errorMessage);
}

function isError(json, property, errorMessage1, errorMessage2){
    if (json == null){
        errorRaise(errorMessage1);
        return true;
    } else if (!json.hasOwnProperty(property)){
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

function generateIndexTable(json) {
    const errorMessage1 = "目次の生成に失敗しました。もう一度お試しください。";
    //const errorMessage2 = "目次の生成に失敗しました。もう一度お試しください。";
    if (isError(json, 'index', errorMessage1, errorMessage1)){
        return ;
    } else if (isError(json['index'][0], 'index', errorMessage1, errorMessage1)){
        return ;
    }
    removePreContent('indexTableContent');
    // table要素を生成
    var table = document.createElement('table');
    table.setAttribute('id', 'indexTableContent');
    
    //クラス要素を追加
    table.classList.add("u-full-width");
    
    // ヘッダーを作成
    var tr = document.createElement('tr');
    
    
    // テーブル本体を作成
    for (var i = 0; i < json['index'].length; i++) {
        // tr要素を生成
        var tr = document.createElement('tr');
        // th・td部分のループ
        // td要素を生成
        var td = document.createElement('td');
        // td要素内にテキストを追加
        var indexname =  json['index'][i]['index'];
        td.innerHTML = `<a onclick="generatePullOutIndex('${indexname}')">${indexname}</a>`
        // td要素をtr要素の子要素に追加
        tr.appendChild(td);
        // tr要素をtable要素の子要素に追加
        table.appendChild(tr);
    }
    // 生成したtable要素を追加する
    document.getElementById('indexTable').appendChild(table);
}

function generateAllText(json) {
    const errorMessage1 = "文字起こしの生成に失敗しました。もう一度お試しください。";
    //const errorMessage2 = "文字起こしの生成に失敗しました。もう一度お試しください。"
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

function generateExt(json) {
    const errorMessage1 = "目次に該当する箇所の抜き出しに失敗しました。もう一度お試しください。";
    //const errorMessage2 = "目次に該当する箇所の抜き出しに失敗しました。もう一度お試しください。";
    if (isError(json, 'text', errorMessage1, errorMessage1)){
        return ;
    } 
    removePreContent('ExtContent');
    var Ext = document.createElement("p");
    Ext.setAttribute('id', 'ExtContent');
    Ext.textContent = json['text'];
    document.getElementById("extraction").appendChild(Ext);
}

async function generatePullOutIndex(index){
    loadCircleSwitch(true);
    const json = await pullOutIndex(index);
    generateExt(json);
    loadCircleSwitch(false);
}

async function pullOutIndex(index){  
    const text_element = document.getElementById("AllText");
    const text = text_element.textContent;

    data = {'index': index, 'text': text};
    
    const response = await fetch("http://127.0.0.1:5000/api/pull-out", {
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
};

const reloadButton = document.getElementById("reloadButton");
reloadButton.disabled = true;

async function generateIndex(){
    loadCircleSwitch(true);
    const uploadButton = document.getElementById("uploadButton");
    uploadButton.disabled = true;
    const json = await uploadFile();
    generateIndexTable(json);
    generateAllText(json);
    loadCircleSwitch(false);
    const reloadButton = document.getElementById("reloadButton");
    if (reloadButton.disabled == true){
        reloadButton.disabled = false;
    }
}

async function reloadIndex() {
    const text_element = document.getElementById("AllText");
    const text = text_element.textContent;

    data = {'text': text};
    
    const response = await fetch("http://127.0.0.1:5000/api/reloadIndex", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
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

async function reGenerateIndex() {
    loadCircleSwitch(true);
    const reloadButton = document.getElementById("reloadButton");
    reloadButton.disabled = true;
    const json = await reloadIndex();
    generateIndexTable(json);
    generateAllText(json);
    loadCircleSwitch(false);
    if (reloadButton.disabled == true){
        reloadButton.disabled = false;
    }
}

async function search(keyword) {
    loadCircleSwitch(true);
    const json = await searchKeyword(keyword);
    generateExt(json);
    loadCircleSwitch(false);
}

async function searchKeyword(keyword){
    const text_element = document.getElementById("AllText");
    const text = text_element.textContent;

    data = {'keyword': keyword, 'text': text};

    const response = await fetch("http://127.0.0.1:5000/api/search", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        const result = await response.json();
        console.log("success");
        return result;
    } else {
        console.error("error in searching");
        return null;
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