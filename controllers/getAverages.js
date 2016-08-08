module.exports = function (tweetTotal, startTime){
  var averages = {},
      elapsedTime = (Date.now() - startTime)/1000;
  averages.avgPerSecond = (tweetTotal/elapsedTime).toFixed(0);
  averages.avgPerMinute = averages.avgPerSecond*60;
  averages.avgPerHour = averages.avgPerMinute*60;
  return averages;
};
