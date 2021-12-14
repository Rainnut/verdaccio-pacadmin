/* global document, location, XMLHttpRequest, ZingGrid */

import TagType from './TagType.js';
import ListGrid from './ListGrid.js';
import PackageGrid from './PackageGrid.js';
// import authJson from '../api/auth.json';
class Pacman
{
    constructor ()
    {
        const
            options = JSON.parse((document.querySelector('#pacman-options') || {}).value || '{}'),
            button = document.createElement('button'),
            toolbarLeftSide = document.querySelector(options.selectorPacmanBtn),
            homeButton = document.querySelector(options.selectorHomeBtn);

        this._options = options;

        button.setAttribute('class', 'pacman open');
        button.addEventListener('click', this._loadLogin.bind(this));

        options.injectMode === 'prepend' && toolbarLeftSide.prepend(button);
        options.injectMode === 'append' && toolbarLeftSide.append(button);

        homeButton.addEventListener('click', () => location.assign('/'));
    }

    /**
     * @private
     */
    _load ()
    {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('load', this._inject.bind(this, xhr));
        xhr.open('GET', '/-/pacman/web/index.html');
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

        ZingGrid.registerCellType(TagType.TYPE, {renderer: TagType.renderer.bind(null, this._options)});

        new ListGrid(document, '#main', '#child', this._options);
        new PackageGrid(document, '#main', '#child', this._options);
    }

    _loadLogin ()
    {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('load', this._injectLogin.bind(this, xhr));
        xhr.open("GET", "/-/pacman/web/login/index.html");
        xhr.send();
    }
    async _injectLogin (xhr)
    {
        // const { secret } = await fetch(`/-/htpasswd/json`, {
        //   method: "GET"
        // });
        // console.log("frontend json", secret);
        document.querySelector('div.container.content').innerHTML = xhr.responseText;
        const loginBtn = document.getElementById('loginBtn');
        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');
        loginBtn.addEventListener('click', async () => {
          const username = usernameEl?.value;
          const password = passwordEl?.value;
          if (!username || !password) {
            alert("用户名或密码不能为空。");
          } else {
            try {
              const rawResponse = await fetch(`/-/htpasswd/api`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
              });
              const content = await rawResponse.json();
              console.log('登陆验证返回', status);
              // if (status === 200) {
                
              // } else {

              // }
            } catch (err) {
              alert(err);
            }
          }
        });
    }
}

new Pacman();