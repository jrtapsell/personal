const EXTERNAL = {
  "handlebars": require("gulp-compile-handlebars"),
  "fileSystem": require("fs"),
  "showdown": require("showdown")
};

// https://github.com/showdownjs/showdown/wiki/Add-default-classes-for-each-HTML-element
const classMap = {
  table: "mdl-data-table mdl-js-data-table mdl-cell mdl-cell--12-col"
};

const bindings = Object.keys(classMap)
  .map((key) => ({
    type: "output",
    regex: new RegExp(`<${key}>`, "g"),
    replace: `<${key} class="${classMap[key]}">`
  }));

const converter = new EXTERNAL.showdown.Converter({
  extensions: [...bindings]
});

EXTERNAL.showdown.setOption("tables", true);

function safeString(unsafe) {
  return new EXTERNAL.handlebars.Handlebars.SafeString(unsafe);
}

function wrap(prefix, suffix) {
  return function wrapped(input) {
    return safeString(prefix + input + suffix);
  }
}

function withJsonFile(filename, options) {
  const filePath = "./src/data/" + filename;
  const data = JSON.parse(EXTERNAL.fileSystem.readFileSync(filePath, "utf8"));
  return safeString(options.fn(data));
}

function buttonBar(body) {
  let result = "<div class=\"mdl-cell mdl-cell--12-col button-bar\">";
  for (const buttonDetails of JSON.parse(body)) {
    result += `<a href="${buttonDetails[1]}">
    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
        ${buttonDetails[0]}
    </button>
    </a>`;
  }
  result += "</div>";
  return safeString(result);
}

const helpers = {
  "load_file": withJsonFile,
  "markdown": (body) => safeString(converter.makeHtml(body.fn())),
  "toId": (body) => safeString(body.toLowerCase().replace(" ", "_")),
  "youtube": wrap("<iframe src=\"https://www.youtube.com/embed/", "\" frameborder=\"0\" allowfullscreen></iframe>"),
  "vimeo": wrap("<iframe src=\"https://player.vimeo.com/video/", "\" frameborder=\"0\" allowfullscreen></iframe>"),
  "pdf": wrap("<iframe src=\"https://docs.google.com/gview?url=", "&embedded=true\" frameborder=\"0\"></iframe>"),
  "button_bar": buttonBar
};

module.exports.helpers = helpers;