define(
[
  'jquery'
],
function($) {
  var dropbox = {};

  dropbox.init = function() {};

  dropbox.pick = function(type) {
    var deferred = $.Deferred();

    window.Dropbox.choose({
      success: function(files) {
        deferred.resolve(files[0].link);
      },
      linkType: 'direct',
      extensions: [type]
    });

    return deferred.promise();
  };


  return dropbox;
});
