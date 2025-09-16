const request = require("supertest");
const express = require("express");
const salesRoutes = require("../src/routes/sales");

const app = express();
app.use(express.json());
app.use("/sales", salesRoutes);

describe("Sales API", () => {
  it("should queue a sale", async () => {
    const res = await request(app)
      .post("/sales")
      .send({ product: "Coffee", quantity: 2, price: 3.5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("queued");
  });
});
