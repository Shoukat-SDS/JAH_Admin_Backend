// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

// Load env vars
dotenv.config();

// Connect to database
await connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Security middlewares
app.use(mongoSanitize()); // Sanitize data
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);


const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // console.log('🌍 Incoming request origin:', origin);

    if (!origin) {
      console.log('⚠️ No origin header (maybe Postman or curl)');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      // console.log('✅ Allowed origin:', origin);
      callback(null, true);
    } else {
      // console.error('❌ Blocked origin:', origin);
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true,
}));
// Enable CORS
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));

// Mount routes
import authRoutes from './routes/authRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import subscriberRoutes from "./routes/subscriberRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/contact", contactRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});