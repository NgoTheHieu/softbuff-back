const router = require("express").Router({ mergeParams: true });
const { getComment, createComment, deleteComment, updateComment } = require("../src/controllers/commentController");
const { loginRequired } = require("../src/middlewares/auth")


// /experiences/:eid/reviews/

router.route("/")
    .get(getComment) // get all reviews from an experience
    .post(loginRequired, createComment) // create a new review for an experience

router.route("/:rid")
    .patch(loginRequired, updateComment) // createReview func will also update an existing review
    // .delete(loginRequired, deleteComment) // delete an existing review



module.exports = router