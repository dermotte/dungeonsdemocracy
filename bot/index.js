const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = new express();

app.get('/', function(request, response){
    response.sendFile(__dirname+'/welcome.html');
});

app.listen(PORT);