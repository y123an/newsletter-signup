const express = require('express');
const bodyPareser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyPareser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function (req, res) {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/d1a2f67711"
    const option = {
        method: "POST",
        auth: "yohannes:c6b15fd85cf9f15f9b6c771435da0b16-us12"
    }
    const request = https.request(url, option, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failuer.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})
app.listen(process.env.PORT || 3000, function () {
    console.log("server is listening on port 3000");
});