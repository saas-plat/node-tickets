var hbs = require('hbs')
    , moment = require('moment')
    , downsize = require('downsize')
    , _ = require('underscore')
    , coreHelpers = {}
    , asyncHelpers = {};

exports = module.exports;

/**
 * Content Helper - Enables tag-safe truncation of content by characters or words.
 *
 * Turns content html into a safestring so that the user doesn't have to
 * escape it or tell handlebars to leave it alone with a triple-brace.
 *
 * Usage example:
 * `{{content}}`
 * `{{content words="20"}}`
 * `{{content characters="256"}}`
 *
 * @todo a way for themes to register these
 *
 * @param Object options
 *
 * @return String handlebars SafeString html, complete or truncated.
 */
coreHelpers.content = function (html, options) {
    var truncateOptions = (options || {}).hash || {};
    truncateOptions = _.pick(truncateOptions, ['words', 'characters']);
    _.keys(truncateOptions).map(function (key) {
        truncateOptions[key] = parseInt(truncateOptions[key], 10);
    });

    if (truncateOptions.hasOwnProperty('words') || truncateOptions.hasOwnProperty('characters')) {
        // Due to weirdness in downsize the 'words' option
        // must be passed as a string.
        // TODO: when downsize fixes this quirk remove this hack.
        if (truncateOptions.hasOwnProperty('words')) {
            truncateOptions.words = truncateOptions.words.toString();
        }
        return new hbs.handlebars.SafeString(
            downsize(html, truncateOptions)
        );
    }

    return new hbs.handlebars.SafeString(html);
};


/**
 * date
 *
 * Usage example:
 * {{{date published_at timeago="true"}}}
 * date uses moment.js for formatting dates. See their documentation for a full explanation of all the different format strings that can be used.
 * http://momentjs.com/docs/#/parsing/string-format/
 *
 * @param  {Object} context date object
 * @param  {*} Options: format (date format, default “MMM Do, YYYY”), timeago (boolean)
 *
 * @return {Object} A Moment time / date object
 */
coreHelpers.date = function (context, options) {
    if (!options && context.hasOwnProperty('hash')) {
        options = context;
        context = undefined;
    }
    context = context === null ? undefined : context;

    var f = options.hash.format || 'MMM Do, YYYY',
        timeago = options.hash.timeago || false,
        html = options.hash.html || false,
        utc = moment.utc(context).format(),
        date;

    if (timeago) {
        date = moment(context).fromNow();
    } else {
        date = moment(context).format(f);
    }

    return ( html ? '<time datetime="'+ utc +'">'+ date +'</time>' : date );
};

/**
 * json - encode object to json string
 *
 * Usage example:
 * `{{json obj}}`
 *
 * @param  {Object} context object
 * @param  {*} obj
 *
 * @return String json encoded
 */
coreHelpers.json = function (context, options) {
    if (!options && context.hasOwnProperty('hash')) {
        options = context;
        context = undefined;
    }
    context = context === null ? undefined : context;
    var pretty = options.hash.pretty || false;

    return new hbs.handlebars.SafeString(
        pretty?
        JSON.stringify(context,null,2):
        JSON.stringify(context)
    );
};

/**
 * encode - URI Encoding helper
 *
 * Usage example:
 * `{{encode uri}}`
 *
 * @param  {String} context String
 * @param  {*} str
 *
 * @return String URI encoded
 */
coreHelpers.encode = function (context, str) {
    var uri = context || str;
    return new hbs.handlebars.SafeString(encodeURIComponent(uri));
};

/**
 * length - finding length helper
 *
 * Usage example:
 * `{{length var}}`
 *
 * @param  {*} context String, Array, Object
 *
 * @return Integer
 */
coreHelpers.length = function (context) {
        if( context.length ) return context.length;
        var length = 0;
        for( var prop in context ){
            if( context.hasOwnProperty( prop ) ){
                length++;
            }
        }
        return length.toString();
};

/**
 * upper - string to upper case
 *
 * Usage example:
 * `{{upper var}}`
 *
 * @param  {String} str
 *
 * @return upper case string
 */
coreHelpers.upper = function (str) {
    return ( str || '' ).toUpperCase();
};

/**
 * lower - string to lower case
 *
 * Usage example:
 * `{{lower var}}`
 *
 * @param  {String} str
 *
 * @return lower case string
 */
coreHelpers.lower = function (str) {
    return ( str || '' ).toLowerCase();
};

/**
 * debug - context or value
 *
 * Usage example:
 * `{{debug}}` for context
 * `{{debug var}}` for value
 *
 * @param  {*} optionalValue
 *
 */
coreHelpers.debug = function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
        return '';
    }
};

/**
 * anchor - create an anchor tag
 *
 * Usage example:
 * `{{{anchor value href="http://google.com" target="_blank"}}}`
 *
 * @param  value
 * @param  options
 *
 * @return html anchor tag
 */
coreHelpers.anchor = function(value , options) {
    if (arguments.length < 1)
        throw new Error("Handlerbars Helper 'anchor' needs value parameter");

    var aHref = options.hash.href,
        aParam = options.hash.param || '',
        aTarget = options.hash.target,
        aClass = options.hash.class,
        aId = options.hash.id,
        anchor = '<a href="'+aHref+aParam+'"';
    if (aTarget) anchor += ' target="'+aTarget+'"';
    if (aClass) anchor += ' class="'+aClass+'"';
    if (aId) anchor += ' id="'+aId+'"';
        anchor += '>'+value+'</a>';
    return anchor;
};

/**
 * bool - ensure boolean prints a value
 *
 * Usage example:
 * `{{bool user.deleted}}`
 *
 * @param  {Boolena} context boolean
 *
 * @return String URI encoded
 */
coreHelpers.bool = function (context, yes, no) {
    yes = yes || 'true';
    no = no || 'false';
    return new hbs.handlebars.SafeString((context ? yes : no));
};

/**
 * pattern - provide a regex for input pattern html5 validation
 *
 * Usage example:
 * `{{pattern "creditCard"}}`
 *
 * @param  {String} option
 *
 * @return String RegEx
 */
coreHelpers.pattern = function (option) {
    var regex = {
        creditCard: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})$',
        alphaNumeric: '^[a-zA-Z0-9]+$',
        alphaNumericWithSpaces: '^[a-zA-Z0-9 ]+$',
        date: '^(0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2}$',
        alpha: '^[a-zA-Z]+$',
        numeric: '^[0-9]+$',
        email: '^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
        alphaLower: '^[a-z]+$',
        password: '(?=^.{6,}$)((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.*', //one lowercase letter, one uppercase letter, one number, and be at least 6 characters
        alphaUpper: '^[A-Z]+$',
        url: '^((http|https|ftp)://)?([[a-zA-Z0-9]\-\.])+(\.)([[a-zA-Z0-9]]){2,4}([[a-zA-Z0-9]/+=%&_\.~?\-]*)$'
    };
    return (regex.hasOwnProperty(option) ? 'pattern="'+ regex[option] +'"' : '');
};

/**
 * compare
 *
 * Example Usage: (defaults to == if operator omitted)
 * {{#compare menu dash}}
 * <li>dash</li>
 * {{/compare}}
 *
 * {{#compare likes dislikes operator="<"}}
 * Unpopular Content
 * {{/compare}}
 *
 * @param lvalue
 * @param rvalue
 * @param options operator
 * @returns {*}
 */

coreHelpers.compare = function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";

    var operators = {
        '==':		function(l,r) { return l == r; },
        '===':	function(l,r) { return l === r; },
        '!=':		function(l,r) { return l != r; },
        '<':		function(l,r) { return l < r; },
        '>':		function(l,r) { return l > r; },
        '<=':		function(l,r) { return l <= r; },
        '>=':		function(l,r) { return l >= r; },
        'typeof':	function(l,r) { return typeof l == r; },
        'has':	function(l,r) { return (l.indexOf(r) != -1); }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

};

/**
 * Excerpt Helper
 * Attempts to remove all HTML from the string, and then shortens the result according to the provided option.
 *
 * Usage example:
 * `{{excerpt}}`
 * `{{excerpt words="50"}}`
 * `{{excerpt characters="256"}}`
 *
 * @param Object options
 *
 * @return String handlebars SafeString html-free, complete or truncated.
 */
coreHelpers.excerpt = function (html, options) {
    var truncateOptions = (options || {}).hash || {},
        excerpt;

    truncateOptions = _.pick(truncateOptions, ['words', 'characters']);
    _.keys(truncateOptions).map(function (key) {
        truncateOptions[key] = parseInt(truncateOptions[key], 10);
    });

    /*jslint regexp:true */
    excerpt = String(html).replace(/<\/?[^>]+>/gi, '');
    excerpt = excerpt.replace(/(\r\n|\n|\r)+/gm, ' ');
    /*jslint regexp:false */

    if (!truncateOptions.words && !truncateOptions.characters) {
        truncateOptions.words = 50;
    }

    return new hbs.handlebars.SafeString(
        downsize(excerpt, truncateOptions)
    );
};

coreHelpers.layout_head = function () {
    var head = [];

    head.push('<meta charset="utf-8">');
    head.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
    head.push('<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,600,700" media="all" rel="stylesheet" type="text/css">');
    head.push('<link href="/css/plugins.css" media="all" rel="stylesheet" type="text/css">');
    head.push('<link href="/css/site.css" media="all" rel="stylesheet" type="text/css">');

    return new hbs.handlebars.SafeString(head.join('').trim());
};

coreHelpers.layout_foot = function () {
    var foot = [];

    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/ios-orientationchange-fix.js"></script>');
    foot.push('<script type="application/javascript" language="JavaScript" charset="utf-8" src="/js/lib/jquery-ui-1.10.4.custom.min.js"></script>');
    foot.push('<script type="application/javascript" language="JavaScript" charset="utf-8" src="/js/lib/bootstrap.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/respond.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/angular.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/angular-sanitize.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/jquery.blockUI.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/jquery.placeholder.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/jquery.bootstrap-duallistbox.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/select2/select2.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/typeahead.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/bootstrap-switch.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/angular-bootstrap-switch.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/bootstrap-raise.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/datatables/jquery.dataTables.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/datatables/DT_bootstrap.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/holder.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/google-code-prettify/prettify.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/summernote.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/moment.min.js"></script>');
    foot.push('<script type="application/javascript" language="javascript" charset="utf-8" src="/js/lib/bootstrap-datetimepicker.min.js"></script>');

    return new hbs.handlebars.SafeString(foot.join('').trim());
};

coreHelpers.js = function (uri) {
    return new hbs.handlebars.SafeString('<script type="application/javascript" language="javascript" charset="utf-8" src="'+uri+'"></script>');
};

function registerHelpers() {
    _.forEach(coreHelpers,function(fn,helper){
        hbs.registerHelper(helper, fn);
    });
    _.forEach(asyncHelpers,function(fn,helper){
        hbs.registerAsyncHelper(helper, fn);
    });
}
exports.coreHelpers = coreHelpers;
exports.asyncHelpers = asyncHelpers;
exports.loadCoreHelpers = registerHelpers;