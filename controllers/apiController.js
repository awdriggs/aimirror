import { processImage } from '../services/ai.js';
//import model for db?

//interface with the ai services
//gets an image
export const postImage = async (req, res) => {
    let data = await processImage(req.body.image);//takes in a b64 image 
    //api returns a b64 string, send it back to the user
    res.json({ success: true, url:`data:image/png;base64, ${data}`});
};

//get all the saved images from the db

//save an image to the db


