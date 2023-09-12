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
      console.log("data available after MediaRecorder.stop() called.");
      const audio = document.createElement('audio');



      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/webm; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");
      console.log(audioURL);
      uploadRecordingFile(blob);
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

async function uploadRecordingFile(fileURI) {
	const file = fileURI;
	const formData=new FormData();

	formData.append("file", file);

	const response = await fetch("http://127.0.0.1:5000/api/upload-blob", {
		method: "POST",
        headers:{
            'Content-Type': 'file'
        },
		body: formData,
	});

	if (response.ok) {
		const result = await response.json();
		console.log("success");
		console.log(result['index'][0]);
	} else {
		console.error("File upload failed");
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