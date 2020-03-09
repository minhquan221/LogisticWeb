var optionssuggest = {
    ajaxUrl: '',
    countType: 0,
    TEXTCOLUMN: '',
    IsQuery: false,
    IsTyping: false,
    data: []
};
var IsQuery = false;
var countType = 0;
var IsTyping = false;

function InitSuggest(item) {
    var $item = $(item);
    var id = $item.attr('id');
    $('#' + id).bind('keyup', function (e) {
        if ($('ul[related=' + $item.attr('id') + ']').is(':focus')) {
            $('ul[related=' + $item.attr('id') + ']').hide();
        }
        var $data = $(this);
        IsTyping = true;
        countType++;
        setTimeout(function () {
            CheckDoneType($data);
        }, 200);
    });
    $('#' + id).on('blur', function (e) {
        if (!$('ul[related=' + $item.attr('id') + ']').is(':hover')) {
            $('ul[related=' + $item.attr('id') + ']').hide();
        }
    })
}

function CallSuggest(item) {
    if ($(item).val() == '') {
        if ($('ul[related=' + $(item).attr('id') + ']').length > 0) {
            $('ul[related=' + $(item).attr('id') + ']').remove();
        }
        return;
    }
    if (!IsTyping) {
        if (!IsQuery) {
            $.ajax({
                type: 'POST',
                url: $(item).attr('suggest-link'),
                cache: false,
                data: { inputstring: $(item).val() },
                beforeSend: function () {
                    IsQuery = true;
                    $('ul[related=' + $(item).attr('id') + ']').remove();
                },
                success: function (res) {
                    IsQuery = false;
                    if (res.IsOk) {
                        var data = res.dataObj;
                        ShowRecord(item, data);
                    }
                }
            });
        }
    }
}

function CheckDoneType(item) {
    var options = $(item).data('customsuggestoptions');
    if (IsQuery) {
        return;
    }
    countType--;
    if (countType == 0) {
        IsTyping = false;
    }
    $(item).data('customsuggestoptions', options);
    if (countType == 0) {
        setTimeout(function () {
            CallSuggest(item);
        }, 100);
    }
}

function SelectThis(item) {
    var $item = $(item);
    var idData = $item.closest('ul').attr('related');
    $('#' + idData).val($item.html());
    $item.closest('ul').hide();
}

function ShowRecord(item, data) {
    var $ul = $('<ul related="' + $(item).attr('id') + '" class="autocomplete"></ul>');
    var $liList = [];
    if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var $li = $('<li onclick="SelectThis(this)" >' + data[i][$(item).attr('columnName')] + '</li>');
            $liList.push($li);
        }
    }
    for (var i = 0; i < $liList.length; i++) {
        $ul.append($liList[i]);
    }
    $(item).after($ul);
}