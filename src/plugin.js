'use strict';

const ModuleLoader = require("./api/ModuleLoader"),
  StaticFiles = require("./api/StaticFiles"),
  LoginStaticFiles = require("./api/LoginStaticFiles"),
  Injector = require("./api/Injector"),
  Pacman = require("./api/Pacman"),
  Utils = require("./Utils"),
  Defaults = {
    enabled: false,
    selectorHomeBtn: "header > :first-child > :first-child > :first-child",
    selectorPacmanBtn: "header > :first-child > :last-child",
    injectMode: "prepend",
    pageSize: 25,
    protectedTags: ["latest"],
  };

class Plugin
{
    /**
     * @return {{enabled: boolean, protectedTags: [string]}}
     * @constructor
     */
    static get Defaults ()
    {
        return Defaults;
    }

    /**
     * @param {object} config
     */
    constructor (config)
    {
        config = Object.assign({}, Defaults, Utils.validateConfig(config));
        // noinspection JSCheckFunctionSignatures
        config.protectedTags = Array.from(new Set(Defaults.protectedTags.concat(config.protectedTags)));

        this._config = config;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {object} app
     * @param {object} auth
     * @param {{getPackage: function}} storage
     */
    register_middlewares (app, auth, storage)
    {
        if (!this._config.enabled) {
            return;
        }
        console.log("pacadmin");
        // console.log(auth.config.auth.groups);
        // Utils.getAuthGroupUsers(auth, "superAdmin");
        ModuleLoader.register(app);
        Injector.register(app, this._config);
        StaticFiles.register(app);
        // LoginStaticFiles.register(app);
        Pacman.register(app, storage, this._config);
    }
}

module.exports = Plugin;