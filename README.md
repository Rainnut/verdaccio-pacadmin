# verdaccio-pacadmin
Verdaccio Middleware Plugin to manage tags and versions of packages

[![verdaccio-pacadmin (latest)](https://img.shields.io/npm/v/verdaccio-pacadmin/latest.svg)](https://www.npmjs.com/package/verdaccio-pacadmin)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![node](https://img.shields.io/node/v/verdaccio-pacadmin/latest.svg)](https://www.npmjs.com/package/verdaccio-pacadmin)

## Requirements

* verdaccio@4.x.x or higher

```
 npm install --global verdaccio-pacadmin
```

## Usage

To enable the plugin you need to add following lines to your configuration file.  
```
middlewares:
  pacman:
    # Enables the plugin - the only required config parameter
    # Default: false
    enabled: true
    
    # CSS Selector to select verdaccio home button
    # Default: 'header > :first-child > :first-child > :first-child'
    selectorHomeBtn: 'header > :first-child > :first-child > :first-child'
    
    # CSS Selector to select parent element to injected plugin button
    # Default: 'header > :first-child > :last-child'
    selectorPacmanBtn: 'header > :first-child > :last-child'

    # Injection mode for plugin button, valid values are "append" and "prepend"
    # Default: prepend
    injectMode: prepend
    
    # List of tags to protect. Protected tags or package versions 
    # with assigned protected tags can not be deleted.
    # Note: Tag "latest" is always protected!
    protectedTags:
      - dev
      - stage
      - prod
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)