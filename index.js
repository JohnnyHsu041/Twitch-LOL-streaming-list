const twitchID = "i5pez7cykn5pufq8tl1okprp99qykq";
const secret = "kv0rrwiygt7dxqphpjgg4almaqaw56";
const getToken = `https://id.twitch.tv/oauth2/token?client_id=${twitchID}&client_secret=${secret}&grant_type=client_credentials`;
let lang = "&language=zh";
let titleLang = "zh-tw";

$(document).ready(() => {
  //initialize
  $(".title").html(window.I18N[titleLang].TITLE);
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
});
