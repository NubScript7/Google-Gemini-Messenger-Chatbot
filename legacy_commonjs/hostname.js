const {hostname: getInternalHostname} = require("os");
module.exports = getInternalHostname;
module.exports.default = getInternalHostname;