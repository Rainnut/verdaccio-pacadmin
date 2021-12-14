'use strict';

const
    {posix: {join: posixJoin}, join} = require('path'),
    {constants: {R_OK: readable, F_OK: visible}, promises: {access}} = require('fs'),
    ROUTE = '/-/pacman/web/',
    STATIC_FILE_ROOT = join(__dirname, '../web'),
    SCRIPT = posixJoin(ROUTE, 'pacman.js'),
    STYLES = posixJoin(ROUTE, 'styles.css');

class StaticFiles
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
            // console.log("staticFiles._fileLoader", file, STATIC_FILE_ROOT);
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
        node.append(`<script type="module" src="${SCRIPT}" id="pacman" data-options=""></script>`);
    }

    /**
     * @param {object} app
     */
    static register (app)
    {
        app.get(posixJoin(ROUTE, ':file'), StaticFiles._fileLoader);
    }
}

module.exports = StaticFiles;