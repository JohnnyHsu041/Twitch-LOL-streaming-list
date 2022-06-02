const twitchID = "i5pez7cykn5pufq8tl1okprp99qykq";
const secret = "kv0rrwiygt7dxqphpjgg4almaqaw56";
const getToken = `https://id.twitch.tv/oauth2/token?client_id=${twitchID}&client_secret=${secret}&grant_type=client_credentials`;
let lang = "&language=zh";
let titleLang = "zh-tw";

$(document).ready(() => {
  $(".title").html(window.I18N[titleLang].TITLE);

  //initialize
  launch(
    twitchID,
    getToken,
    lang,
    getGameID,
    getStream,
    getUser,
    getData,
    render
  );

  //click to switch stream list
  $(".chinese").click(() => changeStreamLang("&language=zh", "zh-tw"));
  $(".english").click(() => changeStreamLang("&language=en", "en"));
});
