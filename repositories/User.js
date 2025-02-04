const { User } = require('../models');

const listUsers = async () => {
  return User.find();
};

const findUserById = async id => {
  try {
    return await User.findById(id);
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return null;
    }
    throw error;
  }
};

const findUserByEmail = async email => {
  try {
    const result = User.findOne({ email });
    return await result;
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return null;
    }
    throw error;
  }
};

const findByVerifyToken = async verifyToken => {
  try {
    const result = User.findOne({ verifyToken });
    return await result;
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return null;
    }
    throw error;
  }
};


const addUser = async body => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatarUrl) => {
  return await User.updateOne({ _id: id }, { avatarUrl });
};

const updateTokenVerify = async (id, isVerified ,  verifyToken) => {
  return await User.updateOne({ _id: id }, { isVerified ,  verifyToken });
};

module.exports = {
  listUsers,
  findUserById,
  findUserByEmail,
  addUser,
  updateToken,
  updateAvatar,
  findByVerifyToken,
  updateTokenVerify
};
