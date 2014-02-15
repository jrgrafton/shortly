Meteor.subscribe('url-count');
Counts = new Meteor.Collection('counts');

Deps.autorun(function () {
  Meteor.subscribe("url-count");
});

Template.urlInfo.count = function () {
  return Counts.findOne('0').count;
} 