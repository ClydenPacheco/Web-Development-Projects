const interval = setInterval(() => {
  var date = new Date();
  var options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  var timeString = date.toLocaleTimeString('en-US', options);
  
  let [hours, minutes, seconds, ampm] = timeString.match(/(\d{2}):(\d{2}):(\d{2}) (\w{2})/).slice(1, 5);

  let values = document.querySelectorAll(".value");
  values[0].innerHTML = hours + ":";
  values[1].innerHTML = minutes + ":";
  values[2].innerHTML = seconds;
  values[3].innerHTML = ampm;
}, 1000);
  
function toggleMode() {
  const body = document.body;
  const button = document.querySelector("button");

  const isDarkMode = body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode", !isDarkMode);

  button.textContent = isDarkMode ? "Night Mode" : "Light Mode";
}
