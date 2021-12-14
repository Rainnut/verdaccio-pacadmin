/* global document, location, XMLHttpRequest */
import Pacman from '../pacman.js';
class Login
{
    constructor ()
    {
        const
            options = JSON.parse((document.querySelector('#Login-options') || {}).value || '{}'),
            button = document.createElement('button'),
            toolbarLeftSide = document.querySelector(options.selectorLoginBtn),
            homeButton = document.querySelector(options.selectorHomeBtn);

        this._options = options;

        button.setAttribute('class', 'Login open');
        button.addEventListener('click', this._load.bind(this));

        options.injectMode === 'prepend' && toolbarLeftSide.prepend(button);
        options.injectMode === 'append' && toolbarLeftSide.append(button);

        homeButton.addEventListener('click', () => location.assign('/'));

        function clickLogin() {
          var name = document.getElementById("username").value;
          var pass = document.getElementById("password").value;
          //判断非空
          if (name == null || name == "" || pass == null || pass == "") {
            alert("用户名或密码不能为空！！");
          } else {
            if (name == "123" && pass == "123") {
              alert("登录成功！");
              //页面跳转，href后写自己想要在登陆后跳转到的页面地址
              Pacman._load.bind(this);
            } else {
              alert("用户名或密码错误！！");
            }
          }
        }
    }

    /**
     * @private
     */
    _load ()
    {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('load', this._inject.bind(this, xhr));
        xhr.open('GET', '/-/Login/web/index.html');
        xhr.send();
    }

    /**
     * @param {object} xhr
     * @return {Promise}
     * @private
     */
    async _inject (xhr)
    {
        document.querySelector('div.container.content').innerHTML = xhr.responseText;
    }
}

new Login();