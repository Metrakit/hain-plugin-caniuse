'use strict';

const _       = require('lodash');
const caniuse = require('caniuse-api');

module.exports = (pluginContext) => {
    const shell = pluginContext.shell;

    function search(query, res) {
        const query_trim = query.trim();
        if (query_trim.length == 0) {
            return;
        }

        let results = caniuse.find(query_trim);

        _.take(results, 5).map((x) => {
          const support = caniuse.getSupport('border-radius');
          const desc = 'Chrome <b>' + support.chrome.y + '+</b>, '
          + 'Firefox <b>' + support.firefox.y + '+</b>, '
          + 'IE <b>' + support.ie.y + '+</b>, '
          + 'Safari <b>' + support.safari.y + '+</b>, '
          + 'Opera <b>' + support.opera.y + '+</b>';
          return res.add({
              id: x,
              payload: 'open',
              title: 'Search ' + x,
              desc: desc
          });
        });
    }

    function execute(id, payload) {
        if (payload !== 'open') {
            return;
        }
        shell.openExternal(`http://caniuse.com/#search=${id}`);
    }

    return {search, execute};
};