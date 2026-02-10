module.exports = (req, res, next) => {
    if (req.file) {
        req.body.avatar = req.file.path;
    }
    next();
};
