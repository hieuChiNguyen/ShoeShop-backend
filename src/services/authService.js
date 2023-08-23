import User from '../models/User';
import bcrypt from 'bcryptjs';

const { Op } = require('sequelize');
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({
                where: { email: userEmail }
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let checkExistInformation = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({
                where: {
                    [Op.or]: [{ email: data.email }, { username: data.username }, { phone: data.phone }]
                }
            });
            if (user) {
                // Exist
                resolve(true);
            } else {
                // Not exist
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let createNewCustomer = (userData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check user was already existed
            let checkExist = await checkExistInformation(userData);
            const phoneNumberRegex = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
            const isValidPhoneNumber = phoneNumberRegex.test(userData.phone);

            if (checkExist === true) {
                resolve({
                    errCode: 2,
                    message: 'This user was already existed ! Try another email or username or phone !'
                });
            } else {
                if (isValidPhoneNumber === false) {
                    resolve({
                        errCode: 3,
                        message: 'This number phone is illegal !'
                    });
                } else {
                    let hashPasswordBcrypt = await hashUserPassword(userData.password);
                    let newUser = await User.create({
                        fullName: userData.fullName,
                        email: userData.email,
                        password: hashPasswordBcrypt,
                        address: userData.address,
                        username: userData.username,
                        phone: userData.phone,
                        gender: userData.gender,
                        role: 'Customer'
                    });

                    if (newUser) {
                        resolve({
                            errCode: 0,
                            message: 'done',
                            customer: newUser
                        });
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let handleUserSignIn = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);

            if (isExist) {
                // user exist
                let user = await User.findOne({
                    where: { email: email },
                    attributes: ['email', 'role', 'password', 'username', 'id'],
                    raw: true
                });

                if (user) {
                    // compare password
                    let checkPassword = bcrypt.compareSync(password, user.password);

                    if (checkPassword) {
                        userData.errCode = 0;
                        userData.message = 'done';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = 'Wrong Password !';
                    }
                }
            } else {
                //user not found
                userData.errCode = 2;
                userData.message = `This email is not existed. Try again !`;
            }

            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserSignIn: handleUserSignIn,
    createNewCustomer: createNewCustomer
};
