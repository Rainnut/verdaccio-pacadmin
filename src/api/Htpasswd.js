'use strict';

const {
    posix: { join: join },
  } = require("path"),
  { json } = require("body-parser"),
  crypto = require("crypto"),
  authJson = require("./auth.json"),
  Utils = require("./../Utils"),
  ROUTE = "/-/htpasswd/api";

class Htpasswd {

  static _verifyPassword(auth) {
    return Utils.buildRoute(
      { auth },
      async (module, meta, { body }) => {
          console.log("auth", auth);
        const {username, password} = body;
        // 先判断是否超级用户
        const superUsers = Utils.getAuthGroupUsers(auth, "superAdmin");
        console.log("superUsers", superUsers);
        if (!superUsers.includes(username)) throw new Error('非超级管理员无法进入～');
        
        // 检验密码正确性
        const hash = Utils.getUserHtpasswd(auth, username);
        console.log("hash", hash);
        const passwd = crypto.AES.decrypt(password, authJson.secret);
        crypto
          .createHash("sha1")
          // https://nodejs.org/api/crypto.html#crypto_hash_update_data_inputencoding
          .update(passwd, "utf8")
          .digest("base64") === hash.substr(5);
      },
      200
    );
  }

  static register(app, auth) {
    app.post(ROUTE, json(), Htpasswd._verifyPassword(auth));
    app.get("/-/htpasswd/json", () => authJson);
  }
}

module.exports = Htpasswd;