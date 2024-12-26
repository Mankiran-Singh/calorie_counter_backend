const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');


router.post('/add', async (req, res) => {
  const { name, date, food, calories } = req.body;
  try {
    const entry = new Entry({ name, date, food, calories });
    await entry.save();
    res.status(201).json(entry);  
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/:date', async (req, res) => {
  try {
    const date = req.params.date;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = parseInt(req.query.skip, 10) || 0; 

    const entries = await Entry.find({ date }).limit(limit).skip(skip);

    if (!entries || entries.length === 0) {
      return res.json({ date, totalCalories: 0, entries: [] });
    }

    const foodSummary = entries.reduce((summary, entry) => {
      const { food, calories, name } = entry;
      const key = `${food}-${name}`;  
      
      if (!summary[key]) {
        summary[key] = { food, name, calories: 0 };
      }
      summary[key].calories += calories; 
      return summary;
    }, {});

    const aggregatedEntries = Object.values(foodSummary);

    const totalCalories = aggregatedEntries.reduce((sum, entry) => sum + entry.calories, 0);

    res.status(200).json({
      date,
      totalCalories,
      entries: aggregatedEntries, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch entries', error: error.message });
  }
});


router.get('/all', async (req, res) => {
  try {
    const { limit, skip } = req.query;

    const limitParsed = parseInt(limit, 10) || 10; 
    const skipParsed = parseInt(skip, 10) || 0; 

    const entries = await Entry.find().limit(limitParsed).skip(skipParsed);

    if (!entries || entries.length === 0) {
      return res.json({ totalCalories: 0, entries: [] });
    }

    const foodSummary = entries.reduce((summary, entry) => {
      const { food, calories, name } = entry;
      const key = `${food}-${name}`; 
      
      if (!summary[key]) {
        summary[key] = { food, name, calories: 0 };
      }
      summary[key].calories += calories; 
      return summary;
    }, {});

    const aggregatedEntries = Object.values(foodSummary);

    const totalCalories = aggregatedEntries.reduce((sum, entry) => sum + entry.calories, 0);

    res.status(200).json({
      totalCalories,
      entries: aggregatedEntries, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch entries', error: error.message });
  }
});

module.exports = router;



module.exports = router;
