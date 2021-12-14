'use strict';

const
    {posix: {join: posixJoin}, join} = require('path'),
    {constants: {R_OK: readable, F_OK: visible}, promises: {access}} = require('fs'),
    ROUTE = '/-/pacman/web/login/',
    STATIC_FILE_ROOT = join(__dirname, '../web/login'),
    SCRIPT = posixJoin(ROUTE, 'index.js'),
    STYLES = posixJoin(ROUTE, 'styles.css');

class LoginStaticFiles
{
    /**
     * @param {Request} req
     * @param {Response} res
     * @private
     */
    static async _fileLoader (req, res)
    {
        try {
            const {file} = req.params;
            await access(join(STATIC_FILE_ROOT, file), readable | visible);
            res.sendFile(file, {root: STATIC_FILE_ROOT});
        } catch (err) {
            res.sendStatus(404);
        }
    }

    /**
     * @param {object} node
     */
    static inject (node)
    {
        node.append(`<link rel="stylesheet" type="text/css" href="${STYLES}">`);
        node.append(`<script type="module" src="${SCRIPT}" id="pacmanLogin" data-options=""></script>`);
    }

    /**
     * @param {object} app
     */
    static register (app)
    {
        app.get(posixJoin(ROUTE, ":file"), LoginStaticFiles._fileLoader);
    }
}

module.exports = LoginStaticFiles;