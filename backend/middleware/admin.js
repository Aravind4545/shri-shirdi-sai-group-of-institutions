const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'Admin') {
      next();
    } else {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
