import express from 'express';
import { addContact, showContact } from '../controllers/contactController.js';

const contactRouter = express.Router();

contactRouter.post('/addContact', addContact);
contactRouter.get('/showContact', showContact);

export default contactRouter;