import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
// import { swaggerUi, swaggerDocs } from "./openapi/index.js"

dotenv.config();
const app = express();

// CORS configuration - must be before any routes
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    // Check if the origin is in the allowed list or is a local network origin
    const isAllowed = allowedOrigins.includes(origin) || 
      origin.match(/^http:\/\/192\.168\.\d+\.\d+:5173$/) ||
      origin.match(/^http:\/\/10\.\d+\.\d+\.\d+:5173$/) ||
      origin.match(/^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:5173$/);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());

// Explicit preflight handler for all routes
app.options('*', cors(corsOptions));

// Swagger disabled due to Node.js 22 compatibility issue
// app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🧩 Routes

app.use("/api/auth", authRoutes);


app.use("/api/donor", donorRoutes);

app.use("/api/facility", facilityRoutes);

app.use("/api/admin", adminRoutes);



import bloodLabRoutes from "./routes/bloodLabRoutes.js";
app.use("/api/blood-lab", bloodLabRoutes);


import hospitalRoutes from "./routes/hospitalRoutes.js";
app.use("/api/hospital", hospitalRoutes);


import recommendRoutes from "./routes/recommend.js";
app.use("/api", recommendRoutes);

import chatbotRoutes from "./routes/chatbotRoutes.js";
app.use("/api/chatbot", chatbotRoutes);

// 🗄️ DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
