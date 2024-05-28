require("dotenv").config()
let supertest = require("supertest")
let mockModel = require("../models/mock")
let app = require("../server")
let request = supertest(app)

beforeEach(
    async () => {
        console.log("test initialized");
    }
)

test("testing the mock route",async ()=>{
    let res = await request.get("/").expect(200)
    expect(res).toBe([])
})