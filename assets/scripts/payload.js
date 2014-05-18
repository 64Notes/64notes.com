

// ______ TEST FRAMEWORK ______ //
var tests = {
  'run' : 0,
  'msg' : function(signal) {
    var signal = "[Tests] " + signal;
    console.log(signal);
  }
}

function _run_tests() {
  // Run tests only on dev environment.
  if (documentData.environment == "dev" ) {
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
var share_settings = {
  'facebook': {
    'base_URL': 'http://www.facebook.com/sharer.php?',
    'name' : 'sharer',
    'count_url': 'https://graph.facebook.com/?id=' 
      + encodeURIComponent(documentData.url)
      + '&callback=?'
  },
  'twitter': {
    'base_URL': 'https://twitter.com/intent/tweet?',
    'name': 'tweet',
    'count_url': 'https://cdn.api.twitter.com/1/urls/count.json?url=' 
      + encodeURIComponent(documentData.url) 
      + '&callback=?'
  }
}

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

function _get_share_count(network) {
  var push_url = window.share_settings[network]['count_url'];
  var count;

  data = $.getJSON(push_url, function(data) { return data; });
  console.log(data);
  
  if(network == 'twitter') {
    count = data.count;
  } 
  else if (network == 'facebook') {
    count = data.shares;
  }
  console.log(count);
}


// ______ INITIALIZATION SCRIPTS ______ //
function _js_classes() {
  $('.js_onload_show').show();

  window.tests['js_onload_show'] = function() {
    var class_instances = document.getElementsByClassName('js_onload_show');
    class_instances.forEach(function() {
      if(this.hidden) {
        console.log(this);
        console.log('.js_onload_show failing. On item ' + this.index);
      }
    });
  }
}


function initScripts() {
  _js_classes();
}


// ______ POST SCRIPTS ______ //
function postScripts() {
  _run_tests();
}

$(document).ready(function() {
  initScripts();

  postScripts(); // The last thing to execute.
});
