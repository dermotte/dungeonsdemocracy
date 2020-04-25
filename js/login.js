function init() {
  // check if user already logged in
  user = utils.getUserName();
  if (user) {
    console.log(user)
    // return to game
    window.location = 'game.html';
  }
}


function login() {

  let input = document.querySelector("#username_input");
  let info = document.querySelector("#info");
  if (!input.checkValidity()) {
    info.innerHTML = input.validationMessage;
    return false;
  }
  utils.saveToLocalStorage(lsVars.user, input.value);
  return true;
}
