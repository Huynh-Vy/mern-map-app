import express from 'express';
import {createPins, getPins, deletePin, editPin} from '../controllers/pins.js';

const router = express.Router();

// Creating a pin
router.post("/", createPins);

// Get all pins
router.get("/", getPins);

// Edit a pin
router.patch("/:id", editPin);

// Delete a pin
router.delete("/:id", deletePin)

export default router;
