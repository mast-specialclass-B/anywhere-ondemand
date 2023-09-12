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
