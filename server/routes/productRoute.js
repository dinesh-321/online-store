import express from 'express';
import { addProduct, changeStock, productById, productList ,deleteProduct,productByBarcode,updateProduct,getSingleProduct } from '../controllers/productController.js';
import {upload} from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import multer from "multer";

const productRouter = express.Router();

productRouter.post('/add', upload.array(['images']), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);
// Get product by Barcode (RESTful)
productRouter.get('/scan-barcode/:barcode', productByBarcode);
productRouter.delete("/:id", deleteProduct);
// GET single product
productRouter.get("/:id", getSingleProduct);

// PUT update product
productRouter.put("/update/:id", upload.array("images", 4), updateProduct);


export default productRouter;

