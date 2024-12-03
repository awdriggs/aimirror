async function run() {
  // const canvas = document.getElementById("video_canvas");

  if (!canvas || !video) {
    console.error("Required elements not found in the DOM");
    return;
  }

  try {
    // Load face-api.js models
    await loadModels();

    // Request access to the webcam
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    console.log("Webcam stream started");

    video.srcObject = stream;

    video.onloadeddata = () => {
      console.log("Video data loaded");
      video.play();
    };

    video.onplay = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) {
        console.error("Unable to determine video dimensions");
        return;
      }

      // Set video and canvas dimensions
      canvas.width = width;
      canvas.height = height;
      video.style.width = `${width}px`;
      video.style.height = `${height}px`;

      // Start face detection
      detectFaces(video, canvas);
    };
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Unable to access the webcam. Please check permissions.");
  }
}

//face api needs a model for face detection, using tiny face detector 
async function loadModels() {
  const MODEL_URL = "./js/models"; // Path to your model directory
  console.log("Loading face-api.js models...");
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  // await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  console.log("Models loaded successfully");
}

async function detectFaces(video, canvas) {

  const displaySize = { width: video.videoWidth, height: video.videoHeight };

  faceapi.matchDimensions(canvas, displaySize);

  console.log("Starting face detection...");
  detect(); // Start detection loop

  //detect definition 
  async function detect() {
    // Detect faces
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    // .withFaceLandmarks();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw detections
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    //draw the bounding box
    faceapi.draw.drawDetections(canvas, resizedDetections);

    if(resizedDetections.length > 0){
      //find the middle of the bounding box
      let firstFace = resizedDetections[0]
      centerX = firstFace.box.x + firstFace.box.width/2;
      centerY = firstFace.box.y + firstFace.box.height/2;
      captureWidth = firstFace.box.width * 1.5; //expand the area that is shown.
      captureHeight = firstFace.box.height * 2;

      //for testing, draws a red box over the face
      ctx.fillStyle = "red";
      ctx.fillRect (centerX -  captureWidth/2, centerY - captureHeight * 0.6, captureWidth, captureHeight)

      btn.disabled = false;
      // btn.classList.remove("hide");

      status.innerText = "I see a face!";
      //set the upload button to active
    } else {
      btn.disabled = true;
      // btn.classList.add("hide");

      status.innerText = "I don't see a face";
    }
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    requestAnimationFrame(detect); //pasing this function as a callback to requestAnimationFrame
  }

}


