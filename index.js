const express = require('express')
const fs = require('fs')
const fileUpload = require('express-fileupload');
var app = express()
app.use(express.json());

app.use(fileUpload());

app.use(express.static('public'));

const PORT = 80
const HOST = 'localhost'

var users = []
var requestBuffer = {}
var responseBuffer = {}

function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
            return true;
        }
    }
    return false;
}

function remove(arr,...forDeletion) {
    return arr.filter(item => !forDeletion.includes(item))
}

app.get('/download/:file_name',(req,res)=>{
    fileName = req.params.file_name
    console.log('File '+ fileName +' download.')
    res.download('./ShareContent/'+ fileName)
})

app.get('/users',(req,res)=>{
    res.send(users)
})
app.get('/requestBuffer',(req,res)=>{
    res.send(requestBuffer)
})

app.get('/responseBuffer',(req,res)=>{
    res.send(responseBuffer)
})

app.get('/response/:user',(req,res)=>{
    find = false
    targetUser = req.params.user
    for(var user in responseBuffer){
        if(user == targetUser){
            curRes = responseBuffer[user]
            find = true
            res.send(curRes)
            delete responseBuffer[user]
        }
    }
    if(!find){
        res.send('404')
    }
})

app.post('/send/req',(req,res)=>{
    targetUser = req.body.user
    message = req.body.message
    if(!contains(users,targetUser)){
        res.send('404')
    }
    requestBuffer[targetUser] = message
    res.send('200')
    console.log('Sent request to user: -' + targetUser + '- Message: ' + message)
})

app.post('/send/res',(req,res)=>{
    user = req.body.user
    message = req.body.message
    responseBuffer[user] = message
    res.send('200')
    console.log('Sent response from user: -' + user + '- Message: ' + message)
})

app.get('/listen/:user',(req,res)=>{
    curUser = req.params.user
    if(!contains(users,curUser)){
        users.push(curUser)
        console.log('User ' + curUser + ' reconnected!')
    }
    var find = false

    for(var user in requestBuffer){
        if(user == curUser){
            curReq = requestBuffer[user]
            find = true
            res.send(curReq)
            delete requestBuffer[user]
        }
    }
    if(!find){
        res.send('404')
    }
})
app.post('/connect',(req,res)=>{
    let user = req.body.user
    if(!contains(users,user)){
        users.push(user)
        res.send('201')
        console.log('User '+user+' connected!')
    }else{
        res.send('201')
        console.log('User ' + user + ' reconnected!')
    }
})
app.post('/disconnect',(req,res)=>{
    let user = req.body.user
    if(contains(users,user)){
        users = remove(users,user)
        res.send('201')
        console.log('User '+user+' disconnected!')
    }else{
        res.send('201')
        console.log('User ' + user + ' not connected!')
    }
})

app.post('/upload', (req, res) => {
    console.log(req.files);
    // Get the file that was set to our field named "image"
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/upload/' + image.name);

    res.sendStatus(200);
});

app.listen(PORT,HOST,() => {
    console.log(`Server started: http://${HOST}:${PORT}`)
})
