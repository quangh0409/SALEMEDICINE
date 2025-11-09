# Frontend (ReactJS + TypeScript)

This is the frontend application for the SaleMedicine POS system, built with ReactJS, TypeScript, and TailwindCSS.

## Features

-   **User Authentication**: Login functionality with JWT.
-   **Dashboard**: A simple dashboard.
-   **Product Management**: View, add, edit, delete, import, and export products.
-   **Customer Management**: View, add, edit, and delete customers.
-   **Sales/Invoice Creation**: Create new sales invoices by selecting customers and adding products to a cart.
-   **Protected Routes**: Ensures only authenticated users can access the main application.

## Technologies

-   ReactJS (TypeScript)
-   Vite (build tool)
-   TailwindCSS (for styling)
-   Axios (HTTP client)
-   React Router DOM (for routing)
-   Zustand (for state management)
-   React Modal (for modals)

## Setup

1.  **Prerequisites**:
    *   Node.js (LTS version)

2.  **Install Dependencies**:
    Navigate to the `frontend` directory and install the dependencies:

    ```bash
    cd frontend
    npm install
    ```

3.  **Run the Application**:
    To start the development server:

    ```bash
    npm run dev
    ```

    The application will be running at `http://localhost:5173` (or another port if 5173 is in use).

## Configuration

The API base URL is configured in `frontend/src/api/axiosClient.ts`. Ensure it points to your running backend instance:

```typescript
const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Base URL for your NestJS backend
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Usage

1.  **Login**: Access the application and log in using the credentials (default: `username: admin`, `password: admin`).
2.  **Navigation**: Use the sidebar to navigate between Dashboard, Products, Customers, and Sales/Invoices.
3.  **Product Management**: On the Products page, you can add new products, edit existing ones, delete them, or import/export stock using the respective buttons.
4.  **Customer Management**: On the Customers page, you can add new customers, edit existing ones, or delete them.
5.  **Sales**: On the Sales page, you can create new invoices by selecting a customer, adding products to the cart, and then creating the invoice.