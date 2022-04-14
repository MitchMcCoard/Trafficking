/*
    Mitchell McCoard
    James Lear
    Alli Pope
    Parker George

    We came, we saw, we conqured.
    This is our project 3, it is a page that spreads awareness about missing people.
*/

const express = require("express");

let app = express();

var path = require("path");
const { runInNewContext } = require("vm");

const port = process.env.PORT || 3001;

const knex = require(path.join(__dirname + '/knex/knex.js'));

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
//make ejs work
app.set("view engine", "ejs");

//connect to database
/*
const knex = require("knex")({
    client: "pg",
    connection: {
        host : "localhost",
        user : "postgres",
        password : "Gr@ft1ng",
        database : "trafficking",
        port : 5432
    }
});      
*/

app.get("/", (req, res) => {
    res.redirect("/testejs");
});

app.get("/people",(req, res) => {

    knex.select().from("victims").then(list =>{
        res.render("people", {people: list})
    })
});

app.get("/testejs", (req, res) => {
    
    knex.select().from("victims").then(list =>{
        res.render("index", {people: list})
    })
});

app.get("/addRecord", (req, res) => {
    res.render("addRecord");
});

app.post("/addRecord", (req, res) => {
    knex("victims").insert({first_name : req.body.first_name,
    date_missing: req.body.date_missing,
    last_name: req.body.last_name,
    age_at_missing: req.body.age_at_missing,
    city: req.body.city,
    state: req.body.state,
    gender: req.body.gender,
    race: req.body.race}).then(newRecord => {
        res.redirect("/people");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
})

//One thing to note, When we delete in this way and add records our id's begin to skip around. I think that is fine, but just to note.
app.post("/deleteRecord/:id", (req, res) => {
    knex("victims").where("id", req.params.id).del().then(dell => {
        res.redirect("/people");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});

app.get("/toDo", (req,res) => { res.render("toDo",{});});



//method for redirecting to update page
/*
app.get("/updateRecord/:id", (req, res) => {

    knex.select().from("victims").where("id", req.params.id).then(list =>{
        res.render("updateRecord", {people: list})
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })

});

//this is the method that actually updates the record
app.post("/updateRecord/:id", (req, res) => {


    knex.select().from("victims").where("id", parseInt(req.body.id)).update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_missing: req.body.date_missing,
        age_at_missing: req.body.age_at_missing,
        city: req.body.city,
        state: req.body.state,
        gender: req.body.gender,
        race: req.body.race
    }).then(list =>{
        res.render("people", {people: list})
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
}) 
*/

//this is how we redirect to aadd record page
app.get("/addRecord", (req,res) => { res.render("addRecord",{})})


app.get("/findRecord", (req, res) => {
    res.render("findRecord", {});
});


app.get("/updateRecord", (req, res) => {       
    knex.select().from("victims").where("first_name", req.query.firstName).then(fName => {
        res.render("updateRecord", {people: fName});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });    
});

app.post("/updateRecord", (req, res) => {
    knex("victims").where("id", parseInt(req.body.id)).update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_missing: req.body.date_missing,
        age_at_missing: req.body.age_at_missing,
        city: req.body.city,
        state: req.body.state,
        gender: req.body.gender,
        race: req.body.race
    }).then(list => {
        res.redirect("/people");
    });    
});

app.listen(port, ()=> console.log("Project 2 is listening"));