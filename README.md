# SaleMedicine POS System

This is a full-stack Point of Sale (POS) system designed to manage products, customers, and sales invoices. It consists of a NestJS backend with a MongoDB database and a ReactJS frontend.

## Table of Contents

1.  [Features](#features)
2.  [Technologies](#technologies)
3.  [Setup and Installation](#setup-and-installation)
    *   [Backend Setup](#backend-setup)
    *   [Frontend Setup](#frontend-setup)
4.  [Running the Application](#running-the-application)
5.  [API Documentation](#api-documentation)
6.  [Usage](#usage)

## Features

*   **Product Management**: CRUD operations for products (code, name, price, unit, stock, warning threshold).
*   **Stock Management**: Import (add stock) and Export (deduct stock) functionality for products.
*   **Customer Management**: CRUD operations for customers (code, full name, phone, email, address).
*   **Invoice Management**: Create sales invoices with selected products, quantities, and total amount.
*   **Authentication**: JWT-based authentication for securing API endpoints.
*   **Intuitive UI**: A clean and responsive user interface for managing POS operations.
*   **Protected Routes**: Ensures only authenticated users can access core application features.

## Technologies

### Backend

*   **Framework**: NestJS (TypeScript)
*   **Database**: MongoDB (via TypeORM)
*   **ORM**: TypeORM
*   **Authentication**: JWT (JSON Web Tokens)
*   **API Documentation**: Swagger
*   **Validation**: Class-validator, Class-transformer

### Frontend

*   **Framework**: ReactJS (TypeScript)
*   **Build Tool**: Vite
*   **Styling**: TailwindCSS
*   **HTTP Client**: Axios
*   **Routing**: React Router DOM
*   **State Management**: Zustand
*   **UI Components**: React Modal

## Setup and Installation

### Prerequisites

*   Node.js (LTS version)
*   MongoDB instance (e.g., a free cluster on MongoDB Atlas)

### 1. Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Create `.env` file**:
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
    ```bash
    npm install
    ```

### 2. Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

## Running the Application

1.  **Start the Backend**:
    Open a new terminal, navigate to the `backend` directory, and run:
    ```bash
    cd backend
    npm run start:dev
    ```
    The backend will run on `http://localhost:3000`.

2.  **Start the Frontend**:
    Open another new terminal, navigate to the `frontend` directory, and run:
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will typically run on `http://localhost:5173` (or another available port).

## API Documentation

Once the backend is running, you can access the interactive Swagger UI for API documentation at:
`http://localhost:3000/api/docs`

## Usage

1.  **Access the Frontend**: Open your web browser and go to the frontend URL (e.g., `http://localhost:5173`).
2.  **Login**: Use the default credentials to log in:
    *   **Username**: `admin`
    *   **Password**: `admin`
    (These are configured in `backend/src/modules/auth/auth.service.ts` for development purposes).
3.  **Navigate**: Use the sidebar to access different sections:
    *   **Dashboard**: Overview.
    *   **Products**: Manage product inventory, add/edit/delete products, import/export stock.
    *   **Customers**: Manage customer information, add/edit/delete customers.
    *   **Sales / Invoices**: Create new sales transactions, add products to a cart, and generate invoices.
4.  **Logout**: Click the "Logout" button in the sidebar to end your session.