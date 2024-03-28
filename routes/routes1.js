const path = require("path")

const express = require("express")
const _ = require("lodash")

const controller = require("../controllers/controller1")
const upload = require("../middlewares/multer.middleware")

const router = express.Router()
router.get("/", controller.getHomePage)
router.get("/about", controller.getAboutPage)
router.get("/contact", controller.getContactPage)
router.get("/posts", controller.getPosts)

router.get("/register", controller.getRegister)
router.post("/register", controller.postRegister)

router.get("/login", controller.getLogin)
router.post("/login", controller.postLogin)

router.get("/compose", controller.getCompose)
router.post("/compose", upload.single("blog_image"), controller.postCompose)

router.get("/edit-post/:postId", controller.getEditPost)
router.post("/edit-post", upload.single("blog_image"), controller.postEditPost)
router.post("/delete-post", controller.postDeletePost)

router.get("/user", controller.getUser)

module.exports = router
