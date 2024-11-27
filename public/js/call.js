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
        return result.caption; 
          // img.src = `data:image/png;base64, `; 
        // let img = document.createElement("img");
        // img.src = result.url
        // document.querySelector("body").append(img);

    } catch (error) {
        // Handle errors
        console.error("Error during POST request:", error.message);
    }
}


async function postCaption(caption) {
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
        return result.url;

    } catch (error) {
        // Handle errors
        console.error("Error during POST request:", error.message);
    }
}

