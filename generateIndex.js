async function uploadFile() {
	const fileInput=document.getElementById("fileInput");
	const file = fileInput.files[0];
	const formData=new FormData();
    
	formData.append("file", file);
    
	const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
		body: formData,
	});
    
	if (response.ok) {
        const result = await response.json();
		console.log("success");
		console.log(result);
        return result;
	} else {
        console.error("File upload failed");
        return null;
	}
}

function removePreContent() {
    const preTable = document.getElementById('indexTableContent')
    if (preTable != null)
        preTable.remove();
    const preText = document.getElementById('allTextContent');
    if (preText != null)
        preText.remove();
    const preExt = document.getElementById('ExtContent');
    if (preExt != null)
        preExt.remove();
}

function generateIndexTable(json) {
    // table要素を生成
    var table = document.createElement('table');
    table.setAttribute('id', 'indexTableContent');
    
    //クラス要素を追加
    table.classList.add("u-full-width");
    
    // ヘッダーを作成
    var tr = document.createElement('tr');
    
    
    // テーブル本体を作成
    for (var i = 0; i < json['index'].length; i++) {
        console.log(json['index'][i]);
        // tr要素を生成
        var tr = document.createElement('tr');
        // th・td部分のループ
        // td要素を生成
        var td = document.createElement('td');
        // td要素内にテキストを追加
        var indexname =  json['index'][i]['index'];
        td.innerHTML = `<a onclick="putIndex('${indexname}')">${indexname}</a>`
        // td要素をtr要素の子要素に追加
        tr.appendChild(td);
        // tr要素をtable要素の子要素に追加
        table.appendChild(tr);
    }
    // 生成したtable要素を追加する
    document.getElementById('indexTable').appendChild(table);
    
    
    //p要素を作成
    var allText = document.createElement('p');
    allText.setAttribute('id', 'allTextContent');
    //文字要素を追加
    allText.textContent = json['transcript']['text'];
    document.getElementById("AllText").appendChild(allText);
    
    var Ext = document.createElement("p");
    Ext.setAttribute('id', 'ExtContent');
    Ext.textContent = "目次をクリックすると、ここに本文からの抜き出し部分が表示されます";
    document.getElementById("extraction").appendChild(Ext);
}

function putIndex(index){    
    console.log(index);
};

async function generateIndex(){
    const uploadButton = document.getElementById("uploadButton");
    uploadButton.disabled = true;
    removePreContent();
    const json = await uploadFile();
    generateIndexTable(json);
}
