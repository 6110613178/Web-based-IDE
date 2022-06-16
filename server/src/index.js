const express = require('express')
const app = express()
const server = require("http").Server(app);
const axios = require('axios');
const request = require('request')
const SocketService = require("./SocketService");

const cors = require('cors');
const fs = require('fs');
const path = require('path');

const corsOptions = {
  origin: 'http://localhost:1234',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.post('/save', (req, res) => {

  fs.writeFile('src/storage/' + req.body.file_name + '.' + req.body.language, req.body.code, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
})

app.post('/check', (req, res) => {

  var data = { 'text': req.body.text }
  var url = 'https://8477-2405-9800-ba10-f053-3d8f-a873-f137-4f09.ap.ngrok.io/text'
  var header = req.headers['content-type'];
  const options = {
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': header
    },
    "formData": data
  }

  request(options, function (error, response) {
    var markdown = JSON.parse(response.body)
    console.log(error, markdown);
    res.send(markdown);
    return;
  });
  
});

const port = 8000;

server.listen(port, function () {
  console.log("Server listening on : ", port);
  const socketService = new SocketService();
  socketService.attachServer(server);

  // fs.writeFile('src/storage/code.py', '', function (err) {
  //   if (err) throw err;
  // });
  // fs.writeFile('src/storage/code.java', 'public class code {\n  public static void main(String[] args) {\n      System.out.println("This is Java file");\n  }\n}', function (err) {
  //   if (err) throw err;
  // });

  fs.readdir('src/storage', (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join('src/storage', file), err => {
        if (err) throw err;
      });
    }
  });

});
