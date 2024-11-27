import { getCaption, getImage } from '../services/ai.js';
//import model for db?

//interface with the ai services
export const generateCaption = async (req, res) => {
  let data = await getCaption(req.body.image);//takes in a b64 image
  res.json({ success: true, caption: data });
};

export const generateImage = async (req, res) => {
  let data = await getImage(req.body.caption);
  res.json({ success: true, url:`data:image/png;base64, ${data}`});
}

//get all the saved images from the db

//save an image to the db


