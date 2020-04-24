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
