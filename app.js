const express = require('express')
const app = express()
const PORT = process.env.PORT | 8000
const bodyparper = require('body-parser')
const request = require('request')



app.use(bodyparper.json())


// testing
app.get('/',(req, res)=>{
    res.send("hello world")
    res.end()
})

// getting the access token
app.get('/access_token', access, (req, res) =>{
    res.status(200).json({"access_token": req.access_token})
})

// registering my url 

app.get('/register', access , (req,res)=>{
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer " + req.access_token

    request(
        { 
           method: 'POST',
           url : url,
           headers:{
               "Authorization": auth
           },
           json:{
            "ShortCode": "600383",
            "ResponseType": "Complete",
            "ConfirmationURL": "https://locolhost:8000/confirmation",
            "ValidationURL": "https://locolhost:8000/validation"

           }

        },
        function(error, response, body){
            if (error){console.log(error)}
            else{
                res.json(body)
                console.log(body)
            }
        }
    )
})

app.post('/confirmation', (req,res)=>{
    console.log('------confirmation-------')
    console.log(res.body)
})

app.post('/validation', (req,res)=>{
    console.log('------validation-------')
    console.log(res.body)

})

app.get('/simulate', access, (req, res)=>{
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
    let auth = "Bearer " + req.access_token

    request(
        { url : url,
          method : 'POST',
          headers:{ "Authorization" : auth},
          json: {
            "ShortCode":"600383",
            "CommandID":"CustomerPayBillOnline",
            "Amount":"5",
            "Msisdn":"254708374149",
            "BillRefNumber":"testing"
          }

        },
        function(error, response, body){
            if(error){console.log(error)}
            else{
                res.json(body)
            }
        }
    )
})















// a function to get access token will be reused
function access(req, res, next){

let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
var auth = "Basic " + new Buffer.from("vGaq5fq4X3NNbsGAftkRmgjyy9N2h3G:ZAno0CMSEUIyh8E").toString("base64");

request(
  {
    url : url,
    headers : {
      "Authorization" : auth
    }
  },
  (error, response, body) => {
    if(error){console.log(error)}
    else{
        req.access_token = JSON.parse(body).access_token
        next()
    }
  }
)

}




app.listen(PORT, () =>{console.log(`listing at port ${PORT}`)})