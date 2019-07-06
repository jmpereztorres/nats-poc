const {
  simulateDatabase
} = require('./simulate');
const NATS = require('nats');
const nats = NATS.connect({
  servers: ['nats://127.0.0.1:4222']
});

const persisterId = process.argv.length > 2 ? process.argv.slice(-1)[0] : random(1, 9);

const db = simulateDatabase(persisterId);



// Persister should get messages from queue and store them using `db.save` method
// After that, it should send back an ACK confirmation for that message.
// COMPLETE CODE HERE

nats.subscribe('*', {
  queue: 'work01'
}, (msg, reply, subject) => {
  console.log('recibo' + msg)
  db.save(JSON.parse(msg)).then(ack => {
    console.log('Message properly stored', ack);
    let websocket = simulateClients(JSON.parse(msg).shard);
    websocket.ack(ack);
  });
});



// Suscripción a cola 

// EXAMPLE 3. How to store a message in the database (simulated!)
// const message = {
//   id: 'A1'
// };
// db.save(message).then(ack => {
//   console.log('Message properly stored', ack);

// Publicación
// COMPLETE CODE HERE
// });