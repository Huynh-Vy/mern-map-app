import User from '../models/User.js';
import bcrypt from 'bcrypt';
import {registerValidation, loginValidation} from '../middlewares/validationMiddleware.js';

// Register
export const register = async(req, res) => {
    // Validate the register info
    const { error } = await registerValidation(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    // Checking if user is already in database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) {
        return res.status(400).json({message: 'Email is already exist'});
    }

    const userExist = await User.findOne({userName: req.body.userName});
    if (userExist) {
        return res.status(400).json({message: 'Username is already exist'});
    }

    try {
        // generate hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
        });

        // Save user in DB
        await newUser.save();
        return res.status(200).json({message: 'Profile created sucessfully'});
    } catch(err) {
        return res.status(500).json({message: err.message});
    }

}

// login
export const login = async(req, res) => {
    const { error } = await loginValidation(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    const {email, password} = req.body;

    try {
         // Checking if user is already in database
    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(400).json({message: 'Wrong email or password'});
    }

    // Checking if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.status(400).json({message: 'Wrong email or pasword'});
    }

    return res.status(200).json({
        message: 'Login successfully',
        user: user.userName,
        _id: user._id
,    })
    } catch(err) {
        return res.status(500).json({message: err.mesage});
    } 
}