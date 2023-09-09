import User from '../models/User';
import userService from '../services/userService';

// Admin
let handleCreateNewUser = async (req, res) => {
    await User.sync();

    let information = await userService.createNewUserByAdmin(req.body);
    return res.status(200).json(information);
};

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // ALL (get all users), id (get one user)

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        });
    }

    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    });
};

let handleGetProfile = async (req, res) => {
    let userId = req.params.id;
    let profile = await userService.getProfile(userId);
    return res.status(200).json(profile);
};

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required parameters !'
        });
    }
    let information = await userService.deleteUser(req.body.id);
    return res.status(200).json(information);
};

let handleEditUser = async (req, res) => {
    let data = req.body;
    let information = await userService.editUserData(data);
    return res.status(200).json(information);
};

// CLient
let handleUpdateUserAvatar = async (req, res) => {
    try {
        let data = req.body;
        let updatedData = await userService.updateUserAvatar(data);
        return res.status(200).json(updatedData);
    } catch (error) {
        return res.status(400).json({ errCode: 1, message: 'Fail to upload avatar image !' });
    }
};

let handleGetUserAvatar = async (req, res) => {
    try {
        let userId = req.params.id;
        let avatar = await userService.getUserAvatar(userId);
        return res.status(200).json(avatar);
    } catch (error) {
        return res.status(400).json({
            errCode: 1,
            message: 'User not found !'
        });
    }
};

module.exports = {
    handleCreateNewUser: handleCreateNewUser,
    handleGetAllUsers: handleGetAllUsers,
    handleGetProfile: handleGetProfile,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    handleUpdateUserAvatar: handleUpdateUserAvatar,
    handleGetUserAvatar: handleGetUserAvatar
};
