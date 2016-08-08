module.exports = function(streamData){
  // tweet object constructor
  function TweetSchema(obj) {
    this.body = obj['text'];
    this.hashtags = obj['entities']['hashtags'];
    this.urls = obj['entities']['urls'];
    this.media = obj['entities']['media'];
  }
  // return new tweet object
  return new TweetSchema(streamData);
};
