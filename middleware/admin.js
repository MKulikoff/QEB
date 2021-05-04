module.exports = function(req, res, next) {
    if(!req.session.isAdministrator) {
      return res.redirect('/card')
    }
    next()
}