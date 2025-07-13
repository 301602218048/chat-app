const { Message, ArchiveMsg } = require("../models");
const { Op } = require("sequelize");
const uploadtoS3 = require("../controllers/s3");

const UploadToS3 = async (req, res) => {
  try {
    const file = req.file;
    const filename = req.body.filename;
    const location = await uploadtoS3(file, filename);
    res.status(200).json({
      status: "success",
      location,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: "false", err });
  }
};

const postMessage = async (req, res) => {
  try {
    const user = req.user;
    const { file, message, groupId } = req.body;
    if (message === "" && file === null) {
      return res.status(401).json({ msg: "invalid message", success: false });
    }
    const newMessage = await Message.create({
      message,
      file,
      from: user.name,
      userId: user.id,
      groupId,
    });
    res.status(200).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: `${error.message}` });
  }
};

const fetchChat = async (req, res) => {
  try {
    const lastMsgId = +req.params.lastId;
    const recentChat = await Message.findAll({
      where: { id: { [Op.gt]: lastMsgId } },
    });

    let archivedChat = [];
    if (recentChat.length === 0 && lastMsgId > 0) {
      archivedChat = await ArchivedMessage.findAll({
        where: { id: { [Op.gt]: lastMsgId } },
      });
    }

    const combinedChat = [...recentChat, ...archivedChat];

    if (combinedChat.length === 0) {
      return res
        .status(200)
        .json({ success: true, msg: "chat up to date", chat: [] });
    }
    res
      .status(200)
      .json({
        success: true,
        chat: combinedChat,
        lastChatId: combinedChat[combinedChat.length - 1].id,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: `${error.message}` });
  }
};

module.exports = {
  postMessage,
  fetchChat,
  UploadToS3,
};
