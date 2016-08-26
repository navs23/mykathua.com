"use strict";
const ajax = require('axios');

const URL = 'https://www.googleapis.com/youtube/v3/search';

module.exports = function (options, callback) {
  if (!options.key) {
    throw new Error('You need API key for YouTube');
  }

  let params = {
    key: options.key,
    q: options.query,
    maxResults: options.maxResults || 10,
    part: 'snippet',
    type: 'video',
    order:'date'
  };

  ajax.get(URL, { params })
    .then((response) => {
      if (callback) { 
        callback(response.data.items);
      }
    })
    .catch((response) => {
      console.error(response);
    });
};
