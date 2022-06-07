import css from "../css/index.css";
import mods from "./modules.js";
import vars from "./variables.js";

const $ = require("jquery");

$(document).ready(() => {
  //initialize
  mods.switchLang(vars.title);
  mods.launch(
    vars.twitchID,
    vars.getToken,
    vars.lang
  );

  //switch to Chinese
  $(".chinese").click(() => {
    vars.lang = "&language=zh";
    vars.titleLang = "zh-tw";

    mods.switchLang(vars.title);
    mods.reload();
    mods.launch(
      vars.twitchID,
      vars.getToken,
      vars.lang
    );
  });

  // switch to English
  $(".english").click(() => {
    vars.lang = "&language=en";
    vars.titleLang = "en";

    mods.switchLang(vars.title);
    mods.reload();
    mods.launch(
      vars.twitchID,
      vars.getToken,
      vars.lang
    );
  });
});
