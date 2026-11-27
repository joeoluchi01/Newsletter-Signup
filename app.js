require("dotenv").config();
const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const { dirname } = require("path")
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req,res){

    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req,res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const Data = {

        members: [ {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname,
            }

       }
        ]
    }

const JsonData = JSON.stringify(Data)

const url = `https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`

const options = {
    method: "POST",
    auth: `joeoluchi:${process.env.MAILCHIMP_API_KEY}`
}

 const request = https.request(url, options, function(response){

request.on("error", function (err) { 
    console.log("MailChimp request failed:", err.message) 
    if (!res.headersSent){
        res.sendFile(__dirname + "/failure.html")
    }  })

console.log(response.statusCode)
    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html")
    } else{
        res.sendFile( __dirname + "/failure.html")
    }

response.on("data", function(data){

    console.log(JSON.parse(data))

})
})
request.write(JsonData)
request.end()


})

app.post("/failure", function(req,res){
    res.redirect("/")
})



app.listen(PORT, function(){
    console.log("Web is running on Port 3000.")
})


