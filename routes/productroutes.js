import { Router } from "express";
import Product from "../models/productmodel.js";

const router = new Router();


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
            res.status(200).json(product);
        } else {
            res.status(404).send("Not found");
        }
    }
    catch (error) {
        res.status(500).send({ error: "Server error" });
    }
});

router.get("/product", async function (req, res) {
    const { name } = req.query; 
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
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).send("Bad request");
    }
});

router.put("/products/:id", async function (req, res) {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (product) {
            res.status(200).json(product);
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