const prisma = require('../prisma/client');


module.exports = async function(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || (user.role !== 'Teacher' && user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
      return res.status(403).json({ msg: 'Access denied. Teacher only route.' });
    }
    // Inject user details so routes can filter by assignedProgram
    req.user.role = user.role;
    req.user.assignedProgram = user.assignedProgram;
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
