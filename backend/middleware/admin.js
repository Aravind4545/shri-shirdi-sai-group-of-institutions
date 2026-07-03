const prisma = require('../prisma/client');


module.exports = async function(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user && user.role === 'Admin') {
      next();
    } else {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
