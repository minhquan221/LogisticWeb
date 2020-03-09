!function ($) {
    'use strict';
    $.fn.customvalidate_js = async function (o, args) {
        var data = $(this).data('customvalidate_js');
        if (!data) { $(this).data('customvalidate_js', data = new customvalidate_js(this)); }
        var options = $.extend(
            {},
            $.fn.validateoptions,
            args || {}
        );
        $(this).validateoptions = options;
        if (o === undefined) {
            await data.init($(this));
        }
        if (typeof o == 'string') {
            await $(this).data('customvalidate_js')[o].call($(this), args);
        }
    };
    $.fn.validateoptions = {
        notnull: false,
        Null_Msg: '',
        Regex: '',
        Regex_Msg: '',
        min: null,
        max: null,
        min_Msg: '',
        max_Msg: '',
    };
    var customvalidate_js = function (e) {
        this.$elements = e;
    };

    customvalidate_js.prototype = {
        init: async function (item) {
            var $item = $(item);
            var validateoptions = {
                notnull: false,
                Null_Msg: '',
                Regex: '',
                Regex_Msg: '',
                min: null,
                max: null,
                min_Msg: '',
                max_Msg: '',
            };
            //var $item = $(item);
            validateoptions.notnull = ($item.attr('data-notnull') != undefined ? true : false);
            validateoptions.Null_Msg = ($item.attr('data-null-msg') != undefined ? $item.attr('data-null-msg') : '');
            validateoptions.Regex = ($item.attr('data-regex') != undefined ? $item.attr('data-regex') : '');
            validateoptions.Regex_Msg = ($item.attr('data-regex-msg') != undefined ? $item.attr('data-regex-msg') : '');
            validateoptions.min = ($item.attr('data-min') != undefined ? $item.attr('data-min') : null);
            validateoptions.max = ($item.attr('data-max') != undefined ? $item.attr('data-max') : null);
            validateoptions.min_Msg = ($item.attr('data-min-msg') != undefined ? $item.attr('data-min-msg') : '');
            validateoptions.max_Msg = ($item.attr('data-max-msg') != undefined ? $item.attr('data-max-msg') : '');
            var idItem = $item.attr('id');
            if (idItem == undefined) {
                var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
                var stringReplace = $item.text().replace(/[^\w\s]/gi, '')
                idItem = stringReplace.replace(/ /g, '');
                $item.attr('id', idItem);
            }
            $('#' + $item.attr('id')).data('validateoptions', validateoptions);
            var tagName = $item.prop("tagName");
            switch (tagName.toLowerCase()) {
                case ('select'):
                    $item.bind('change', function () {
                        $item.customvalidate_js('onchange');
                    })
                    break;
                case ('input'):
                    var type = $item.attr('type');
                    switch (type) {
                        case ('text'):
                            $item.bind('blur', function () {
                                $item.customvalidate_js('onblur');
                            })
                            break;
                        case ('number'):
                            $item.bind('keydown', function (event) {
                                $item.customvalidate_js('onkeyminmax', event);
                            })
                            break;
                        case ('button'):
                            var outerHtml = $item[0].outerHTML;
                            var idItem = $item.attr('id');
                            $item.hide();
                            var $replaceBtn = $(outerHtml);
                            $replaceBtn.attr('relate-btn', idItem);
                            $replaceBtn.removeAttr('onclick');
                            $item.after($replaceBtn);
                            $replaceBtn.bind('click', function () {
                                $(this).customvalidate_js('submit');
                            })
                            break;
                    }
                    break;
                case ('textarea'):
                    $item.bind('keydown', function () {
                        $item.customvalidate_js('onkeydown');
                    })
                    break;
                case ('button'):
                    var outerHtml = $item[0].outerHTML;
                    var idItem = $item.attr('id');
                    $item.hide();
                    var $replaceBtn = $(outerHtml);
                    $replaceBtn.attr('relate-btn', idItem);
                    $replaceBtn.removeAttr('onclick');
                    $item.after($replaceBtn);
                    $replaceBtn.bind('click', function () {
                        $(this).customvalidate_js('submit');
                    })
                    break;
            }

        },
        onkeyminmax: function (e) {
            var $this = $(this);
            $this.validateoptions = $this.data('validateoptions');
            var keycode = (e.keyCode ? e.keyCode : e.which);
            var valueText = parseFloat($this.val());
            var min = $this.validateoptions.min;
            var max = $this.validateoptions.max;
            if (min != null) {
                if (valueText < min) {
                    Swal.fire({
                        type: 'error',
                        title: 'Validate fail',
                        text: $this.validateoptions.min_Msg
                    });
                    $this.addClass('error');
                    return false;
                }
            }
            if (max != null) {
                if (valueText > max) {
                    Swal.fire({
                        type: 'error',
                        title: 'Validate fail',
                        text: $this.validateoptions.max_Msg
                    });
                    $this.addClass('error');
                    return false;
                }
            }
            $this.removeClass('error');
        },
        onblur: function () {
            var $this = $(this);
            $this.validateoptions = $this.data('validateoptions');
            var valueText = $this.val();
            var Null_Msg = $this.validateoptions.Null_Msg;
            if ($this.validateoptions.notnull) {
                if ($this.val() == '') {
                    Swal.fire({
                        type: 'error',
                        title: 'Validate fail',
                        text: Null_Msg
                    });
                    $this.addClass('error');
                    if ($this.closest('.controls-left-50').length > 0) {
                        var $content = $this.closest('.controls-left-50');
                        $content.addClass('requirefield');
                    }
                    else {
                        var $content = $this.closest('.control-group');
                        $content.addClass('requirefield');
                    }
                    return;
                }
                else {
                    if ($this.closest('.requirefield').length > 0) {
                        var $contentRequired = $this.closest('.requirefield');
                        $contentRequired.removeClass('requirefield');
                    }
                }
            }
            if ($this.validateoptions.Regex != '') {
                var reg = new RegExp($this.validateoptions.Regex);
                if (!reg.test(valueText)) {
                    Swal.fire({
                        type: 'error',
                        title: 'Validate fail',
                        text: $this.validateoptions.Regex_Msg
                    });
                    $this.addClass('error');
                    return;
                }
            }
            $this.removeClass('error');
        },
        onchange: function () {

        },
        submit: function () {
            var $this = $(this);
            $this.validateoptions = $this.data('validateoptions');
            var form = $this.closest('form');
            if ($(form).find('.customvalidate_js.error').length > 0) {
                Swal.fire({
                    type: 'error',
                    title: 'Validate fail',
                    text: 'Error on validate data'
                });
                return;
            }
            var relatedId = $this.attr('relate-btn');
            $('#' + relatedId).click();
        }
    }
    $.fn.customvalidate_js.Constructor = customvalidate_js;
    $(function () {
        $('form').find('.customvalidate_js').each(async function () {
            await $(this).customvalidate_js();
        });
    });
}(window.jQuery);