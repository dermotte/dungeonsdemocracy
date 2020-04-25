class AiDungeon {

    constructor() {
        this.host = "https://dungeonsdemocracy.herokuapp.com";
        //this.host = "http://localhost:5000";
        this.defaultEmail = "dungeonsdemocracy@gmail.com";
        this.defaultPassword = "23XvgTidFEAga6kKFJVK";
    }

    async login(email, password) {
        if (!email) email = this.defaultEmail;
        if (!password) password = this.defaultPassword;
        let response = await axios.post(this.buildUrl("login"), {email: email, password: password});
        // this.log(response.data);
        return response.data;
    }

    // initialize a new story, either with a user defined starting sentence (customPrompt)
    // or - if undefined - based on pre-defined starting phrases
    async initStory(customPrompt) {
        let data = {};
        if (customPrompt) {
            data.customPrompt = customPrompt;
        }
        let response = await axios.post(this.buildUrl("initStory"), data);
        // this.log(response.data);
        return response.data;
    }

    async generate(text) {
        if (!text) {
            text = "";
        }
        // TODO instead of text, we would alternatively input a new 'context'
        let response = await axios.post(this.buildUrl("input"), {text: text});
        // this.log(response.data);
        return response.data;
    }

    buildUrl(path) {
        return this.host + "/" + path;
    }

    log(msg) {
        console.log("AI DUNGEON: " + JSON.stringify(msg));
    }
}

var aiDungeon = new AiDungeon();
