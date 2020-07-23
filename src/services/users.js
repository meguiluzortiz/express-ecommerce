const MongoLib = require('../lib/mongo');

class UsersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUserByUsername(username) {
    const [user] = await this.mongoDB.getAll(this.collection, {
      username,
    });

    return user;
  }
}

module.exports = UsersService;
