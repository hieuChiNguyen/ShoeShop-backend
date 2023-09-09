import User from '../models/User';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
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

let createNewUserByAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check email was already existed
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email was already existed ! Try again !'
                });
            } else {
                let hashPasswordBcrypt = await hashUserPassword(data.password);
                let user = await User.create({
                    fullName: data.fullName,
                    email: data.email,
                    password: hashPasswordBcrypt,
                    address: data.address,
                    username: data.username,
                    phone: data.phone,
                    gender: data.gender,
                    role: 'Admin'
                });

                if (user) {
                    resolve({
                        errCode: 0,
                        message: 'OK',
                        data: user
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';

            if (userId === 'ALL') {
                users = await User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });

                // const { count, rows } = await User.findAndCountAll({ where: { role: 'Admin' } });
                // // console.log('check count: ', count);
                // if (count > 0) {
                //     const roles = [
                //         { url: '/signin', description: 'Customer signs in' },
                //         { url: '/signup', description: 'Customer creates a new account' },
                //         { url: '/admin', description: 'Admin page' },
                //         { url: '/admin/manage_accounts', description: 'Manage all accounts' },
                //         { url: '/admin/manage_products', description: 'Manage all products' },
                //         { url: '/admin/manage_vouchers', description: 'manage all vouchers' },
                //         { url: '/admin/post_products', description: 'Admin posts a new product to homepage' },
                //         { url: '/products', description: 'Show all products' },
                //         { url: '/profile', description: 'View customer profile' },
                //         { url: '/cart', description: 'View customer cart' },
                //         { url: '/male', description: 'Show all male products' },
                //         { url: '/female', description: 'Show all female products' }
                //     ];

                //     await Role.bulkCreate(roles, { individualHooks: true }).then(() =>
                //         console.log('Roles data have been saved')
                //     );
                // }
            }

            if (userId && userId !== 'ALL') {
                users = await User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }

            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let getProfile = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userProfile = await User.findByPk(userId);

            if (userProfile) {
                resolve({
                    errCode: 0,
                    message: 'done',
                    data: userProfile
                });
            } else {
                resolve({
                    errCode: 1,
                    message: 'User does not exist !'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({
                where: { id: userId }
            });

            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'User is not existed'
                });
            }

            await User.destroy({
                where: { id: userId }
            });

            resolve({
                errCode: 0,
                message: 'User is successfully deleted !'
            });
        } catch (error) {
            reject(error);
        }
    });
};

let editUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters !'
                });
            }

            let user = await User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.fullName = data.fullName;
                user.email = data.email;
                user.address = data.address;
                user.username = data.username;
                user.phone = data.phone;
                user.gender = data.gender;
                user.role = data.role;

                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update successfully user information !'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found !'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserAvatar = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.update(
                { avatar: data.avatar },
                {
                    where: {
                        id: data.id
                    }
                }
            );
            resolve({
                errCode: 0,
                message: 'done',
                avatar: user
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getUserAvatar = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByPk(userId);

            if (user) {
                resolve({
                    errCode: 0,
                    message: 'done',
                    avatar: user.avatar
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewUserByAdmin: createNewUserByAdmin,
    getAllUsers: getAllUsers,
    getProfile: getProfile,
    deleteUser: deleteUser,
    editUserData: editUserData,
    updateUserAvatar: updateUserAvatar,
    getUserAvatar: getUserAvatar
};
