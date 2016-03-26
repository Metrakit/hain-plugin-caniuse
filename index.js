'use strict';

const _       = require('lodash');
const caniuse = require('./caniuse-api');

module.exports = (pluginContext) => {
    const shell = pluginContext.shell;

    const browsers = ['firefox', 'chrome', 'ie', 'opera', 'safari'];

    function capitalize(word) {
      return word[0].toUpperCase() + word.slice(1);
    }

    function getDesc(property) {
        const support = caniuse.getSupport(property);
        var desc = "";

        _.take(browsers, 5).map((x) => {

          if (x == 'ie') {
            desc = desc + 'IE <b>';
          } else {
            desc = desc + capitalize(x) + ' <b>';
          }
          if (support[x].y === undefined) {
            desc = '<span style="color: #b51c1c">'+desc + '✘</span>';
          } else {
            desc = '<span style="color: #1a6510">'+desc + support[x].y + '+ </span>';
          }
          desc = desc + '</b>, ';
        });

        return desc.slice(0, -2);
    }

    function search(query, res) {
        const query_trim = query.trim();
        if (query_trim.length === 0) {
            return res.add({
            id: '',
            payload: 'open',
            title: 'Search on caniuse',
            desc: 'Search on caniuse.com'
          });
        }

        res.add({
            id: query_trim,
            payload: 'open',
            title: 'Search property: ' + query_trim,
            desc: 'Search on caniuse.com'
        });

        let results = caniuse.find(query_trim);
        if (typeof results === "string") {

          return res.add({
              id: results,
              payload: 'open',
              title: results,
              desc: getDesc(results)
          });
        } else {
          _.take(results, 5).map((x) => {

            if (x == query_trim) {
              res.remove(query_trim);
            }

            return res.add({
                id: x,
                payload: 'open',
                title: x,
                desc: getDesc(x)
            });
          });
        }
    }

    function execute(id, payload) {
        if (payload !== 'open') {
            return;
        }
        shell.openExternal(`http://caniuse.com/#search=${id}`);
    }

    return {search, execute};
};