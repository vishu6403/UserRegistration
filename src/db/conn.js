const mongoose = require("mongoose");

        mongoose.connect("mongodb://127.0.0.1:27017/userRegistration", {
        }).then(() => {
            console.log(`connection successful`);// if connecection is established
        }).catch((e) => {
            console.log(`connection failed`); //if connection not established
        })

        //used to connect the database to the server where database is stored