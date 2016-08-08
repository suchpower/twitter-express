var appFunctions = require('./appFunctions'),
    getTotal = require('./getTotal'),
    getAverages = require('./getAverages'),
    getTopEmojis = require('./getTopEmojis'),
    getPercentEmojis = require('./getPercentEmojis'),
    getTopHashtags = require('./getTopHashtags'),
    getPercentHashtags = require('./getPercentHashtags'),
    getPercentUrls = require('./getPercentUrls'),
    getPercentPhotoUrls = require('./getPercentPhotoUrls'),
    getTopUrlDomains = require('./getTopUrlDomains');

module.exports = function(myTweets, myHashtags, myNumHashtags, myUrls, myNumUrls, myUrlDomains, myNumPhotoUrls, myEmojis, myNumEmojis, myNumStreamErrors, startTime) {
  var tweetTotal = appFunctions.getObjectLength(myTweets),
      urlsTotal = appFunctions.getObjectLength(myUrls),
      hashtagsTotal = appFunctions.getObjectLength(myHashtags),
      emojisTotal = appFunctions.getObjectLength(myEmojis),
      streamReport = {
        totalTweets: tweetTotal,
        streamErrors: myNumStreamErrors,
        averages: getAverages(tweetTotal, startTime),
        streamUrls: {total: myNumUrls, unique: urlsTotal},
        streamHashtags: {total: myNumHashtags, unique: hashtagsTotal},
        streamEmojis: {total: myNumEmojis, unique: emojisTotal},
        percentEmojis: getPercentEmojis(tweetTotal, myNumEmojis),
        percentUrls: getPercentUrls(tweetTotal, myNumUrls),
        percentHashtags: getPercentHashtags(tweetTotal, myNumHashtags),
        percentPhotoUrls: getPercentPhotoUrls(tweetTotal, myNumPhotoUrls),
        topEmojis: getTopEmojis(myEmojis),
        topHashtags: getTopHashtags(myHashtags),
        topUrlDomains: getTopUrlDomains(myUrlDomains)
      };

  var formatReport = function(streamReport) {
    // Format report for display in the terminal
    var report = '';
    report += 'TOTAL TWEETS: '+streamReport.totalTweets+"\n\n";
    report += 'Tweets/Second: '+streamReport.averages.avgPerSecond+"\n"+'Tweets/Minute: '+streamReport.averages.avgPerMinute+"\n"+'Tweets/Hour: '+streamReport.averages.avgPerHour+"\n\n";
    report += 'URLs - Total: '+streamReport.streamUrls.total+' - Unique: '+streamReport.streamUrls.unique+"\n";
    report += 'HASHTAGS - Total: '+streamReport.streamHashtags.total+' - Unique: '+streamReport.streamHashtags.unique+"\n";
    report += 'EMOJIS - Total: '+streamReport.streamEmojis.total+' - Unique: '+streamReport.streamEmojis.unique+"\n\n";
    report += 'Tweets containing URLs: '+streamReport.percentUrls+'%'+"\n";
    report += 'Tweets containing Emojis: '+streamReport.percentEmojis+'%'+"\n";
    report += 'Tweets containing Hashtags: '+streamReport.percentHashtags+'%'+"\n";
    report += 'Tweets containing Photo URLs: '+streamReport.percentPhotoUrls+'%'+"\n\n";
    report += 'Top Emojis:'+"\n";
    Object.keys(streamReport.topEmojis).forEach(function(key){
      report += key+'   ('+streamReport.topEmojis[key]+') '+"\n";
    });
    report += "\n";
    report += 'Top Hashtags:'+"\n";
    Object.keys(streamReport.topHashtags).forEach(function(key){
      report += '('+streamReport.topHashtags[key]+')  '+key+"\n";
    });
    report += "\n";
    report += 'Top Domains in tweets containing URLs: '+"\n";
    Object.keys(streamReport.topUrlDomains).forEach(function(key){
      report += '('+streamReport.topUrlDomains[key]+')  '+key+"\n";
    });
    report += "\n";
    report += 'Stream errors detected: '+streamReport.streamErrors;
    return report;
  };

  return formatReport(streamReport);
};
