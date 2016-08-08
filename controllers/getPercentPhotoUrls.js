module.exports = function (tweetTotal, myNumPhotoUrls){
  return ((myNumPhotoUrls/tweetTotal)*100).toFixed(0);
};
