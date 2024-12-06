import request from "supertest";
import mongoose from "mongoose";

import mongoKey from "./config.js"
import app from "./app.js";
import Product from "./models/productmodel.js";


describe("API tests", function() {
    beforeEach(async function() { 
        try {
            await mongoose.connect(mongoKey)
            await Product.insertMany([
                { 	
                    "name": "default name",
                    "description": "default desc",
                    "price": 1,
                    "quantity": 1,
                    "category": "default category",
                },
                { 	
                    "name": "default name2",
                    "description": "default desc2",
                    "price": 2,
                    "quantity": 2,
                    "category": "default category",
                },
                { 	
                    "name": "default name kw",
                    "description": "default desc3",
                    "price": 3,
                    "quantity": 3,
                    "category": "default category",
                }
            ])
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    })
    afterEach(async function() {
        try {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        } catch (error) {
            console.error(error);
        }
    });
    afterAll(async () => {
        try {
            await mongoose.connection.close(); 
        } catch (error) {
            console.error("Error closing the DB/Server", error);
        }
    });
    test("GET /api/products should return an array of products", async function() {
        const response = await request(app).get("/api/products");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    test("GET /api/products/:id should return a product based off ID", async function() {
        const getTestProd = await Product.findOne({ "name": "default name" }) 
        expect(getTestProd).toBeDefined();
        expect(getTestProd.name).toBe("default name");
        const productId = getTestProd._id;

        const responseTwo = await request(app).get(`/api/products/${productId}`)
        expect(responseTwo.status).toBe(200);
        expect(responseTwo.body.name).toBe("default name");
        expect(Array.isArray(responseTwo.body)).toBe(false); 
    });
    test("GET /api/products/?name=.. should return search query", async function() {
        const response = await request(app).get("/api/product?name=kw");
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toMatch("kw");
    });
    test("POST /api/products should post a new product", async function() { 
        const newProduct = { name: "heyhey", description: "hey3", price: 666, quantity: 99, category: "heyhey", };
        const response = await request(app).post("/api/products").send(newProduct);
        expect(response.status).toBe(201);
        const id = response.body._id;

        const verifyProduct = await request(app).get(`/api/products/${id}`)
        expect(verifyProduct.status).toBe(200);
        expect(verifyProduct.body.name).toBe(newProduct.name);
    });
    test("PUT /api/products/:id should update existing product", async function() {
        const testProduct = await Product.findOne({ name: "default name" });
        const updateData = { name: "Testing" };

        const response = await request(app).put(`/api/products/${testProduct._id}`).send(updateData);
        expect(response.status).toBe(200);

        const responseTwo = await request(app).get(`/api/products/${testProduct._id}`);
        expect(responseTwo.body.name).toBe("Testing");
    });
    test("DELETE /api/products/:id should delete a product based off ID", async function() {
        const getTestProd = await Product.findOne({ "name": "default name2" });
        expect(getTestProd.name).toBe("default name2");
        const productId = getTestProd._id;

        const deleteProd = await request(app).delete(`/api/products/${productId}`);
        expect(deleteProd.status).toBe(200);

        const deleteConfirm = await request(app).get(`/api/products/${productId}`);
        expect(deleteConfirm.status).toBe(404);
    });
    test("DELETE /api/products should delete all products", async function() {
        const deleteProds = await request(app).delete("/api/products");
        expect(deleteProds.status).toBe(200);

        const deleteConfirm = await Product.find({});
        expect(deleteConfirm.length).toBe(0);
    });
})