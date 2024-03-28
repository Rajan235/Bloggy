const Post = require("../models/post")
const _ = require("lodash")
const User = require("../models/user")
exports.getHomePage = (req, res, next) => {
	res.render("homepage.ejs")
}

exports.getAboutPage = (req, res, next) => {
	res.render("about.ejs")
}

exports.getContactPage = (req, res, next) => {
	res.render("contact.ejs")
}

exports.getCompose = (req, res, next) => {
	res.render("compose")
}

exports.postCompose = (req, res, next) => {
	const title = req.body.title
	const description = req.body.description
	const image_URL = req.body.image_URL
	if (!req.session.user) {
		// Handle case where user is not logged in
		// You might redirect back to login page with an error message
		return res.redirect("/login")
	}
	const userId = req.session.user.id // Assuming user ID is stored in session
	console.log("user id is ")
	console.log(userId)
	Post.create({
		title: title,
		description: description,
		image_URL: image_URL,
		userId: userId, // Associate the post with the logged-in user's ID
	})
		.then((result) => {
			console.log(result)
			console.log("Created Post")
			res.redirect("/posts")
		})
		.catch((err) => {
			console.log(err)
			// Handle error appropriately
			res.redirect("/compose") // Redirect back to compose page with error message
		})
}

exports.getEditPost = (req, res, next) => {
	const postId = req.params.postId
	if (!req.session.user) {
		return res.redirect("/login") // Redirect to login page if user is not logged in
	}
	Post.findByPk(postId)
		//.getPosts({ where: { id: postId } })
		.then((post) => {
			//const post = posts[0]
			if (!post) {
				return res.redirect("/posts")
			}
			res.render("edit-post.ejs", {
				post: post,
			})
		})
		.catch((err) => {
			console.log(err)
		})
}
exports.postEditPost = (req, res, next) => {
	const postId = req.body.postId
	const updatedTitle = req.body.title
	const updatedDescription = req.body.description
	const updatedImage_URL = req.body.image_URL
	if (!req.session.user) {
		return res.redirect("/login") // Redirect to login page if user is not logged in
	}
	Post.findByPk(postId)
		.then((post) => {
			post.title = updatedTitle
			post.description = updatedDescription
			post.image_URL = updatedImage_URL
			return post.save()
		})
		.then((result) => {
			console.log("Updated product")
			res.redirect("/")
		})
		.catch((err) => {
			console.log(err)
		})
}

/*exports.getEditPost = (req, res, next) => {
	const postId = req.params.postId
	// Ensure a user is logged in
	if (!req.session.user) {
		return res.redirect("/login") // Redirect to login page if user is not logged in
	}
	const userId = req.session.user.id // Get the logged-in user's ID from the session
	console.log("user id is " + userId + " " + postId)
	Post.findOne({ where: { id: postId, userId: userId } })
		.then((posts) => {
			const post = posts[0]
			if (!post) {
				return res.redirect("/posts")
			}
			res.render("edit-post.ejs", {
				post: post,
			})
		})
		.catch((err) => {
			console.log(err)
			res.redirect("/")
		})
}
exports.postEditPost = (req, res, next) => {
	const postId = req.body.postId
	const updatedTitle = req.body.title
	const updatedDescription = req.body.description
	const updatedImage_URL = req.body.image_URL
	if (!req.session.user) {
		return res.redirect("/login") // Redirect to login page if user is not logged in
	}

	const userId = req.session.user.id

	Post.findOne({ where: { id: postId, userId: userId } })
		.then((post) => {
			if (!post) {
				return res.redirect("/posts") // Redirect if the post does not exist or does not belong to the user
			}
			// Update post properties
			post.title = updatedTitle
			post.description = updatedDescription
			post.image_URL = updatedImage_URL
			return post.save()
		})
		.then((result) => {
			console.log("Updated product")
			res.redirect("/")
		})
		.catch((err) => {
			console.log(err)
			res.redirect("/")
		})
}*/

exports.getPosts = (req, res, next) => {
	if (!req.session.user) {
		return res.redirect("/login") // Redirect to login page if user is not logged in
	}
	const userId = req.session.user.id
	Post.findAll({ where: { userId: userId } })
		.then((posts) => {
			res.render("posts.ejs", {
				posts: posts,
			})
		})
		.catch((err) => {
			console.log(err)
			// Handle error appropriately
			res.redirect("/") // Redirect to homepage or another appropriate route
		})
}
/*exports.getPost = (req, res, next) => {
	const postId = req.params.postId
	Post.findByPk(postId)
		.then((post) => {
			res.render("post-detail"),
				{
					post: post,
				}
		})
		.catch((err) => {
			console.log(err)
			res.redirect("/posts")
		})
}*/
exports.postDeletePost = (req, res, next) => {
	const postId = req.body.postId
	Post.destroy({ where: { id: postId } })
		.then((result) => {
			console.log("Product Deleted")
			res.redirect("/posts")
		})
		.catch((err) => {
			console.log(err)
		})
}
exports.getUser = (req, res, next) => {
	res.render("user.ejs")
}

exports.getRegister = (req, res, next) => {
	res.render("register.ejs")
}

exports.getLogin = (req, res, next) => {
	res.render("login.ejs")
}

exports.postRegister = (req, res, next) => {
	const email = req.body.username
	const password = req.body.password
	User.create({
		email: email,
		password: password,
	})
		.then((result) => {
			console.log(result)
			console.log("User Created")
			res.redirect("/user")
		})
		.catch((err) => {
			console.log(err)
		})
}

exports.postLogin = (req, res, next) => {
	const email = req.body.username
	const password = req.body.password
	User.findOne({ where: { email: email, password: password } })
		.then((user) => {
			if (!user) {
				// Handle case where user is not found
				// You might redirect back to login page with an error message
				return res.redirect("/login")
			}
			req.session.user = user // Store user data in session
			res.redirect("/")
		})

		.catch((err) => {
			console.log(err)
			// Handle error appropriately
			res.redirect("/login")
		})
}
