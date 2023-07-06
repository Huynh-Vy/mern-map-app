import Pin from '../models/Pin.js';
import User from '../models/User.js';

// Creating new pin and save to DB
export const createPins = async(req, res) => {
    const newPin = new Pin(req.body);

    try {
        await newPin.save();
        return res.status(200).json(newPin);
        
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}

// Get all the pins
export const getPins = async(req, res) => {
    try {
        const pins = await Pin.find();
        return res.status(200).json(pins);
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}

// Edit a pin
export const editPin = async(req, res) => {
    const { id } = req.params;
    const { title, description, rating } = req.body;

    try {
        const pin = await Pin.findById(id);
        if (!pin) {
            return res.status(400).json({ message: 'No pin was found'});
        }

        await Pin.findByIdAndUpdate(id, {title: title, description: description, rating: rating});
        const updatedPin = await Pin.findById(id);
        return res.status(200).json({
            message: 'Pin is updated sucessfully',
            newPin: updatedPin,
        });

    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
}


// Delete a pin
export const deletePin = async(req, res) => {
    const { id } = req.params;

    try {
        const pin = await Pin.findById(id);
        if (!pin) {
            return res.status(400).json({ message: 'No pin was found'});
        }

        await Pin.findOneAndRemove({_id : id});
        return res.status(200).json({ message: 'Pin is deleted successfully'});
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
}


