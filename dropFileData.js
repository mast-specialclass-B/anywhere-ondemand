//ドロップしたファイルのファイル名を表示するためのやつ
const displayEl = document.querySelector(".dropped-file");
const fileInputEl = document.querySelector("input");
fileInputEl.addEventListener("change", (e) => {
	displayEl.innerText = e.target.files[0].name;
});