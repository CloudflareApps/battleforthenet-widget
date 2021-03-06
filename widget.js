(function() {
  if (typeof _bftn_options == "undefined") _bftn_options = {};
  if (typeof _bftn_options.animation == "undefined") _bftn_options.animation = 'main';
  if (typeof _bftn_options.iframe_base_path == "undefined") _bftn_options.iframe_base_path = 'RESOURCE_ROOT';
  if (typeof _bftn_options.delay == "undefined") _bftn_options.delay = 1000;
  if (typeof _bftn_options.debug == "undefined") _bftn_options.debug = false;
  if (typeof _bftn_options.date == "undefined") _bftn_options.date = new Date(2017, 6 /* Zero-based month */, 12);
  if (typeof _bftn_options.always_show_widget == "undefined") _bftn_options.always_show_widget = false;

  var _bftn_animations = {
    main: {
      options: {
        modalAnimation: 'main'
      },
      init: function(options) {
        for (var k in options) this.options[k] = options[k];
        return this;
      },
      start: function() {
        var iframe = _bftn_util.createIframe();
        _bftn_util.bindIframeCommunicator(document.getElementById('_bftn_iframe'), this);
      },
      stop: function() {
        _bftn_util.destroyIframe();
      }
    }
  }

  var _bftn_util = {
    injectCSS: function(id, css) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.id = id;
      if (style.styleSheet) style.styleSheet.cssText = css;
      else style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    },

    createIframe: function() {
      var wrapper = document.createElement('div');
      wrapper.id = '_bftn_wrapper';
      var iframe = document.createElement('iframe');
      iframe.id = '_bftn_iframe';
      iframe.src = "data:text/html;base64,ENCODED_IFRAME";
      iframe.frameBorder = 0;
      iframe.allowTransparency = true; 
      iframe.style.display = 'none';
      wrapper.appendChild(iframe);
      document.body.appendChild(wrapper);
      return wrapper;
    },

    destroyIframe: function() {
      var iframe = document.getElementById('_bftn_wrapper');
      iframe.parentNode.removeChild(iframe);
    },

    bindIframeCommunicator: function(iframe, animation) {
      function sendMessage(requestType, data) {
        data || (data = {});
        data.requestType = requestType;
        data.BFTN_WIDGET_MSG = true;
        iframe.contentWindow.postMessage(data, '*');
      }

      var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

      eventer(messageEvent, function(e) {
        if (!e.data || !e.data.BFTN_IFRAME_MSG) return;

        delete e.data.BFTN_IFRAME_MSG;

        switch (e.data.requestType) {
          case 'getAnimation':
            iframe.style.display = 'block';
            sendMessage('putAnimation', animation.options);
            break;
          case 'stop':
            animation.stop();
            break;
        }
      }, false);
    },

    setCookie: function(name, val, exdays) {
      var d = new Date();
      d.setTime(d.getTime()+(exdays*24*60*60*1000));

      var expires = "expires="+d.toGMTString();
      document.cookie = name + "=" + val + "; " + expires;
    },

    getCookie: function(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      var c;

      for(var i = 0; i < ca.length; i++) {
        c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }

      return "";
    },

    log: function() {
      if (_bftn_options.debug) console.log.apply(console, arguments);
    }
  }

  function onDomContentLoaded() {
    var images = new Array();
    var preloaded = 0;

    function init() {
      setTimeout(function() {
        _bftn_animations[_bftn_options.animation].init(_bftn_options).start();
      }, _bftn_options.delay);
    }

    function preload() {
      for (i = 0; i < preload.arguments.length; i++) {
        images[i] = new Image()
        images[i].src = _bftn_options.iframe_base_path + '/images/' + preload.arguments[i]

        images[i].onload = function() {
          preloaded++;
          _bftn_util.log('Preloaded ' + preloaded + ' images.');

          if (preloaded == images.length) {
            _bftn_util.log('DONE PRELOADING IMAGES. Starting animation in ' + _bftn_options.delay + ' milliseconds.');
            init();
          }
        }
      }
    }

    // Should we show the widget, regardless?
    if (!_bftn_options.always_show_widget && window.location.href.indexOf('ALWAYS_SHOW_BFTN_WIDGET') === -1) {

      // Only show once.
      if (_bftn_util.getCookie('_BFTN_WIDGET_SHOWN')) return;

      // Only show on configured date.
      var today = new Date();
      if (today.getFullYear() !== _bftn_options.date.getFullYear() ||
          today.getMonth() !== _bftn_options.date.getMonth() ||
          today.getDate() !== _bftn_options.date.getDate()) {
          return;
      }
    }

    _bftn_util.setCookie('_BFTN_WIDGET_SHOWN', 'true', 365);

    _bftn_util.injectCSS('_bftn_iframe_css', '#_bftn_wrapper { position: fixed; left: 0px; top: 0px; width: 100vw; height: 100%; z-index: 20000; -webkit-overflow-scrolling: touch; overflow-y: scroll; } #_bftn_iframe { width: 100%; width: 100vw; height: 100%; min-height: 750px;  }');

    // Preload images before showing the animation
    // preload();
    init();
  }

  // Wait for DOM content to load.
  switch(document.readyState) {
    case 'complete':
    case 'loaded':
    case 'interactive':
      onDomContentLoaded();
      break;
    default:
      if (typeof document.addEventListener === 'function') {
        document.addEventListener('DOMContentLoaded', onDomContentLoaded, false);
      }
  }
})();
