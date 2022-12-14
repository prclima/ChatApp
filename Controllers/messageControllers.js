const Chat = require("../Models/Chat.model.js");
const User = require("../Models/User.model.js");
const Message = require("../Models/Message.model.js");





async function sendMessage(req, res) {
  let newMessage;
  let message;
  const { content, chatId } = req.body;
  newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
     message = await Message.create(newMessage);
    console.log(req.user._id)
    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (err) {
    console.log(err);
  }
}

async function allMessages(req, res) {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name")
      .populate("chat");
    res.json(messages);
    
  } catch (err) {
    console.log(err);
  }
}

module.exports = { sendMessage, allMessages };
