# Expense Tracker Web Application

A full-stack Expense Tracker web application developed using HTML, CSS, JavaScript, PHP and MySQL.

The application allows users to manage their income and expenses, set monthly budgets, view transactions and analyze their financial data through reports and charts.

## Project Status

Completed and tested locally.

## Features

- User Registration
- User Login and Logout
- Session-based Authentication
- Dashboard
- Add, View, Edit and Delete Expenses
- Add, View, Edit and Delete Income
- Transaction Management
- Monthly Budget Management
- Expense and Income Reports
- Expense Category Analysis
- Monthly Expense Analysis
- User Profile
- MySQL Database Integration

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- PHP

### Database
- MySQL

### Development Environment
- Visual Studio Code
- XAMPP / Apache
- MySQL Workbench

### Libraries
- Chart.js

## Project Modules

### 1. Registration
Allows new users to create an account.

### 2. Login
Authenticates users using their email and password.

### 3. Dashboard
Displays total income, total expenses, balance and recent transactions.

### 4. Expense Management
Users can add, view, edit and delete expense records.

### 5. Income Management
Users can add, view, edit and delete income records.

### 6. Transactions
Displays income and expense transactions together with search and filtering options.

### 7. Budget Management
Allows users to set and manage their monthly budget and compare it with their expenses.

### 8. Reports & Analytics
Provides graphical analysis of expenses and income using Chart.js.

### 9. Profile
Displays the logged-in user's profile information.

### 10. Logout
Ends the user's PHP session securely.

## Database Tables

The application uses the following MySQL tables:

- `users`
- `expenses`
- `income`
- `budgets`

## Project Structure

```text
Expense-Tracker/
│
├── css/
│   ├── dashboard.css
│   ├── login.css
│   └── style.css
│
├── js/
│   ├── budget.js
│   ├── dashboard.js
│   ├── expenses.js
│   ├── income.js
│   ├── login.js
│   ├── profile.js
│   ├── register.js
│   ├── reports.js
│   └── transactions.js
│
├── php/
│   ├── add_budget.php
│   ├── add_expense.php
│   ├── add_income.php
│   ├── db.php
│   ├── delete_expense.php
│   ├── delete_income.php
│   ├── get_budget.php
│   ├── get_expenses.php
│   ├── get_income.php
│   ├── get_profile.php
│   ├── get_reports.php
│   ├── login.php
│   ├── logout.php
│   ├── register.php
│   ├── update_expense.php
│   └── update_income.php
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── expenses.html
├── income.html
├── transactions.html
├── budget.html
├── reports.html
└── profile.html













## How to Run Locally

### 1. Install XAMPP

Install XAMPP with Apache and PHP.

### 2. Place the Project

Copy the project into the XAMPP `htdocs` directory:

```text
C:\xampp\htdocs\Expense-Tracker