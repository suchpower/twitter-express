module.exports = function (tweetTotal, myNumHashtags){
  return ((myNumHashtags/tweetTotal)*100).toFixed(0);
};
