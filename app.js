const path = require("path")

const express = require("express")
const bodyParser = require("body-parser")

const _ = require("lodash")

const session = require("express-session")

const errorController = require("./controllers/error")
const sequelize = require("./utiliities/database")
const Post = require("./models/post")
const User = require("./models/user")
let initial_path = path.join(__dirname, "public")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

const Routes = require("./routes/routes1")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(initial_path))

app.use(
	session({
		secret: "your-secret-key", // Secret used to sign the session ID cookie
		resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
		saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store, default is true
	})
)

app.use((req, res, next) => {
	if (!req.session.userId) {
		req.session.userId = 1
		//return next() // No user session available, move to next middleware
	}

	// Fetch user from database using user ID stored in session
	User.findByPk(req.session.userId)
		.then((user) => {
			if (!user) {
				// No user found with the ID stored in session
				// Create a dummy user
				return User.create({
					email: "dummy@example.com",
					password: "password",
				})
			}
			return user // Return the user if it exists
		})
		.then((user) => {
			req.user = user // Attach user object to request
			next()
		})
		.catch((err) => {
			console.log(err)
			next(err) // Pass error to error handling middleware
		})
})

/*app.use((req, res, next) => {
	User.findByPk(1)
		.then((user) => {
			req.user = user
			next()
		})
		.catch((err) => {
			console.log(err)
		})
})*/

/*app.use((req, res, next) => {
	User.findOrCreate({
		where: { email: email,
		password: password},
	})
	.then((user) => {
		req.user = user
		next()
	})
	.catch((err) => console.log(err))
})*/

app.use(Routes)

app.use(errorController.get404)

Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" })
User.hasMany(Post)
sequelize
	//.sync({ force: true })
	.sync()
	.then((user) => {
		console.log(user)
		app.listen(3000, () => {
			console.log("Server is running on port 3000")
		})
	})
	.catch((err) => {
		console.log(err)
	})
