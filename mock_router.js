let yakbak = require('./index.js');
const debug = require('debug')('yakbak:server');
const lookup = {

  "//project/select": {
    target: 'http://dev-solr.bidclerk.com/project',
    dirname: '/home/ubuntu/projects/mock-data/tapes/solr',
  },

  "//company/select": {
    target: 'http://dev-solr.bidclerk.com/company',
    dirname: '/home/ubuntu/projects/mock-data/tapes/solr',
  },

  default: {
    target: 'http://cst-dvweb-01.isqft.com/services',
    dirname: '/home/ubuntu/projects/mock-data/tapes',
  }
}
function lookupTarget(path) {
  debug('Looking up path: ', path);
   return Object.keys(lookup).find((partial) => {
      return path.includes(partial);
   })
}

module.exports = function(path) {
  let found = lookupTarget(path);
  if (found) {
    debug('Using lookup of: ', lookup[found]);
    return yakbak(lookup[found].target, {dirname: lookup[found].dirname });
  }else{
    debug('Using default: ', lookup.default);
    return yakbak(lookup.default.target, {dirname: lookup.default.dirname });
  }
}
