const colors = require('colors');

const { identifier, name, random, pick } = require('./random');

const shards = ['A', 'B', 'C', 'D'];

const simulateClients = shardId => ({
  send: message => console.log('SND'.cyan, message.id),
  ack: ackr => console.log('ACK'.green, ackr.messageId, `[${ackr.persisterId}]`.dim.green, `${ackr.time}ms`),
  receive: onMessage => {
    console.log('START'.bgCyan.white.bold, 'shardId:', shardId);
    setInterval(
      _callback => {
        const shard = pick(shards);
        const message = {
          id: identifier(shard),
          shard,
          user: name()
        };
        console.log('RCV', message);
        _callback(message);
      },
      1000,
      onMessage
    );
  }
});

const simulateDatabase = persisterId => {
  console.log('PERSISTER'.bgRed.white.bold, persisterId);
  return {
    save: ({ id }) => {
      console.log(`SAVE [${persisterId}]`.grey, id.grey);
      return new Promise((resolve, reject) => {
        const delayInMs = random(10, 1000);
        setTimeout(() => {
          const ack = JSON.stringify({
            messageId: id,
            persisterId,
            time: delayInMs
          });
          console.log(`SAVE [${persisterId}]`.green, id, `(${delayInMs}ms)`);
          resolve(ack);
        }, delayInMs);
      });
    }
  };
};

module.exports = { simulateClients, simulateDatabase, shards };
