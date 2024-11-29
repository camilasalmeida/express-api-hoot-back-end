// controllers/hoots.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Hoot = require('../models/hoot.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
try {
    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);
    hoot._doc.author = req.user;
    res.status(201).json(hoot);
} catch (error) {
    res.status(500).json(error);
}
});

router.get('/', async (req, res) => {
    try {
        const hoots = await Hoot.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
        res.status(200).json(hoots);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:hootId', async (req, res) => {
try {
    const hoot = await Hoot.findById(req.params.hootId).populate('author');
    res.status(200).json(hoot);
} catch (error) {
    res.status(500).json(error);
}
})

router.put('/:hootId', async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId);                 // Find the hoot.
        
        if (!hoot.author.equals(req.user._id)) {                             // Check permissions.
            return res.status(403).send("You are not allowed to do that!");
        }

        const updatedHoot = await Hoot.findByIdAndUpdate(                    // Update Hoot. And pass 3 arguments.
            req.params.hootId,                                                // First: Is the ObjectId by which we will locate the hoot.
            req.body,                                                         // Second: Is the form data (req.body) that will be used to update the hoot document.
            { new: true }                                                     // Third: Is to specifies that we want this method to return the updated document.
        );

        updatedHoot._doc.author = req.user;                                  // Append req.user to the author property.
        res.status(200).json(updatedHoot)                                    // Issue JSON response.
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;