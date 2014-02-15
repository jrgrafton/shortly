Meteor.publish("urlCount", function () {
  return Meteor.Models.URL.find({}).count();
});