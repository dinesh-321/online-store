import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';
import fs from "fs";
import path from "path";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files;

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // ✅ Ensure barcode is saved with product
        if (!productData.barcode) {
            return res.json({ success: false, message: "Barcode is required" });
        }

        await Product.create({ ...productData, image: imagesUrl });

        res.json({ success: true, message: 'Product Added' });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get product list : /api/product/list 
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get single Product by ID : /api/product/list/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        res.json({ success: true, product });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get product by Barcode : GET /api/product/scan-barcode/:barcode
export const productByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    if (!barcode) {
      return res.status(400).json({ success: false, message: "Barcode is required" });
    }

    const product = await Product.findOne({ barcode });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product by barcode:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Change product inStock : /api/product/stock 
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock });
        res.json({ success: true, message: 'Stock Updated' });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { productData } = req.body;

    if (!productData) {
      return res.status(400).json({ success: false, message: "Product data missing" });
    }

    const data = JSON.parse(productData);
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // ✅ Update fields
    product.name = data.name;
    product.description = data.description;
    product.price = data.price;
    product.offerPrice = data.offerPrice;
    product.unit = data.unit;
    product.stock = data.stock;
    product.brand = data.brand;
    product.SubCategory = data.SubCategory;
    product.barcode = data.barcode;

    // ✅ Handle images: only append new files
    if (req.files && req.files.length > 0) {
      // Optionally delete old images from server if needed
      // product.image.forEach(imgPath => fs.unlinkSync(path.join(__dirname, "..", imgPath)));
      product.image = req.files.map(f => f.path); // store paths of new images
    }

    await product.save();

    res.json({ success: true, product, message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};