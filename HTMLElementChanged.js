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

var elementHTMLChanged = (function(optionsObject) {
    var elementHTMLChanged = {
        oldValue: '',
        id: '',
        onChange: function() {},
        microSeconds: 2000,
        to: null,
        cancelable: false,
        reset: function() {},
        addResetToId: '',
        before: function() {},
        success: function() {},
        fail: function() {},
        succeded: false,
        after: function() {},
        beforeStop: false,
        init: function(options) {
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
        checkChanged: function(object) {
            object.before();
            var el = document.getElementById(object.id);
            if(
             (!object.beforeStop) && 
             (
              (object.oldValue != el.innerHTML) ||
              (!object.succeded)
             )
            ) {
                object.oldValue = el.innerHTML;
                if(object.onChange()) {
                    if(object.cancelable) clearInterval(object.to);
                    object.success();
                    object.succeded = true;
                } else {
                 	object.fail();
                    object.succeded = false;
                }
            }
            object.after();
        }
    }
    
    function run() {
        elementHTMLChanged.init(optionsObject);
    }
    
    optionsObject.event = optionsObject.event || 'load';
    var firstEvent = optionsObject.event;
    delete optionsObject.event;
    
    if (window.addEventListener) {
        window.addEventListener(
            firstEvent,
            run
            , false
        );
    } else if (window.attachEvent)  {
        window.attachEvent(
            firstEvent,
            run
        );
    }
});