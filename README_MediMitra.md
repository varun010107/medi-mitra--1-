# Medi Mitra: Full-Stack Healthcare Assistance System

 Project Description
Medi Mitra is a multi-page healthcare web application that integrates four essential health services into one unified digital platform. It provides users with a convenient and guided experience across Diet & Fitness, Symptom Checking, Lab Tests, and Doctor Appointments.

The system is built using a clean MERN architecture with strict constraints: React (JSX) + Pure CSS on the frontend and a Node.js/Express backend with a local MongoDB database.

---

### Features
- Diet & Fitness Planner  
- Symptom Checker  
- Lab Tests Module  
- Doctor Appointments  
- Responsive Design

---

### Tech Stack
| Component    | Technology          | Constraints                                 |
|--------------|----------------------|----------------------------------------------|
| Frontend | Vite + React (JSX)  | Pure CSS only (No frameworks like Tailwind) |
| Backend  | Node.js + Express.js | Minimal dependencies                         |
| Database | MongoDB              | Local connection on port 7001            |

---

### Getting Started

#### 1. Prerequisites
- Node.js & npm  
- MongoDB Community Server running on port 7001

---

## 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env`:
```
MONGODB_URI=mongodb://localhost:7001/medimitra
PORT=5000
```

Start backend:
```bash
npm run dev
```

---

## 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

---

### Founders
- Varun Nembhani – Co-Developer  
- Vansh Patel – Co-Developer  
- Saksham Ostwal – Co-Developer  
