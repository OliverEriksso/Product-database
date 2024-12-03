import request from "supertest";
import mongoose from "mongoose";

import { mongoKey } from "./server.js";
import app from "./app.js";
import Product from "./models/productmodel.js";

let server;

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
                    "category": "default category2",
                },
                { 	
                    "name": "default name3",
                    "description": "default desc3",
                    "price": 3,
                    "quantity": 3,
                    "category": "default category3",
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
    test("GET /api/products should return an array of products", async function() {
        const response = await request(app).get("/api/products");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    test("GET /api/products/:id should return a product based off ID", async function() {
        const response = await request(app).post("/api/products").send({
            name: "Testing4",
            description: "Testing45",
            price: 45,
            quantity: 45,
            category: "Testing categ"
        });
        expect(response.status).toBe(201);
        const productId = response.body._id;

        const responseTwo = await request(app).get(`/api/products/${productId}`)
        expect(responseTwo.status).toBe(200);
        expect(responseTwo.body.name).toBe("Testing4");
        expect(Array.isArray(responseTwo.body)).toBe(false); 
    });
    // test("GET /api/products/?name=.. should return search query", async function() { //not done
    //     const response = await request(httpServer).get("/api/products?name=ps");
    // })
    // test("POST /api/products should post a new product", async function() { //not done
    //     const newProduct = { name: "heyhey", description: "hey3", price: 666, quantity: 99, category: "heyhey", };

    //     const response = await request(httpServer).post("/api/products").send(newProduct);
    //     expect(response.status).toBe(200);
    //     expect(response.body.name).toBe(newProduct.name);

    //     const verifyData = await Product.findById(response.body._id);
    //     expect(verifyData).not.toBeNull();
    //     expect(verifyData.name).toBe(newProduct.name);
    // })
    // test("DELETE /api/products/:id should delete a product based off ID", async function() { 
    //     const newProduct = { name: "Test Product6", description: "Test6", price: 109, quantity: 6, category: "Test6", }
    //     const response = await request(httpServer).post("/api/products").send(newProduct);
    //     expect(response.status).toBe(200);
    //     const productId = response.body._id;

    //     const deleteProd = await request(httpServer).delete(`/api/products/${productId}`);
    //     expect(deleteProd.status).toBe(200);

    //     const deleteConfirm = await request(httpServer).get(`/api/products/${productId}`);
    //     expect(deleteConfirm.status).toBe(404);
    // })
    // test("DELETE /api/products should delete all products", async function() {
    //     await Product.create([
    //         { name: "Test Product4", description: "Test4", price: 106, quantity: 4, category: "Test4" },
    //         { name: "Test Product5", description: "Test5", price: 107, quantity: 5, category: "Test5" }
    //     ]);
    //     const deleteProds = await request(httpServer).delete("/api/products");
    //     expect(deleteProds.status).toBe(200);

    //     const deleteConfirm = await Product.find({});
    //     expect(deleteConfirm.length).toBe(0);
    // })
})