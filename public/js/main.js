//global variables, used by all js files
let btn;
let centerX, centerY, captureWidth, captureHeight;
let canvas, ctx; //canvas and context
let video;
let caption; //global to hold the caption bro
let status, processEl, captionEl;
let count = 0; //for the animation, wish this wasn't a global though

window.onload = () => {
  console.log("Page loaded");

  //get the upload button
  btn = document.querySelector("#upload");
  resetBtn = document.querySelector("#reset");
  // btn.classList.add("hide");

  //add event listener to the button
  btn.addEventListener("click", generate);
  resetBtn.addEventListener("click", reset);

  status = document.querySelector("#status");
  processEl = document.querySelector("#process");
  captionEl = document.querySelector("#caption");

  canvas = document.getElementById("video_canvas");
  ctx = canvas.getContext("2d");
  video = document.getElementById("video1");

  document.addEventListener("keyup", (t) =>  {
    if(t.key == "d"){
      document.querySelector("#video-container").classList.toggle("hide");
      console.log("toggle debug");
    }
  });

  run(); //start the face detection bizness
};

async function generate() {
  //change the button to loading
  btn.classList.add("hide");
  
  console.log("getting a caption");
  // process.innerText = "Analyzing..."
  
  var processInterval = setInterval(ellipsis, 500, processEl, "Analyzing");
  //show the actual person?
  let image = prepareImage(); //this grabs the image from the hidden canvas element
  //show the image
  let img = document.createElement("img");
  img.src = image.image;
  document.querySelector("#human-image").append(img);


  let caption = await postImage(image);

  clearInterval(processInterval); //kill caption interval 

  captionEl.innerText = caption; 
  
  // processEl.innerHTML = "Generating an image..."
  count = 0; //reset the count dots
  processInterval = setInterval(ellipsis, 500, processEl, "Generating");


  //once you have the caption display it to the screen
  console.log("getting an image...");
  //get the image
  let url = await postCaption(caption);
  clearInterval(processInterval); //kill caption interval 
  processEl.innerHTML = "Done!"
  // debugger;
    
  img = document.createElement("img");
  img.src = url
  document.querySelector("#ai-image").append(img);

  //wait a few seconds, then dispaly the button again
    // btn.classList.remove("hide");
  setTimeout(()=> {
    resetBtn.classList.remove("hide") 
  }, 3000)
}

// var interval = setInterval(ellipsis, 500, el, baseword);

// clearInterval(refreshIntervalId);

function ellipsis(element, base) {
  let text = base;

  for(let i = 0; i < count; i++){
    text+="."
  }

  if(count == 3){
    count = 0;
  } else {
    count++;
  }

  element.innerText = text;
  // document.title = text; //haha
}


//reset fucntion?
function reset(){
  console.log("reseting");
  //hide the reset button
  resetBtn.classList.add("hide");
  //unhide the capture button
  btn.classList.remove("hide");
  //clear the contentes of human-img, ai-img, caption, and process
  captionEl.innerText = "";
  processEl.innerText = "";
  
  document.querySelector("#ai-image").innerHTML = "";
  document.querySelector("#human-image").innerHTML = "";
}
//save function?
