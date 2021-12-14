'use strict';

const { load: cheerio } = require("cheerio"),
  ModuleLoader = require("./ModuleLoader"),
  StatisFiles = require("./StaticFiles"),
  LoginStatisFiles = require("./LoginStaticFiles"),
  CSP_HEADER = "Content-Security-Policy",
  ZingGridLicenseValidationUrl =
    "https://app.zingsoft.com/v1/api/license/validate",
  HTML_MIME = "text/html";

class Injector
{
    /**
     * @param {object} options
     * @param {Request} req
     * @param {Response} res
     * @param {function} next
     * @private
     */
    static _inject (options, req, res, next)
    {
        const
            send = res.send.bind(res),
            accept = (req.headers.accept || '').split(',')

        if (accept.includes(HTML_MIME)) {
            res.send = async data => {
                if (res.statusCode !== 200) {
                    return send(data);
                }

                const
                    $ = cheerio(data),
                    $body = $('body'),
                    csp = (res.get(CSP_HEADER) || '').split(' ');

                res.set({[CSP_HEADER]: csp.concat(ZingGridLicenseValidationUrl).join(' ')});

                try {
                    $body.append(`<data id="pacman-options" value='${JSON.stringify(options)}'></data>`);
                    console.log("Injector");
                    StatisFiles.inject($body);
                    // LoginStatisFiles.inject($body);
                    ModuleLoader.inject($body);

                    send($.html());
                } catch (err) {
                    send(data);
                }
            }
        }
        next();
    }

    /**
     * @param {object} app
     * @param {object} options
     */
    static register (app, options)
    {
        app.use(Injector._inject.bind(null, options));
    }
}

module.exports = Injector;