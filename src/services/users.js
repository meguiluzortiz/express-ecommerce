const MongoLib = require('../lib/mongo');
const bcrypt = require('bcryptjs');

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

  async createUser(user) {
    const { username, email, password } = user;
    const hashedPassword = await bcrypt.hash(password);

    const createUserId = await mongoDB.create(this.collection, {
      username,
      email,
      password: hashedPassword,
    });

    return createUserId;
  }
}

module.exports = UsersService;
