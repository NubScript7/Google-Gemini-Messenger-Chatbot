class Net {
	constructor() {
		this.url = "self";
		this.nickname = null;
		this.output = "https://graph.facebook.com/v2.6/me/messages";
	}

	set_url(url) {
		this.url = url;
	}
	
	set_name(name) {
		this.nickname = name;
	}

	set_output(output) {
		this.output = output;
	}
}

module.exports = Net;
module.exports.default = Net;