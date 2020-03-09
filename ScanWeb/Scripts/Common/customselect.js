(function () {
    $('.customselect').each(function () {
        InitSelect(this);
    });
}(window.jQuery));

function InitSelect(item) {
    var $item = $(item);
    callAjaxSelect(item);
}


function callAjaxSelect(item) {
    var $item = $(item);
    $.ajax({
        url: $item.attr('ajaxurl'),
        method: 'POST',
        data: { pageindex: 0, pagesize: -1 },
        success: function (res) {
            //$item.html('');
            if (res.IsOk) {
                var data = res.dataObj;
                if (data != null) {
                    var ValueCol = "ID";
                    if ($item.attr('data-value') != undefined) {
                        ValueCol = $item.attr('data-value');
                    }
                    var NameCol = "NAME";
                    if ($item.attr('data-name') != undefined) {
                        NameCol = $item.attr('data-name');
                    }
                    var selectItem = $item.attr('data-selected');
                    var $optionList = [];
                    for (var i = 0; i < data.length; i++) {
                        var row = data[i];
                        var $option = $('<option value="' + row[ValueCol] + '" ' + (selectItem == row[ValueCol] ? "selected" : "") + '>' + row[NameCol] + '</option>');
                        $optionList.push($option);
                    }
                    for (var i = 0; i < $optionList.length; i++) {
                        $item.append($optionList[i]);
                    }
                }
            }
            if ($item.attr('afterload') != undefined && $item.attr('afterload') != '') {
                setTimeout(function () {
                    window[$item.attr('afterload').toString()]($item);
                }, 300);
                
            }
        }
        
    });
}