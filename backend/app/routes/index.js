const express = require('express');
const contactRoute = require('./contact.route');
// Import other routes here as you create them

const router = express.Router();

// Define API routes
router.use('/contacts', contactRoute);
// Add other routes here, e.g.:
// router.use('/users', userRoute);
// router.use('/products', productRoute);

module.exports = router;
