const Publication = require("../models/publication.js");
const Like = require("../models/like.js");

const getPublications = async (
  userIdentityId,
  filter = "",
  page = 1,
  limit = 5,
) => {
  try {
    const publications = await Publication.paginate(filter, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: { path: "user", select: "-password -role -email -__v" },
    });

    // Para traer solo los likes de las publicaciones buscadas
    const publicationsIds = publications.docs.map(
      (publication) => publication._id,
    );

    const likes = await Like.find(
      {
        user: userIdentityId,
        targetType: "Publication",
        targetId: publicationsIds,
      },
      "targetId -_id",
    );

    const arrayLikes = likes.map((like) => like.targetId.toString());

    const publicationsWithLikes = publications.docs.map((publication) => {
      const pub = publication.toObject();
      return {
        ...pub,
        liked: arrayLikes.includes(pub._id.toString()),
      };
    });

    return {
      status: "success",
      page,
      limit,
      totalPublications: publications.totalDocs,
      totalPages: publications.totalPages,
      hasNextPage: publications.hasNextPage,
      items: publicationsWithLikes,
    };
  } catch (error) {
    return null;
  }
};

module.exports = {
  getPublications,
};
