const twitchID = "i5pez7cykn5pufq8tl1okprp99qykq";
const secret = "kv0rrwiygt7dxqphpjgg4almaqaw56";
const getToken = `https://id.twitch.tv/oauth2/token?client_id=${twitchID}&client_secret=${secret}&grant_type=client_credentials`;
let lang = "&language=zh";
let titleLang = "zh-tw";

$(document).ready(() => {
  $(".title").html(window.I18N[titleLang].TITLE);

  //initialize to get app token
  initialize(getToken, getGameID);

  //click button to transfer to Chinese stream list
  $(".chinese").click(function (e) {
    lang = "&language=zh";
    titleLang = "zh-tw";

    //title language
    $(".title").html(window.I18N[titleLang].TITLE);

    //reload animation
    $(".thumbnail").each(
      (index) => ($(".thumbnail")[index].style.opacity = "0")
    );
    $(".avatar").each((index) => ($(".avatar")[index].style.opacity = "0"));
    $(".channel").html("Title");
    $(".streamer-name").html("Streamer");

    //re-launch request
    $.ajax({
      url: getToken,
      method: "POST",
      type: "json",
      success: function (response) {
        const token = response.access_token;
        getGameID(twitchID, token, getStream);
      },
      error: function (response) {
        console.log(" Chinese getToken error");
      },
    });
  });

  //click button to transfer to English stream list
  $(".english").click(function (e) {
    lang = "&language=en";
    titleLang = "en";

    //title language
    $(".title").html(window.I18N[titleLang].TITLE);

    // reload animation
    $(".thumbnail").each(
      (index) => ($(".thumbnail")[index].style.opacity = "0")
    );
    $(".avatar").each((index) => ($(".avatar")[index].style.opacity = "0"));
    $(".channel").html("Title");
    $(".streamer-name").html("Streamer");

    //re-launch request
    $.ajax({
      url: getToken,
      method: "POST",
      type: "json",
      success: function (response) {
        const token = response.access_token;
        getGameID(twitchID, token, getStream);
      },
      error: function (response) {
        console.log(" English getToken error");
      },
    });
  });

  // vanilla.js
  // const xhr = new XMLHttpRequest();

  // xhr.open("POST", getToken, true);
  // xhr.send();
  // xhr.onerror = () => console.log("just error");
  // xhr.onload = function () {
  //   if (xhr.status >= 200 && xhr.status < 400) {
  //     let token = JSON.parse(xhr.responseText).access_token;

  //     //starts callbacks to get stream info
  //     getGameID(twitchID, token, getStream, getUser, getData);
  //   } else console.log("err");
  // };
});

//initialize
function initialize(getToken, callback) {
  $.ajax({
    url: getToken,
    method: "POST",
    type: "json",
    success: function (response) {
      const token = response.access_token;
      callback(twitchID, token, getStream);
    },
    error: function (response) {
      console.log(" getToken error");
    },
  });
}

//get game id
function getGameID(clientID, token, callback) {
  const api = "https://api.twitch.tv/helix/games?name=League%20of%20Legends";
  const id = clientID;
  const appToken = token;

  $.ajax({
    url: api,
    method: "GET",
    headers: {
      Authorization: "Bearer " + appToken,
      "Client-Id": id,
    },
    type: "json",
    success: (response) => {
      const result = response.data[0].id;
      callback(result, id, appToken, getUser);
    },
    error: (response) => console.log("getGameID error"),
  });

  // vanilla.js
  // const request = new XMLHttpRequest();
  // request.open("GET", api, true);
  // request.setRequestHeader("Authorization", "Bearer " + appToken);
  // request.setRequestHeader("Client-Id", id);
  // request.send();
  // request.onload = function (e) {
  //   const result = JSON.parse(request.response).data[0].id;
  //   callback(result, id, appToken, callback2, callback3);
  // };
}

//get stream list
function getStream(gameID, clientID, token, callback) {
  const api = `https://api.twitch.tv/helix/streams?game_id=${gameID}${lang}`;
  const id = clientID;
  const appToken = token;

  $.ajax({
    url: api,
    method: "GET",
    headers: {
      Authorization: "Bearer " + appToken,
      "Client-Id": id,
    },
    type: "json",
    success: (response) => {
      const result = response;
      callback(result, clientID, token, getData);
    },
    error: (response) => console.log("getStream error"),
  });

  // vanilla.js
  // const request = new XMLHttpRequest();
  // request.open("GET", api, true);
  // request.setRequestHeader("Authorization", "Bearer " + appToken);
  // request.setRequestHeader("Client-Id", id);
  // request.send();
  // request.onload = function (e) {
  //   const result = JSON.parse(request.response);
  //   callback(result, clientID, token, callback2);
  // };
}

//get each streamer
function getUser(result, clientID, token, callback) {
  const data = result.data;
  for (let i = 0; i < data.length; i++) {
    callback(data[i], clientID, token, i, render);
  }
}

//get streamer info
function getData(data, clientID, token, count, callback) {
  const api = `https://api.twitch.tv/helix/users?id=${data.user_id}`;
  const streamer = data;
  const id = clientID;
  const appToken = token;
  const order = count;

  $.ajax({
    url: api,
    method: "GET",
    headers: {
      Authorization: "Bearer " + appToken,
      "Client-Id": id,
    },
    type: "json",
    success: (response) => callback(streamer, order, response),
    error: (response) => console.log("getData error"),
  });

  // vanilla.js
  // const request = new XMLHttpRequest();
  // request.open("GET", api, true);
  // request.setRequestHeader("Authorization", "Bearer " + appToken);
  // request.setRequestHeader("Client-Id", id);
  // request.send();
  // request.onload = function (e) {
  //   render(streamer, order, response);
  // };
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
