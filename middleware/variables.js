module.exports = async function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    res.locals.isAdmin = req.session.isAdministrator
    next()
  }