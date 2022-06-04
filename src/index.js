const $ = require("jquery");
const I18N = {
  en: require("./lang-en.js"),
  "zh-tw": require("./lang-zh-tw.js"),
};
const twitchID = "i5pez7cykn5pufq8tl1okprp99qykq";
const secret = "kv0rrwiygt7dxqphpjgg4almaqaw56";
const getToken = `https://id.twitch.tv/oauth2/token?client_id=${twitchID}&client_secret=${secret}&grant_type=client_credentials`;
let lang = "&language=zh";
let titleLang = "zh-tw";

$(document).ready(() => {
  //initialize
  $(".title").html(I18N[titleLang].TITLE);
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

  //switch languages
  $(".chinese").click(() => {
    changeStreamLang("&language=zh", "zh-tw");
  });
  $(".english").click(() => {
    changeStreamLang("&language=en", "en");
  });
});

//launch request
function launch(
  id,
  token,
  lang,
  callback,
  callback2,
  callback3,
  callback4,
  callback5
) {
  $.ajax({
    url: token,
    method: "POST",
    type: "json",
    success: function (response) {
      const token = response.access_token;
      callback(id, token, lang, callback2, callback3, callback4, callback5);
    },
    error: function (response) {
      console.log("error");
    },
  });
}

//switch to the stream list of chosen language
function changeStreamLang(streamLang, title) {
  lang = streamLang;
  titleLang = title;

  //switch title
  $(".title").html(I18N[titleLang].TITLE);

  //reload animation
  $(".thumbnail").each((index) => ($(".thumbnail")[index].style.opacity = "0"));
  $(".avatar").each((index) => ($(".avatar")[index].style.opacity = "0"));
  $(".channel").html("Title");
  $(".streamer-name").html("Streamer");

  //re-launch request
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
}

//get game id
function getGameID(id, token, lang, callback, callback2, callback3, callback4) {
  const api = "https://api.twitch.tv/helix/games?name=League%20of%20Legends";

  $.ajax({
    url: api,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Client-Id": id,
    },
    type: "json",
    success: (response) => {
      const gameID = response.data[0].id;
      callback(gameID, id, token, lang, callback2, callback3, callback4);
    },
    error: (response) => console.log("getGameID error"),
  });
}

//get stream list
function getStream(gameID, id, token, lang, callback, callback2, callback3) {
  const api = `https://api.twitch.tv/helix/streams?game_id=${gameID}${lang}`;

  $.ajax({
    url: api,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Client-Id": id,
    },
    type: "json",
    success: (response) => {
      const result = response;
      callback(result, id, token, callback2, callback3);
    },
    error: (response) => console.log("error"),
  });
}

//get each streamer
function getUser(result, clientID, token, callback, callback2) {
  const streamers = result.data;
  for (let i = 0; i < streamers.length; i++) {
    callback(streamers[i], clientID, token, i, callback2);
  }
}

//get streamer info
function getData(streamer, clientID, token, order, callback) {
  const api = `https://api.twitch.tv/helix/users?id=${streamer.user_id}`;

  $.ajax({
    url: api,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Client-Id": clientID,
    },
    type: "json",
    success: (response) => callback(streamer, order, response),
    error: (response) => console.log("error"),
  });
}

//render
function render(streamer, order, result) {
  const userLogin = streamer.user_login;
  const link = `https://www.twitch.tv/${userLogin}`;
  const streamTitle = streamer.title;
  const streamerName = streamer.user_name;
  const image = result.data[0].profile_image_url;
  const thumbnail = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${userLogin}-300x150.jpg`;

  $(".link")[order].setAttribute("href", link);
  $(".thumbnail")[order].setAttribute("src", thumbnail);
  $(".avatar")[order].setAttribute("src", image);
  $(".channel")[order].innerHTML = streamTitle;
  $(".streamer-name")[order].innerHTML = streamerName;
}