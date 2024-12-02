import request from "supertest";

import httpServer from "./server.js";

import mongoose from "mongoose";


describe("API tests", function() {
    test("GET /api/products should return an array of products", async function() {
        const response = await request(httpServer).get("/api/products");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    test("GET /api/products/:id should return a product based off ID", async function() {
        const response = await request(httpServer).get(`/api/products/674c0f5bad38f1c94e59daf1`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(false); //not done
    });
    test("GET /api/products/?name=.. should return search query", async function() { //not done
        const response = await request(httpServer).get("/api/products?name=ps");
    })
    test("POST /api/products should post a new product", async function() { //not done

    })
    test("DELETE /api/products/:id should delete a product based off ID", async function() { //not done?
        const fakeProd = { name: "Test", price: 1 };
        const response = await request(httpServer).post("/api/products/").send(fakeProd);
        const fakeProdId = response.body._id;
        expect(response.status).toBe(200);

        const deleteProd = await request(httpServer).delete(`/api/products/${fakeProdId}`);
        expect(deleteProd.status).toBe(200);

        const deleteConfirm = await request(httpServer).get(`/api/products/${fakeProdId}`);
        expect(deleteConfirm.status).toBe(404);
    })
    test("DELETE /api/products should delete all products", async function() {
        const response = await request(httpServer).get("/api/products");
        expect(response.status).toBe(200);

        const deleteProds = await request(httpServer).delete("/api/products");
        expect(deleteProds.status).toBe(200);

        const deleteConfirm = await request(httpServer).get("/api/products");
        expect(deleteConfirm.status).toBe(200);
        expect(deleteConfirm.body).toEqual([]);

    })
    afterAll(function() {
        mongoose.connection.close();
        httpServer.close();
    });
})