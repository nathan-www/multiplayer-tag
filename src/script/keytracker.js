let keys = [];

window.addEventListener("keydown", (e) => {
  if (!keys.includes(e.key)) {
    keys.push(e.key);
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.includes(e.key)) {
    keys.splice(keys.indexOf(e.key), 1);
  }
});

export default keys;
