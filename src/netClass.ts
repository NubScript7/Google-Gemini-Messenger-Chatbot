class Net {
	public url: string
	public nickname: string
	public output: string

	
	constructor() {
		this.url = "self";
		this.nickname = "";
		this.output = "https://graph.facebook.com/v2.6/me/messages";
	}

	set_url(url: string) {
		this.url = url;
	}
	
	set_name(name: string) {
		this.nickname = name;
	}

	set_output(output: string) {
		this.output = output;
	}
}

export default Net;