import dotenv from 'dotenv';
import OpenAI from 'openai'; // Import default

// Load environment variables
dotenv.config();

// OpenAI Configuration
const openai = new OpenAI({
  organization: process.env.ORGANIZATION,
  project: process.env.PROJECT,
  apiKey: process.env.OPENAI_API_KEY,
});

//do all your logic here?

const getImage = async (prompt) => {
  //get a dall-e image
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
    style: "vivid"
  })
   
  // console.log(image);
  console.log(image); 
  return image.data[0].b64_json; 
};

const getCaption = async (img) => {
  // async function main() {
  console.log("getting caption");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Describe what you see in this photo. Be as specific as possible. If there is a person describe what they look like, including their preceived gender, age and race." },
          {
            type: "image_url",
            image_url: {
              // "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
              "url": img,
              //will accept a base64 string!
            },
          }
        ],
      },
    ],
  });

  console.log(response.choices[0]);
  return response.choices[0].message.content;
}

// export const getCaption = async (img) => {
//     const msg = await main(img);
//     console.log("sending message");
//     return msg;
// };

//process request
// take image data
// get a catpion for that image data
// get an image from the caption
// return the image to the user? base64?

export const processImage = async (img) => {
  let caption = await getCaption(img);
  let image = await getImage(caption);
  return image; //image is a b64 string only
};

