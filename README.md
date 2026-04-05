# 🚀 LogiEdge Billing Dashboard

A full-stack billing and invoice management system built using **React, Node.js, Express, and PostgreSQL**.
This application allows users to manage customers, items, generate invoices with GST logic, and view billing history through a dashboard.

---

## 📌 Features

### 🟢 Master Module

* Add and manage customers
* Add and manage items
* View customers and items in card-based UI

### 🟡 Billing Module

* Select customer and items
* Add items with quantity to cart
* Automatic price calculation
* GST logic:

  * If customer has GST → No GST applied
  * If customer does not have GST → 18% GST applied
* Generate invoice with unique Invoice ID

### 🔵 Invoice System

* Unique Invoice ID (Format: `INVC123456`)
* Stores invoice data in PostgreSQL
* Stores item-wise billing details

### 🟣 Dashboard Module

* View all generated invoices
* Search invoice by Invoice ID
* Display customer-wise invoice details

### 📄 PDF Feature

* Download invoice as PDF
* Includes:

  * Invoice ID
  * Customer details
  * Items list
  * GST & Total

---

## 🧱 Tech Stack

### Frontend

* React JS (Create React App)
* Axios
* React Router DOM
* React Icons
* HTML/CSS

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Additional Libraries

* jsPDF (PDF generation)
* html2canvas (UI capture)

---

## 📁 Project Structure

```
project-root/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│
├── backend/
│   ├── db.js
│   ├── index.js
│   └── routes/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone Repository

```
git clone https://github.com/your-username/logiedge-billing-dashboard.git
cd logiedge-billing-dashboard
```

---

### 🔹 2. Setup Backend

```
cd backend
npm install
node index.js
```

👉 Server runs on:

```
http://localhost:5000
```

---

### 🔹 3. Setup Frontend

```
cd frontend
npm install
npm start
```

👉 App runs on:

```
http://localhost:3000
```

---

### 🔹 4. Setup PostgreSQL

* Create database: `logiedge_db`
* Create required tables:

  * customers
  * items
  * invoices
  * invoice_items

---

## 🧠 Business Logic

### GST Rule

```
IF customer has GST AND is active:
    → No GST applied
ELSE:
    → Apply 18% GST
```

---

### Invoice ID Generation

```
INVC + 6 digit random number
Example: INVC482193
```

Ensures uniqueness using database validation.

---

## 🧪 API Endpoints

### Customers

* GET `/customers`
* POST `/customers`

### Items

* GET `/items`
* POST `/items`

### Invoices

* POST `/invoice/create`
* GET `/invoice/all`
* GET `/invoice/:id`

---

## 🎯 Screens

* Dashboard
* Customer Management
* Item Management
* Billing Page
* Invoice View

---

## 🚀 Future Improvements

* 📊 Analytics Dashboard (Charts)
* 🌙 Dark Mode
* 📱 Mobile Responsiveness
* 🔐 Authentication System
* 📦 Deployment (Render + Vercel)

---

## 🏁 Conclusion

This project demonstrates:

* Full-stack development
* API integration
* Database design
* Real-world business logic implementation

---

## 👨‍💻 Author

**Divyansh Saxena**

B.Tech Student | Full Stack Developer

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
