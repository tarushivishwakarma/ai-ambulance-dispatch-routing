const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const path = require('path');
const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : 'http://localhost:5173';
const allowedOrigins = [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
  }
});

// Pass io to request object for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes placeholder
const authRoutes = require('./src/routes/authRoutes');
const incidentRoutes = require('./src/routes/incidentRoutes');
const ambulanceRoutes = require('./src/routes/ambulanceRoutes');
const dispatchRoutes = require('./src/routes/dispatchRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const hospitalRoutes = require('./src/routes/hospitalRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const iotRoutes = require('./src/routes/iotRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/iot', iotRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

app.get('/api/alerts', async (req, res) => {
  try {
    const Alert = require('./src/models/Alert');
    const alerts = await Alert.find({});
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/roads', async (req, res) => {
  try {
    const RoadCondition = require('./src/models/RoadCondition');
    const roads = await RoadCondition.find({});
    res.status(200).json({ success: true, count: roads.length, data: roads });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/historical', async (req, res) => {
  try {
    const IncidentHistory = require('./src/models/IncidentHistory');
    const history = await IncidentHistory.find({});
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (err) { res.status(500).json({ success: false }); }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Socket connections
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
