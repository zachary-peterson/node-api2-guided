const express = require('express');

const Hubs = require('./hubs/hubs-model.js');

const server = express();

server.use(express.json()); // gives Express the ability to parse the req.body

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});


// common.js equiv of export default
module.exports = server
