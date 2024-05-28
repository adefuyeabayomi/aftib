# Aftib-site-back-end
This is an API documentation of Aftib. This backend project is created with express and mongoose. 

To get the project up and running, navigate to the root directory and install the depedencies by running npm install in the terminal
```bash
npm install
```
The project can be run in two modes: development mode and production mode.

Development Mode
```bash
npm run dev
```

Production Mode
```bash
npm run start
```

## Testing
The project's test covers integration tests. The testing utilizes Jest and Supertest to run tests. To start the testing, use the command: 

```bash
npm run test
```

## Authentications API
### Usage Guide
The authentication the Login and Signup. 

After getting the server running[dev], it would be running on port 8080, then you can utilize auth utilities.

Signup
```bash
curl -X POST http://localhost:8080/auth/signup \
-H "Content-Type: application/json" \
-d '{"email": "your_email_value", "password": "your_password_value"}'
```

Login
```bash
curl -X POST http://localhost:8080/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "your_email_value", "password": "your_password_value"}'
```
Response if successful 
```bash
response {token: 'tokenString'}
```

Response if there is an error  
```bash
response {error: 'errorMessage'}
```


