const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const captureBtn = document.getElementById("captureBtn");
const video = document.getElementById("video");
const overlayCanvas = document.getElementById("overlayCanvas");
const cameraSelect = document.getElementById("cameraSelect");
const ctx = overlayCanvas.getContext("2d");
let stream = null;
let model = null;

// Load Face Detection Model
async function loadModel() {
    model = await blazeface.load();
    console.log("Face detection model loaded!");
}

// Start Camera
startBtn.addEventListener("click", async () => {
    try {
        const selectedCamera = cameraSelect.value;
        const constraints = { video: { facingMode: selectedCamera } };

        // Stop any existing stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        // Ensure overlay matches video size
        video.onloadedmetadata = () => {
            overlayCanvas.width = video.videoWidth;
            overlayCanvas.height = video.videoHeight;
        };

        await loadModel();
        detectFaces();
    } catch (error) {
        console.error("Error accessing webcam: ", error);
    }
});

// Stop Camera
stopBtn.addEventListener("click", () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height); // Clear AR overlay
    }
});

// Take Screenshot
captureBtn.addEventListener("click", () => {
    if (!stream) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    const capturedImage = document.createElement("img");
    capturedImage.src = imageDataUrl;
    capturedImage.style.position = "absolute";
    capturedImage.style.top = "10px";
    capturedImage.style.left = "10px";
    capturedImage.style.border = "2px solid black";
    capturedImage.style.maxWidth = "200px";

    document.body.appendChild(capturedImage);
});

// Face Detection with AR Overlay
async function detectFaces() {
    if (!model || !stream) return;

    const predictions = await model.estimateFaces(video, false);
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    predictions.forEach(prediction => {
        const [x, y, width, height] = [
            prediction.topLeft[0],
            prediction.topLeft[1],
            prediction.bottomRight[0] - prediction.topLeft[0],
            prediction.bottomRight[1] - prediction.topLeft[1]
        ];

        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
    });

    requestAnimationFrame(detectFaces);
}
