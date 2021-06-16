const rejectUnauthenticated = (req, res, next) => {
    // check if logged in
    if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
        next();
    } else {
    // failure best handled on the server. do redirect here.
        res.status(403).send({
            message: 'User is not authorized to access this data.',
        });
    }
};

module.exports = { rejectUnauthenticated };
