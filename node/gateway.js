const {
  shards,
  simulateClients
} = require('./simulate');

const NATS = require('nats');
const nats = NATS.connect({
  servers: ['nats://127.0.0.1:4222']
});

const shardId = process.argv.slice(-1)[0];
if (!shards.some(s => s === shardId)) {
  console.error('ERROR'.red, 'Unknown shardId, available:', shards.join(','));
  console.error('Usage: node gateway.js B');
  process.exit(-1);
}

const websocket = simulateClients(shardId);
websocket.receive(msg => {
  console.debug(`Message ${msg.id} from user ${msg.user}, connected to shard ${msg.shard}.`);
  // This code executes everytime the server gets a new message from the outside
  // COMPLETE EXERCISE CODE HERE

  console.log(msg);

  nats.publish(msg.shard, JSON.stringify(msg));

  console.log('Enviado')
});

// EXAMPLE 1. If you want to send a message from server to another user:
const message = {
  id: 'A1',
  shard: 'A',
  user: 'Jack'
};
websocket.send(message);

// EXAMPLE 2. If you want to send confirmation a message was properly persisted to a user:
const acknowledge = {
  messageId: 'A1',
  persisterId: 42
};
websocket.ack(acknowledge);