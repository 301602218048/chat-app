const cron = require("node-cron");
const { Op } = require("sequelize");
const { Message, ArchiveMsg } = require("../models");

cron.schedule("0 0 * * *", async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const oldMessages = await Message.findAll({
      where: {
        createdAt: {
          [Op.lt]: yesterday,
        },
      },
    });

    if (oldMessages.length > 0) {
      const archivedData = oldMessages.map((msg) => ({
        id: msg.id,
        file: msg.file,
        message: msg.message,
        from: msg.from,
        userId: msg.userId,
        groupId: msg.groupId,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      }));

      await ArchiveMsg.bulkCreate(archivedData);

      await Message.destroy({
        where: {
          id: oldMessages.map((msg) => msg.id),
        },
      });

      console.log(`Archived ${archivedData.length} messages.`);
    } else {
      console.log("No messages to archive.");
    }
  } catch (err) {
    console.error("Error archiving messages", err);
  }
});
