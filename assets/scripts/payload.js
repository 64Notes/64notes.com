

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
    'call' : 'sharer',
    'param': {
      'u': documentData.url,
      't': documentData.title
    }
  },
  'twitter': {
    'base_URL': 'https://twitter.com/intent/tweet?',
    'call': 'tweet'
  }
}

function window_setting(toolbar, status, width, height) {
  var toolbar = toolbar || '0';
  var status = status || '0';
  var width = width || '620';
  var height = height || '430';

  var settings = 'toolbar=' + toolbar + ',status=' + status + ',width=' + width + ',height=' + height;
  return settings;
}

function share_click(network, window_setting, documentData) {
  var window_setting = window_setting || window.window_setting(); 
  var documentData = documentData || window.documentData;

  var url = share_settings[network]['base_URL'];
  window.open(url, share_settings[network]['call'], window_setting);
  return false;
}

function fb_click() {
  window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(documentData.url)+'&t='+encodeURIComponent(documentData.title),'sharer','toolbar=0,status=0,width=626,height=436');
  return false;
}

function tweet_click() {
  var target;
  target = 'https://twitter.com/intent/tweet?' +
    'url=' + encodeURIComponent(documentData.url) +
    '&via=' + 'kingsidharth' + '&related=kingsidharth' +
    '&text=' + encodeURIComponent(documentData.title);

  window.open(target, 'tweet', 'toolbar=0,status=0,width=626,height=436');
  return false;
}

function get_tweet_count() {
  var url = 'https://cdn.api.twitter.com/1/urls/count.json?url=' + encodeURIComponent(documentData.url);
  getJSON = new XMLHttpRequest;
  getJSON.crossDomain = "http://www.64notes.com";
  getJSON.onreadystatechange = function() {
    if (getJSON.readyState == 4 && getJSON.status == 200) {
        JSON.parse(getJSON.responseText);
    }
  }
  getJSON.open("GET", url)
  getJSON.send();
  console.log(getJSON);
}

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

$(document).ready(function() {
  initScripts();
  run_tests();
});
