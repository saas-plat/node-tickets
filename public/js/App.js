var App = function() {
    "use strict";
    var layoutColorCodes = {
        'blue':   '#54728c',
        'red':    '#e25856',
        'green':  '#94B86E',
        'purple': '#852b99',
        'grey':   '#555555',
        'yellow': '#ffb848'
    };
    var handleCheckableTables = function() {
        $( '.table-checkable thead th.checkbox-column :checkbox' ).on('change', function() {
            var checked = $( this ).prop( 'checked' );

            var data_horizontalWidth = $(this).parents('table.table-checkable').data('horizontalWidth');
            if (typeof data_horizontalWidth != 'undefined') {
                var $checkable_table_body = $( this ).parents('.dataTables_scroll').find('.dataTables_scrollBody tbody');
            } else {
                var $checkable_table_body = $( this ).parents('table').children('tbody');
            }

            $checkable_table_body.each(function(i, tbody) {
                $(tbody).find('.checkbox-column').each(function(j, cb) {
                    var cb_self = $( ':checkbox', $(cb) ).prop( "checked", checked ).trigger('change');

                    if (cb_self.hasClass('uniform')) {
                        $.uniform.update(cb_self);
                    }

                    $(cb).closest('tr').toggleClass( 'checked', checked );
                });
            });
        });
        $( '.table-checkable tbody tr td.checkbox-column :checkbox' ).on('change', function() {
            var checked = $( this ).prop( 'checked' );
            $( this ).closest('tr').toggleClass( 'checked', checked );
        });

        // Feature to toggle header checkbox on pagination (if necessary)
        $('.datatable.table-checkable').bind('draw', function() {
            var checkboxes_count         = $('tbody tr td.checkbox-column :checkbox', this).length;
            var checkboxes_checked_count = $('tbody tr td.checkbox-column :checkbox:checked', this).length;

            var $toggle_all_checkbox     = $('thead th.checkbox-column :checkbox', this);
            var checked                  = false;

            if (checkboxes_count == checkboxes_checked_count && checkboxes_count != 0) {
                checked = true;
            } else {
                checked = false;
            }

            $toggle_all_checkbox.prop( "checked", checked );

            if ($toggle_all_checkbox.hasClass('uniform')) {
                $.uniform.update($toggle_all_checkbox);
            }
        });
    }
    var initSelect2 = function() {
        if ($.fn.select2) {
            // Set default options
            $.extend(true, $.fn.select2.defaults, {
                width: 'element'
            });

            // Initialize default select2 boxes
            $('select.select2,input.select2').each(function(){
                // default
                var args = {};
                // data-placeholder="- Select One -"
                if (this.dataset.placeholder) args.placeholder = this.dataset.placeholder;
                // data-min="2"
                if (this.dataset.min) args.minimumInputLength = this.dataset.min;
                // data-max="5"
                if (this.dataset.max) args.maximumInputLength = this.dataset.max;
                // data-limit="10"
                if (this.dataset.limit) args.maximumSelectionSize = this.dataset.limit;
                // data-multiple
                if (this.dataset.multiple) args.multiple = true;
                // data-width="20px"
                if (this.dataset.width) args.width = this.dataset.width;
                // data-class="col-xs-4"
                if (this.dataset.class) args.containerCssClass = this.dataset.class;
                // data-style="cursor:pointer;"
                if (this.dataset.style) args.dropdownCss = this.dataset.style;
                // data-tags="tag,separated,by,comma"
                if (this.dataset.tags) args.tags = this.dataset.tags.split(',');
                // data-stay
                if (this.dataset.stay) args.closeOnSelect = false;
                // data-allowclear
                if (this.dataset.allowclear) args.allowClear = true;
                // data-clear
                if (this.dataset.clear) args.allowClear = false;
                // data-separators=" ,|"
                if (this.dataset.separators) {
                    var str = this.dataset.separators, arr = str.split(","); arr.push(",");
                    args.tokenSeparators = arr;
                } // " ,|" will produce: Array [" ", "|", ","]
                $(this).select2(args);
            });
            $('.select2-offscreen.form-control').removeClass('form-control');
            $('.select2-container').css('width','');
        }
    };
    var initSortable = function() {
        $(".sortable").each(function(){
            $(this).sortable({
                tolerance: 'pointer',
                revert: 'invalid',
                placeholder: $(this).data('placeholder') || 'tile',
                forceHelperSize: true
            });
        });
    };
    var initDuelLists = function() {
        $('.dualListbox').bootstrapDualListbox({
            nonselectedlistlabel: 'Available',
            selectedlistlabel: 'Selected',
            selectorminimalheight: 100,
            filteronvalues: true,
            filterplaceholder: 'Filter',
            filtertextclear: 'Clear',
            helperselectnamepostfix: false,
            moveonselect: true,
            preserveselectiononmove: false
        });
    };
    var initTooltips = function() {
        // This fixes issue #5865
        // (When using tooltips and popovers with the Bootstrap input groups,
        // you'll have to set the container option to avoid unwanted side effects.)
        $.extend(true, $.fn.tooltip.defaults, {
            container: 'body'
        });
        // Use e.g. "#container" as container (instead of "body") if you're experience errors when using Ajax
        $('.tooltip').tooltip({
            container: 'body'
        });
        $('.focus-tooltip').tooltip({
            trigger: 'focus',
            container: 'body'
        });
    };
    var initPopovers = function() {
        $('.popover').popover();
    };
    var initPlaceholders = function() {
        $(":text, textarea").placeholder();
    };
    var initPrettyPrint = function() {
        window.prettyPrint && prettyPrint();
    };
    var initBootstrapSwitch = function() {
        $('[data-toggle="switch"]').bootstrapSwitch();
    };
    var initFocusStates = function() {
        $('.input-group').on('focus', '.form-control', function () {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function () {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });
    };

    var initDateTime = function() {
        $('time').each(function(){
            var datetime = new Date($(this).attr('datetime'));
            $(this).data('default', $(this).text());
            $(this).text(datetime.toString());
        });
    };

    var initPicker = function() {
        $('.datetimepicker').datetimepicker();
        $('.bootstrap-datetimepicker-widget').css('display','none');
    };

    var initWysiwyg = function() {
        $('.wysiwyg').each(function(){
            var options = $(this).data();
            options.toolbar = [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol']],
                ['height', ['height']],
                ['insert', ['picture', 'link']],
                ['view', ['codeview']],
                ['table', ['table']]
            ];
            $(this).summernote(options);
        });
    };

    var initDataTables = function(query) {
        if ($.fn.dataTable) {
            // Set default options
            $.extend(true, $.fn.dataTable.defaults, {
                "oLanguage": {
                    "sSearch": ""
                },
                "sDom": "<'row'<'dataTables_header clearfix'<'col-md-6'l><'col-md-6'f>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>",
                // set the initial value
                "iDisplayLength": 5,
                fnDrawCallback: function () {
                    if ($.fn.uniform) {
                        $(':radio.uniform, :checkbox.uniform').uniform();
                    }

                    if ($.fn.select2) {
                        $('.dataTables_length select').select2({
                            minimumResultsForSearch: "-1"
                        });
                    }

                    // SEARCH - Add the placeholder for Search and Turn this into in-line formcontrol
                    var search_input = $(this).closest('.dataTables_wrapper').find('div[id$=_filter] input');

                    // Only apply settings once
                    if (search_input.parent().hasClass('input-group')) return;

                    search_input.attr('placeholder', 'Filter')
                    search_input.addClass('form-control')
                    search_input.wrap('<div class="input-group"></div>');
                    search_input.parent().prepend('<span class="input-group-addon"><i class="glyphicon glyphicon-filter"></i></span>');

                    // Responsive
                    /*if (typeof responsiveHelper != 'undefined') {
                     responsiveHelper.respond();
                     }*/
                }
            });

            $.fn.dataTable.defaults.aLengthMenu = [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]];

            // Initialize default datatables
            if ('string' !== typeof query) query = '.datatable';
            $(query).each(function () {
                var self = $(this);
                var options = {};

                /*
                 * Options via data-attribute
                 */

                // General Wrapper
                var data_dataTable = self.data('datatable');
                if (typeof data_dataTable != 'undefined') {
                    $.extend(true, options, data_dataTable);
                }

                // Sorting
                var data_aaSorting = self.data('aasorting');
                if (typeof data_aaSorting != 'undefined') {
                    $.extend(true, options, {
                        "aaSorting": eval(data_aaSorting)
                    });
                }

                // Display Length
                var data_displayLength = self.data('displaylength');
                if (typeof data_displayLength != 'undefined') {
                    $.extend(true, options, {
                        "iDisplayLength": data_displayLength
                    });
                }

                // Horizontal Scrolling
                var data_horizontalWidth = self.data('horizontalwidth');
                if (typeof data_horizontalWidth != 'undefined') {
                    $.extend(true, options, {
                        "sScrollX": "100%",
                        "sScrollXInner": data_horizontalWidth,
                        "bScrollCollapse": true
                    });
                }

                /*
                 * Other
                 */

                // Checkable Tables
                if (self.hasClass('table-checkable')) {
                    $.extend(true, options, {
                        'aoColumnDefs': [
                            { 'bSortable': false, 'aTargets': [0] }
                        ]
                    });
                }

                // TableTools
                if (self.hasClass('table-tabletools')) {
                    $.extend(true, options, {
                        "sDom": "<'row'<'dataTables_header clearfix'<'col-md-4'l><'col-md-8'Tf>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>", // T is new
                        "oTableTools": {
                            "aButtons": [
                                "copy",
                                "print",
                                "csv",
                                "xls",
                                "pdf"
                            ],
                            "sSwfPath": "/js/lib/datatables/tabletools/swf/copy_csv_xls_pdf.swf"
                        }
                    });
                }

                // ColVis
                if (self.hasClass('table-colvis')) {
                    $.extend(true, options, {
                        "sDom": "<'row'<'dataTables_header clearfix'<'col-md-6'l><'col-md-6'Cf>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>", // C is new
                        "oColVis": {
                            "buttonText": "Columns <i class='icon-angle-down'></i>",
                            "iOverlayFade": 0
                        }
                    });
                }

                // TableTools and ColVis
                if (self.hasClass('table-tabletools') && self.hasClass('table-colvis')) {
                    $.extend(true, options, {
                        "sDom": "<'row'<'dataTables_header clearfix'<'col-md-6'l><'col-md-6'TCf>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>" // C is new
                    });
                }

                // If ColVis is used with checkable Tables
                if (self.hasClass('table-checkable') && self.hasClass('table-colvis')) {
                    $.extend(true, options, {
                        "oColVis": {
                            "aiExclude": [0]
                        }
                    });
                }

                // Set options via external function
                var data_dataTableFunction = self.data('datatableFunction');
                if (typeof data_dataTableFunction != 'undefined') {
                    $.extend(true, options, window[data_dataTableFunction]() );
                }

                // Check, if table should be initialized with a ColumnFilter
                if (self.hasClass('table-columnfilter')) {
                    // With ColumnFilter

                    var options_columnfilter = {};

                    var data_columnFilter = self.data('columnfilter');
                    if (typeof data_columnFilter != 'undefined') {
                        $.extend(true, options_columnfilter, data_columnFilter);
                    }

                    $(this).dataTable(options).columnFilter(options_columnfilter);

                    // Style inputs
                    self.find('.filter_column').each(function() {
                        // Check, if selectboxes should be converted into Select2s
                        var data_columnFilterSelect2 = self.data('columnfilterSelect2');
                        if (typeof data_columnFilterSelect2 != 'undefined') {
                            $(this).children('input').addClass('form-control');

                            $(this).children('select').addClass('full-width-fix').select2({
                                placeholderOption: 'first'
                            });
                        } else {
                            $(this).children('input, select').addClass('form-control');
                        }
                    });
                } else {
                    // Without ColumnFilter (regular)
                    $(this).dataTable(options);
                }
            });
        }
    };
    return {
        init: function() {
            handleCheckableTables();
            initSelect2();
            initTooltips();
            initPopovers();
            initPlaceholders();
            initPrettyPrint();
            initBootstrapSwitch();
            initFocusStates();
            initDateTime();
            initWysiwyg();
            initPicker();
            initDuelLists();
            initSortable();
            initDataTables(); // must be last
        },
        initSortable: function() {
            initSortable();
        },
        initDataTables: function(target) {
            initDataTables(target);
        },
        reinitDataTables: function(target) {
            if ('string' === typeof target) {
                $(target).each(function () {
                    $(this).dataTable().fnDestroy();
                });
                initDataTables(target);
            }
        },
        getLayoutColorCode: function(name) {
            if (layoutColorCodes[name]) {
                return layoutColorCodes[name];
            } else {
                return '';
            }
        },
        blockUI: function (el, centerY) {
            var el = $(el);
            el.block({
                message: '<img src="/img/ajax-loading.gif" alt="ajax loading">',
                centerY: centerY != undefined ? centerY : true,
                css: {
                    top: '10%',
                    border: 'none',
                    padding: '2px',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.05,
                    cursor: 'wait'
                }
            });
        },
        unblockUI: function (el) {
            $(el).unblock({
                onUnblock: function () {
                    $(el).removeAttr("style");
                }
            });
        },
        nextTick: function (next) {
            setTimeout(function(){
                return next();
            }, 1);
        }
    };
}();