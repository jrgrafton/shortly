Meteor.subscribe('url-count');
Counts = new Meteor.Collection('counts');

Deps.autorun(function () {
  Meteor.subscribe("url-count");
});

Template.stats.urlCount = function () {
  return (Counts.findOne('0') == undefined)? 0 : Counts.findOne('0').count;
} 