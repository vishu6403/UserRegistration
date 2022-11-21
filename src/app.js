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
            res.status(201).render("login");
            //res.status(201).render("register");
        } else {
            res.send("Passwords are not Matching")
        }
    } catch (error) {    //error if user tries to register with same details
        res.status(400).render("already");
    }
});
app.post("/login", async (req, res) => { //setting a async function with req and res
    try {
        const email = req.body.email; //takig the email and password user enters in login page
        const password = req.body.password;

        //console.log(`${email} and password is ${password}`)
        const useremail = await Register.findOne({email:email}) //checking if the email is registered or not with us

        if(useremail.password===password){
            res.status(201).send(`
            <!DOCTYPE html>
            <html>
            
            <head>
            <title>Details</title>
                <!-- Required meta tags -->
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            
                <!-- Bootstrap CSS -->
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css"
                    integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous" />
            
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="#">User Registration</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                      <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                      <ul class="navbar-nav">
                        <li class="nav-item active">
                          <a class="nav-link" href="http://localhost:3000">Home<span class="sr-only">(current)</span></a>
                        </li>
                      <li class="nav-item active">
                          <a class="nav-link" href="http://localhost:3000/register">Register</a> 
                        </li>
                        <li class="nav-item active">
                          <a class="nav-link" href="http://localhost:3000/login">Login</a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                  
                <style>
                    table {
                        font-family: arial, sans-serif;
                        border-collapse: collapse;
                        width: 70%;
                    }
            
                    td,
                    th {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
            
                    tr:nth-child(even) {
                        background-color: #dddddd;
                    }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <div class="jumbotron">
            
                        <center>
                            <h2>Details of ${useremail.firstname}</h2>
                            <table>
                            <br>
                                <h4>Personal Details :</h4>
                                <br><br>
                                <tr>
                                    <td>User Name</td>
                                    <td>${useremail.firstname} ${useremail.lastname}</td>
                                </tr>
                                <tr>
                                    <td>User Email</td>
                                    <td>${useremail.email}</td>
                                </tr>
                                <tr>
                                    <td>User Phone No.</td>
                                    <td>${useremail.phone}</td>
            
                                </tr>
                                <tr>
                                    <td>User Gender</td>
                                    <td>${useremail.gender}</td>
                                </tr>
                                <tr>
                                    <td>Student Age</td>
                                    <td>${useremail.age}</td>
            
                                </tr>
                            </table>
                            <br>
                            <form action="http://localhost:3000">
                            <input type="submit" value="Sign Out" />
                            </form>
                        </center>
                    </div>
                </div>
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
                    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
                    crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js"
                    integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
                    crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js"
                    integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
                    crossorigin="anonymous"></script>
            </body>
            
            </html>
            `); //if the user enters the correct password 
        }else{
            res.render("Incorrect")
        }
    } catch (error) {
        res.status(400).render("NotRegistered");
    }
});


app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})