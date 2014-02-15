Meteor.subscribe('url-count');
Counts = new Meteor.Collection('counts');

Deps.autorun(function () {
  Meteor.subscribe("url-count");
});

Meteor.subscribe('url-count', function onComplete() {
  Session.set('statsLoaded', true);
});

Template.stats.urlCount = function () {
  return (Counts.findOne('0') == undefined)? 0 : Counts.findOne('0').count;
}
Template.stats.statsLoaded = function () {
  return Session.get('statsLoaded');
};