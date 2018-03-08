var methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    expressSanitizer= require("express-sanitizer"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    

// mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb://danskophile:1234@ds161148.mlab.com:61148/restful-blog");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String, 
    image: String, 
    body: String, 
    date: {type: Date, default: Date.now}
}); 

var Blog = mongoose.model("Blog", blogSchema); 

// Blog.create({
//     title: "First blog post!", 
//     image: "https://www.nationalgeographic.com/content/dam/travel/Guide-Pages/europe/ireland/ireland_NationalGeographic_1561052.ngsversion.1501515053876.adapt.1900.1.jpg", 
//     body: "This is a picture of the great country"
// })

// ROOT ROUTE

app.get("/", function(req, res){
    res.redirect("/blogs"); 
})

// INDEX ROUTE

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err); 
        } else {
            res.render("index", {blogs: blogs}); 
        }
    })
})

// NEW ROUTE

app.get("/blogs/new", function(req, res){
    res.render("new"); 
})


// CREATE ROUTE

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, blog){
        if(err){
            console.log(err); 
        } else {
            res.redirect("/blogs"); 
        }
    })

})

// SHOW ROUTE

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            console.log(err); 
        } else {
            res.render("show", {blog: foundBlog}); 
        }
    })
})

// EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err); 
        } else {
            res.render("edit", {blog: foundBlog}); 
        }
    })
})

// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err); 
        } else {
            res.redirect("/blogs/" + req.params.id); 
        }
    })
})

// DESTROY ROUTE

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err); 
        } else {
            res.redirect("/blogs"); 
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
})