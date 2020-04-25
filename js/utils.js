// import
// <script type="text/javascript" src="js/utils.js"></script>
// use
// e.g. utils.loadfromLocalStorage(lsVars.user)

// localStorage Vars stored values
var lsVars = {
  user : "user",
  sessionID: "sessionID",
  sessionName: "sessionName"
}

class Utils {
  constructor() {
  }
  loadFromLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name));
  }
  saveToLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  }
  removeFromLocalStorage(name) {
    localStorage.removeItem(name);
  }
  clearLocalStorage() {
    localStorage.clear();
  }
  getUserName() {
    return this.loadFromLocalStorage(lsVars.user);
  }
  getSessionID() {
    return this.loadFromLocalStorage(lsVars.sessionID);
  }
  getSessionName() {
    return this.loadFromLocalStorage(lsVars.sessionName);
  }

}
var utils = new Utils();
