function setBackground(item) {
  var background = item.dataset["background"];
  item.style.background = background;
  item.removeAttribute("data-background");
  item.setAttribute("data-processed-background", background);
}

document.querySelectorAll("[data-background]").forEach(setBackground);