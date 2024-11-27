//global variables
let btn;
let centerX, centerY, captureWidth, captureHeight;
let canvas, ctx; //canvas and context
let video;

let caption; //global to hold the caption bro

let test; //temp global for testing

window.onload = () => {
  console.log("Page loaded");

  //get the upload button
  btn = document.querySelector("#upload");
  //add event listener to the button
  btn.addEventListener("click", postImage);

  canvas = document.getElementById("video_canvas");
  ctx = canvas.getContext("2d");
  video = document.getElementById("video1");

  run(); //start the face detection bizness
};

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
  const MODEL_URL = "./models"; // Path to your model directory
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

      //set the upload button to active
    }
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    requestAnimationFrame(detect); //pasing this function as a callback to requestAnimationFrame
  }

}

function prepareImage(){
  console.log("capture bro");
  // Create an image url
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //help of chatgpt here
  const imageData = ctx.getImageData(centerX -  captureWidth/2, centerY - captureHeight * 0.6, captureWidth, captureHeight)
  // Create a new canvas element to hold the cropped portion
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = captureWidth;
  croppedCanvas.height = captureHeight;
  const croppedCtx = croppedCanvas.getContext('2d');

  // Put the extracted image data onto the new canvas
  croppedCtx.putImageData(imageData, 0, 0);

  // Step 3: Convert the cropped canvas to an image (base64)
  const croppedImageURL = croppedCanvas.toDataURL(); // Base64 string

  //
  let data = {};
  data.image = croppedImageURL;  

  //testing
  // let img = document.createElement("img");
  // img.src = croppedImageURL;
  // document.querySelector("body").append(img);

  // console.log(data);
  return data;
}

async function postImage() {
  //var base_url = window.location.origin; //need to update this
    const url = 'http://localhost:3000/api/image'; // Replace with your Node.js server endpoint
    const data = prepareImage();  

    try {
        // Make the POST request
        const response = await fetch(url, {
            method: 'POST', // Use POST method
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
            },
            body: JSON.stringify(data), // Convert data to JSON string
        });

        // Handle non-200 HTTP statuses
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const result = await response.json();
        console.log("Server Response:", result);

        // test = result;
        caption = result.caption; 
          // img.src = `data:image/png;base64, `; 
        // let img = document.createElement("img");
        // img.src = result.url
        // document.querySelector("body").append(img);

    } catch (error) {
        // Handle errors
        console.error("Error during POST request:", error.message);
    }
}


async function postCaption() {
  //var base_url = window.location.origin; //need to update this
    const url = 'http://localhost:3000/api/caption'; // Replace with your Node.js server endpoint
    const data = {"caption": caption}; //get the capition 

    try {
        // Make the POST request
        const response = await fetch(url, {
            method: 'POST', // Use POST method
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
            },
            body: JSON.stringify(data), // Convert data to JSON string
        });

        // Handle non-200 HTTP statuses
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const result = await response.json();
        console.log("Server Response:", result);
        // test = result;
       //result will be b4 image 
          // img.src = `data:image/png;base64, `; 
        let img = document.createElement("img");
        img.src = result.url
        document.querySelector("#ai-image").append(img);

    } catch (error) {
        // Handle errors
        console.error("Error during POST request:", error.message);
    }
}


