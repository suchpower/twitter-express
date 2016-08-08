module.exports = function (myEmojis){
  
  var props = Object.keys(myEmojis).map(function(key) {
    return { key: key, value: this[key].counter };
  }, myEmojis);

  props.sort(function(p1, p2) { return p2.value - p1.value; });
  //var topFiveEmojis = props.slice(0, 5);

  var topFiveEmojis = props.slice(0, 5).reduce(function(obj, prop) {
    obj[prop.key] = prop.value;
    return obj;
  }, {});

  return topFiveEmojis;
};
