const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');
const UsersService = require('../../../services/users');

passport.use(
  new BasicStrategy(async function (username, password, cb) {
    const usersService = new UsersService();

    try {
      const user = await usersService.getUserByUsername(username);

      if (!user) {
        return cb(boom.unauthorized(), false);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);
