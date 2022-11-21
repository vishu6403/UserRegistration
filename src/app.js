const express = require("express"); //importing express module
const path = require("path"); //providing the utilities for working
const app = express(); //makes express app
const hbs = require("hbs"); //for rendering hbs files
require("./db/conn"); //establishing the connection
const Register = require("./models/registers"); //importing file from module
const port = process.env.PORT || 3000; //defining port on which project will be running
// console.log(path.join(__dirname, "../public"));
const static_path = path.join(__dirname, "../public"); //joining specific paths into one
const template_path = path.join(__dirname, "../template/views"); 
const partials_path = path.join(__dirname, "../template/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));// to stop extended values


app.use(express.static(static_path));
app.set("view engine", "hbs"); //setting view engine and hbs
app.set("views", template_path);
hbs.registerPartials(partials_path);

//For rendering the hbs page
app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", async (req, res) => { //creating async function request after submitting the form
    try {                                   // method to confirn if both passwords typed are same
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {      //loop will enter only if both passwords are same
            const registerEmployee = new Register({
                firstname: req.body.firstname,      //User details
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })
            const registered = await registerEmployee.save(); //if passwords do not match.
            res.status(201).render("index");
            //res.status(201).render("register");
        } else {
            res.send("Passwords are not Matching")
        }
    } catch (error) {    //error if user tries to register with same details
        res.status(400).send(error);
    }
});



app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})