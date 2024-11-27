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
  btn.addEventListener("click", generate);

  canvas = document.getElementById("video_canvas");
  ctx = canvas.getContext("2d");
  video = document.getElementById("video1");

  run(); //start the face detection bizness
};


async function generate() {
  //change the button to loading
  console.log("getting a caption");
  let caption = await postImage();

  //once you have the caption display it to the screen
  
  console.log("getting an image");
  //get the image
  let url = await postCaption(caption);

  let img = document.createElement("img");
  img.src = url
  document.querySelector("#ai-image").append(img);

}


