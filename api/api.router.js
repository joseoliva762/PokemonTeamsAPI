const express = require('express');
const router = express.Router();
const v1Routes = require('./v1/v1.router').router;

router.use('/v1', v1Routes);
    
exports.router = router;