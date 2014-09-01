define(
[
  'local',
  'dropbox',
  'google_drive'
],
function(local, dropbox, google_drive) {
  /**
   * Initializes each picker source
   */
  var Picker = function() {
    this._sources = {};

    this._sources.dropbox = dropbox;
    this._sources.local = local;
    this._sources.google_drive = google_drive;
  };

  Picker.prototype.pick = function(id, type) {
    return this._sources[id].pick(type);
  };

  return Picker;
});
