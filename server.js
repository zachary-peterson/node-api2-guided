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

server.get('/api/hubs', (req, res) => {
  console.log(req.query) // http://localhost:4000/api/hubs?limit=20 // { foo: 'bar', baz: 'fizz' }
  Hubs.find(req.query)
  .then(hubs => {
    res.status(200).json(hubs);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hubs',
    });
  });
});

server.get('/api/hubs/:id', (req, res) => {
  Hubs.findById(req.params.id)
  .then(hub => {
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'Hub not found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hub',
    });
  });
});

server.post('/api/hubs', (req, res) => {
  Hubs.add(req.body)
  .then(hub => {
    res.status(201).json(hub);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error adding the hub',
    });
  });
});

server.delete('/api/hubs/:id', (req, res) => {
  Hubs.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The hub has been nuked' });
    } else {
      res.status(404).json({ message: 'The hub could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the hub',
    });
  });
});

server.put('/api/hubs/:id', (req, res) => {
  const changes = req.body;
  Hubs.update(req.params.id, changes)
  .then(hub => {
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'The hub could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the hub',
    });
  });
});

// add an endpoint that returns all the messages for a hub
server.get('/api/hubs/:id/messages', (req, res) => {
  // we need to find a good function inside the model
  Hubs.findHubMessages(req.params.id)
    .then(data => {
      // throw new Error('that was arghhhhh!!!!!!')
      console.log(data)
      if (!data.length) {
        res.status(404).json({
          message: 'No messages, OR No hub with id ' + req.params.id
        })
      } else {
        res.status(200).json(data)
      }
    })
    .catch(error => {
      console.log(error.message, error.stack)
      res.status(500).json({
        // message: 'that was an error of some sort'
        message: error.message,
        stack: error.stack,
      })
    })
})
// add an endpoint for adding new message to a hub [POST] { sender, text } :id
server.post('/api/hubs/:id/messages', (req, res) => {
  const newMessage = { hub_id: req.params.id, ...req.body }
  Hubs.addMessage(newMessage)
    .then(data => {
      console.log(data)
      res.status(201).json(data)
    })
    .catch(error => {
      // console.log(error) // this is not gonna go well
      console.log(error.message, error.stack)
      res.status(500).json({
        // message: 'that was an error of some sort'
        message: error.message,
        stack: error.stack,
      })
    })
})
