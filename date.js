module.exports.getDay = () => {
  var dateOptions = { weekday: "long" };
  var today = new Date();
  var dayOfWeek = today.toLocaleDateString("en-US", dateOptions);
  return dayOfWeek;
};
