# Blood Donation Management System

A full-stack **Blood Donation Management System** designed to efficiently connect **blood donors, recipients, hospitals, and blood banks** through a centralized digital platform.

The system helps manage donor registrations, blood donation records, blood requests, blood inventory, and communication between donors and recipients.

> **Academic Project | Full-Stack Web Development | Portfolio Project**

---

## Project Overview

The **Blood Donation Management System** provides a centralized platform for managing the complete blood donation workflow.

Instead of relying on manual records and communication, the system allows users to digitally:

* Register and manage blood donors
* Record and track blood donations
* Submit blood requests
* Manage blood bank inventory
* Search for compatible blood groups
* Monitor blood availability
* Manage donation and request statuses
* Maintain donor and recipient information

The goal is to make blood donation management **faster, more organized, and accessible**.

---

# Features

## Donor Management

* Donor registration
* Secure donor authentication
* Donor profile management
* Blood group information
* Donor location information
* Donation history
* Track donor eligibility and last donation
* Find donors based on blood group and location

---

## Blood Request Management

Recipients or hospitals can create blood requests containing information such as:

* Required blood group
* Required units
* Hospital or recipient information
* Request priority
* Required date
* Location
* Additional requirements

Request statuses can be tracked:

```text
Pending → Approved → Fulfilled
```

or

```text
Pending → Rejected
```

---

## Blood Bank Management

The system maintains blood inventory for different blood groups.

Supported blood groups:

| Blood Group |
| ----------- |
| A+          |
| A-          |
| B+          |
| B-          |
| AB+         |
| AB-         |
| O+          |
| O-          |

Blood bank administrators can:

* Add blood units
* Remove blood units
* Update inventory
* View available stock
* Identify low-stock blood groups
* Track blood transactions

---

## Admin Dashboard

Administrators can manage the entire system from a centralized dashboard.

### Dashboard Statistics

* Total Donors
* Total Donations
* Active Blood Requests
* Available Blood Units
* Critical Blood Groups
* Completed Requests

### Admin Management

* Manage users
* Manage donors
* Manage blood requests
* Manage blood inventory
* Verify donor information
* Approve or reject requests
* Monitor system activity

---

# System Architecture

The application follows a modern full-stack architecture:

```text
                 ┌─────────────────────┐
                 │      Frontend       │
                 │       Next.js       │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │       Backend       │
                 │ Node.js + Express   │
                 └──────────┬──────────┘
                            │
                         SQL Queries
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Database       │
                 │     PostgreSQL      │
                 └─────────────────────┘
```

---

# Tech Stack

## Frontend

* **Next.js**
* JavaScript / TypeScript
* CSS / Tailwind CSS
* REST API integration
* Responsive UI

## Backend

* **Node.js**
* **Express.js**
* Authentication and authorization
* RESTful APIs
* Input validation
* Error handling

## Database

* **PostgreSQL**
* Relational database design
* Foreign key relationships
* Data validation
* Transaction management

---

# Project Structure

```text
blood-donation-system/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
│
├── .env.example
├── .gitignore
└── README.md
```

---

# Database Design

The system can be organized around the following major entities:

```text
Users
  │
  ├──────────────┐
  │              │
  ▼              ▼
Donors       Recipients
  │              │
  │              ▼
  │        Blood Requests
  │              │
  ▼              │
Donations        │
  │              │
  └───────┬──────┘
          ▼
    Blood Inventory
          │
          ▼
      Blood Groups
```

## Main Tables

### Users

```text
users
├── id
├── name
├── email
├── password
├── phone
├── role
├── created_at
└── updated_at
```

### Donors

```text
donors
├── id
├── user_id
├── blood_group
├── date_of_birth
├── gender
├── address
├── city
├── last_donation_date
├── eligibility_status
└── created_at
```

### Donations

```text
donations
├── id
├── donor_id
├── blood_group
├── units
├── donation_date
├── blood_bank_id
├── status
└── created_at
```

### Blood Requests

```text
blood_requests
├── id
├── requester_id
├── blood_group
├── units_required
├── hospital_name
├── location
├── urgency
├── request_date
├── required_date
├── status
└── created_at
```

### Blood Inventory

```text
blood_inventory
├── id
├── blood_bank_id
├── blood_group
├── units_available
├── last_updated
└── created_at
```

---

# Authentication and Authorization

The system should implement role-based access control.

## Donor

Can:

* Register and login
* Manage profile
* View donation history
* View blood requests
* Respond to donation opportunities

## Recipient / Hospital

Can:

* Register and login
* Create blood requests
* View request status
* Search available blood
* Track fulfilled requests

## Administrator

Can:

* Manage users
* Manage donors
* Manage blood requests
* Manage blood inventory
* Approve or reject requests
* Monitor system statistics

Example:

```text
             ┌──────────────┐
             │     User     │
             └──────┬───────┘
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Donor    Recipient    Admin
```

---

# Blood Donation Workflow

## 1. Donor Registration

```text
Donor
  ↓
Create Account
  ↓
Complete Profile
  ↓
Add Blood Group
  ↓
Account Created
```

## 2. Blood Donation

```text
Donor
  ↓
Donation Appointment
  ↓
Blood Donation
  ↓
Donation Recorded
  ↓
Blood Inventory Updated
```

## 3. Blood Request

```text
Hospital / Recipient
        ↓
Create Blood Request
        ↓
System Checks Inventory
        ↓
Blood Available?
      /     \
    YES      NO
    ↓         ↓
Approve    Find Donor
    ↓         ↓
Fulfill    Contact Donor
Request       ↓
             Donation
```

---

# REST API

The backend exposes RESTful APIs for communication between the frontend and database.

## Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register a user  |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/me`       | Get current user |

## Donors

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/api/donors`        | Get all donors           |
| GET    | `/api/donors/:id`    | Get donor                |
| POST   | `/api/donors`        | Create donor             |
| PUT    | `/api/donors/:id`    | Update donor             |
| DELETE | `/api/donors/:id`    | Delete donor             |
| GET    | `/api/donors/search` | Search compatible donors |

## Donations

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| GET    | `/api/donations`     | Get donations   |
| POST   | `/api/donations`     | Record donation |
| GET    | `/api/donations/:id` | Get donation    |
| PUT    | `/api/donations/:id` | Update donation |

## Blood Requests

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| GET    | `/api/requests`     | Get requests   |
| POST   | `/api/requests`     | Create request |
| GET    | `/api/requests/:id` | Get request    |
| PUT    | `/api/requests/:id` | Update request |
| DELETE | `/api/requests/:id` | Delete request |

## Blood Inventory

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/api/inventory`        | Get blood inventory    |
| GET    | `/api/inventory/:group` | Get group availability |
| POST   | `/api/inventory`        | Add blood units        |
| PUT    | `/api/inventory/:id`    | Update inventory       |

---

# Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL
* Git

Check your versions:

```bash
node --version
npm --version
psql --version
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/your-username/blood-donation-system.git
```

Navigate into the project:

```bash
cd blood-donation-system
```

---

# Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```

---

# Backend Setup

Open another terminal:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/blood_donation

JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

Backend API:

```text
http://localhost:5000
```

---

# PostgreSQL Database Setup

Create the database:

```sql
CREATE DATABASE blood_donation;
```

Connect to the database:

```bash
psql -U postgres -d blood_donation
```

Run the database schema:

```bash
psql -U postgres -d blood_donation -f database/schema.sql
```

If seed data is available:

```bash
psql -U postgres -d blood_donation -f database/seed.sql
```

---

# Environment Variables

## Backend

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> Never commit `.env` files containing passwords, database credentials, API keys, or JWT secrets.

---

# Example Dashboard

The admin dashboard can display:

```text
┌─────────────────────────────────────────────┐
│          Blood Donation Dashboard           │
├────────────┬────────────┬───────────────────┤
│   Donors   │   Units    │     Requests      │
│    1,250   │    3,420   │       86          │
├────────────┴────────────┴───────────────────┤
│                                             │
│       Blood Group Availability              │
│                                             │
│ A+   ████████████████  450 units            │
│ A-   ███████            180 units            │
│ B+   █████████████      390 units            │
│ B-   ████                90 units            │
│ AB+  █████               120 units            │
│ AB-  ██                   40 units            │
│ O+   ███████████████     420 units            │
│ O-   ███                  70 units            │
│                                             │
└─────────────────────────────────────────────┘
```

---

# Donor Search

Users can search for donors based on:

* Blood group
* City or location
* Availability
* Donation eligibility

Example:

```text
Search Donors

Blood Group: [ O- ▼ ]

City:        [ Rawalpindi ]

Availability: [ Available ]

              [ Search ]
```

Results:

```text
┌───────────────────────────────────────┐
│ Donor                                 │
│ Blood Group: O-                       │
│ Location: Rawalpindi                 │
│ Availability: Available              │
│                                       │
│        [ Contact Donor ]              │
└───────────────────────────────────────┘
```

---

# Security

The application should follow basic security best practices:

* Password hashing
* JWT-based authentication
* Role-based authorization
* Protected API routes
* Server-side validation
* SQL injection prevention
* Environment variables for secrets
* Input sanitization
* Proper error handling

---

# Responsive Design

The frontend is designed to work across:

* Desktop
* Laptop
* Mobile
* Tablet

The interface should provide a simple and accessible experience for donors, hospitals, and administrators.

---

# Testing

The project can include testing for:

## Backend

* API endpoint testing
* Authentication testing
* Database operations
* Request validation

## Frontend

* Component testing
* Form validation
* Authentication flows
* API integration

Example:

```bash
npm test
```

---

# Future Improvements

The system can be extended with:

* Google Maps donor location
* Email notifications
* SMS notifications
* Push notifications
* Donation appointment scheduling
* AI-based donor matching
* Advanced analytics
* Hospital management portal
* Multiple blood-bank support
* Mobile application
* Real-time blood availability
* Automated emergency notifications
* Donation certificates
* Complete audit logs

---

# Project Goals

The major goals of this project are:

1. Digitize blood donation management
2. Improve donor-recipient communication
3. Maintain centralized blood inventory
4. Reduce delays in emergency blood requests
5. Make compatible donors easier to find
6. Provide administrators with useful statistics
7. Maintain secure user and donation records

---

# Why This Project?

Blood availability can become critical during emergencies, surgeries, accidents, and medical procedures.

A centralized blood donation platform can help organizations manage donors and blood inventory more efficiently while reducing the dependency on manual records.

This project demonstrates practical implementation of:

* Full-stack web development
* REST API development
* Database management
* Authentication
* Authorization
* CRUD operations
* Relational database design
* Responsive UI development

---

# Development Roadmap

```text
[x] Project Planning
[x] Database Design
[x] Backend Setup
[x] Frontend Setup

[ ] Authentication
[ ] Donor Management
[ ] Blood Request System
[ ] Blood Inventory
[ ] Admin Dashboard
[ ] Donor Search
[ ] Notifications
[ ] Testing
[ ] Deployment
```

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Create a Pull Request

---

# License

This project is developed for **educational and academic purposes**.

You can modify and extend the project according to your requirements.

---

# Author

**Ali Hassan Durrani & Aleena Mazhar**

Full-Stack Web Development Project

**Blood Donation Management System**

---

## Support

If you find this project useful, consider giving the repository a star on GitHub.

---

# Donate Blood. Save Lives.

> **"A single donation can make a difference in someone's life."**

**Built using Next.js, Node.js, Express.js, and PostgreSQL.**
