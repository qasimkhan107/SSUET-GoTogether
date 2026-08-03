# 🚗 SSUET GoTogether

A full-stack MERN-based ride-sharing platform developed for Sir Syed University of Engineering & Technology (SSUET). The system enables students and faculty to create rides, book available rides, manage vehicles, receive notifications, submit reviews, and securely authenticate using SSUET email accounts.

---

## ✨ Features

### Authentication
- JWT Authentication
- SSUET Email Verification
- Secure Password Hashing
- Role-based Access Control
- Profile Completion

### User Features
- Complete User Profile
- Upload Profile Picture
- Add/Edit Vehicle
- View Dashboard
- Search Available Rides

### Ride Management
- Create Ride
- Edit Ride
- Cancel Ride
- Complete Ride
- View My Rides
- Ride History

### Booking System
- Book Seats
- Cancel Booking
- Driver Accept/Reject Booking
- Booking Status Tracking

### Reviews & Ratings
- Rate Drivers
- Leave Reviews
- Driver Rating Calculation

### Notifications
- Real-time Notifications
- Booking Notifications
- Ride Updates

### Admin Features
- User Management
- Ride Monitoring
- Booking Monitoring
- Dashboard Statistics

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- React Hook Form
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer
- Multer

---

## 📁 Project Structure

```
SSUET-GoTogether
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── validators
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/SSUET-GoTogether.git

cd SSUET-GoTogether
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`.

Start backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file using `.env.example`.

Run frontend:

```bash
npm run dev
```

---

## Environment Variables

Do **NOT** commit your real `.env` files.

Create the following files locally.

### backend/.env

```
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_app_password

FRONTEND_URL=http://localhost:5173
```

### frontend/.env

```
VITE_API_URL=http://localhost:5000/api
```

---

## Security

Sensitive credentials are excluded from the repository.

Never commit:

- MongoDB URI
- JWT Secret
- Gmail App Password
- API Keys
- Environment Files

---

## Available Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

## Author

**Qasim Raza**

Software Engineering Student

Sir Syed University of Engineering & Technology

Karachi, Pakistan

---

## License

This project is developed for educational purposes.