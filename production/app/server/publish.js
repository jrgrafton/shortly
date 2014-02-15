Meteor.publish("url-count", function () {
  var self = this;
  var count = 0;
  var initializing = true;
  var handle = Meteor.Models.URL.find({}).observeChanges({
    added: function (id) {
      count++;
      if (!initializing)
        self.changed("counts", '0', {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("counts", '0', {count: count});
    }
    // don't care about moved or changed
  });

  // Observe only returns after the initial added callbacks have
  // run.  Now return an initial value and mark the subscription
  // as ready.
  initializing = false;
  self.added("counts", '0', {count: count});
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle.stop();
  });
});