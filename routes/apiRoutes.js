import express from 'express';
import { generateCaption, generateImage } from '../controllers/apiController.js';

const router = express.Router();

// API routese
// router.get('/data', getData);

router.post('/image', generateCaption); //when you get an image, generate a caption 
router.post('/caption', generateImage); //when you get a caption, gnerate an image 

export default router;
