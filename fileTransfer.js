async function uploadFile() {
	const fileInput=document.getElementById("fileInput");
	const file = fileInput.files[0];
	const formData=new FormData();

	formData.append("file", file);

	const response = await fetch("http://127.0.0.1:5000/upload", {
		method: "POST",
		body: formData,
	});
	// const response = await fetch("http://localhost:5000/", {
	// 	method: "GET",
	// });

	if (response.ok) {
		const result = await response;
		console.log("success");
		console.log(result);
	} else {
		console.error("File upload failed");
	}
}
