# Admin Dashboard

A responsive admin dashboard built with React and DummyJSON API.

The application allows users to log in, view and manage products, search and filter products, sort results, view product details, and perform basic CRUD operations.

## Live Demo

https://admin-dashboard-five-neon-66.vercel.app/

## GitHub Repository

Add your GitHub repository URL here.

---

## Demo Credentials

Use the following DummyJSON credentials to log in:

Username:
emilys

Password:
emilyspass

---

## Features

### Authentication

- Login using DummyJSON authentication API
- Protected product routes
- JWT token stored in localStorage
- Logout functionality
- Automatic redirect to login when authentication expires
- Prevents multiple login requests while login is in progress

### Product Management

- View products in a responsive table
- Mobile-friendly product cards
- View product details
- Add a new product
- Edit an existing product
- Delete a product
- Form validation
- Delete confirmation popup

### Search

- Search products using DummyJSON search API
- Debounced search input
- Search state is preserved in the URL
- Pagination resets to page 1 when search changes
- Previous search requests are cancelled to prevent stale results

### Filtering

- Filter products by category
- Categories are loaded dynamically from the API
- Search and category filtering are handled separately because DummyJSON does not provide a combined search + category endpoint for this implementation

### Sorting

Products can be sorted by:

- Price: Low to High
- Price: High to Low
- Rating: Low to High
- Rating: High to Low
- Title: A to Z
- Title: Z to A

### Pagination

- API-based pagination using `limit` and `skip`
- Page sizes:
  - 10
  - 20
  - 50
- Previous and Next buttons
- Page number navigation
- Displays the current range of products

Example:

Showing 21–40 of 194

### URL State

The following product-list state is stored in the URL:

- Page
- Page size
- Search
- Category
- Sort
- Sort order

For example:

/products?page=2&limit=20&search=phone&sort=price&order=asc

This allows the current view to be preserved when refreshing or sharing the URL.

### Error and Loading Handling

The application handles:

- Loading states
- API errors
- Empty results
- Invalid product IDs
- Invalid page numbers
- Invalid page sizes
- Retry functionality

---

## Tech Stack

### Frontend

- React
- React Router
- JavaScript
- CSS
- Axios
- Vite

### API

- DummyJSON API

### Deployment

- Vercel

---
