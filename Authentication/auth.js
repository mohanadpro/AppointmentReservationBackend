const jwt = require('jsonwebtoken');
const config = require('../config');
class Auth {
    constructor(token) {
        this.token = token;
    }

    isAuthentication() {
        if (this.token == '') {
            return false;
        }
        try {
            const actToken = this.token.split(' ')[1];
            var decoded = jwt.verify(actToken, config.JWT_SECRET);
            if (decoded.user._id != undefined) {
                return true;
            }
            else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
}

module.exports = Auth