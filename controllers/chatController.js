const Message = require("../models/message");
const s3Service = require("../services/s3Service");
const { Op } = require("sequelize");

const postMessage = async (req, res) => {
  try {
    const user = req.user;
    const { file, message, groupId } = req.body;
    const filename = `ChatApp-${user.id}-${new Date()}.txt`;
    const fileUrl = await s3Service.UploadToS3(file, filename);
    if (message === "" && file === null) {
      return res.status(401).json({ msg: "invalid message", success: false });
    }
    const newMessage = await Message.create({
      message,
      file: fileUrl,
      from: user.name,
      userId: user.id,
      groupId,
    });
    res
      .status(200)
      .json({
        success: true,
        name: user.name,
        message: newMessage.message,
        file: newMessage.file,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: `${error.message}` });
  }
};

const fetchChat = async (req, res) => {
  try {
    const lastMsgId = +req.params.lastId;
    const chat = await Message.findAll({
      where: { id: { [Op.gt]: lastMsgId } },
    });
    if (chat.length === 0) {
      return res
        .status(200)
        .json({ success: true, msg: "chat up to date", chat: [] });
    }
    res
      .status(200)
      .json({ success: true, chat, lastChatId: chat[chat.length - 1].id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: `${error.message}` });
  }
};

module.exports = {
  postMessage,
  fetchChat,
};
