const { Users } = require('../models');

const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ message: 'No token provided' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            const user = await Users.findByPk(decoded.id);
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token or unauthorized' });
        }
    };
};

module.exports = authorize;