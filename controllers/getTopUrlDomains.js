module.exports = function (myUrlDomains){
  //console.log(Object.keys(myTweets).length);
  var props = Object.keys(myUrlDomains).map(function(key) {
    return { key: key, value: this[key] };
  }, myUrlDomains);
  props.sort(function(p1, p2) { return p2.value - p1.value; });
  //var topFiveUrlDomains = props.slice(0, 5);
  var topFiveUrlDomains = props.slice(0, 5).reduce(function(obj, prop) {
    obj[prop.key] = prop.value;
    return obj;
  }, {});
  return topFiveUrlDomains;
};
