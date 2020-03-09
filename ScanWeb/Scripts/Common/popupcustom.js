var PopupType = {
    'Information': 1,
    'Warning': 2,
    'Error': 3,
    'Confirm': 4,
    'CheckNote': 5,
    'MessageBoard': 6
};
var PopupNote = {
    'maxlength': 0,
    'minlength': 0
}
var MessageResult = [];
!function ($) {
    'use strict';
    $.fn.popup_js = function (o, args) {
        var $this = $(o), data = $(o).data('popup_js');
        if (!data) $this.data('popup_js', data = new popup_js(this));
        if (!o) {
            data.init($(this));
        }
        var options = $.extend(
            {},
            $.fn.popup_js.options,
            args || {}
        );
        if (typeof o == 'string') {
            data[o].call($(this), options);
        }
    };
    $.fn.popup_js.options = {
        title: "MESSAGES",
        message: "",
        type: PopupType.Information,
        action: "",
        callbackrejectevent: "",
        typenote: "",
        datastring: "",
        returnlink: "",
        attrnote: "NotePopUp",
        notemaxlength: PopupNote.maxlength,
        noteminlength: PopupNote.minlength,
    };
    var popup_js = function (e) {
        this.$elements = e;
    };
    popup_js.prototype = {
        init: function (options) {
            var $this = $(this);
            var $popupContainer = $('<div class="modal hide" data-keyboard="false" data-backdrop="static"></div>');
            var $header = $("<div class='modal-header'><button data-dismiss='modal' class='close' id='closepop' type='button'></button><h3>" + options.title + "</h3></div>");
            var $contentBody = $('<div class="modal-body" actionname="' + options.action + '" actionreject="' + options.callbackrejectevent + '" data="' + options.datastring + '"></div>');
            var $content = $('<div class="text-message-popup text-danger">' + options.message + '</div>');
            var $controls = $('<div class="modal-footer controls" style="text-align: center;"></div>');
            switch (options.type) {
                case (PopupType.Information):
                    $content.addClass("text-success");
                    break;
                case (PopupType.Warning):
                    $content.addClass("text-warning");
                    $controls.append('<button type="button" data-dismiss="modal" class="btn red" value="true">Ok</button>');
                    break;
                case (PopupType.Error):
                    $content.addClass("text-error");
                    $controls.append('<button type="button" data-dismiss="modal" class="btn red" value="true">Ok</button>');
                    break;
                case (PopupType.Confirm):
                    $content.addClass("text-danger");
                    $controls.append('<button onclick="SubtmitRequestPop(true, this)" type="button" class="btn red" value="true">Yes</button><button onclick="SubtmitRequestPop(false, this)" type="button" class="btn red" value="false">No</button>');
                    break;
                case (PopupType.MessageBoard):
                    $content.addClass("text-messageboard");
                    break;
                case (PopupType.CheckNote):
                    $content.append('<div><textarea name="' + options.attrnote + '" class="notecheckpopup" rows="4" style="resize:none;"></textarea><div class="validateareapopup"></div></div>');
                    if (options.maxlength > 0) {
                        $($content.find('[name="' + options.attrnote + '"]')).attr('maxlength', options.maxlength);
                    }
                    if (options.minlength > 0) {
                        $($content.find('[name="' + options.attrnote + '"]')).attr('minlength', options.minlength);
                    }
                    $controls.append('<button type="button" onclick="SubmitCheckNote(this, ' + options.typenote + ')" class="btn red" value="true">Submit</button>');
                    break;
            }
            $contentBody.append($content);
            $popupContainer.append($header).append($contentBody).append($controls);
            $this.append($popupContainer);
            switch (options.type) {
                case (PopupType.Information):
                    if (options.action != "") {
                        $($this.find('#closepop')).on('click', function () {
                            SubmitAction($(this).closest('.modal').find('.modal-body'));

                        })
                    }
                    else {
                        $($this.find('#closepop')).on('click', function () {
                            CallBackReturnPop(options.returnlink);
                        })
                    }
                    break;
                case (PopupType.Error):
                    if (options.action != "") {
                        $($this.find('button')).on('click', function () {
                            SubmitAction(this);
                        });
                    }
                    break;
                case (PopupType.CheckNote):
                    $($this.find('textarea')).each(function () {
                        $(this).on('keydown', function () {
                            $('.validateareapopup').html('');
                            $(this).common('maxminlengthPop');
                            if (MessageResult.length > 0) {
                                for (var i = 0; i < MessageResult.length; i++) {
                                    $('.validateareapopup').html(MessageResult[i]);
                                }
                            }
                            MessageResult = [];
                        })
                    })
                    break;
            }
            $this.find('.modal').modal('show');
        },
        destroy: function () {
            $('.popupjs').each(function () {
                $(this).html();
            });
        },
        reinit: function (options) {
            $('.popupjs').popup_js('destroy');
            $('.popupjs').popup_js('init', options);
        },
    };

    $.fn.popup_js.Constructor = popup_js;
    $(function () {
        //$('.popupjs').popup_js();
    });
}(window.jQuery);