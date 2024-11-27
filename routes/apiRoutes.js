import express from 'express';
import { postImage } from '../controllers/apiController.js';

const router = express.Router();

// API routese
// router.get('/data', getData);

router.post('/data', postImage); 

export default router;
