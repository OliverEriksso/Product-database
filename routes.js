import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();
const mongoKey = process.env.MONGO_URI;

mongoose.connect(mongoKey)
    .then(() => console.log("connected to MongoDB"))
    .catch(err => console.error("Failed to conect to MongoDB", err));

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
});

const router = express.Router();

const Product = mongoose.model("Product", productSchema)


router.get("/products", async function (req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    }
    catch {
        res.status(500).send("Server ERror");
    }
});

router.get("/products/:id", async function (req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("Not found!");
        }
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});

router.get("/product", async function (req, res) {
    const { name } = req.query; 
    console.log("name:", name);

    try {
        const products = await Product.find();

        let filteredProducts = products;
        if (name) {
            filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(name.toLowerCase())
            );
        }
        res.json(filteredProducts);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send("server error");
    }
});

router.post("/products", async function (req, res) {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json(product);
    }
    catch (error) {
        res.status(400).send("Bad request");
    }
});

router.put("/products/:id", async function (req, res) {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("Product not found")
        }
    }
    catch (error) {
        res.status(500).send("server error")
    }
});

router.delete("/products/:id", async function (req, res) {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (result) {
            res.send("Removed successfully!");
        } else {
            res.status(404).send("Not found")
        }
    }
    catch (error) {
        res.status(500).send("Server error");
    }
});

router.delete("/products", async function (req, res) {
    try {
        await Product.deleteMany({});
        res.send("All products deleted!")
    }
    catch (error) {
        res.status(500).send("server error");
    }
});

export default router;