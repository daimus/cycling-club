

exports.login = (req, res) => {
    res.render('auth/login');
}

exports.signin = (req, res) => {
    res.send('sign in');
}

exports.register = (req, res) => {
    res.render('auth/register');
}

exports.signup = (req, res) => {
    res.send('sign up');
}

exports.logout = (req, res) => {
    res.send('logout');
}