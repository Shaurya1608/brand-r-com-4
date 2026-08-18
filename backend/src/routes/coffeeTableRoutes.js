const express = require('express');
const router = express.Router();
const {
  createCoffeeTable,
  getCoffeeTables,
  updateCoffeeTable,
  deleteCoffeeTable
} = require('../controllers/coffeeTableController');

// Public route to submit coffee table enquiry
router.post('/create', createCoffeeTable);

// Admin routes
router.get('/', getCoffeeTables);
router.put('/:id', updateCoffeeTable);
router.delete('/:id', deleteCoffeeTable);

module.exports = router;
