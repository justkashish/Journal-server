import express from 'express';
import {
    createEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry
} from '../controllers/journalController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/journal
// @desc    Create a journal entry
// @access  Private
router.post('/', auth, createEntry);

// @route   GET api/journal
// @desc    Get all journal entries
// @access  Private
router.get('/', auth, getEntries);

// @route   GET api/journal/:id
// @desc    Get a journal entry by ID
// @access  Private
router.get('/:id', auth, getEntry);

// @route   PUT api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', auth, updateEntry);

// @route   DELETE api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', auth, deleteEntry);

export default router;