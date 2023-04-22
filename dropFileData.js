//ドロップしたファイルのファイル名を表示するためのやつ
const displayEl = document.querySelector(".dropped-file");
const fileInputEl = document.querySelector("input");
const uploadButton = document.getElementById("uploadButton");
uploadButton.disabled = true;
fileInputEl.addEventListener("change", (e) => {
	displayEl.innerText = e.target.files[0].name;
});

function ableButton(){
	if (uploadButton.disabled == true){
		uploadButton.disabled = false;
	}else{
		uploadButton.disabled = true;
	}
}