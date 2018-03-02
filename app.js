var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    Twitter = require('twitter'),
    uidSafe = require('uid-safe'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    config = require('./config'),
    appFunctions = require('./controllers/appFunctions'),
    TweetFactory = require('./controllers/tweetFactory'),
    Tweet = require('./models/tweet'),
    myTweets = {},
    myEmojis = {},
    myHashtags = {},
    myUrls = {},
    myUrlDomains = {},
    myPhotoUrls = {},
    myNumHashtags = 0,
    myNumUrls = 0,
    myNumPhotoUrls = 0,
    myNumEmojis = 0,
    myNumStreamErrors = 0,
    processorStartTime = '';

const punycode = require('punycode');
const app = express();
var emojiUnicodes = appFunctions.extractEmojiUnicodes();
var client = new Twitter(config.credentials);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

processorStartTime = Date.now();
client.stream('statuses/sample', {}, function(stream) {
  stream.on('data', function(data) {
    // Uncomment the line below to
    //console.log(data);
    if (data['user'] !== undefined) {
      var tweetHashtags = {},
          tweetHashtagsLength = 0,
          tweetUrls = {},
          tweetUrlsLength = 0,
          tweetMedia = {},
          tweetMediaLength = 0,
          tweetEmojis = {},
          tweetEmojisLength = 0,
          extractedDomain = '';

      // Construct new tweet object
      var tweet = new Tweet(data);
      // Append tweet object to master tweet object
      myTweets[data.id_str] = tweet;

      tweetHashtags = myTweets[data.id_str]['hashtags'];
      tweetHashtagsLength = myTweets[data.id_str]['hashtags'].length;
      tweetUrls = myTweets[data.id_str]['urls'];
      tweetUrlsLength = myTweets[data.id_str]['urls'].length;
      tweetMedia = myTweets[data.id_str]['media'];
      tweetMediaLength = myTweets[data.id_str]['media'].length;
      tweetEmojis = appFunctions.parseEmojis(myTweets[data.id_str]['body'], emojiUnicodes);
      tweetEmojisLength = appFunctions.getObjectLength(tweetEmojis);

      /*
      Sorry for the blocking here. An excellent package called
      async (var async = require(async);) can handily queue these 4 following
      processes in parallel to concurrently process these variables, and it is
      already bundled with node, but alas, I have run out of time. :)
      I probably shouldn't have saved that part for last.
      Anyway, the next step in development of this app is to refactor
      the 4 following processes into functions that run as asynchronously
      as is possible in javascript's single-thread environment, using the tweet
      data saved in the myTweets variable.

      Check this out, if you're interested: https://www.npmjs.com/package/async
      */
      setTimeout(function(tweetHashtags, tweetHashtagsLength) {
        // Store Hashtags
        //console.log(tweetHashtags);
        //console.log(tweetHashtagsLength);
        if (tweetHashtagsLength > 0) {
          myNumHashtags += tweetHashtagsLength;
          for (var h = 0, hl = tweetHashtagsLength; h < hl; h++) {
            if (myHashtags.hasOwnProperty(tweetHashtags[h].text)) {
              //increment counter on appropriate hashtag in myHashtags
              myHashtags[tweetHashtags[h].text]++;
            } else {
              //add new hashtag info and counter set to 0
              myHashtags[tweetHashtags[h].text] = 1;
            }
          }
        }
      }, 0, tweetHashtags, tweetHashtagsLength);

      setTimeout(function(tweetUrls, tweetUrlsLength) {
        // Store Urls
        if (tweetUrlsLength > 0) {
          myNumUrls += tweetUrlsLength;
          for (var u = 0; u < tweetUrlsLength; u++) {
            // Save urls to url list
            if (myUrls.hasOwnProperty(myTweets[data.id_str]['urls'][u].url)) {
              //increment counter on appropriate url in myUrls
              myUrls[tweetUrls[u].url]++;
            } else {
              //add new url info and set counter to 1
              myUrls[tweetUrls[u].url] = 1;
            }

            // Save display_urls to domain list
            extractedDomain = appFunctions.extractDomain(tweetUrls[u].display_url);
            if (myUrlDomains.hasOwnProperty(extractedDomain)) {
              //increment counter on appropriate display_url in myUrlDomains
              myUrlDomains[extractedDomain]++;
            } else {
              //add new display_url info and set counter to 1
              myUrlDomains[extractedDomain] = 1;
            }
          }
        }
      }, 0, tweetUrls, tweetUrlsLength);

      setTimeout(function(tweetMedia, tweetMediaLength) {
        // Store Photo Urls
        if (tweetMediaLength > 0) {
          for (var p = 0; p < tweetMediaLength; p++) {
            var mediaUrl = tweetMedia[p].display_url;
            var photoUrlTwitter = /pic.twitter.com/i;
            var photoUrlInstagram = /instagram.com/i;
            if (mediaUrl.match(photoUrlTwitter) || mediaUrl.match(photoUrlInstagram)) {
              //increment photo url counter
              myNumPhotoUrls++;
            }
          }
        }
      }, 0, tweetMedia, tweetMediaLength);

      setTimeout(function(tweetEmojis, tweetEmojisLength) {
        // Store Emojis
        //console.log(tweetEmojis);
        if (tweetEmojisLength > 0) {
          myNumEmojis += tweetEmojisLength;
          Object.keys(tweetEmojis).forEach(function(key) {
            if (myEmojis.hasOwnProperty( punycode.ucs2.encode(['0x'+key]) )) {
              //increment counter on appropriate emoji in myEmojis
              myEmojis[ punycode.ucs2.encode(['0x'+key]) ].counter++;
            } else {
              //add new emoji info and set counter to 1
              myEmojis[ punycode.ucs2.encode(['0x'+key]) ] = {
                name: tweetEmojis[key].name,
                shortName: tweetEmojis[key].shortName,
                counter: 1
              };
            }
          });
        }
      }, 0, tweetEmojis, tweetEmojisLength);




    }
  });

  stream.on('error', function(error) {
    //console.log(error);
    myNumStreamErrors++;
  });
});


// Set interval and generate a report from tweetFactory
var intervalID = setInterval( function(){
  var factory = TweetFactory(myTweets, myHashtags, myNumHashtags, myUrls, myNumUrls, myUrlDomains, myNumPhotoUrls, myEmojis, myNumEmojis, myNumStreamErrors, processorStartTime);
  if (config.reportGeneration === true) {
    // Log report to the console
    console.log("\n"+'-------------------------------------------------'+"\n"+'-----------------TWITTER EXPRESS-----------------'+"\n"+'-------------------------------------------------'+"\n");
    console.log(factory);
    console.log("\n\n");
  }
}, config.reportInterval);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Hndlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
