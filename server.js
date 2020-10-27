const express = require('express');
const hubsRouter = require('./hubs/hubs-router.js')

const server = express();

// are where we configure the app/server
server.use(express.json()); // gives Express the ability to parse the req.body
server.use(hubsRouter)

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

// common.js equiv of export default
module.exports = server
