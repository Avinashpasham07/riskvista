const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const financeRoutes = require('./routes/financeRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window` to handle slider simulations
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Strict Limiter for Auth Routes (Brute force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 15 login/register requests per window
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
});

app.use(express.json());

const apiRouter = express.Router();

apiRouter.use('/auth', authLimiter, authRoutes);
apiRouter.use('/financial-records', financeRoutes);
apiRouter.use('/simulate', simulationRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

app.use('/api', apiLimiter, apiRouter);

app.get('/', (req, res) => {
    res.send('Startup Financial Risk Intelligence Platform API is running');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
