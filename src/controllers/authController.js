import User from '../models/User';
import authService from '../services/authService';
import jwt from 'jsonwebtoken';

// Generate Refresh Token
let generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: '30d' }
    );
};

// Create a new customer
let handleSignUp = async (req, res) => {
    try {
        await User.sync();
        let user = req.body;
        let customer = await authService.createNewCustomer(user);

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

// Sign in an existed account
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

    // validate
    if (userData.errCode === 3 || userData.errCode === 4) {
        return res.status(404).json(userData);
    } else {
        // Refresh Token -> long-lived token
        const refreshToken = generateRefreshToken(userData.user);

        // Store refresh token into Cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(userData);
    }
};

// Log out an account
let handleSignOut = async (req, res) => {
    res.clearCookie('refreshToken');
    return res.status(200).json({
        message: 'Logged out successfully !'
    });
};

// Reset access token and refresh token
let handleRefreshToken = async (req, res) => {
    // Take refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    console.log('check refresh token called: ', refreshToken);

    if (!refreshToken) {
        return res.status(401).json({
            message: 'You are not authenticated !'
        });
    } else {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (error, user) => {
            if (error) {
                console.log(error);
            }

            let date = new Date();
            if (user.exp < date.getTime() / 1000) {
                // Create a new refresh token
                const newRefreshToken = generateRefreshToken(user);

                // Store new refresh token into Cookies
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
            }

            // Create a new access token
            const newAccessToken = authService.generateAccessToken(user);
            console.log('check new access token: ', newAccessToken);

            return res.status(200).json({
                message: 'Create new access token successfully !',
                newAccessToken: newAccessToken
            });
        });
    }
};

module.exports = {
    handleSignIn,
    handleSignUp,
    handleSignOut,
    handleRefreshToken
};
