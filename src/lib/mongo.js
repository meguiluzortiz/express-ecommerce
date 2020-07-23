const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:mongo');
const { config } = require('../config');

const DB_USER=encodeURIComponent(config.dbUser);
const DB_PASSWORD=encodeURIComponent(config.dbPassword);

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;
const MONGO_OPTIONS = {
  ignoreUndefined: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let cachedDb;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, MONGO_OPTIONS);
  }

  async connect() {
    try {
      if (!cachedDb) {
        cachedDb = await this.client.connect();
        debug('Connected succesfully to mongo');
      }

      return cachedDb.db();
    } catch (error) {
      debug('Couldn\'t connecto to mongo');
      throw error;
    }
  }

  getAll(collection, query) {
    return this.connect().then((db) => {
      return db.collection(collection).find(query).toArray();
    });
  }

  get(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data);
      })
      .then((result) => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then((result) => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }
}

module.exports = MongoLib;
