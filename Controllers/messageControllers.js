const Chat = require("../Models/Chat.model.js");
const User = require("../Models/User.model.js");
const Message = require("../Models/Message.model.js");

async function sendMessage(req, res) {
  const teste = req.user._id;
  const userIDFind = new String(teste).toString();

  try {
    let newMessage;
    let message;
    const { content, chatId } = req.body;
    newMessage = {
      sender: userIDFind,
      content: content,
      chat: chatId,
    };
    // console.log(req);
    message = await Message.create(newMessage);

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
