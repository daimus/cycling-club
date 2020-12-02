

exports.index = (req, res) => {
    res.render('user/index');
}

exports.profile = (req, res) => {
    res.send('Welcome ' + req.user.name);
}