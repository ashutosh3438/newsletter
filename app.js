const express = require ("express");
const https = require ("https");
const bodyParser = require("body-parser");

const app = express();

//To be able to serve up static content to the browser
app.use(express.static("public"));

//To be able to parse the body of the http request
app.use(bodyParser.urlencoded({extended: true}));

//Handle get for root endpoint
app.get("/", (req,res) => {
  res.sendFile(__dirname + "/signup.html");
});

//Handle post for root endpoint
app.post("/", (req,res) => {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  //Mock success endpoint via beeceptor
  const url = "https://practice.free.beeceptor.com/path1";

  //Mock failure endpoint via beeceptor
  const url2 = "https://practice.free.beeceptor.com/path2";

  //we are going to pass a JS object in a stringified format in the post request
  let data = {
    members: [
      {
        emailId: email,
        status: "subscribed",
        full_name: {
          fName: firstName,
          lName: lastName
        }
      }
    ]
  }

  const options = {
    method: "POST"
  }

  let jsonData = JSON.stringify(data);
  console.log(jsonData);

  //Learning: Use https.request method to POST a request
  //The "options" object can be used to specify teh type of Method, i.e. post along with any other params such as auth etc.
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
      console.log(response.statusCode);
    });
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  //the request needs to be assigned to a variable in the method call above and then we can write the data to be posted
  //to this varible.
  //Don't forget to end the request
  request.write(jsonData);
  request.end();

});

//Handle post for "failure", i.e. redirect to signup.html, i.e. root
app.post("/failure", (req, res) => {
  res.redirect("/");
});

//Start server on port 3003
app.listen(process.env.PORT || 3003, ()=> {
  console.log("Servier running on port: 3003");
});
