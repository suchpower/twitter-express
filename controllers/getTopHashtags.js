module.exports = function (myHashtags){
  //console.log(Object.keys(myTweets).length);
  var props = Object.keys(myHashtags).map(function(key) {
    return { key: key, value: this[key] };
  }, myHashtags);
  props.sort(function(p1, p2) { return p2.value - p1.value; });
  //var topFiveHashtags = props.slice(0, 5);
  var topFiveHashtags = props.slice(0, 5).reduce(function(obj, prop) {
    obj[prop.key] = prop.value;
    return obj;
  }, {});
  return topFiveHashtags;
};
