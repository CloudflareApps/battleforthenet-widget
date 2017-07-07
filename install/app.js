(function () {
  'use strict'

  if (!window.addEventListener) return // Check for IE9+

  var options = INSTALL_OPTIONS
  var isPreview = INSTALL_ID === 'preview'

  window._bftn_options = {
    theme: options.theme,
    delay: parseInt(options.delay, 10),
    always_show_widget: isPreview
  }
}())
