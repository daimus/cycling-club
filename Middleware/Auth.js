exports.authenticatedOnly = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

exports.unAuthenticatedOnly = (req, res, next) => {
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}