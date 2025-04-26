const express = require("express")
const router = express.Router()
const journalController = require("../controllers/journalController")
const auth = require("../middleware/auth")

// Apply auth middleware to all routes
router.use(auth)

// @route   POST api/journal
// @desc    Create a journal entry
// @access  Private
router.post("/", journalController.createEntry)

// @route   GET api/journal
// @desc    Get all journal entries
// @access  Private
router.get("/", journalController.getEntries)

// @route   GET api/journal/:id
// @desc    Get a journal entry by ID
// @access  Private
router.get("/:id", journalController.getEntry)

// @route   PUT api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put("/:id", journalController.updateEntry)

// @route   DELETE api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete("/:id", journalController.deleteEntry)

module.exports = router