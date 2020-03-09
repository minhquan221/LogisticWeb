$(function () {
    $('.customdatatable').each(function () {
        InitTable($(this));
    });
});

function OrderCol(name, item) {
    var $item = $(item);
    if ($item.attr('order') == '') {
        $item.attr('order', 'asc');
    }
    else if ($item.attr('order') == 'asc') {
        $item.attr('order', 'desc');
    }
    else if ($item.attr('order') == 'desc') {
        $item.attr('order', '');
    }
}

function buildTable(item) {
    var $item = $(item);
    if ($item.find('thead th').length == 0) {
        BuildHeader($item);
    }
    else {
        $item.find('tbody').html('');
    }
    buildDataRow($item);
}


function TableGetFilter(item) {
    var $item = $(item);
    var filterquery = '';
    var filter = [];
    if ($item.closest('.tablejs').find('.customdatatable_filter[realateid=' + $item.attr('id') + ']').length > 0) {
        $item.closest('.tablejs').find('.customdatatable_filter[realateid=' + $item.attr('id') + ']').first().find('input[type=text], input[type=checkbox], select, textarea').each(function () {
            filter.push($(this).attr('name'));
        });

    }
    for (var i = 0; i < filter.length; i++) {
        var $this = filter[i];
        if ($item.closest('.tablejs').find('[name=' + $this + ']').is('textarea')) {
            if ($item.closest('.tablejs').find('[name=' + $this + ']').val() != '' && $item.closest('.tablejs').find('[name=' + $this + ']').val() != null) {
                filterquery += $this + " LIKE '%' + '" + $item.closest('.tablejs').find('[name=' + $this + ']').val() + "' + '%' AND ";
            }
        }
        else if ($item.closest('.tablejs').find('[name=' + $this + ']').is('input')) {
            if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('type') == 'text') {
                if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('name') == 'daterange') {
                    var range = $item.closest('.tablejs').find('[name=' + $this + ']').val();
                    if (range != '') {
                        var rangeSplit = range.split(' - ');
                        var paramStringDate = $item.closest('.tablejs').find('[name=' + $this + ']').attr('data-namedb');
                        filterquery += "(" + paramStringDate + " >= CONVERT(datetime,'" + rangeSplit[0] + "  00:00:00.000') AND " + paramStringDate + " <= CONVERT(datetime, '" + rangeSplit[1] + " 23:59:59.999')) AND ";
                    }
                }
                else if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('name') == 'yearmonthpick') {
                    var yearmonth = $item.closest('.tablejs').find('[name=' + $this + ']').val();
                    if (yearmonth != '') {
                        var yearmonthsplit = yearmonth.split('-');
                        var paramStringDate = $item.closest('.tablejs').find('[name=' + $this + ']').attr('data-namedb');
                        filterquery += "(YEAR(" + paramStringDate + ") = CONVERT(INT,'" + yearmonthsplit[0] + "') AND MONTH(" + paramStringDate + ") = CONVERT(INT,'" + yearmonthsplit[1] + "')) AND ";
                    }
                }
                else if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-compare') !== undefined && $item.closest('.tablejs').find('[name=' + $this + ']').attr('data-compare') !== '') {
                    if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-checkisnull') != 'true' && $item.closest('.tablejs').find('[name=' + $this + ']').val() != '') {
                        var queryplaintext = '';
                        var listParam = $item.closest('.tablejs').find('[name=' + $this + ']').attr('data-compare').split(';');
                        for (var j = 0; j < listParam.length; j++) {
                            queryplaintext += listParam[j] + " LIKE '%' + '" + $('#' + $this).val() + "' + '%' OR ";
                        }
                        filterquery += "( " + queryplaintext.substr(0, queryplaintext.length - 3) + " ) AND ";
                    }
                }
                else {
                    if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-checkisnull') != 'true' && $item.closest('.tablejs').find('[name=' + $this + ']').val() != '') {
                        if ($item.closest('.tablejs').find('[name=' + $this + ']').val() != '' && $item.closest('.tablejs').find('[name=' + $this + ']').val() != null) {
                            filterquery += $this + " LIKE '%' + '" + $item.closest('.tablejs').find('[name=' + $this + ']').val() + "' + '%' AND ";
                        }
                    }
                }
            }
            else if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('type') == 'checkbox') {
                var $item = $item.closest('.tablejs').find('[name=' + $this + ']');
                if ($item.is(':checked')) {
                    filterquery += $this + " = 1 AND ";
                }
                else {
                    filterquery += $this + " = 0 AND ";
                }
            }
        }
        else if ($item.closest('.tablejs').find('[name=' + $this + ']').is('select')) {
            if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('name') == 'listlot') {
                if ($item.closest('.tablejs').find('[name=' + $this + ']').val() != '') {
                    var selectstringlot = $item.closest('.tablejs').find('[name=' + $this + ']').val();
                    filterquery += " '" + selectstringlot + "' IN( SELECT VALUE FROM STRING_SPLIT(STRINGLOT, ';')) AND ";
                }
            }
            else if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-chosen') == 'true') {
                var multipleFilter = '';
                if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-multiple') == 'true') {
                    var lstVal = $item.closest('.tablejs').find('[name=' + $this + ']').chosen().val();
                    for (var k = 0; k < lstVal.length; k++) {
                        if (lstVal[k] != '' && lstVal[k] != null) {
                            multipleFilter += $this + " = '" + lstVal[k] + "' OR ";
                        }
                    }
                    var fullmultiple = multipleFilter.substr(0, multipleFilter.length - 3);
                    multipleFilter = fullmultiple != "" ? "(" + multipleFilter.substr(0, multipleFilter.length - 3) + ")" : "";
                }
                else {
                    var Val = $item.closest('.tablejs').find('[name=' + $this + ']').chosen().val();
                    multipleFilter += $this + " = '" + $(this) + "' ";
                }
                filterquery += multipleFilter != '' ? multipleFilter + " AND " : "";
            }
            else {
                if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-mix-select') == 'true') {
                    if ($('#SELECTION').val() != '') {
                        filterquery += " SELECTIONLIST LIKE '%" + $('#SELECTION').val() + " " + $('#SUBSELECTION').val() + "%' AND ";
                    }
                }
                else if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-nocheck') != 'true') {
                    if ($item.closest('.tablejs').find('[name=' + $this + ']').val() != '' && $item.closest('.tablejs').find('[name=' + $this + ']').val() != null) {
                        if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-fullquery') == 'true') {
                            filterquery += $item.closest('.tablejs').find('[name=' + $this + ']').val() + "AND ";
                        }
                        else {
                            filterquery += $this + " = '" + $item.closest('.tablejs').find('[name=' + $this + ']').val() + "' AND ";
                        }
                    }
                    else {
                        if ($item.closest('.tablejs').find('[name=' + $this + ']').attr('data-checkisnull') == "true") {
                            filterquery += "(" + $this + " = '' OR " + $this + " is null ) AND ";
                        }

                    }
                }
            }
        }
    };
    filterquery = filterquery.substr(0, filterquery.length - 4);
    return filterquery;
}

function TableOrderBy(item) {
    var $item = $(item);
    var orderBy = '';
    $item.find('th').each(function () {
        if ($(this).attr('order') != undefined && $(this).attr('order') != '') {
            orderBy = ' ' + $(this).attr('dataorder') + ' ' + $(this).attr('order') + ' ';
        }
    });
    return orderBy;
}

function TablePrev(item) {
    var $item = $(item);
    var PageIndex = ($item.attr('pageindex') != undefined && $item.attr('pageindex') != '' ? parseInt($item.attr('pageindex')) : 0);
    var PageSize = ($item.attr('pagesize') != undefined && $item.attr('pagesize') != '' ? parseInt($item.attr('pagesize')) : 50);
    var TotalRecords = ($item.attr('TotalRecords') != undefined && $item.attr('TotalRecords') != '' ? parseInt($item.attr('TotalRecords')) : 0);
    var Control = $item.attr('control');
    var TotalPages = parseInt(TotalRecords / PageSize);
    if (TotalRecords % PageSize > 0)
        TotalPages++;
    if (PageIndex == 1)
        return;
    PageIndex--;
    window.history.pushState(null, '', "/" + Control + "?pageindex=" + PageIndex);
    $item.attr('pageindex', PageIndex);
    TableCallAjax($item);
}

function activepaging(item) {
    var $item = $(item);
    var PageIndex = ($item.attr('pageindex') != undefined && $item.attr('pageindex') != '' ? parseInt($item.attr('pageindex')) : 0);
    var PageSize = ($item.attr('pagesize') != undefined && $item.attr('pagesize') != '' ? parseInt($item.attr('pagesize')) : 50);
    var TotalRecords = ($item.attr('TotalRecords') != undefined && $item.attr('TotalRecords') != '' ? parseInt($item.attr('TotalRecords')) : 0);
    var TotalPages = parseInt(TotalRecords / PageSize);
    if (TotalRecords % PageSize > 0)
        TotalPages++;
    if (PageIndex > 1) {
        $item.closest('.row-fluid-auto').find('.prev').removeClass('disabled');
    }
    else {
        $item.closest('.row-fluid-auto').find('.prev').addClass('disabled');
    }
    if (PageIndex >= TotalPages) {
        $item.closest('.row-fluid-auto').find('.next').addClass('disabled');
    }
    else {
        $item.closest('.row-fluid-auto').find('.next').removeClass('disabled');
    }
    $item.closest('.row-fluid-auto').find('.paging').removeClass('active');
    $item.closest('.row-fluid-auto').find('.paging a[data-page="' + (PageIndex - 1) + '"]').closest('li').addClass('active');
}

function TableNext(item) {
    var $item = $(item);
    var PageIndex = ($item.attr('pageindex') != undefined && $item.attr('pageindex') != '' ? parseInt($item.attr('pageindex')) : 0);
    var PageSize = ($item.attr('pagesize') != undefined && $item.attr('pagesize') != '' ? parseInt($item.attr('pagesize')) : 50);
    var TotalRecords = ($item.attr('TotalRecords') != undefined && $item.attr('TotalRecords') != '' ? parseInt($item.attr('TotalRecords')) : 0);
    var Control = $item.attr('control');
    var TotalPages = parseInt(TotalRecords / PageSize);
    if (TotalRecords % PageSize > 0)
        TotalPages++;
    if (PageIndex >= TotalPages)
        return;
    PageIndex++;
    window.history.pushState(null, '', "/" + Control + "?pageindex=" + PageIndex);
    $item.attr('pageindex', PageIndex);
    TableCallAjax($item);
}

function InitPaging(item) {
    var $item = $(item);
    $($($item.closest('.row-fluid-auto').find('.dataTables_paginate')).closest('.row-fluid')).remove();
    var PageIndex = ($item.attr('pageindex') != undefined && $item.attr('pageindex') != '' ? parseInt($item.attr('pageindex')) : 0);
    var PageSize = ($item.attr('pagesize') != undefined && $item.attr('pagesize') != '' ? parseInt($item.attr('pagesize')) : 50);
    var TotalRecords = ($item.attr('TotalRecords') != undefined && $item.attr('TotalRecords') != '' ? parseInt($item.attr('TotalRecords')) : 0);
    var TotalPages = parseInt(TotalRecords / PageSize);
    if (TotalRecords % PageSize > 0)
        TotalPages++;
    var realPageIndex = PageIndex - 1;
    var $Container = $('<div class="row-fluid"><div class="span6"></div></div>');
    var $span6 = $('<div class="span6"></div>');
    var $Pagination = $('<div class="dataTables_paginate paging_bootstrap pagination"></div>');
    var $ul = $('<ul></ul>');
    var $PrevBtn = $('<li class="prev ' + (realPageIndex == 0 ? "disabled" : "") + '"><a href="javascript:void(0)">← <span class="hidden-480">Prev</span></a></li>');
    var $NextBtn = $('<li class="next  ' + (realPageIndex == (TotalPages - 1) ? "disabled" : "") + '"><a href="javascript:void(0)"><span class="hidden-480">Next</span> → </a></li>');
    var arrPage = [];
    for (var i = 1; i <= TotalPages; i++) {
        var $page = $('<li class="paging ' + (realPageIndex == (i - 1) ? "active" : "") + '"><a href="javascript:void(0)" data-page="' + (i - 1) + '">' + i + '</a></li>');
        arrPage.push($page);
    }
    $ul.append($PrevBtn);
    for (var i = 0; i < arrPage.length; i++) {
        $ul.append(arrPage[i]);
    }
    $ul.append($NextBtn);
    $Pagination.append($ul);
    $span6.append($Pagination);
    $Container.append($span6);
    $item.closest('div').before($Container);
    $item.closest('.row-fluid-auto').find('.prev').bind('click', function () {
        TablePrev($item);
    });
    $item.closest('.row-fluid-auto').find('.next').bind('click', function () {
        TableNext($item);
    });
    $item.closest('.row-fluid-auto').find('.paging').each(function () {
        $(this).bind('click', function () {
            goTo($item, this);
        })
    });
    activepaging($item);
    sweetviewpaging($item);
}

function goTo(item, clickEle) {
    var $item = $(item);
    var Control = $item.attr('control');
    var PageIndex = ($item.attr('pageindex') != undefined && $item.attr('pageindex') != '' ? parseInt($item.attr('pageindex')) : 0);
    var $Ele = $(clickEle);
    var pageindex = $Ele.find('a').attr('data-page');
    var PageIndex = parseFloat(pageindex);
    window.history.pushState(null, '', "/" + Control + "?pageindex=" + (PageIndex + 1));
    $item.attr('pageindex', (PageIndex + 1));
    TableCallAjax($item);
}

function sweetviewpaging(item) {
    var $item = $(item);
    var PageIndex = ($item.attr('pageindex') != undefined && $item.attr('pageindex') != '' ? parseInt($item.attr('pageindex')) : 0);
    var PageSize = ($item.attr('pagesize') != undefined && $item.attr('pagesize') != '' ? parseInt($item.attr('pagesize')) : 50);
    var TotalRecords = ($item.attr('TotalRecords') != undefined && $item.attr('TotalRecords') != '' ? parseInt($item.attr('TotalRecords')) : 0);
    var TotalPages = parseInt(TotalRecords / PageSize);
    if (TotalRecords % PageSize > 0)
        TotalPages++;
    var steppage = ($item.attr('steppage') != undefined && $item.attr('steppage') != '' ? parseInt($item.attr('steppage')) : 6);
    var CountBack = PageIndex - (steppage / 2);
    var CountNext = PageIndex + (steppage / 2);
    if (CountBack < 1) {
        CountNext = (CountNext - CountBack) >= TotalPages ? TotalPages : (CountNext - CountBack);
        CountBack = 1;
    }
    if (CountNext > TotalPages) {
        CountBack = CountBack - (CountNext - TotalPages) <= 1 ? 1 : CountBack - (CountNext - TotalPages);
        CountNext = TotalPages;
    }
    $item.closest('.row-fluid-auto').find('.paging').each(function () {
        var pageindex = parseFloat($(this).find('a').attr('data-page')) + 1;
        if ((pageindex >= CountBack && pageindex <= PageIndex) || (pageindex <= CountNext && pageindex >= PageIndex)) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
        //if (pageindex <= (PageIndex + (steppage / 2)) && (pageindex >= (PageIndex - (steppage / 2)))) {
        //    $(this).show();
        //}
        //else {
        //    $(this).hide();
        //}
    })
}

function InitTable(item) {
    var $item = $(item);
    var html = $item[0].outerHTML;
    var id = $item.attr('id');
    $item[0].outerHTML = '<div class="overflowtable" generatefor="' + id + '">' + html + "</div>";
    $item = $($('.overflowtable[generatefor=' + id + ']').find('table').first());
    InitSearchSubmit($item);
    TableCallAjax($item);
}

function InitSearchSubmit(item) {
    var $item = $(item);
    $item.closest('.tablejs').find('.customdatatable_filter[realateid=' + $item.attr('id') + ']').first().find('.btn-search').bind('click', function () {
        TableSubmitSearch($item);
    })
}

function BuildHeader(item) {
    var $item = $(item);
    var HeaderCol = ($item.attr('headerCol') != undefined ? $item.attr('headerCol').split(',') : []);
    var TableCol = ($item.attr('arrCol') != undefined ? $item.attr('arrCol').split(',') : []);
    var ColItemWidth = ($item.attr('colwidth') != undefined ? $item.attr('colwidth').split(';') : []);
    var actioncolwidth = ($item.attr('actioncolwidth') != undefined ? $item.attr('actioncolwidth') : '');
    var ordertable = ($item.attr('ordertable') != undefined && $item.attr('ordertable') == "true" ? true : false);
    var checkall = ($item.attr('checkall') != undefined && $item.attr('checkall') == "true" ? true : false);
    var colindex = ($item.attr('colindex') != undefined ? $item.attr('colindex') : '');
    var $listcolwidth = ColItemWidth;
    var data = $item.data($item.attr('id'));
    var noedit = ($item.attr('noedit') == "true" ? true : false);
    var obj = {};
    if (data != null && data.length > 0) {
        obj = data[0];
    }
    var $header = $('<thead></thead>');
    var tr = '<tr>';
    if (colindex == '') {
        tr += "<th></th>";
    }
    else {
        tr += '<th style="min-width:25px;text-align: center;"></th>';
    }
    if (HeaderCol.length == 0) {
        if (TableCol.length == 0) {
            if (obj != undefined && obj != null) {
                for (var i = 0; i < Object.keys(obj).length; i++) {
                    if ($listcolwidth.length > 0 && $listcolwidth[i] != '') {
                        tr += '<th class="hidden-480" style="min-width:' + $listcolwidth[i] + 'px;"><span>' + Object.keys(obj)[i] + '</span></th>';
                    }
                    else {
                        tr += '<th class="hidden-480"><span>' + Object.keys(obj)[i] + '</span></th>';
                    }
                }
            }
        }
        else {
            for (var i = 0; i < TableCol.length; i++) {
                if ($listcolwidth.length > 0 && $listcolwidth[i] != '') {
                    tr += '<th style="min-width:' + $listcolwidth[i] + 'px;" class="hidden-480" dataorder="' + TableCol[i] + '" order=""><span>' + TableCol[i] + '</span></th>';
                }
                else {
                    tr += '<th style="" class="hidden-480" dataorder="' + TableCol[i] + '" order=""><span>' + TableCol[i] + '</span></th>';
                }
            }
        }
    }
    else {
        for (var i = 0; i < HeaderCol.length; i++) {
            if ($listcolwidth.length > 0 && $listcolwidth[i] != '') {
                tr += '<th style="min-width:' + $listcolwidth[i] + 'px;" class="hidden-480" dataorder="' + TableCol[i] + '" order=""><span>' + HeaderCol[i] + '</span></th>';
            }
            else {
                tr += '<th style="" class="hidden-480" dataorder="' + TableCol[i] + '" order=""><span>' + HeaderCol[i] + '</span></th>';
            }
        }
    }
    if (colindex == '') {
        if (checkall) {
            tr += "<th class='hidden-480'><input type='checkbox' onchange='CheckAllTable(this)' /></th>";
        }
        if (!noedit) {
            tr += "<th class='hidden-480' style='min-width:" + (actioncolwidth != '' ? actioncolwidth : "110") + "px;'></th>";
        }
    }
    tr += '</tr>';
    $header.append(tr);
    $item.append($header);
    if (ordertable == true) {
        actionOrderBy($item);
    }
    $item.find('th').on('dblclick', function (e) {
        var $this = $(this);
        //console.log($this.width());
        ResizeDbClickCol($this);
    });
    $item.find('th').on('mousedown mouseup mousemove mouseout', function mouseState(e) {
        var $this = $(this);
        switch (e.type) {
            case "mousedown":
                IsHold = true;
                holdXBegin = e.pageX;
                beginWidthElement = $this.width() + 2;
                $this[0].style.minWidth = beginWidthElement.toString() + "px";
                break;
            case "mouseup":
                IsHold = false;
                break;
            case "mousemove":
                if (IsHold) {
                    var currentposition = e.pageX;
                    currentWidthElement = beginWidthElement + (currentposition - holdXBegin) + 6;
                    $this[0].style.minWidth = currentWidthElement.toString() + "px";
                    ResizeWholeCol($this, currentWidthElement);
                }
                break;
            case "mouseout":
                if (IsHold) {
                    var currentposition = e.pageX;
                    currentWidthElement = beginWidthElement + (currentposition - holdXBegin) + 6;
                    $this[0].style.minWidth = currentWidthElement.toString() + "px";
                    ResizeWholeCol($this, currentWidthElement);
                }
                break;
        }
    });
}

function CheckAllTable(item) {
    var $item = $(item);
    if ($item.is(":checked")) {
        $item.closest('table').find('tbody tr').each(function () {
            if (!$(this).find('input[type=checkbox]').is(":checked")) {
                $(this).find('input[type=checkbox]').prop("checked", true);
            }
        });
    }
    else {
        $item.closest('table').find('tbody tr').each(function () {
            if ($(this).find('input[type=checkbox]').is(":checked")) {
                $(this).find('input[type=checkbox]').prop("checked", false);
            }
        });
    }
}

function ResizeDbClickCol(item) {
    var $item = $(item);
    var $table = $(item).closest('table');
    var index = 0;
    for (var i = 0; i < $table.find('th').length; i++) {
        var $th = $table.find('th')[i];
        if ($th.innerHTML == $item[0].innerHTML) {
            index = i;
            break;
        }
    }
    var heightSpan = 0;
    $table.find('tbody tr').each(function () {
        if ($($(this).find('td')[index]).find('span').length > 0) {
            var $span = $($($(this).find('td')[index]).find('span'));
            var heightSpanCurr = $span.height();
            if (heightSpanCurr >= heightSpan) {
                heightSpan = heightSpanCurr;
            }
            //console.log(heightSpan);
            //$($(this).find('td')[index]).find('span')[0].style.width = currentWidthElement.toString() + "px";
        }
    });
    //console.log(heightSpan);
    var widthAll = 0;
    $table.find('tbody tr').each(function () {
        if ($($(this).find('td')[index]).find('span').length > 0) {
            //white-space: normal;
            $($(this).find('td')[index]).find('span')[0].style.whiteSpace = "normal";
            var $span = $($($(this).find('td')[index]).find('span'));
            var heightCurr = $span.height();
            var widthCurr = $span.width();
            if (widthCurr > widthAll)
                widthAll = widthCurr;
            if (widthAll > widthCurr)
                widthCurr = widthAll;
            while (heightCurr > heightSpan) {
                widthCurr = $span.width();
                if (widthCurr < widthAll)
                    widthCurr = widthAll;
                $($(this).find('td')[index]).find('span')[0].style.width = widthCurr.toString() + "px";
                heightCurr = $span.height();
                while (heightCurr > heightSpan) {
                    widthCurr++;
                    $($(this).find('td')[index]).find('span')[0].style.width = widthCurr.toString() + "px";
                    heightCurr = $span.height();
                }
                if (widthCurr > widthAll)
                    widthAll = widthCurr;
            }
            $($(this).find('td')[index]).find('span')[0].style.whiteSpace = null;
            $($(this).find('td')[index]).find('span')[0].style.width = null;
        }
    });
    $table.find('tbody tr').each(function () {
        if ($($(this).find('td')[index]).find('span').length > 0) {
            var $span = $($($(this).find('td')[index]).find('span'));
            $($(this).find('td')[index]).find('span')[0].style.whiteSpace = "normal";
            var heightCurr = $span.height();
            if (heightCurr > heightSpan) {
                $($(this).find('td')[index]).find('span')[0].style.width = widthAll.toString() + "px";
            }
            $($(this).find('td')[index]).find('span')[0].style.whiteSpace = null;
        }
    });
}

function ResizeWholeCol(item, currentWidthElement) {
    var $item = $(item);
    var $table = $(item).closest('table');
    var index = 0;
    for (var i = 0; i < $table.find('th').length; i++) {
        var $th = $table.find('th')[i];
        if ($th.innerHTML == $item[0].innerHTML) {
            index = i;
            break;
        }
    }
    $table.find('tbody tr').each(function () {
        if ($($(this).find('td')[index]).find('span').length > 0) {
            $($(this).find('td')[index]).find('span')[0].style.width = currentWidthElement.toString() + "px";
        }
    })
}

var IsHold = false;
var holdXBegin = 0;
var beginWidthElement = 0;

function actionOrderBy(item) {
    var $item = $(item);
    $item.find('th').each(function () {
        $(this).children('span').on('click', function () {
            var $this = $(this).parent('th');
            $this.closest('thead').find('th').each(function () {
                if ($(this).attr('dataorder') != $this.attr('dataorder')) {
                    $(this).attr('order', '');
                    $(this).attr('class', '');
                }
            })
            if ($this.attr('order') == '') {
                $this.attr('order', 'asc');
                $this.attr("class", '');
                $this.addClass('asc');
            }
            else if ($this.attr('order') == 'asc') {
                $this.attr('order', 'desc');
                $this.attr("class", '');
                $this.addClass('desc');
            }
            else if ($this.attr('order') == 'desc') {
                $this.attr('order', '');
                $this.attr("class", '');
            }
            TableSubmitSearch($item);
        })
    });
}
function TableSubmitSearch(item) {
    var $item = $(item);
    $item.attr('pageindex', '1');
    TableCallAjax(item);
}

function BuidTable(item) {
    var $item = $(item);
    if ($item.find('thead th').length == 0) {
        BuildHeader($item);
    }
    else {
        $($item.find('tbody')).html('');
    }
    buildDataRow($item);
}

function TableCallAjax(item) {
    var $item = $(item);
    var filterquery = TableGetFilter($item);
    var orderby = TableOrderBy($item);
    var rowtotal = ($item.attr('rowtotal') == "true" ? true : false);
    var PageIndex = ($item.attr('pageindex') != undefined && $item.attr('pageindex') != '' ? parseInt($item.attr('pageindex')) - 1 : 0);
    var PageSize = ($item.attr('pagesize') != undefined && $item.attr('pagesize') != '' ? parseInt($item.attr('pagesize')) : 50);
    var ajaxUrl = $item.attr('urlquery');
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        async: true,
        data: { pageindex: PageIndex, pagesize: PageSize, filterquery: filterquery, orderby: orderby },
        success: function (res) {
            if (res.IsOk) {
                if (res.dataObj != null) {
                    $item.data($item.attr('id'), res.dataObj);
                    $item.attr('TotalRecords', res.totalrows);
                    if (rowtotal) {
                        $item.attr('TotalPallet', res.TotalPallet);
                        $item.attr('TotalPCS', res.TotalPCS);
                        $item.attr('TotalNW', res.TotalNW);
                        $item.attr('TotalSQFT', res.TotalSQFT);
                        $item.attr('TotalINV', res.TotalINV);
                        $item.attr('TotalCNT', res.TotalCNT);
                    }
                }
                else {
                    $item.data($item.attr('id'), []);
                    $item.attr('TotalRecords', 0);
                }
            }
            BuidTable($item);
            InitPaging($item);

        }
    });
}

function buildDataRow(item) {
    var $item = $(item);
    var $datarow = $item.data($item.attr('id'));
    var Control = $item.attr('control');
    var PageIndex = ($item.attr('pageindex') != undefined ? parseInt($item.attr('pageindex')) : 0);
    var PageSize = ($item.attr('pagesize') != undefined ? parseInt($item.attr('pagesize')) : 50);
    var dbClickAction = ($item.attr('data-dbclickaction') != undefined ? $item.attr('data-dbclickaction') : '');
    var HeaderCol = ($item.attr('headerCol') != undefined ? $item.attr('headerCol').split(',') : []);
    var TableCol = ($item.attr('arrCol') != undefined ? $item.attr('arrCol').split(',') : []);
    var ColItemWidth = ($item.attr('colwidth') != undefined ? $item.attr('colwidth').split(';') : []);
    var formatcol = ($item.attr('formatcol') != undefined ? $item.attr('formatcol').split(';') : []);
    var formatSubStr = ($item.attr('formatsubstr') != undefined ? $item.attr('formatsubstr').split(';') : []);
    var definebtn = ($item.attr('definebtn') != undefined ? $item.attr('definebtn').split(';') : []);
    var definefnbtn = ($item.attr('definefnbtn') != undefined ? $item.attr('definefnbtn').split(';') : []);
    var iconbtn = ($item.attr('iconbtn') != undefined ? $item.attr('iconbtn').split(';') : []);
    var lstparambtn = ($item.attr('lstparambtn') != undefined ? $item.attr('lstparambtn').split(';') : []);
    var actioncolwidth = ($item.attr('actioncolwidth') != undefined ? $item.attr('actioncolwidth') : '');
    var aligncol = ($item.attr('aligncol') != undefined ? $item.attr('aligncol').split(';') : []);
    var IDCol = ($item.attr('idCol') != undefined ? $item.attr('idCol') : "ID");
    var rowtotal = ($item.attr('rowtotal') == "true" ? true : false);
    var titlespancolbefore = ($item.attr('titlespancolbefore') != undefined ? $item.attr('titlespancolbefore') : '');
    var titlespancolafter = ($item.attr('titlespancolafter') != undefined ? $item.attr('titlespancolafter') : '');
    var totalcol = ($item.attr('totalcol') != undefined ? $item.attr('totalcol').split(';') : []);
    var admin = ($item.attr('data-admin') == "true" ? true : false);
    var replaceEdit = ($item.attr('replaceEdit') == "true" ? true : false);
    var noedit = ($item.attr('noedit') == "true" ? true : false);
    var editcol = ($item.attr('editcol') != undefined ? $item.attr('editcol') : '');
    var bluractioneditcol = ($item.attr('bluractioneditcol') != undefined ? $item.attr('bluractioneditcol') : '');
    var blurvalue = ($item.attr('blurvalue') != undefined ? $item.attr('blurvalue') : '');
    var checkall = ($item.attr('checkall') != undefined && $item.attr('checkall') == "true" ? true : false);
    var singleclickaction = ($item.attr('data-singleclickaction') != undefined ? $item.attr('data-singleclickaction') : '');
    var colindex = ($item.attr('colindex') != undefined ? $item.attr('colindex') : '');
    var subidCol = ($item.attr('subidCol') != undefined ? $item.attr('subidCol') : '');
    var subcontrol = ($item.attr('subcontrol') != undefined ? $item.attr('subcontrol') : '');
    var $listcolwidth = [];
    var a = 0;
    $item.find('th').each(function () {
        if (a != 0) {
            $listcolwidth.push($(this).width());
        }
        a++;
    });
    var $tbody;
    if ($item.find('tbody').length > 0) {
        $tbody = $item.find('tbody');
    }
    else {
        $tbody = $('<tbody></tbody>');
    }
    if (rowtotal) {
        var trtotal = '<tr class="odd gradeX" style="font-weight: bold; background-color: #e4f3f5 !important;font-size: 11px;">';
        trtotal += '<td colspan="' + titlespancolbefore + '" style="text-align: center;">TOTAL</td>';
        for (var c = 0; c < totalcol.length; c++) {
            trtotal += '<td>' + $item.attr(totalcol[c]) + '</td>';
        }
        trtotal += '<td colspan="' + titlespancolafter + '"></td>';
        trtotal += '</tr>';
    }

    $tbody.append(trtotal);

    for (var i = 0; i < $datarow.length; i++) {
        var $row = $datarow[i];
        var tr = '';
        if (dbClickAction != '') {
            if (subidCol == '' && subcontrol == '') {
                tr += '<tr class="odd gradeX"' + (checkall ? 'idrow=' + $row[IDCol] : '') + ' ondblclick="' + dbClickAction + '(' + $row["ID"] + ')" item-key="' + ($row[IDCol] != undefined ? $row[IDCol] : $row["ID"]) + '" ' + (singleclickaction != undefined && singleclickaction != '' && colindex == '' ? 'onclick="' + singleclickaction + '(this)"' : 'b') + '>';
            }
            else {
                tr += '<tr class="odd gradeX"' + (checkall ? 'idrow=' + $row[IDCol] : '') + ' ondblclick="' + dbClickAction + '(\'' + subcontrol.trim() + '\',\'' + $row[subidCol] + '\',' + $row["ID"] + ')" item-key="' + ($row[IDCol] != undefined ? $row[IDCol] : $row["ID"]) + '" ' + (singleclickaction != undefined && singleclickaction != '' && colindex != '' ? 'onclick="' + singleclickaction + '(this)"' : 'b') + '>';
            }
        }
        else {
            if (replaceEdit) {
                //url = '/" + Control + "/detail?id=" + $row[IDCol] + "' onclick = 'GotoUrl(this)'
                tr += '<tr class="odd gradeX" ' + (checkall ? 'idrow=' + $row[IDCol] : '') + ' url="/' + Control + '/detail?id=' + $row[IDCol] + '" ondblclick="GotoUrl(this)">';
            }
            else {
                tr += '<tr class="odd gradeX" item-key="' + ($row[IDCol] != undefined ? $row[IDCol] : $row["ID"]) + '">';
            }
        }
        var stt = i + 1 + ((PageIndex - 1) * PageSize);
        if (colindex == '') {
            tr += '<td>' + stt + '</td>';
        }
        else {
            if (singleclickaction != '') {
                tr += '<td><i class="icon-plus"></i></td>';
            }
        }
        //tr += '<td><input type="checkbox" class="checkboxes" /></td>';
        if (TableCol.length == 0) {
            for (var i = 0; i < Object.keys($row).length; i++) {
                if ($row[Object.keys($row)[i]] != null) {
                    if (editcol != '' && Object.keys($row)[i] == editcol) {
                        var valuedata = $row[blurvalue];
                        tr += '<td><input exval="' + $row[Object.keys($row)[i]].toString() + '" style="border: none !important;height: 12px;" type="text" name="' + editcol + '" onblur="' + bluractioneditcol + '(this, ' + valuedata + ')" value="' + $row[Object.keys($row)[i]].toString() + '" /></td>';
                    }
                    else {
                        var align = aligncol.length > 0 ? aligncol[i] : '';
                        if ($row[Object.keys($row)[i]].toString().indexOf('Date(') >= 0) {
                            var ts = $row[Object.keys($row)[i]].replace('/Date(', '').replace(')/', '');
                            var date = new Date(Number(ts));
                            if (Object.keys($row)[i].toLowerCase() == 'createddate') {
                                tr += '<td class="center hidden-480"><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "min-width:" + $listcolwidth[i] + "px;" : "") + '">' + date.GetMonthCustom(2) + "/" + date.GetDateCustom(2) + "/" + date.getFullYear() + " " + date.GetHourCustom(2) + ":" + date.GetMinuteCustom(2) + ":" + date.GetSecondCustom(2) + '</span></td>';
                            }
                            else {
                                tr += '<td class="center hidden-480"><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "min-width:" + $listcolwidth[i] + "px;" : "") + '">' + date.GetMonthCustom(2) + "/" + date.GetDateCustom(2) + "/" + date.getFullYear() + '</span></td>';
                            }
                        }
                        else {
                            if (formatcol[i] == '1') {
                                if (formatSubStr[i] == '0') {
                                    var str = $row[Object.keys($row)[i]].FormatNumberCustom();
                                    if (str == 'true' || str == 'false') {
                                        switch (str) {
                                            case 'true':
                                                str = '<span class="icon-check"></span>';
                                                break;
                                            case 'false':
                                                str = '<span class="icon-check-empty"></span>';
                                                break;
                                        }
                                    }
                                    tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : (align != '' ? 'style="text-align: ' + align + ';"' : '')) + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "min-width:" + $listcolwidth[i] + "px;" : "") + '">' + str + '</span></td>';
                                }
                                else {
                                    var str = $row[Object.keys($row)[i]].FormatNumberCustom(true);
                                    if (str == 'true' || str == 'false') {
                                        switch (str) {
                                            case 'true':
                                                str = '<span class="icon-check"></span>';
                                                break;
                                            case 'false':
                                                str = '<span class="icon-check-empty"></span>';
                                                break;
                                        }
                                    }
                                    tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : (align != '' ? 'style="text-align: ' + align + ';"' : '')) + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "min-width:" + $listcolwidth[i] + "px;" : "") + '">' + str + '</span></td>';
                                }
                            }
                            else {
                                if (this.customtable_js.options.formatSubStr[i] == '0') {
                                    var str = $row[Object.keys($row)[i]];
                                    if (str == 'true' || str == 'false') {
                                        switch (str) {
                                            case 'true':
                                                str = '<span class="icon-check"></span>';
                                                break;
                                            case 'false':
                                                str = '<span class="icon-check-empty"></span>';
                                                break;
                                        }
                                    }
                                    tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : (align != '' ? 'style="text-align: ' + align + ';"' : '')) + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "min-width:" + $listcolwidth[i] + "px;" : "") + '">' + str + '</span></td>';
                                }
                                else {
                                    var str = $row[Object.keys($row)[i]].toString().FormatSubStrLength(15);
                                    if (str == 'true' || str == 'false') {
                                        switch (str) {
                                            case 'true':
                                                str = '<span class="icon-check"></span>';
                                                break;
                                            case 'false':
                                                str = '<span class="icon-check-empty"></span>';
                                                break;
                                        }
                                    }
                                    tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : (align != '' ? 'style="text-align: ' + align + ';"' : '')) + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "min-width:" + $listcolwidth[i] + "px;" : "") + '">' + str + '</span></td>';
                                }
                            }
                        }
                    }

                }
                else {
                    if (editcol != '' && Object.keys($row)[i] == editcol) {
                        var valuedata = $row[blurvalue];
                        tr += '<td class="center hidden-480"><input style="border: none !important;height: 12px;" exval="" type="text" name="' + editcol + '" onblur="' + bluractioneditcol + '(this, ' + valuedata + ')" value="" /></td>';
                    }
                    else {
                        tr += '<td class="center hidden-480"></td>';
                    }
                }
            }
        }
        else {
            var tableCol = TableCol;
            for (var j = 0; j < tableCol.length; j++) {
                if ($row[tableCol[j]] != null) {
                    if (editcol != '' && tableCol[j] == editcol) {
                        var valuedata = $row[blurvalue];
                        tr += '<td><input exval="' + $row[tableCol[j]].toString() + '" style="border: none !important;height: 12px;" type="text" name="' + editcol + '" onblur="' + bluractioneditcol + '(this, ' + valuedata + ')" value="' + $row[tableCol[j]].toString() + '" /></td>';
                    }
                    else {
                        var align = aligncol.length > 0 ? aligncol[j] : '';
                        if ($row[tableCol[j]].toString().indexOf('Date(') >= 0) {
                            var ts = $row[tableCol[j]].replace('/Date(', '').replace(')/', '');
                            var date = new Date(Number(ts));
                            if (tableCol[j].toLowerCase() == 'createddate') {
                                tr += '<td class="center hidden-480"><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "min-width:" + $listcolwidth[j] + "px;" : "") + '">' + date.GetMonthCustom(2) + "/" + date.GetDateCustom(2) + "/" + date.getFullYear() + " " + date.GetHourCustom(2) + ":" + date.GetMinuteCustom(2) + ":" + date.GetSecondCustom(2) + '</span></td>';
                            }
                            else {
                                tr += '<td class="center hidden-480"><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "min-width:" + $listcolwidth[j] + "px;" : "") + '">' + date.GetMonthCustom(2) + "/" + date.GetDateCustom(2) + "/" + date.getFullYear() + '</span></td>';
                            }
                        }
                        else {
                            if (formatcol[j] == '1') {
                                if (formatSubStr[j] == '0') {
                                    var str = $row[tableCol[j]].FormatNumberCustom();
                                    if (str == 'true' || str == 'false') {
                                        switch (str) {
                                            case 'true':
                                                str = '<span class="icon-check"></span>';
                                                break;
                                            case 'false':
                                                str = '<span class="icon-check-empty"></span>';
                                                break;
                                        }
                                    }
                                    tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : (align != '' ? 'style="text-align: ' + align + ';"' : '')) + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "min-width:" + $listcolwidth[j] + "px;" : "") + '">' + str + '</span></td>';
                                }
                                else {
                                    var str = $row[tableCol[j]].FormatNumberCustom(true);
                                    if (str == 'true' || str == 'false') {
                                        switch (str) {
                                            case 'true':
                                                str = '<span class="icon-check"></span>';
                                                break;
                                            case 'false':
                                                str = '<span class="icon-check-empty"></span>';
                                                break;
                                        }
                                    }
                                    //($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "min-width:" + $listcolwidth[i] + "px;" : "")
                                    tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : (align != '' ? 'style="text-align: ' + align + ';"' : '')) + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "min-width:" + $listcolwidth[j] + "px;" : "") + '">' + str + '</span></td>';
                                }
                            }
                            else {
                                if (formatSubStr[j] == '0') {
                                    var str = $row[tableCol[j]];
                                    if (str == 'true' || str == 'false') {
                                        switch (str) {
                                            case 'true':
                                                str = '<span class="icon-check"></span>';
                                                break;
                                            case 'false':
                                                str = '<span class="icon-check-empty"></span>';
                                                break;
                                        }
                                    }
                                    tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : (align != '' ? 'style="text-align: ' + align + ';"' : '')) + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "min-width:" + $listcolwidth[j] + "px;" : "") + '">' + str + '</span></td>';
                                }
                                else {
                                    var str = $row[tableCol[j]].toString().FormatSubStrLength(15);
                                    if (str == 'true' || str == 'false') {
                                        switch (str) {
                                            case 'true':
                                                str = '<span class="icon-check"></span>';
                                                break;
                                            case 'false':
                                                str = '<span class="icon-check-empty"></span>';
                                                break;
                                        }
                                    }
                                    tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : (align != '' ? 'style="text-align: ' + align + ';"' : '')) + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "min-width:" + $listcolwidth[j] + "px;" : "") + '">' + str + '</span></td>';
                                }
                            }
                        }
                    }
                }
                else {
                    if (editcol != '' && tableCol[j] == editcol) {
                        var valuedata = $row[blurvalue];
                        tr += '<td class="center hidden-480"><input exval="" style="border: none !important;height: 12px;" type="text" name="' + editcol + '" onblur="' + bluractioneditcol + '(this, ' + valuedata + ')" value="" /></td>';
                    }
                    else {
                        tr += '<td class="center hidden-480"></td>';
                    }
                }
            }
        }
        if (colindex == '') {
            if (checkall) {
                tr += "<td class='center hidden-480'><input type='checkbox' /></td>";
            }
            tr += "<td class='center hidden-480'>";
            //tr += "<button url='/" + Control + "/detail?id=" + (this.customtable_js.options.IDCol == '' ? $row["ID"] : $row[this.customtable_js.options.IDCol]) + "' onclick='GotoUrl(this)' class='btn'><span class='icon-edit'></span></button>";



            if (!noedit) {
                tr += "<button type='button' style='cursor: pointer;min-width:54px; " + (replaceEdit ? "display:none;" : "") + "'><span url='/" + Control + "/detail?id=" + $row[IDCol] + "' onclick='GotoUrl(this)' class='icon-edit'></span></button>";
                if (admin) {
                    tr += "<button type='button' style='cursor: pointer;min-width:54px;'><span data-id='" + $row[IDCol] + "' onclick='Delete(this)' class='icon-trash'></span></button>";
                }
            }
            if (definebtn.length > 0) {
                var lstbtn = definebtn;
                var lstfnbtn = definefnbtn;
                for (var k = 0; k < lstbtn.length; k++) {
                    if (lstfnbtn[k] != undefined) {
                        tr += "<button type='button' style='cursor: pointer;min-width:54px;'><span data-primval='" + (lstparambtn[k] != undefined ? $row[lstparambtn[k]] : $row["ID"]) + "' onclick='" + lstfnbtn[k] + "(this)' class='" + (iconbtn[k] != undefined ? iconbtn[k] : "") + "'></span></button>";
                    }
                }
            }
            tr += '</td>';
        }
        tr += '</tr>';
        $tbody.append(tr);
    }
    $item.append($tbody);
}

var IsHold = false;
var holdXBegin = 0;
var holdXAfter = 0;
var currentWidthElement = 0;

