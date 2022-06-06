import { enTitle } from "./lang-en.js";
import { zhTwTitle } from "./lang-zh-tw";

let lang = "&language=zh";
let titleLang = "zh-tw";

const I18N = {
  en: enTitle.TITLE,
  "zh-tw": zhTwTitle.TITLE,
};
const title = I18N[titleLang];
const twitchID = "i5pez7cykn5pufq8tl1okprp99qykq";
const secret = "kv0rrwiygt7dxqphpjgg4almaqaw56";
const getToken = `https://id.twitch.tv/oauth2/token?client_id=${twitchID}&client_secret=${secret}&grant_type=client_credentials`;

export default {
  lang,
  titleLang,
  I18N,
  title,
  twitchID,
  secret,
  getToken,
};
