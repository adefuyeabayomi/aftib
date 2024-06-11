require('dotenv').config
const supertest = require('supertest')
const app = require('../server')
const request = supertest(app)
const User = require('../models/auth')
const connectDB = require('../utils/dbConnect')

const correctUserData = {
    email: "userrrr@exhhample.com",
    password: "StrongP@ssw0rd",
    signupType: "emailAndPassword",
    mobileNumber: "1234567890",
    name: "John Doe",
    accountType: "agent"
}

const incorrectUserData = {
    email: "userexample.com",
    password: "short",
    signupType: "emailAndPassword",
    mobileNumber: "123",
    name: "Joe Mama"
}

const existingUserData = {
    email: "existinguser@example.com",
    password: "ExistingP@ssw0rd",
    signupType: "emailAndPassword",
    mobileNumber: "9876543210",
    name: "Jane Doe"
}


describe("AUTHENTICATION ENDPOINTS",()=>{
    // BEFORE
    beforeEach(async () => {
        await connectDB(); // Ensure the database is connected before running tests
    })

    // TEST SIGNUP
    describe('POST /auth/signup', () => {
        it('should sign up a user with correct input', async () => {
            const response = await request
                .post('/auth/signup')
                .send(correctUserData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
        })

        it('should not sign up a user with incorrect input', async () => {
            const response = await request
                .post('/auth/signup')
                .send(incorrectUserData);
            expect(response.status).toBe(400);
        })

        it('should not sign up a user that already exists', async () => {
            // First, create the user
            await request
                .post('/auth/signup')
                .send(existingUserData)

            // Try to sign up the same user again
            const response = await request
                .post('/auth/signup')
                .send(existingUserData)
            expect(response.status).toBe(409)
            expect(response.body).toHaveProperty('message', 'Conflict');
        })
    })


    // TEST LOGIN
    describe('POST /auth/login', () => {
        it('should log in a user with correct credentials', async () => {
            // Ensure the user exists
            await request
                .post('/auth/signup')
                .send(correctUserData);

            const response = await request
                .post('/auth/login')
                .send({
                    email: correctUserData.email,
                    password: correctUserData.password
                });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should not log in a user with incorrect credentials', async () => {
            const response = await request
                .post('/auth/login')
                .send({
                    email: correctUserData.email,
                    password: 'wrongpassword'
                });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Password does not match.');
        })

        it('should not log in a non-existent user', async () => {
            const response = await request
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'SomePassword123'
                });
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Email has not been Registered.');
        });
    });
})