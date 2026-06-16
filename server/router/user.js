const express = require('express');
const { getAllUsers } = require('../controller/user.controller');
const authMiddleWare = require('../middleware/authMiddleware');
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware');
const route = express.Router();

route.get('/all', authMiddleWare, roleCheckMiddleware('admin', 'editor'), getAllUsers);

module.exports = route;
