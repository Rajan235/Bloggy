const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/upload_images")
	},
	filename: function (req, file, cb) {
		console.log(file)
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + path.extname(file.originalname))
	},
})

const upload = multer({ storage: storage })

module.exports = upload
