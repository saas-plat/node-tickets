/**************************
 * Bootstrap Alert Plugin *
 * By Chris Langton       *
 **************************/
(function(window, undefined){
    "use strict";
    $.fn.raise = function raise(arg1,arg2,arg3){
        this.defaults = {
            id: false,
            type: 'info',
            message: '',
            dismissable: true,
            class: false,
            heading: false,
            stack: 'prepend',
            delay: false,
            fade: false
        };
        if ( 'object' === typeof arg1 ) $.extend(true, this.defaults, arg1);
        if ( 'object' === typeof arg2 ) $.extend(true, this.defaults, arg2);
        if ( 'object' === typeof arg3 ) $.extend(true, this.defaults, arg3);
        if ( 'undefined' === typeof arg2 && 'string' === typeof arg1 ) this.defaults.message = arg1;
        else if ( 'string' === typeof arg1 ) this.defaults.type = arg1;
        if ( 'string' === typeof arg2 ) this.defaults.message = arg2;
        if ( 'string' === typeof arg3 ) this.defaults.id = arg3;
        var alert = document.createElement('div'),
            dismiss = document.createElement('button'),
            heading = document.createElement('strong'),
            x = document.createElement('i'),
            ele = jQuery('alert'),
            classStr = 'alert alert-'+this.defaults.type;
        if (this.defaults.id) alert.id = this.defaults.id;
        if (this.defaults.dismissable) classStr += ' alert-dismissable';
        if (this.defaults.class) classStr += ' '+this.defaults.class;
        alert.className = classStr;
        alert.innerHTML = this.defaults.message;
        if (this.defaults.heading) {
            heading.innerHTML = this.defaults.heading+'&nbsp;';
            jQuery(alert).prepend(heading);
        }
        if (this.defaults.dismissable) {
            x.className = 'glyphicon glyphicon-remove';
            dismiss.type = 'button';
            dismiss.dataset.dismiss = 'alert';
            dismiss.className = 'close';
            dismiss.appendChild(x);
            alert.appendChild(dismiss);
        }
        if (1 === this.length) jQuery(this[0])[this.defaults.stack](alert);
        else if (1 < this.length)
            jQuery.each(this,function(){
                jQuery(this)[this.defaults.stack](alert);
            });
        else if (ele.length) ele[this.defaults.stack](alert);

        if (this.defaults.delay) {
            var fade = this.defaults.fade;
            window.setTimeout(function dismissAlert(){
                (fade) ?
                    jQuery(alert).fadeOut('slow'):
                    jQuery(alert).remove();
            }, parseInt(this.defaults.delay)*1000);
        }
    };
})(window);
