# Backend (NestJS + MongoDB)

This is the backend application for the SaleMedicine POS system, built with NestJS, TypeScript, and TypeORM for MongoDB.

## Features

-   **Product Management**: CRUD operations for products, including stock import and export.
-   **Customer Management**: CRUD operations for customers.
-   **Invoice Management**: Create sales invoices, with product details and total calculation.
-   **Authentication**: JWT-based authentication for securing API endpoints.
-   **API Documentation**: Swagger UI for easy API exploration and testing.

## Technologies

-   NestJS (TypeScript)
-   TypeORM
-   MongoDB
-   JWT for Authentication
-   Swagger for API Documentation
-   Class-validator, Class-transformer for DTO validation

## Setup

1.  **Prerequisites**:
    *   Node.js (LTS version)
    *   MongoDB instance (e.g., a free cluster on MongoDB Atlas)

2.  **Environment Variables**:
    Create a `.env` file in the `backend` directory with the following content:

    ```
    # MongoDB Database
    DB_URL=mongodb+srv://<username>:<password>@<your-cluster-url>/<database-name>?retryWrites=true&w=majority
    DB_NAME=SaleMedicine

    # JWT
    JWT_SECRET=your_super_secret_key
    JWT_EXPIRATION=3600s
    ```

    *Replace `<username>`, `<password>`, `<your-cluster-url>`, and `<database-name>` with your actual MongoDB connection details. For `JWT_SECRET`, use a strong, unique secret key.*

3.  **Install Dependencies**:
    Navigate to the `backend` directory and install the dependencies:

    ```bash
    cd backend
    npm install
    ```

4.  **Run the Application**:
    To start the development server:

    ```bash
    npm run start:dev
    ```

    The application will be running at `http://localhost:3000`.

## API Documentation (Swagger)

Once the backend is running, you can access the Swagger UI for API documentation and testing at:

`http://localhost:3000/api/docs`

## API Endpoints

### Authentication

-   `POST /auth/login`: Authenticate and get a JWT token.

### Products

-   `GET /products`: Get all products.
-   `GET /products/low-stock`: Get products below warning threshold.
-   `GET /products/:id`: Get a product by ID.
-   `POST /products`: Create a new product.
-   `POST /products/import`: Import (add stock) to products.
-   `POST /products/export`: Export (deduct stock) from products.
-   `PUT /products/:id`: Update a product.
-   `DELETE /products/:id`: Delete a product.

### Customers

-   `GET /customers`: Get all customers.
-   `GET /customers/:id`: Get a customer by ID.
-   `POST /customers`: Create a new customer.
-   `PUT /customers/:id`: Update a customer.
-   `DELETE /customers/:id`: Delete a customer.

### Invoices

-   `GET /invoices`: Get all invoices.
-   `GET /invoices/:id`: Get an invoice by ID.
-   `POST /invoices`: Create a new invoice.
-   `POST /invoices/:id/print`: Print an invoice (currently returns JSON).

## Testing APIs with Postman/Swagger

1.  **Get a Token**: Use the `/auth/login` endpoint with `username: admin` and `password: admin` (as configured in `auth.service.ts` for development) to get an `accessToken`.
2.  **Authorize Requests**: In Swagger UI, click on the "Authorize" button and paste the `accessToken` into the "Bearer" field. For Postman, add an `Authorization` header with value `Bearer <your_access_token>`.
3.  **Make Requests**: You can now test the protected endpoints.

## Running Tests

To run the unit tests, navigate to the `backend` directory and execute:

```bash
npm run test
```
