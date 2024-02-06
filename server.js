// import dependencies
const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

// create express app
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));

// connect to the database
const uri = process.env.DB_URL;
mongoose.connect(uri).then(() => {
	app.listen(process.env.PORT || port);
	console.log("database connnected, server is now running on localhost:3000");
});

// set up view engine
app.set("view engine", "ejs");

// make a GET handlers
app.get("/", async (req, res) => {
	const shortUrls = await ShortUrl.find();
	res.render("index", { shortUrls });
});

app.post("/shortUrls", async (req, res) => {
	// jadi ini merupakan function asynchronou dimana dia akan lanjut ke line selanutnya trus walaupun belum seleai
	await ShortUrl.create({ full: req.body.fullUrl }); // nah async await ini buat cegah hal itu, jadi dia itu kyk 'ini function async tpi gw mau nunggu dia selesai sebelum lanjut 'await'
	res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
	if (shortUrl == null) return res.sendStatus(404);

	shortUrl.clicks++;
	shortUrl.save();

	res.redirect(shortUrl.full);
});
