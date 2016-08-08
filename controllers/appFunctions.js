var emojiList = require('../public/emoji.json'),
    emojiUnicodes = {};
const punycode = require('punycode');

var objectLengthGetter = function (obj) {
  // Return the length of a given object
  return Object.keys(obj).length;
};

var emojiExtractor = function (url) {
  // Extract pertinent unicode information from emoji.json
  Object.keys(emojiList).forEach(function(key) {
    var emojiUnicode = emojiList[key].unified || null,
        emojiDocomo = emojiList[key].docomo || null,
        emojiAu = emojiList[key].au || null,
        emojiSoftbank = emojiList[key].softbank || null,
        emojiGoogle = emojiList[key].google || null,
        emojiName = emojiList[key].name || null,
        emojiShortName = emojiList[key].short_name || null,
        emojiVariations = emojiList[key].variations || [],
        emojiSkinVariations = emojiList[key].skin_variations || {};

    emojiUnicodes[String(emojiUnicode)] = (emojiUnicode !== null ? { name: emojiName, short_name: emojiShortName } : {});
    emojiUnicodes[String(emojiDocomo)] = (emojiDocomo !== null ? { name: emojiName, shortName: emojiShortName, docomo: true } : {});
    emojiUnicodes[String(emojiAu)] = (emojiAu !== null ? { name: emojiName, shortName: emojiShortName, au: true } : {});
    emojiUnicodes[String(emojiSoftbank)] = (emojiSoftbank !== null ? { name: emojiName, shortName: emojiShortName, softbank: true } : {});
    emojiUnicodes[String(emojiGoogle)] = (emojiGoogle !== null ? { name: emojiName, shortName: emojiShortName, google: true } : {});

    if (emojiVariations.length > 0) {
      for(var ev = 0, evl = emojiVariations.length; ev < evl; ev++) {
        emojiUnicodes[String(emojiVariations[ev])] = { name: emojiName, shortName: emojiShortName };
      }
    }

    if (objectLengthGetter(emojiSkinVariations) > 0) {
      Object.keys(emojiSkinVariations).forEach(function(key){
        emojiUnicodes[String(emojiSkinVariations[key])] = { name: emojiName, shortName: emojiShortName };
      });
    }
  });
  return emojiUnicodes;
};

var domainExtractor = function (url) {
  // Extract domains from urls in tweet
  var domain;
  // Find and remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  // Find and remove port number, if necessary
  domain = domain.split(':')[0];
  return domain;
};

var emojiParser = function (tweetText, emojiUnicodes) {
  // Examine tweetText and extract any emoji unicode characters
  var tweetEmojis = {},
      tempEmojis = [];
  tempEmojis = punycode.ucs2.decode(tweetText);
  for(var t = 0, tl = tempEmojis.length; t < tl; t++) {
    var key = tempEmojis[t].toString(16).toUpperCase();
    if (emojiUnicodes[key] !== undefined) {
      tweetEmojis[key] = emojiUnicodes[key];
    }
  }
  return tweetEmojis;
};

module.exports = {
  // Call cached functions for better perormance
  extractEmojiUnicodes: function(url) {
    return emojiExtractor(url);
  },
  extractDomain: function(url) {
    return domainExtractor(url);
  },
  parseEmojis: function(tweetText, emojiUnicodes) {
    return emojiParser(tweetText, emojiUnicodes);
  },
  getObjectLength: function(obj) {
    return objectLengthGetter(obj);
  }
};
