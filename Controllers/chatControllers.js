const Chat = require("../Models/Chat.model.js");
const User = require("../Models/User.model.js");

let chatData = {};
let users;

async function acessChat(req, res) {
  const teste = req.user._id;
  const userIDFind = new String(teste).toString();

  const { userId } = req.body;

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userIDFind } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });
  if (isChat.length < 0) {
    isChat[0];
  } else {
    chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userIDFind, userId],
    };
  }
  try {
    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat.id }).populate(
      "users",
      "-password"
    );
    res.status(200).json(FullChat);
  } catch (err) {
    return console.log(err);
  }
}

async function fetchChats(req, res) {
  const { userId } = req.body;
  const teste = req.user._id;
  const userIDFind = new String(teste).toString();
  try {
    Chat.find({ users: { $elemMatch: { $eq: userIDFind } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { acessChat, fetchChats };
