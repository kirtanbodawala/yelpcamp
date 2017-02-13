var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

//Schema setup

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Salmon creek", 
// 		image: "http://www.hikinginbigsur.com/hikepix/salmoncreekmain.jpg"
// 	}, function(err, campground){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				console.log(campground);
// 			}
// 		}
// ); 

app.get("/", function(req, res){
	res.render("landing");
});


app.get("/campgrounds", function(req, res){

	Campground.find({}, function(err, campgrounds){
		if(err){
				console.log(err);
			} else {
				res.render("campgrounds", {campgrounds: campgrounds});
			}
		});
});

//CREATE - creates a new campground 
app.post("/campgrounds", function(req, res){
	var name = req.body.campName;
	var image = req.body.campImage;
	var desc = req.body.campDescription;
	var newCampground = {name: name, image:image, description: desc};
	Campground.create(newCampground);
	res.redirect("/campgrounds"); 
});

//NEW - redirects to the form to create a new capground
app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

//SHOW - shows description od one campground
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			console.log(foundCampground);
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(9000, "localhost", function(){
	console.log("Yelp Camp Server Started");
});