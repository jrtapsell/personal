function cardify(outer, item) {
  var card = $("<div/>", {
    "class": "mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col"
  });
  var image_wrapper = $("<div/>", {
    "class": "image-wrapper"
  });
  var title_div = $("<div/>", {
    "class": "mdl-card__title"
  });
  var title = $("<h2/>", {
    "class": "mdl-card__title-text card-title"
  });
  var description = $("<div/>", {
    "class": "mdl-card__supporting-text"
  });
  var link_div = $("<div/>", {
    "class": "mdl-card__actions mdl-card--border"
  });
  var link = $("<a/>", {
    "class": "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
  });
  if (item["icon"]) {
    title_div.css("background", "url('" + item["icon"] + "') no-repeat center ");
    title_div.css("background-size", "contain");
  }
  image_wrapper.css("background", item["backing"] ? item["backing"] : "#CCC");

  if (item["description"]) {
    description.text(item["description"]);
  }

  card.appendTo(outer);
  title_div.appendTo(image_wrapper);
  image_wrapper.appendTo(card);
  description.appendTo(card);
  title.appendTo(title_div);
  title.text(item["name"]);
  link_div.appendTo(card);
  link.appendTo(link_div);
  link.text("Go To");
  link.attr("href", item["url"])
}

function onSuccess(data) {
  var target = $("#target");
  var linksbar = $("#linksbar");
  $.each(data, function(key, value) {
    var link = $("<a/>", {
      "class": "mdl-navigation__link"
    });
    link.text(key);
    link.attr("href", "#" + key);
    link.appendTo(linksbar);
    var bar = $("<h2/>", {
      "id": key
    });
    bar.text(key);
    bar.appendTo(target);
    var projects = $("<div/>", {
      "class": "card-container mdl-grid"
    });
    projects.appendTo(target);
    console.log(key, value);
    $.each(value, function(_, item) {
      cardify(projects, item);
    });
  });
}
function onError(data, text, error) {
  console.log(data, text, error);
}

$.ajax({
  url: "data.json",
  data: "",
  success: onSuccess,
  error: onError,
  dataType: "json"
});
function onAbout(response) {
  $("#about").html(response);
}
$.ajax({
  url: "about.html",
  data: "",
  success: onAbout,
  error: onError,
  dataType: "html"
});


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-97461112-1', 'auto');
ga('send', 'pageview');