const twitchID = "i5pez7cykn5pufq8tl1okprp99qykq";
const secret = "kp8sd5w5cp1bv7di10byixl3boffcc";

//get token
const getToken = `https://id.twitch.tv/oauth2/token?client_id=${twitchID}
&client_secret=${secret}
&grant_type=client_credentials`;

const xhr = new XMLHttpRequest();
xhr.open("POST", getToken, true);
xhr.send();

let token;
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 400) {
    token = JSON.parse(xhr.responseText).access_token;

    //starts callbacks to get stream info
    getGame(twitchID, token, getStream, getUser, getData);
  } else console.log("err");
};

xhr.onerror = function () {
  console.log("just error");
};

//to get game id
function getGame(clientID, token, callback, callback2, callback3) {
  const api = "https://api.twitch.tv/helix/games?name=League%20of%20Legends";
  const id = clientID;
  const appToken = token;
  const request = new XMLHttpRequest();
  request.open("GET", api, true);
  request.setRequestHeader("Authorization", "Bearer " + appToken);
  request.setRequestHeader("Client-Id", id);
  request.send();
  request.onload = function (e) {
    const result = JSON.parse(request.response).data[0].id;
    callback(result, id, appToken, callback2, callback3);
  };
}

//to get game stream list
// let queryString = "?language=zh";
function getStream(gameID, clientID, token, callback, callback2) {
  const api = `https://api.twitch.tv/helix/streams?game_id=${gameID}`;
  const id = clientID;
  const appToken = token;
  const request = new XMLHttpRequest();
  request.open("GET", api, true);
  request.setRequestHeader("Authorization", "Bearer " + appToken);
  request.setRequestHeader("Client-Id", id);
  request.send();
  request.onload = function (e) {
    const result = JSON.parse(request.response);
    callback(result, clientID, token, callback2);
  };
}

//to get each streamer
function getUser(result, clientID, token, callback) {
  const data = result.data;
  let i = 0;
  for (let streamer of data) {
    callback(streamer, clientID, token, i);
    i++;
  }
}

//to get streamer info
function getData(data, clientID, token, count) {
  const api = `https://api.twitch.tv/helix/users?id=${data.user_id}`;
  const streamer = data;
  const id = clientID;
  const appToken = token;
  const order = count;
  const request = new XMLHttpRequest();

  request.open("GET", api, true);
  request.setRequestHeader("Authorization", "Bearer " + appToken);
  request.setRequestHeader("Client-Id", id);
  request.send();
  request.onload = function (e) {
    const userLogin = streamer.user_login;
    const link = `https://www.twitch.tv/${userLogin}`;
    const streamTitle = streamer.title;
    const streamerName = streamer.user_name;
    const image = JSON.parse(request.response).data[0].profile_image_url;
    const thumbnail = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${userLogin}-300x150.jpg`;

    document.querySelectorAll(".link")[order].setAttribute("href", link);
    document
      .querySelectorAll(".thumbnail")
      [order].setAttribute("src", thumbnail);
    document.querySelectorAll(".avatar")[order].setAttribute("src", image);
    document.querySelectorAll(".channel")[order].innerHTML = streamTitle;
    document.querySelectorAll(".streamer-name")[order].innerHTML = streamerName;

    // PREVIOUS VERSION

    // let div = document.createElement("div");
    // div.classList.add("streamer");
    // div.innerHTML = `
    //   <a href="https://www.twitch.tv/${streamer.user_login}" target="_blank" class="link">
    //     <div class="preview">
    //       <img
    //         class="thumbnail"
    //         src="${thumbnail}" alt="stream_thumbnail" onload="this.style.opacity=1"
    //       />
    //     </div>
    //     <div class="streamer-info">
    //       <div class="profile-photo">
    //         <img src="${image}"/>
    //       </div>
    //       <div class="stream-name">
    //         <div class="channel">
    //           ${streamTitle}
    //         </div>
    //         <div>${streamerName}</div>
    //       </div>
    //     </div>
    //   </a>
    // `;
    // document.querySelector(".streamers-container").appendChild(div);
  };
}
