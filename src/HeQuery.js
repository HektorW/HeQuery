/**
 * Utility library for handling the DOM.
 * Very much inspired/(copied) by jQuery
 *
 * Döpas om till HeQuery: I have the power!
 *
 * @author Hektor
 */


 
/**
 * DOM Exceptions
 * 
 * INDEX_SIZE_ERR = 1;                          The index is not in the allowed range.  INDEX_SIZE_ERR (1)
 * DOMSTRING_SIZE_ERR = 2; // historical                          
 * HIERARCHY_REQUEST_ERR = 3;                   The operation would yield an incorrect node tree. HIERARCHY_REQUEST_ERR (3)        
 * WRONG_DOCUMENT_ERR = 4;                      The object is in the wrong document.  WRONG_DOCUMENT_ERR (4)      
 * INVALID_CHARACTER_ERR = 5;                   The string contains invalid characters. INVALID_CHARACTER_ERR (5)        
 * NO_DATA_ALLOWED_ERR = 6; // historical                         
 * NO_MODIFICATION_ALLOWED_ERR = 7;             The object can not be modified. NO_MODIFICATION_ALLOWED_ERR (7)              
 * NOT_FOUND_ERR = 8;                           The object can not be found here. NOT_FOUND_ERR (8)
 * NOT_SUPPORTED_ERR = 9;                       The operation is not supported. NOT_SUPPORTED_ERR (9)    
 * INUSE_ATTRIBUTE_ERR = 10; // historical                          
 * INVALID_STATE_ERR = 11;                      The object is in an invalid state.  INVALID_STATE_ERR (11)      
 * SYNTAX_ERR = 12;                             The string did not match the expected pattern.  SYNTAX_ERR (12)
 * INVALID_MODIFICATION_ERR = 13;               The object can not be modified in this way. INVALID_MODIFICATION_ERR (13)             
 * NAMESPACE_ERR = 14;                          The operation is not allowed by Namespaces in XML. [XMLNS]  NAMESPACE_ERR (14)   
 * INVALID_ACCESS_ERR = 15;                     The object does not support the operation or argument.  INVALID_ACCESS_ERR (15)       
 * VALIDATION_ERR = 16; // historical                         
 * TYPE_MISMATCH_ERR = 17; // historical; use JavaScript's TypeError instead                          
 * SECURITY_ERR = 18;                           The operation is insecure.  SECURITY_ERR (18) 
 * NETWORK_ERR = 19;                            A network error occurred. NETWORK_ERR (19) 
 * ABORT_ERR = 20;                              The operation was aborted.  ABORT_ERR (20)
 * URL_MISMATCH_ERR = 21;                       The given URL does not match another URL. URL_MISMATCH_ERR (21)     
 * QUOTA_EXCEEDED_ERR = 22;                     The quota has been exceeded.  QUOTA_EXCEEDED_ERR (22)
 * TIMEOUT_ERR = 23;                            The operation timed out.  TIMEOUT_ERR (23)
 * INVALID_NODE_TYPE_ERR = 24;                  The supplied node is incorrect or has an incorrect ancestor for this operation. INVALID_NODE_TYPE_ERR (24)
 * DATA_CLONE_ERR = 25;                         The object can not be cloned. DATA_CLONE_ERR (25)
 */
 
 
 
 

(function() {
  // Breaks in dev tools
  // debugger;
  
  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE =  2; // Deprecated
  var TEXT_NODE =  3;
  var CDATA_SECTION_NODE =  4; // Deprecated
  var ENTITY_REFERENCE_NODE = 5; // Deprecated
  var ENTITY_NODE = 6; // Deprecated
  var PROCESSING_INSTRUCTION_NODE =  7;
  var COMMENT_NODE = 8;
  var DOCUMENT_NODE =  9;
  var DOCUMENT_TYPE_NODE = 10;
  var DOCUMENT_FRAGMENT_NODE = 11;
  var NOTATION_NODE = 12; // Deprecated

  // Exposed function
  var HeQuery = this.HeQuery = function(selector) {
    return new HeQuery.fn.init(selector);
  };

  // Shorthand variable for HeQuery
  this.$ = HeQuery;

  // CLASS DOM ELEMENT
  HeQuery.fn = {
    length: 0,

    each: function (fn) {
      var i, len;

      for(i = 0, len = this.length; i < len; ++i) {
        fn.call(this[i]);
      }

      return this;
    }
  };


  // Helpers
  HeQuery.emptyArray = function(a) {
    while(a.length)
      a.pop();
  };


  //////////
  // INIT //
  //////////
  // Constructor for HeQuery objects
  HeQuery.fn.init = function(selector) {

    // Empty function simply returns this
    if( !selector )
      return this;

    var t = typeof selector;

    // STRING
    if(t === 'string') {
      var nodes;

      // See if it's a new element being created
      if(selector.charAt(0) === '<' && selector.charAt(selector.length-1) === '>' && selector.length >= 3) {
        nodes = HeQuery.create(selector);
      }

      // Else querying for elements
      else {
        nodes = HeQuery.query(selector);
      }

      // Add nodes to this
      this.addElements(nodes);

      return this;
    }


    // Short hand for HeQuery.ready
    else if(t === 'function') {
      return HeQuery.ready(selector);
    }


    // Default to creating a DOMElem
    else {
      this.addElements(selector);
    }
  };


  // jQuery does this. Is it good?
  HeQuery.fn.init.prototype = HeQuery.fn;



  /////////
  // ADD //
  /////////
  /**
   * Add elements to HeQuery object
   * 
   * @param {NodeList} elements
   */
  HeQuery.fn.addElements = function(elements) {
    if(this.length === undefined)
      this.length = 0;

    // Multiple elements supplied
    if(elements.length) {
      for(var i = 0, len = elements.length; i < len; i++) {
        this.addElement(elements[i]);
      }
    }

    // Single element supplied
    else {
      this.addElement(elements);
    }
  };
  HeQuery.fn.addElement = function(element) {
    // Check if it's a DOMElement
    // if(!(element instanceof HTMLElement))
    //   return;

    this[this.length++] = element;
  };


  ////////////////
  // ATTRIBUTE  //
  ////////////////
  /**
   * Gets attribute from first element
   * or sets attribute on all elements.
   * 
   * @param  {String} attribute       Attribute type
   * @param  {Value} value(Optional)  Value to set
   * @return {HeQuery}                Returns this;
   */
  HeQuery.fn.attr = function(attribute, value) {
    return value === undefined ?
            this.length > 0 && this[0].getAttribute(attribute) || undefined
            : this.each(function() { this.setAttribute(attribute, value); });
  };


  ////////////
  // APPEND //
  ////////////
  /**
   * Appends content to all elements on HeQuery object
   *
   *  
   * @return {HeQuery.fn}     Returns this to enable chaining
   */
  HeQuery.fn.append = function(content) {
    var t, nodes, i, leni, j, lenj, element;

    if(!content)
      return this;

    t = typeof content;

    if(t === 'string') {
      if(content.charAt(0) === '<' && content.charAt(content.length-1) === '>' && content.length >= 3) {
        nodes = HeQuery.create(content);
      }

      else {
        nodes = HeQuery.query(content);
      }
    }
    else if(content.nodeType) {
      nodes = content;
    }

    for(i = 0, leni = this.length; i < leni; i++){
      element = this[i];

      if(!(element.nodeType === 1 || element.nodeType === 11))
        continue;

      for(j = 0, lenj = nodes.length; j < lenj; j++){
        element.appendChild(nodes[j].cloneNode(true));
      }
    }

    return this;
  };




  ////////
  // ON //
  ////////
  // Bind events
  // Does not keep track of handlers
  HeQuery.fn.on = (function() {
    function addEvent(elem, type, fn) {
      var data = HeQuery._data(elem);


      if(!data.handlers)
        data.handlers = {};

      if(!data.handlers[type])
        data.handlers[type] = [];

      if(!fn.guid)
        fn.guid = HeQuery.guid++;

      data.handlers[type].push(fn);

      if(!data.dispatcher) {
        data.disabled = false;
        data.dispatcher = function(event) {

          if(data.disabled)
            return;

          var handlers = data.handlers[event.type];
          if(handlers) {
            for(var n = 0; n < handlers.length; n++) {
              handlers[n].call(elem, event);
            }
          }
        };
      }

      if(data.handlers[type].length === 1) {
        if(document.addEventListener)
          elem.addEventListener(type, data.dispatcher, false);
        else if(document.attachEvent)
          elem.attachEvent('on'+type, data.dispatcher);
      }
    }




    return function on(type, callback) {
      var i, len, elem, data;

      // Loop through all elements
      for(i = 0, len = this.length; i < len; i++) {
        elem = this[i];


        addEvent(elem, type, callback);
        // #ERROR
        // Uncaught TypeError: Object #<NodeList> has no method 'addEventListener' 

      }

      // Enable method chaing
      return this;
    };
  })();


  // Add event listener

  ///////////////////////////
  // Remove event listener //
  ///////////////////////////
  if(document.removeEventListener) {
    HeQuery.removeEventListener = function(elem, type, fn) {
      elem.removeEventListener(type, fn, false);
    };
  }
  else if(document.detachEvent) {
    HeQuery.removeEventListener = function(elem, type, fn) {
      elem.detachEvent('on'+type, fn);
    };
  }



  /////////
  // OFF //
  /////////
  // Unbind events
  HeQuery.fn.off = (function(){

    function tidyUp(elem, type) {
      function isEmpty(obj) {
        for(var prop in obj)
          return false;
        return true;
      }

      var data = HeQuery._data(elem);

      if(data.handlers[type].length === 0) {
        delete data.handlers[type];

        HeQuery.removeEventListener(elem, type, data.dispatcher);
      }

      if(isEmpty(data.handlers)) {
        delete data.handlers;
        delete data.dispatcher;
      }
      if(isEmpty(data)) {
        HeQuery.removeData(elem);
      }
    }

    // Function user internally for <off>
    function removeEvent(elem, type, fn) {
      // Fetch data associated with element
      data = HeQuery._data(elem);

      // See if any handlers are bound, else just leave
      if(!data.handlers)
        return;

      // Internally used function, function expression to avoid evaluating if we end eariler
      var removeType = function(t) {
        // Empty handler array
        HeQuery.emptyArray(data.handlers[t]);
        // Tidy up our data
        tidyUp(elem, t);
      };


      var handlers = data.handlers[type];
      if(!handlers)
        return;

      // If no type is supplied we remove all handlers on elemen
      if(!type) {
        for(var t in handlers)
          removeType(t);
        return;
      }


      // If no explicit function is supplied we remove all of type
      if(!fn) {
        removeType(type);
        return;
      }

      // If we reach here we have a function and type, so we try to remove it
      if(fn.guid) {
        for(var n = 0; n < handlers.length; ++n) {
          if(handlers[n].guid === fn.guid)
            handlers.splice(n--, 1);
        }
      }
    }

    // Exposed function
    return function off(type, handler) {
      var i, len, elem, data;

      for(i = 0, len = this.length; i < len; ++i) {

        elem = this[i];

        removeEvent(elem, type, handler);

      }
    };
  })();


  ///////////
  // CLICK //
  ///////////
  // Short hand function for click event
  HeQuery.fn.click = function(fn) {
    return this.on('click', fn);
  };


  ///////////
  // HOVER //
  ///////////
  /**
   * Accepts two functions to call on hover events
   * In and Out
   *
   * @param  {Function} fn_in     Function on hover in
   * @param  {Function} fn_out    Function on hover out
   * @return {HeQuery.fn}         Returns this for method chaining
   */
  HeQuery.fn.hover = (function(){

    function withinElement(elem, ev) {
      var parent = ev.relatedTarget;

      while(parent && parent != elem) {
        try {
          parent = parent.parentNode;
        } catch(e) {
          break;
        }
      }

      return (elem != parent);
    }

    return function(fn_in, fn_out) {
      // This function needs to be rewritten as a better function
      // See JavaScript Ninja for resources

      if(fn_in) {
        this.on('mouseover', function(ev) {

          if(withinElement(this, ev))
            fn_in.call(this, ev);

        });
      }
      if(fn_out) {
        this.on('mouseout', function(ev) {

          if(withinElement(this, ev))
            fn_out.call(this, ev);

        });
      }

      return this;
    };
  })();


  /////////
  // GET //
  /////////
  /**
   * Returns the element at index
   * 
   * @param  {Number} index   The number to return
   * @return {Element}         Returns element at index
   */
  HeQuery.fn.get = function(index) {
    // Should maybe return Elements as array if index == null
    return this[index || 0];
  };


  /////////
  // CSS //
  /////////
  // Change style for elements
  // For now only accepts an object with style
  HeQuery.fn.css = (function() {
    var regex = /-([a-z])/ig;

    function toUpper(all, letter) {
      return letter.toUpperCase();
    }
    function normalizeCSSString(str){
      return str.replace(regex, toUpper);
    }


    return function css() {
      var i, len, elem, style, s;

      if(arguments.length === 1 && typeof arguments[0] === 'object') {
        style = arguments[0];

        for(i = 0, len = this.length; i < len; i++) {
          elem = this[i];

          for(s in style) {
            elem.style[normalizeCSSString(s)] = style[s];
          }
        }
      }

      // Enable method chaining
      return this;
    };
  })();




  //////////
  // HTML //
  //////////
  // Gets or sets the innerHTML
  HeQuery.fn.html = function() {
    var i, len, elem;

    // No arguments supplied
    // Return the innerHTML from the first element
    if(arguments.length === 0) {
      return (this[0] && this[0].innerHTML) || '';
    }

    // If string supplied as argument
    // Set the innerHTML of each object
    if(typeof arguments[0] === 'string') {
      var html = arguments[0];

      for(i = 0, len = this.length; i < len; i++) {
        elem = this[i];

        elem.innerHTML = html;
      }
    }

    // Enable method chaining
    return this;
  };


  //////////
  // TEXT //
  //////////
  /**
   * Gets combined text from all elements
   * or sets the text on each element in set
   * 
   * @param  {String} content   Text to set
   * @return {String/HeQuery}   Returns the combined text or (this)
   */
  HeQuery.fn.text = function(content) {
    var i, len, elem;

    if(!content) {
      var combined = '';

      for(i = 0, len = this.length; i < len; i++){
        elem = this[i];
        combined += ((i > 0)? ' ' : '') + (elem.textContent || elem.innerText);
      }

      return combined;
    }

    // Content provided, set text
    else {
      // Empty element first

      for(i = 0, len = this.length; i < len; i++){
        // Use right method for text
        if(this[i].innerText)
          this[i].innerText = content;
        else if(this[i].textContent)
          this[i].textContent = content;
      }

      return this;
    }
  };


  ///////////
  // CLASS //
  ///////////
  // This implementation uses classList which is supported in IE 10+
  //
  // Adds class to elements
  // Separated by space in string or multiple parameters
  HeQuery.fn.addClass = function() {
    var i, len, elem;

    // Container for classes
    var classes = [];

    // Add all arguments
    for(i = 0, len = arguments.length; i < len; i++) {

      // Assumes that arguments are of string type
      classes.push.apply(
        classes, // Context
        arguments[i].split(' ') // Split all strings by blankspace
      );
    }


    // Loop through elements
    for(i = 0, len = this.length; i < len; i++) {
      elem = this[i];

      /**
       * # ERROR
       * Got <can't read property add of undefined>
       * Perhaps need to check if classList exists
       *
       * Solution: Check nodeType to equal 1
       */
      if(elem.nodeType !== ELEMENT_NODE)
        continue;

      // Add classes with apply
      elem.classList.add.apply(elem.classList, classes);
    }

    // Enable method chaining
    return this;
  };
  // Removes class from elements
  // Separated by space in string or multiple parameters
  HeQuery.fn.removeClass = function() {
    var i, len, elem;

    // Container for classes
    var classes = [];

    // Add all arguments
    for(i = 0, len = arguments.length; i < len; i++) {

      // Assumes that arguments are of string type
      classes.push.apply(
        classes, // Context
        arguments[i].split(' ') // Split all strings by blankspace
      );
    }


    // Loop through elements
    for(i = 0, len = this.length; i < len; i++) {
      elem = this[i];

      /**
       * # ERROR
       * Got <can't read property remove of undefined>
       * Perhaps need to check if classList exists
       *
       * Solution: Check nodeType to equal 1
       */
      if(elem.nodeType !== ELEMENT_NODE)
        continue;

      // Removes classes with apply
      elem.classList.remove.apply(elem.classList, classes);
    }

    // Enable method chaining
    return this;
  };
  // Toggles class on elements
  // Separated by space in string or multiple parameters
  HeQuery.fn.toggleClass = function() {
    var i, j, leni, lenj, elem;

    // Container for classes
    var classes = [];

    // Add all arguments
    for(i = 0, len = arguments.length; i < len; i++) {

      // Assumes that arguments are of string type
      classes.push.apply(
        classes, // Context
        arguments[i].split(' ') // Split all strings by blankspace
      );
    }


    // Loop through elements
    for(i = 0, leni = this.length; i < leni; i++) {
      elem = this[i];

      // Add classes with apply
      for(j = 0, lenj = classes.length; j < lenj; j++) {
        elem.classList.toggle(classes[j]);
      }
    }

    // Enable method chaining
    return this;
  };



  //////////
  // FIND //
  //////////
  // Search for childrens on elements
  HeQuery.fn.find = function(selector) {
    var i, len, elem, children;

    // Container array for elements found
    var elements = [];

    // Shortcut for slice function
    var slice = Array.prototype.slice;

    // Loop through elements on this
    for(i = 0, len = this.length; i < len; i++) {
      elem = this[i];

      // Select children
      children = elem.querySelectorAll(selector);

      // Turn into an array
      children = slice.call(children, 0);

      // Push them on to container array
      elements.push.apply(elements, children);
    }

    // Create a new HeQuery object with children
    return new HeQuery.fn.init(elements);
  };




  ////////////
  // OFFSET //
  ////////////
  // Gets offset of the first element relative to the document
  HeQuery.fn.offset = function() {
    var l = 0,
        t = 0;

    if(this[0].nodeType === ELEMENT_NODE) {
      var o = this[0];

      do {
        l += o.offsetLeft;
        t += o.offsetTop;
      } while((o = o.offsetParent) != null);
    }

    return { top:t, left:l };
  };


  ///////////
  // WIDTH //
  ///////////
  // Gets the width of first element
  // or sets the width of all
  HeQuery.fn.width = function(w) {
    if(w) {
      // Check if there is no measurement specified
      // 1 - '100' = -99
      // 1 - '100%' = NaN
      // 1 - '100px' = NaN
      if(!isNaN(1 - w))
        w = w + 'px';

      this.css({
        'width': w
      });

      return this;
    }
    
    return (this[0].nodeType === ELEMENT_NODE) ? this[0].offsetWidth : 0;
  };



  ///////////
  // HEIGHT //
  ///////////
  // Gets the width of first element
  // or sets the width of all
  HeQuery.fn.height = function(h) {
    if(h) {
      // Check if there is no measurement specified
      // 1 - '100' = -99
      // 1 - '100%' = NaN
      // 1 - '100px' = NaN
      if(!isNaN(1 - h))
        h = h + 'px';

      this.css({
        'height': h
      });

      return this;
    }
    
    return (this[0].nodeType === ELEMENT_NODE) ? this[0].offsetHeight : 0;
  };



  //////////
  // DATA //
  //////////
  // For internal use
  // Associate data with elements
  (function() {

    var cache = {},
        guidCount = 1,
        expando = "data-" + Date.now().toString();


    HeQuery._data = function(element) {
      // Might be other types of element which should support data
      // if(element.nodeType !== ELEMENT_NODE)
      //   return;

      var guid = element[expando];
      if(!guid) {
        guid = element[expando] = guidCount++;
        cache[guid] = {};
      }

      return cache[guid];
    };

    HeQuery._removeData = function(element) {
      var guid = element[expando];
      if(!guid)
        return;

      delete cache[guid];

      try {
        delete element[expando];
      } catch(e) {
        if(element.removeAttribute) {
          element.removeAttribute(expando);
        }
      }
    };
  })();




  ////////////
  // CREATE //
  ////////////
  /**
   * Creates new elements based on html string
   * 
   * @param  {String}     String to parse into HTML
   * @return {NodeList}   Returns NodeList created
   */
  HeQuery.create = (function() {
    return function create(content) {
      var type = typeof content;

      // Create new elements
      if(type === 'string') {
        var d = document.createElement('div');
        d.innerHTML = content;
        var elements = d.childNodes;

        return elements;
      }
    };
  })();



  ///////////
  // EMMET //
  ///////////
  // Generate html from emmet syntax
  HeQuery.emmet = (function() {

    var reg = /[^>|\+]+/g;

    return function emmet(emmet_str) {
      var html = '';

      var res;

      while( (res = reg.exec(emmet_str)) !== null ) {
        console.log(res);
      }

      return html;
    };
  })();


  ///////////
  // QUERY //
  ///////////
  /**
   * Queries for elements on page
   * 
   * @param  {String} selector  
   * @return {NodeList}  Returns the matched elements
   */
  HeQuery.query = function(selector) {
    // Find all elements
    var elems = document.querySelectorAll(selector);

    return elems;

    // Create a new HeQuery.fn
    // var d = new HeQuery.fn(elems);

    // Return it
    // return d;
  };


  ///////////
  // READY //
  ///////////
  // Fires event when document loads or if already loaded
  HeQuery.ready = (function() {
    var is_ready = false,
        contentLoadedHandler,
        callbacks = [],
        timer = null;


    if(document.readyState === 'complete') {
      fireReady();
    }
    else {
      // Event listener
      if(document.addEventListener) {
        contentLoadedHandler = function() {
          document.removeEventListener('DOMContentLoaded', contentLoadedHandler, false);
          fireReady();
        };
        document.addEventListener('DOMContentLoaded', contentLoadedHandler, false);
      }
      else if(document.attachEvent) {
        contentLoadedHandler = function() {
          document.detachEvent('onreadystatechange', contentLoadedHandler);
          fireReady();
        };
        document.attachEvent('onreadystatechange', contentLoadedHandler);
      }

      // Perhaps add a scrollCheck
    }

    // Exposed function
    function ready(fn) {

      addCallback(fn);

      return this;
    }

    function addCallback(fn) {
      callbacks.push(fn);

      // If the document is ready
      // and we haven't scheduled a timer
      if(is_ready && timer === null) {
        // Set a timer so we don't interrupt any parsing of a file in the middle by calling the callback
        timer = setTimeout(fireReady, 0);
      }
    }

    function fireReady() {
      // Set timer to null
      timer = null;
      is_ready = true;

      // Call all callbacks
      for(var i = 0; i < callbacks.length; i++) {
        callbacks[i]();
      }

      HeQuery.emptyArray(callbacks);
    }


    return ready;
  })();


  //////////////
  // PREFIXES //
  //////////////
  HeQuery.fixPrefixes = function() {
    performance = window.performance || {};
    performance.now =
      performance.now                     ||
      performance.webkitNow               ||
      performance.mozNow                  ||
      performance.msNow                   ||
      performance.oNow                    ||
      Date.now;

    window.requestAnimationFrame =
      window.requestAnimationFrame        ||
      window.webkitRequestAnimationFrame  ||
      window.mozRequestAnimationFrame     ||
      window.oRequestAnimationFrame       ||
      window.msRequestAnimationFrame      ||
      function(callback){
          setTimeout(function(){
              callback(window.performance.now());
          }, 1000/60);
      };

    window.cancelAnimationFrame =
      window.cancelAnimationFrame        ||
      window.webkitCancelAnimationFrame  ||
      window.mozCancelAnimationFrame     ||
      window.oCancelAnimationFrame       ||
      window.msCancelAnimationFrame      ||
      function(callback){
        clearTimeout(callback);
      };

    window.AudioContext =
      window.AudioContext       ||
      window.webkitAudioContext ||
      window.mozAudioContext    ||
      undefined;
  };


  ////////////
  // COLORS //
  ////////////
  HeQuery.randColor = (function() {
    var colors = [];

    return function() {

    };
  })();


  ////////////
  // RANDOM //
  ////////////
  HeQuery.randomRange = function(min, max) {
    return Math.random() * (max-min) + min;
  };
  // Return an integer between min and max, inclusive
  HeQuery.randomRangeInt = function(min, max) {
    return Math.floor($.randomRange(min, max+1));
  };


  //////////
  // AJAX //
  //////////
  HeQuery.ajax = (function() {

    var opt = {
      type: 'get || post',
      data: 'data',
      dataType: '', // xml, json, text, document, arraybuffer, blob

      succes: function() {},
      error: function(xhr, error_msg) {}
    };

    return function ajax(url, options) {
      // Create XHR object
      var xhr = new window.XMLHttpRequest();


      // Set response type
      xhr.responseType = options.dataType || opt.dataType;

      xhr.onreadystatechange = function() {
        if( status === 4 ) {
          
        }
      };

      xhr.onload = function() {

      };

      xhr.onerror = function(evt) {
        if(options.error) {
          options.error.call(HeQuery, xhr, evt);
        }
      };
    };
  })();


  

  // VARS ON HeQuery
  HeQuery.guid = 1;
})();