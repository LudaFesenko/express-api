const { prisma } = require("../prisma/prisma-client");

const CommentsController = {
  createComments: async (req, res) => {
    const { postId, content } = req.body;
    const { userId } = req.user;

    if (!content || !postId) {
      res.status(400).json({ error: "Поля обязательны" });
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          postId,
          content,
          userId,
        },
      });

      res.send(comment);
    } catch (error) {
      console.log("create comment error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteComment: async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const comment = await prisma.comment.findUnique({ where: { id } });

      if (!comment) {
        return res.status(404).json({ error: "Комментарий не найден" });
      }

      if (comment.userId !== userId) {
        return res.status(403).json({ error: "нет доступа" });
      }

      await prisma.comment.delete({ where: { id } });

      res.json(comment);
    } catch (error) {
      console.log("delete comment error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = CommentsController;
