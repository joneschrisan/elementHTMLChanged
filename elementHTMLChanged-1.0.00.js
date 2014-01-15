/********************
* The MIT License (MIT)
* 
* Copyright (c) 2014 Chris 'CJ' Jones
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
********************/

var elementHTMLChanged = (function(options) {
    "use strict";
    
    var
        _oldValue = '',
        _to = null,
        _succeded = false,
        _beforeStop = false
    ;
    
    var _doNothing = function() {
        //Do nothing.
    };
    
    function _run() {
        obj.init(options);
    }
    
    var seal = options.seal || false;
    
    var defaultObject = {
        id: '',
        onChange: _doNothing,
        microSeconds: 2000,
        cancelable: false,
        reset: _doNothing,
        addResetToId: '',
        before: _doNothing,
        success: _doNothing,
        fail: _doNothing,
        after: _doNothing
    };
    
    try {
        var obj = Object.create(defaultObject);
        obj.parent = defaultObject;
    } catch(e) {
        throw("Object defaultObject Not Loaded.");
        return false;
    }
    
    Object.defineProperties(obj,
        {
            'id': {
                configurable: false,
                enumerable: true,
                set: function(value) {
                    if(this.getType(value) == '[object string]') {
                        this.parent.id = value;
                    }
                },
                get: function() {
                    return this.parent.id;
                }
            },
            'microSeconds': {
                configurable: false,
                enumerable: true,
                set: function(value) {
                    if(this.getType(value) == '[object integer]') {
                        this.parent.microSeconds = value;
                    }
                },
                get: function() {
                    return this.parent.microSeconds;
                }
            },
            'cancelable': {
                configurable: false,
                enumerable: true,
                set: function(value) {
                    if(this.getType(value) == '[object boolean]') {
                        if(value) {
                            this.parent.cancelable = true;
                        } else {
                            this.parent.cancelable = false;
                        }
                    }
                },
                get: function() {
                    return this.parent.cancelable;
                }
            },
            'addResetToId': {
                configurable: false,
                enumerable: true,
                set: function(value) {
                    if(this.getType(value) == '[object string]') {
                        this.parent.addResetToId = value;
                    }
                },
                get: function() {
                    return this.parent.addResetToId;
                }
            },
            'getType': {
                value: function(value) {
                    return Object.prototype.toString.call(value).toLowerCase();
                },
                writable: false,
                configurable: false,
                enumerable: false
            },
            'init': {
                value: function(options) {
                    var that = this;
                    
                    options = options || {};
                    this.id = options.id || '';
                    this.onChange = options.onChange || function() {};
                    this.microSeconds = options.microSeconds || 2000;
                    this.cancelable = options.cancelable || false;
                    
                    this.reset = options.reset || function() {
                        that.to = window.setInterval(function() { that.checkChanged(that); }, that.ms);
                    }
                    
                    if(options.addResetToId) {
                        this.addResetToId = options.addResetToId;
                        
                        var resetElement = document.getElementById(this.addResetToId);
                        
                        resetElement.addEventListener(
                            'click',
                            function() {
                                that.reset();
                            },
                            false
                        );
                    }
                    
                    this.before = options.before || function() {};
                    this.success = options.success || function() {};
                    this.after = options.after || function() {};
                    
                    this.to = window.setInterval(function() { that.checkChanged(that); }, this.microSeconds);
                },
                writable: false,
                configurable: false,
                enumerable: false
            },
            'checkChanged': {
                value: function() {
                    this.before();
                    var el = document.getElementById(this.id);
                    if(
                     (!this.beforeStop) && 
                     (
                      (_oldValue != el.innerHTML) ||
                      (!this.succeded)
                     )
                    ) {
                        _oldValue = el.innerHTML;
                        if(this.onChange()) {
                            if(this.cancelable) clearInterval(this.to);
                            this.success();
                            this.succeded = true;
                        } else {
                            this.fail();
                            this.succeded = false;
                        }
                    }
                    this.after();
                },
                writable: false,
                configurable: false,
                enumerable: false
            }
        }
    );
    
    if(seal) Object.seal(obj);
    
    options.event = options.event || 'load';
    var firstEvent = options.event;
    delete options.event;
    
    if (window.addEventListener) {
        console.log(window.addEventListener);
        window.addEventListener(
            firstEvent,
            _run
            , false
        );
    } else if (window.attachEvent)  {
        console.log(window.addEventListener);
        window.attachEvent(
            firstEvent,
            _run
        );
    }
    
    return obj
});