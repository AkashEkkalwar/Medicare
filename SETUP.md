# Quick Setup Guide

## Prerequisites
- Node.js (v14+) installed
- MongoDB running locally OR MongoDB Atlas account

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Start backend:
```bash
npm start
# or
npm run dev  # (if nodemon is installed)
```

## Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

(Optional) Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

## Step 3: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Testing the Application

1. Register as a Patient:
   - Go to Register page
   - Fill in details (name, email, password)
   - Select "Patient" role
   - Enter age and gender
   - Submit

2. Register as a Doctor:
   - Register with "Doctor" role
   - Enter specialty (e.g., "Cardiology", "Neurology")
   - Enter years of experience

3. Test Features:
   - Login as patient
   - Use Symptom Checker
   - Book an appointment
   - View medical history

## MongoDB Atlas Setup (Cloud Database)

If using MongoDB Atlas instead of local MongoDB:

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare-platform
   ```

## Troubleshooting

- **Backend won't start**: Check if MongoDB is running or connection string is correct
- **Frontend can't connect**: Verify backend is running on port 5000
- **CORS errors**: Ensure backend has CORS enabled (already configured)
- **Authentication fails**: Check JWT_SECRET is set in backend `.env`
