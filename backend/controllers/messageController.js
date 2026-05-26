import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    const createdMessage = await message.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    next(error);
  }
};

export { getMessages, sendMessage };
