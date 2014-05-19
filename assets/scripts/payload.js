
var dd = documentData;

// ______ TEST FRAMEWORK ______ //

function send_log(signal, app) {
  if(app) {
    signal = (app + ' ' + signal).toString();
    console.log(signal);
    return true;
  }
  else {
    return false;
  }
}
 

var tests = {
  'run' : 0,
  'msg' : function(signal) {
    if(dd.environment == "development") {
      send_log(signal, '[Tests]'); 
    } 
  }
};

var Status = {
  'run' : 0,
  'msg': function(signal) { 
    if(dd.environment == "development") {
      send_log(signal, '[Status]'); 
    }
  } 
};

function _run_tests() {
  // Run tests only on dev environment.
  if (documentData.environment == "development" ) {
    var tests = window.tests; // cache
    if(tests) {
      for ( var index in tests ) {
        tests[index];
        tests.run += 1;
      }
      tests.msg("All tests good. " + tests.run + " tests run.");
    }
    else {
      console.log("Tests not defined.");
      return false;
    }
  }
}




// ______ SOCIAL MEDIA FUNCTIONS______ //
// BASIC DATA
var share_settings = {
  'facebook': {
    'base_URL': 'http://www.facebook.com/sharer.php?',
    'name' : 'sharer',
    'count_url': 'https://graph.facebook.com/?id=' 
      + encodeURIComponent(documentData.url)
      + '&callback=?',
    'count_key': 'shares'
  },
  'twitter': {
    'base_URL': 'https://twitter.com/intent/tweet?',
    'name': 'tweet',
    'count_url': 'https://cdn.api.twitter.com/1/urls/count.json?url=' 
      + encodeURIComponent(documentData.url) 
      + '&callback=?',
    'count_key': 'count'
  }
}


// ACTION::SHARING
// Pop-up window settings generator. 
function _window_setting(toolbar, status, width, height) {
  var toolbar = toolbar || '0';
  var status = status || '0';
  var width = width || '620';
  var height = height || '430';

  var settings = 'toolbar=' + toolbar + ',status=' + status + ',width=' + width + ',height=' + height;
  
  return settings;
}
(window.tests['_window_setting'] = function(settings) {
  if (_window_setting().match(/^toolbar=\d+,status=\d+,width=\d+,height=\d+$/)) {
    return true;
  } else {
    tests.msg("_window_setting[fun] disfunctional");
    return false;
  }
})();

// Click to Share Function
function share_click(network, window_setting) {
  var window_setting = window_setting || window._window_setting(); 
  var network = share_settings[network];
  var verb;

  var page_url = documentData.url; 
  var page_title = documentData.title;
  var push_url = network['base_URL'];

  if(network == 'facebook') {
    push_url = push_url + 'u=' + encodeURIComponent(page_url) 
      + '&t=' + encodeURIComponent(page_title);
    verb = 'facebook';
  } else {
    push_url = push_url + 'url=' + encodeURIComponent(page_url)
      + '&via=kingsidharth&related=kingsidharth&text='
      + encodeURIComponent(page_title);
    verb = 'twitter';
  }

  window.open(push_url, verb, window_setting);
  return false;
}


// WELDERS::SOCIAL MEDIA SHARED NUMBERS 
// Get the number of count for a network.
function _get_share_count(network) {
  var ss = window.share_settings[network];
  var push_url = ss['count_url'];
  var count_key = ss['count_key'];

  var data = $.getJSON(push_url);
  data.done(function(response) {
    var count = response[count_key];
    // Output it to dd for now
    // TODO: Find a better & testable way to run this function.
    window.dd[network + '_count'] = response[count_key];
  });
  data.fail(function() { 
    tests.msg('JSON failed to load for _get_share_count on ' + network);
  });
}

// Get share count of a network
// and set it where it's asked for.
function _set_share_count(network, change_verb) {
  var change_verb = change_verb || true;
  var ele = $('.data_' + network + '_count'); 
  var count = window.dd[network + '_count'];

  if(count != 0 && count != undefined) {
    $(ele).each(function() {
      $(this).html(' ' + window.dd[network + '_count']);
      if(change_verb) {
        $(this).next().append('s');
      }
    });
  }
  return ele; 
}
(window.tests['_set_share_count'] = function() {
  if (_set_share_count('facebook') && _set_share_count('twitter')) {
  } else {
    tests.msg("There was a problem in _set_share_count");
  }
})();

// Get and Set Numbers for each network.
function social_share_count() {
  networks = ['facebook', 'twitter'];

  // Get numbers only if on desktops
  if(dd.device.is_desk_wide || dd.device.is_desk) {
    $(networks).each(function(index, value) {
      _get_share_count(value);
      if(dd[value + '_count']) { _set_share_count(value); }
    });
  }
}




// ______ RESPONSIVE FRAMEWORK ______ //
dd['device'] = new Object;

dd['device'] = {
  'is_desk_wide': false,
  'is_desk': false,
  'is_mobile': false,
  'is_unknown': false
}

// Viewport Dimensions
function _get_viewport_dimensions() {
  dd.device['width'] = window.innerWidth;
  dd.device['height'] = window.innerHeight;
  return dd.device;
}

// Device Orientation
function _get_device_orientation(width, height) {
  var width = width || dd.device.width;
  var height = height || dd.device.height; 

  if (width > height) {
    dd.device['orientation'] = 'landscape';
  }
  else {
    dd.device['orientation'] = 'portrait';
  }

  return dd.device.orientation;
}

// Guess Device Type
function _get_device_type(width, height) {
  var width = width || dd.device.width;
  var height = height || dd.device.height;
  var orientation = orientation || dd.device.orientation;

  if ( width > 1300 && height > 800 ) {
    window.dd.device['is_desk_wide'] = true;
  } 
  else if (width < 1300 && width >= 760) {
    window.dd.device['is_desk'] = true;
  }
  else if (width < 760 && orientation == 'portrait') {
    window.dd.device['is_mobile'] = true;
  }
  else {
    window.dd.device['is_unknown'] = true;
  }

  return dd.device;
}

function init_responsive() {
  _get_viewport_dimensions();
  _get_device_orientation();
  _get_device_type();

  window.tests['_get_viewport_dimensions'] = function() {
    var device = window.dd.device;
    if (device.height && device.width) {
      return true;
    } else {
      tests.msg("Height or Width not defined");
      return false;
    }
  }

  window.tests['_get_device_orientation'] = function() {
    if(window.dd.device.orientation) {
      return true;
    } else {
      test.msg("Device orientation not set");
      return false;
    }
  }

  window.tests['_get_device_type'] = function() {
    var d = window.dd.device;
    if (d.is_desk_wide || d.is_desk || d.is_mobile || d.is_unknown) {
      return true;
    } else {
      tests.msg("_get_device_type is failing. Device type wasn't set");
      return false;
    }
  }
}




// ______ INITIALIZATION SCRIPTS ______ //
function _js_classes() {
  $('.js_onload_show').show();

  window.tests['js_onload_show'] = function() {
    var class_instances = document.getElementsByClassName('js_onload_show');
    class_instances.forEach(function() {
      if(this.hidden) {
        tests.msg(this);
        tests.msg('.js_onload_show failing. On item ' + this.index);
      }
    });
  }
}


// Google Analytics Event Register
function ga_event_register (category, action) {
  _gaq.push(['_trackEvent', category, action]);
}
var gae = ga_event_register;

function initScripts() {
  _js_classes();
  init_responsive();
}


// ______ POST SCRIPTS ______ //

function postScripts() {
  _run_tests();
}

$(document).ready(function() {
  initScripts();
  social_share_count();
  postScripts(); // The last thing to execute.
});
