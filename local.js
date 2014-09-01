define(
[
  'jquery'
],
function($) {
  var local = {};
  var deferred;

  var process_file = function(file) {
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function(_file) {
      deferred.resolve(_file.target.result);
    };
  };

  local.pick = function(type) {
    deferred = $.Deferred();

    $('<input type="file" accept="' + type + 's/*">')
    .on('change', function(e) {
      process_file(e.currentTarget.files[0]);
    })
    .click();

    return deferred.promise();
  };


  return local;
});
