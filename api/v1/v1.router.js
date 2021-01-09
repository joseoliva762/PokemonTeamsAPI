const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/auth.router').router;
const teamsRoutes = require('./teams/teams.router').router;

router.use('/auth', authRoutes);
router.use('/teams', teamsRoutes);
    
exports.router = router;