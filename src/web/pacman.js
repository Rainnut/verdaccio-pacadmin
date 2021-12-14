/* global document, location, XMLHttpRequest, ZingGrid */

import TagType from './TagType.js';
import ListGrid from './ListGrid.js';
import PackageGrid from './PackageGrid.js';
import Login from './Login/index';
class Pacman
{
    constructor ()
    {
      const options = JSON.parse(
          (document.querySelector("#pacman-options") || {}).value || "{}"
        ),
        button = document.createElement("button"),
        toolbarLeftSide = document.querySelector(options.selectorPacmanBtn),
        homeButton = document.querySelector(options.selectorHomeBtn);

      this._options = options;
      console.log("1111111");
      button.setAttribute("class", "pacman open");

      // button.addEventListener("click", Login._load.bind(this));
      button.addEventListener("click", this._load.bind(this));

      options.injectMode === "prepend" && toolbarLeftSide.prepend(button);
      options.injectMode === "append" && toolbarLeftSide.append(button);

      homeButton.addEventListener("click", () => location.assign("/"));
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
}

new Pacman();