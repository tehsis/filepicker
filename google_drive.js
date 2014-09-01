define(
[
  'jquery',
  'config'
],
function($, config) {
  var oauthToken;
  var pickerApiLoaded = false;
  var pickerReady = false;
  var picker;
  var deferred;
  var global_type;

  var google_drive = {};

  var pickerCallback = function(data) {
    var url = 'nothing';
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      var doc = data[window.google.picker.Response.DOCUMENTS][0];
      url = doc[window.google.picker.Document.ID];
      $.ajax(
        'https://www.googleapis.com/drive/v2/files/' + url,
        {
          type: 'GET',
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + oauthToken );
          }
        }).done(function(data) {
          deferred.resolve(data.webContentLink);
        });
    }
  };

  var createPicker = function() {
    var views = {
      image: window.google.picker.ViewId.DOCS_IMAGES,
      video: window.google.picker.ViewId.VIDEO_SEARCH
    };

    if (pickerApiLoaded && oauthToken && !pickerReady) {
      picker = new window.google.picker.PickerBuilder().
        addView(views[global_type]).
        setOAuthToken(oauthToken).
        setDeveloperKey('AIzaSyD6iX0uVL38MUDpFOUCKQAzVQisheeTXX0').
        setCallback(pickerCallback).
        build();
      pickerReady = true;
    }

    if (pickerReady) {
      picker.setVisible(true);
    }
  };

  var onAuth = function(authResult) {
    if (authResult && !authResult.error) {
      oauthToken = authResult.access_token;
      createPicker();
    }
  };

  var onAuthApiLoad = function() {
    window.gapi.auth.authorize({
      'client_id': config.google.drive.clientID,
      'scope': ['https://www.googleapis.com/auth/drive.readonly'],
      'immediate': false
    },  onAuth);
  };

  var onPickerApiLoad = function() {
    pickerApiLoaded = true;
    createPicker();
  };

  google_drive.pick = function(type) {
    global_type = type;

    deferred = $.Deferred();
    if (!oauthToken) {
      window.gapi.load('auth', {'callback': onAuthApiLoad});
    }

    if (!pickerApiLoaded) {
      window.gapi.load('picker', {'callback': onPickerApiLoad});
    }

    createPicker();

    return deferred.promise();
  };


  return google_drive;
});
