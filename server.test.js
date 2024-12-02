import request from "supertest";

import httpServer from "./server.js";

import mongoose from "mongoose";

import { Product, mongoKey } from "./routes.js";

describe("API tests", function() {
    beforeAll(async function() { //before everything, connect to mongoose
        await mongoose.connect(mongoKey, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    })
    afterAll(async function() { //after everything delete temporary products and close connections
        await Product.deleteMany({});
        mongoose.connection.close();
        httpServer.close();
    });
    test("GET /api/products should return an array of products", async function() {
        await Product.create([
            { name: "Test Product", description: "Test", price: 100, quantity: 5, category: "Test", },
            { name: "Test Product2", description: "Test2", price: 102, quantity: 2, category: "Test2" }
        ])
        const response = await request(httpServer).get("/api/products");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    test("GET /api/products/:id should return a product based off ID", async function() {
        const newProduct = { name: "Test Product3", description: "Test3", price: 103, quantity: 3, category: "Test3" };
        const response = await request(httpServer).post("/api/products").send(newProduct);
        expect(response.status).toBe(200);

        const productId = response.body._id;
        const responseTwo = await request(httpServer).get(`/api/products/${productId}`)
        expect(responseTwo.status).toBe(200);
        expect(response.body.name).toBe(newProduct.name);
        expect(Array.isArray(responseTwo.body)).toBe(false); 
    });
    test("GET /api/products/?name=.. should return search query", async function() { //not done
        const response = await request(httpServer).get("/api/products?name=ps");
    })
    test("POST /api/products should post a new product", async function() { //not done
        const newProduct = { name: "heyhey", description: "hey3", price: 666, quantity: 99, category: "heyhey" };

        const response = await request(httpServer).post("/api/products").send(newProduct);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(newProduct.name);

        const verifyDatab = await Product.findById(response.body._id);
        expect(verifyDatab).not.toBeNull();
        expect(verifyDatab.name).toBe(newProduct.name);
    })
    test("DELETE /api/products/:id should delete a product based off ID", async function() { 
        const product = await Product.create({ name: "Test Product6", description: "Test6", price: 109, quantity: 6, category: "Test6", })
        const response = await request(httpServer).post("/api/products").send({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
        });
        expect(response.status).toBe(200);

        const deleteProd = await request(httpServer).delete(`/api/products/${product._id}`);
        expect(deleteProd.status).toBe(200);

        const deleteConfirm = await request(httpServer).get(`/api/products/${product._id}`);
        expect(deleteConfirm.status).toBe(404);
    })
    test("DELETE /api/products should delete all products", async function() {
        await Product.create([
            { name: "Test Product4", description: "Test4", price: 106, quantity: 4, category: "Test4", },
            { name: "Test Product5", description: "Test5", price: 107, quantity: 5, category: "Test5" }
        ])
        const deleteProds = await request(httpServer).delete("/api/products");
        expect(deleteProds.status).toBe(200);

        const deleteConfirm = await Product.find({});
        expect(deleteConfirm.length).toBe(0);
    })
})