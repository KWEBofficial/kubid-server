import passport from 'passport';

export const authRequired = passport.authenticate('jwt', { session: false });

module.exports = { authRequired };
