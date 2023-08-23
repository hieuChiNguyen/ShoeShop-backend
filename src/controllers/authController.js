import User from '../models/User';
import authService from '../services/authService';

// Create a new customer
let handleSignUp = async (req, res) => {
    try {
        await User.sync();
        let userData = req.body;
        let customer = await authService.createNewCustomer(userData);
        if (customer.errCode === 0) {
            return res.status(201).json(customer);
        } else if (customer.errCode === 2 || customer.errCode === 3) {
            return res.status(400).json(customer);
        }
    } catch (error) {
        return res.status(400).json({
            errCode: 1,
            message: 'Please fill out all fields in above form !'
        });
    }
};

let handleSignIn = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // validate
    if (!email) {
        return res.status(400).json({
            errCode: 1,
            message: 'Please enter your email !'
        });
    } else if (!password) {
        return res.status(400).json({
            errCode: 2,
            message: 'Please enter your password !'
        });
    }

    let userData = await authService.handleUserSignIn(email, password);

    return res.status(200).json(userData);
};

module.exports = {
    handleSignIn: handleSignIn,
    handleSignUp: handleSignUp
};
