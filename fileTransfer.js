
async function uploadFile() {
	const fileInput=document.getElementById("fileInput");
	const file = fileInput.files[0];
	const formData=new FromData();

	formData.append("file", file);

	const response = await fetch("http://localhost:80/upload", {
		method: "POST",
		body: formData,
	});

	if (response.ok) {
		const result = await response.json();
		console.log(result);
	} else {
		console.error("File upload failed");
	}
}


//ドロップしたファイルのファイル名を表示するためのやつ
const displayEl = document.querySelector(".dropped-file");
const fileInputEl = document.querySelector("input");
fileInputEl.addEventListener("change", (e) => {
	displayEl.innerText = e.target.files[0].name;
});