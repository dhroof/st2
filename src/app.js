const express = require("express"); // fetch express module
const path = require("path"); // fetch path module
const app = express(); // call express function
const hbs = require("hbs"); // fetch handlebars module
require("./db/conn"); // import the connection moule containing mongoose connection

const Register = require("./models/registers");
const Login = require("./models/login");

const port = process.env.PORT || 8000; // assign a port

const static_path = path.join(__dirname, "../public"); // create a static path to serve your static files
const template_path = path.join(__dirname, "../templates/views"); // same in the case of views and partials
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json()); // convert object to JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path)); // function to serve the static files

app.set("view engine", "hbs");
app.set("views", template_path);

hbs.registerPartials(partials_path); // initialize all partials

// work on the get request
app.get("/", (req, res) => {
    res.render("index") // renders home page
});

app.get("/register", (req, res) => {
    res.render("register"); // renders register page
});

app.get("/login", (req, res) => {
    res.render("login"); // renders login page
})

// displays a message when port is running successfully
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});

// let's create a new user in our database
// handle the register request
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        // check if the two entered passwords are same
        if (password === cpassword) {
            // add data against schema if passwords match
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

            // save the data to mongoose coll
            const registered = await registerEmployee.save();

            res.status(201).render("index");
        } else {
            // display error if passwords do not match
            res.send("passwords are not matching");
        }
    } catch (error) {
        // throws error
        res.status(400).send(error);
    }
});

// handle the login request
app.post("/login", async (req, res) => {

    try {
        const email = req.body.email;

        const user = await Register.findOne({ email: email });
        // check if user exists
        if (user == null) {
            // throws an error if user does not exist
            res.send("User not found!");
        }
        else {
            res.send("Logged in successfully!");
        }
    } catch (err) {
        // throws error
        res.status(400).send(error);
    }
});