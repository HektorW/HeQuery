/**
 * Utility library for handling the DOM.
 * Much based on jQuery
 *
 * @author Hektor
 */

(function() {
  // Exposed function
  var dom = this.dom = function() {
    if(arguments.length === 1) {
      var t = typeof arguments[0];

      switch(t){
        case 'string':
          return dom.query(arguments[0]);
        case 'function':
          return dom.ready(arguments[0]);
      }
    }
  };

  // Shorthand variable for dom
  this.$ = dom;

  // CLASS DOM ELEMENT
  var DOMElem = function(elements) {
    // Add elements as if they were an array
    Array.prototype.push.apply(this, elements);
  };


  // Bind events
  DOMElem.prototype.on = function(event, callback) {
    var i, len, elem;

    // Loop through all elements
    for(i = 0, len = this.length; i < len; i++) {
      elem = this[i];

      // Bind event listener, and bind element as context for callback
      elem.addEventListener(event, callback.bind(elem), false);
    }

    return this;
  };

  DOMElem.prototype.click = function(fn) {
    return this.on('click', fn);
  };

  // Queries for elements on page
  dom.query = function(selector) {
    // Find all elements
    var elems = document.querySelectorAll(selector);

    // Create a new DOMElem
    var d = new DOMElem(elems);

    // Return it
    return d;
  };

  // Fires event when document loads or if already loaded
  dom.ready = function(fn) {
    // For now just bind event listener to window load
    window.addEventListener('load', fn, false);
  };
})();