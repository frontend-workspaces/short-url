const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');
const redirectRoutes = require('./routes/redirect');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/', redirectRoutes);

module.exports = app;
