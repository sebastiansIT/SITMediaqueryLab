'use strict'
/* global math */
/* global navigator */
/* global screen */
/* global window */
/* global document */
/* global $ */

if (typeof navigator.serviceWorker !== 'undefined') {
  navigator.serviceWorker.register('serviceworker.js')
}

/**
 * Returns the width of a vertical scrollbar.
 */
function scrollbarWidth () {
  'use strict'
  var hiddenWidth, visibleWidth
  $('body').css('overflow', 'hidden')
  hiddenWidth = $(window).width()
  $('body').css('overflow', 'scroll')
  visibleWidth = $(window).width()
  $('body').css('overflow', 'auto')
  return hiddenWidth - visibleWidth
}

function scrollbarHeight () {
  'use strict'
  var hiddenHeight, visibleHeight
  $('body').css('overflow', 'hidden')
  hiddenHeight = $(window).height()
  $('body').css('overflow', 'scroll')
  visibleHeight = $(window).height()
  $('body').css('overflow', 'auto')
  return hiddenHeight - visibleHeight
}

/**
 * Returns the width of the viewport as it is defined in the CSS specification
 * (inklusive his scrollbar)
 */
function viewportWidth () {
  'use strict'
  var width
  $('body').css('overflow', 'hidden')
  width = $(window).width()
  $('body').css('overflow', 'auto')
  return width
}
/**
 * Returns the height of the viewport as it is defined in the CSS specification
 * (inklusive his scrollbar)
 */
function viewportHeight () {
  'use strict'
  $('body').css('overflow', 'hidden')
  var height = $(window).height()
  $('body').css('overflow', 'auto')
  return height
}
function getLength (pixelValue, unit) {
  'use strict'
  var returnValue
  switch (unit) {
    case 'px':
      returnValue = pixelValue
      break
    case 'in':
      returnValue = pixelValue / 96
      break
    case 'cm':
      returnValue = (pixelValue / 96) * 2.54
      break
    case 'mm':
      returnValue = ((pixelValue / 96) * 2.54) * 10
      break
    case 'pt':
      returnValue = (pixelValue / 96) * 72
      break
    case 'pc':
      returnValue = ((pixelValue / 96) * 72) / 12
      break
    default:
      return undefined
  }
  return returnValue
}
function getResolution (unit, extrem) {
  'use strict'
  // Create temporal elements for measuring the Resolution
  $('head').append($("<style id='detectorstyle'>"))
  $('#detectorstyle').text(
    '.detector {             '
    + '    border:none;        '
    + '    margin:0;           '
    + '    padding:0;          '
    + '    position:absolute;  '
    + '    left:-3000px;       '
    + '    top:-3000px;        '
    + '}                       '
    + '#dpidetector {          '
    + '    width:1in;          '
    + '    height:1in;         '
    + '}                       '
    + '#dpcmdetector {         '
    + '    width:1cm;          '
    + '    height:1cm;         '
    + '}                       ')
  $('body').append($("<div id='dpidetector' class='detector'></div>"))
  $('body').append($("<div id='dpcmdetector' class='detector'></div>"))
  var pixeldensity = NaN
  switch (extrem) {
    case 'max':
      switch (unit) {
        case 'dpi':
          pixeldensity = math.max($('#dpidetector').width(), $('#dpidetector').height())
          break
        case 'dpcm':
          pixeldensity = math.max($('#dpcmdetector').width(), $('#dpcmdetector').height())
          break
        case 'dppx':
          pixeldensity = (typeof (window.devicePixelRatio) !== 'undefined' ? window.devicePixelRatio : 1)
          return pixeldensity
      }
      break
    case 'min':
      switch (unit) {
        case 'dpi':
          pixeldensity = math.min($('#dpidetector').width(), $('#dpidetector').height())
          break
        case 'dpcm':
          pixeldensity = math.min($('#dpcmdetector').width(), $('#dpcmdetector').height())
          break
        case 'dppx':
          pixeldensity = (typeof (window.devicePixelRatio) !== 'undefined' ? window.devicePixelRatio : 1)
          return pixeldensity
      }
      break
    default:
      if ($('#dpidetector').width() === $('#dpidetector').height()) {
        switch (unit) {
          case 'dpi':
            pixeldensity = $('#dpidetector').width()
            break
          case 'dpcm':
            pixeldensity = $('#dpcmdetector').width()
            break
          case 'dppx':
            pixeldensity = (typeof (window.devicePixelRatio) !== 'undefined' ? window.devicePixelRatio : 1)
            return pixeldensity
        }
      } else {
        pixeldensity = NaN
      }
  }
  // Remove the temporal elements
  $('#detectorstyle').remove()
  $('#dpidetector').remove()
  $('#dpcmdetector').remove()
  return pixeldensity * (typeof (window.devicePixelRatio) !== 'undefined' ? window.devicePixelRatio : 1)
}
/** Displays some informations about the environment at the top of a page */
function showEnvironment () {
  'use strict'
  document.getElementById('os').innerHTML = '<span>' + 'Platform' + ' : <span>' + navigator.platform + '</span><br/>'
  document.getElementById('browser').innerHTML = '<span>' + 'User Agent' + ' : <span>' + navigator.userAgent + '</span><br/>'
}
/** Displays the dimensions of viewport and document */
function showResizableDimension () {
  'use strict'
  // shows width/height of browser viewport in pixel and the width of a scroll bar
  document.getElementById('documentsizeReferenze').textContent = 'Document: ' + $(document).width() + 'px × ' + $(document).height() + 'px'
  // shows width/height of HTML document in pixel
  document.getElementById('viewportsizeReferenze').textContent = 'Viewport: ' + viewportWidth() + 'px × ' + viewportHeight() + 'px' + ' (inclusive Scrollbar: ' + scrollbarWidth() + 'px)'
}
/** Displays the relevant dimensions at the top of a page */
function showDimension () {
  'use strict'
  showResizableDimension()
  // shows width/height of screen in pixel
  document.getElementById('screensizeReferenze').textContent = 'Screen: ' + screen.width + 'px × ' + screen.height + 'px'
  // shows resolution of the screen in dpi and the pixel ratio between device pixels and css pixels (for retina displays)
  document.getElementById('resolutionReferenze').textContent = 'Resolution: ' + getResolution('dpi') + 'dpi (Device pixel ratio of ' + (typeof (window.devicePixelRatio) !== 'undefined' ? window.devicePixelRatio : '-') + ')'
  // shows the color depth
  document.getElementById('colordepthReferenze').textContent = 'Color Depth: ' + screen.colorDepth + ' bit'
}

const showMonitorConfiguration = () => {
  if (window.getWindowSegments) {
    const segments = window.getWindowSegments()
    const domNumberFolds = document.getElementById('folds')
    if (domNumberFolds) {
      domNumberFolds.innerHTML = segments.length
    }

    const domFoldAlignment = document.getElementById('foldalignment')
    if (domFoldAlignment) {
      if (segments.length === 0) {
        domFoldAlignment.innerHTML = 'no display'
      } else if (segments.length === 1) {
        domFoldAlignment.innerHTML = 'single display'
      } else if (segments.length > 2) {
        domFoldAlignment.innerHTML = 'complex'
      } else if (segments[0].top < segments[1].top) {
        domFoldAlignment.innerHTML = 'horizontal split'
      } else {
        domFoldAlignment.innerHTML = 'vertical split'
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('resize', showResizableDimension)
  window.addEventListener('resize', showMonitorConfiguration)
  showEnvironment()
  showDimension()
  showMonitorConfiguration()
})
