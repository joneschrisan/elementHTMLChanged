elementHTMLChanged
==================

Synopsis:
    var myElementChanged = new HTMLElementChanged(Object options);

Paramiters:
    options:
        A Javascript Object with values contaning and combination of the following:
            event: String Event. The javascript event to add HTMLElementChanged.init() listener to.
                Default: load;
            id: String element ID
                Default: Empty String.
            onChange: Function to run if the html of the element has changed. Note: This Function must return true for success or false for fail
                Default: Empty Function.
            microSeconds: Integer interval to check in micro seconds.
                Default: 2000.
            cancelable: Boolean cancel interval once first onChange returns true.
                Default: False.
            reset: Function to run to reset the interval.
                Default: function() { that.to = window.setInterval(function() { that.checkChanged(that); }, that.ms); }
            addResetToId: String ID to add reset function to.
                Default: Empty String.
            before: Function to run before check.
                Default: Empty Function.
            success: Function to run on success.
                Default: Empty Function.
            fail: Function to run on fail.
                Default: Empty Function.
            after: Function to run after check.
                Default: Empty Function.
        
        Options MUST have id set to a non empty String.

Internal values other than above options:
    oldValue: String HTML. Holds the old value for the check.
        Default: Empty String.
    to: Resorce ID for the interval Function;
        Default: Null.
    succeded: Boolean. Tells if the check succeded. Note: Automaticaly set depending on outcome of onChange Function.
        Default: False.
    beforeStop: Boolean. Set to true in before Function to stop the check. Note: after function will still run no matter if beforeStop is true or false.
        Default: False.

Internal Methods:
    init: The initialisation method.
        Paramiters: Object options.
    checkChanged: The check function.
        Paramiters: HTMLElementChanged object.

Example:

var myElementChanged = new HTMLElementChanged({
    event: 'load',
    id: 'foo',
    before: function() {
    	var foo = document.getElementById('foo');
        if (foo.innerHTML == '') myElementChanged.beforeStop = true;
    },
    onChange: function() {
        var foo = document.getElementById('foo');
        if(foo.innerHTML == 'bar') return true;
        return false;
	},
    cancelable: true,
    addResetToId: 'btnrefresh',
    microSeconds: 500
});
