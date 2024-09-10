const { prisma } = require("../prisma/prisma-client");
const { connect } = require("../routes");

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const { userId } = req.user;

    if (followingId === userId) {
      return res
        .status(500)
        .json({ error: "Вы не можете подписаться на себя" });
    }

    try {
      const extendingFollower = await prisma.follows.findFirst({
        where: {
          AND: [
            {
              followerId: userId,
            },
            {
              followingId,
            },
          ],
        },
      });

      if (extendingFollower) {
        return res.status(400).json({ message: "'Подписка уже существует'" });
      }

      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } },
        },
      });

      res.status(201).json({ message: "Подписка успешно создана" });
    } catch (error) {
      console.log("Following user error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  unFollowUser: async (req, res) => {
    const { followingId } = req.body;
    const { userId } = req.user;

    try {
      const extendingFollower = await prisma.follows.findFirst({
        where: {
          AND: [
            { followerId: userId },
            {
              followingId,
            },
          ],
        },
      });

      if (!extendingFollower) {
        return res.status(404).json({ message: "Запись не найдена" });
      }

      await prisma.follows.delete({
        where: { id: extendingFollower.id },
      });

      res.status(200).json({ message: "Отписка успешно выполнена" });
    } catch (error) {
      console.log("UnFollowing user error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = FollowController;
