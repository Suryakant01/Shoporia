# Shoporia: A Full-Stack E-Commerce Application

Shoporia is a modern, full-stack e-commerce web application designed to provide a seamless online shopping experience. It features a sleek, responsive frontend built with **React** and a robust, high-performance backend powered by **Go (Golang)**.

This project demonstrates core e-commerce functionalities, from user authentication to order processing, all packaged in a clean and intuitive user interface.

## ✨ Features

*   **User Authentication**: Secure sign-up and login functionality using JWT (JSON Web Tokens).
*   **Product Catalog**: Browse a list of all available products with a clean, modern interface.
*   **Product Search**: Easily find products with a real-time search bar.
*   **Shopping Cart**: Add items to your cart, view its contents, and remove items. The cart count updates in real-time across the application.
*   **Simple Checkout**: Convert your cart into an order with a single click.
*   **Order History**: Review all your past orders, complete with item details, quantities, and dates.
*   **Responsive Design**: A fully responsive layout that works beautifully on desktops, tablets, and mobile devices, thanks to Tailwind CSS.

## 🛠️ Tech Stack

The project is divided into two main parts: a frontend client and a backend server.

#### Frontend (Client)
*   **Framework**: **React** (with Vite for a fast development experience)
*   **Routing**: **React Router**
*   **Styling**: **Tailwind CSS**
*   **API Communication**: **Axios**
*   **Notifications**: **React Hot Toast**

#### Backend (Server)
*   **Language**: **Go (Golang)**
*   **Web Framework**: **Gin**
*   **ORM**: **GORM**
*   **Database**: **SQLite** (for simplicity and easy setup)
*   **Authentication**: **JWT (JSON Web Tokens)**

## 🚀 Getting Started

To get the application running on your local machine, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) and npm (or another package manager like Yarn/pnpm)
*   [Go](https://go.dev/doc/install) (version 1.24 or newer recommended)

### 1. Run the Backend Server

First, let's get the Go server up and running.

```bash
# 1. Navigate to the server directory
cd server

# 2. Install the required Go modules
go mod tidy

# 3. Run the server
go run .

# The backend API will now be running on http://localhost:8080
```

### 2. Run the Frontend Client

Now, let's start the React application in a **new terminal window**.

```bash
# 1. Navigate to the client directory
cd client

# 2. Install the necessary npm packages
npm install

# 3. Run the development server
npm run dev

# The frontend will be accessible at http://localhost:5173 (or another port if 5173 is in use)
```

### 3. Explore the App!

You're all set! Open your browser to the frontend URL.
1.  Create an account on the "Sign up" page.
2.  Log in with your new credentials.
3.  Start shopping, add items to your cart, and place an order
