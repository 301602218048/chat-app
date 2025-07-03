const Message = require("../models/message");

const postMessage = async (req, res) => {
  try {
    const user = req.user;
    const { message } = req.body;
    if (message === "") {
      return res.status(401).json({ msg: "invalid message", success: false });
    }
    const newMessage = await Message.create({
      message: message,
      from: user.name,
      userId: user.id,
    });
    res
      .status(200)
      .json({ success: true, name: user.name, message: newMessage.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: `${error.message}` });
  }
};

const fetchMesssage = async (req, res) => {
  try {
    const messages = await Message.findAll();
    if (messages.length === 0) {
      return res.status(204).json({ success: false, msg: "No message found" });
    }
    res.status(200).json({ success: true, messages: messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: `${error.message}` });
  }
};

module.exports = {
  postMessage,
  fetchMesssage,
};
