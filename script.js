document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript loaded, event listeners attaching...");

    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const captureBtn = document.getElementById("captureBtn");
    const cameraSelect = document.getElementById("cameraSelect");

    let currentStream = null;

    async function startCamera(facingMode = "environment") {
        try {
            console.log("Starting camera with mode:", facingMode);
            
            // Stop the current stream before switching
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: { facingMode: facingMode }
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            currentStream = stream;
            document.getElementById("video").srcObject = stream;
            console.log("Camera started!");
        } catch (error) {
            console.error("Camera error:", error);
        }
    }

    function stopCamera() {
        console.log("Stopping camera...");
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
            document.getElementById("video").srcObject = null;
            console.log("Camera stopped.");
        }
    }

    function takeScreenshot() {
        console.log("Taking screenshot...");
        const video = document.getElementById("video");
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        document.body.appendChild(img);
        console.log("Screenshot taken!");
    }

    startBtn.addEventListener("click", () => {
        console.log("Start button clicked!");
        startCamera(cameraSelect.value);
    });

    stopBtn.addEventListener("click", () => {
        console.log("Stop button clicked!");
        stopCamera();
    });

    captureBtn.addEventListener("click", () => {
        console.log("Capture button clicked!");
        takeScreenshot();
    });

    cameraSelect.addEventListener("change", () => {
        console.log("Camera switch triggered:", cameraSelect.value);
        startCamera(cameraSelect.value);
    });

});
