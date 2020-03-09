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
        if ($('#' + $this).is('textarea')) {
            if ($('#' + $this).val() != '' && $('#' + $this).val() != null) {
                filterquery += $this + " LIKE '%' + '" + $('#' + $this).val() + "' + '%' AND ";
            }
        }
        else if ($('#' + $this).is('input')) {
            if ($('#' + $this).attr('type') == 'text') {
                if ($('#' + $this).attr('name') == 'daterange') {
                    var range = $('#' + $this).val()
                    if (range != '') {
                        var rangeSplit = range.split(' - ');
                        var paramStringDate = $('#' + $this).attr('data-namedb');
                        filterquery += "(" + paramStringDate + " >= CONVERT(datetime,'" + rangeSplit[0] + "  00:00:00.000') AND " + paramStringDate + " <= CONVERT(datetime, '" + rangeSplit[1] + " 23:59:59.999')) AND ";
                    }
                }
                else if ($('#' + $this).attr('data-compare') !== undefined && $('#' + $this).attr('data-compare') !== '') {
                    var queryplaintext = '';
                    var listParam = $('#' + $this).attr('data-compare').split(';');
                    for (var j = 0; j < listParam.length; j++) {
                        queryplaintext += listParam[j] + " LIKE '%' + '" + $('#' + $this).val() + "' + '%' OR ";
                    }
                    filterquery += "( " + queryplaintext.substr(0, queryplaintext.length - 3) + " ) AND ";
                }
                else {
                    if ($('#' + $this).val() != '' && $('#' + $this).val() != null) {
                        filterquery += $this + " LIKE '%' + '" + $('#' + $this).val() + "' + '%' AND ";
                    }
                }
            }
            else if ($('#' + $this).attr('type') == 'checkbox') {
                var $item = $('#' + $this);
                if ($item.is(':checked')) {
                    filterquery += $this + " = 1 AND ";
                }
                else {
                    filterquery += $this + " = 0 AND ";
                }
            }
        }
        else if ($('#' + $this).is('select')) {
            if ($('#' + $this).attr('data-mix-select') == 'true') {
                if ($('#SELECTION').val() != '') {
                    filterquery += " SELECTIONLIST LIKE '%" + $('#SELECTION').val() + " " + $('#SUBSELECTION').val() + "%' AND ";
                }
            }
            else if ($('#' + $this).attr('data-nocheck') != 'true') {
                if ($('#' + $this).val() != '' && $('#' + $this).val() != null) {
                    if ($('#' + $this).attr('data-fullquery') == 'true') {
                        filterquery += $('#' + $this).val() + "AND ";
                    }
                    else {
                        filterquery += $this + " = '" + $('#' + $this).val() + "' AND ";
                    }
                }
                else {
                    if ($('#' + $this).attr('data-checkisnull') == "true") {
                        filterquery += "(" + $this + " = '' OR " + $this + " is null ) AND ";
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
    var $listcolwidth = ColItemWidth;
    var data = $item.data($item.attr('id'));
    var obj = {};
    if (data != null && data.length > 0) {
        obj = data[0];
    }
    var $header = $('<thead></thead>');
    var tr = '<tr>';
    tr += "<th></th>";
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
    tr += "<th class='hidden-480' style='min-width:" + (actioncolwidth != '' ? actioncolwidth : "110") + "px;'></th>";
    tr += '</tr>';
    $header.append(tr);
    $item.append($header);
    if (ordertable == true) {
        actionOrderBy($item);
    }
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
    var IDCol = ($item.attr('idCol') != undefined ? $item.attr('idCol') : "ID");
    var admin = ($item.attr('data-admin') == "true" ? true : false);
    var $listcolwidth = [];
    var a = 0;
    $item.find('th').each(function () {
        if (a != 0) {
            $listcolwidth.push($(this).width());
        }
        a++;
    })
    var $tbody = $('<tbody></tbody>');
    for (var i = 0; i < $datarow.length; i++) {
        var $row = $datarow[i];
        var tr = '';
        if (dbClickAction != '') {
            tr += '<tr class="odd gradeX" ondblclick="' + dbClickAction + '(' + $row["ID"] + ')">';
        }
        else {
            tr += '<tr class="odd gradeX">';
        }
        var stt = i + 1 + ((PageIndex - 1) * PageSize);
        tr += '<td>' + stt + '</td>';
        //tr += '<td><input type="checkbox" class="checkboxes" /></td>';
        if (TableCol.length == 0) {
            for (var i = 0; i < Object.keys($row).length; i++) {
                if ($row[Object.keys($row)[i]] != null) {
                    if ($row[Object.keys($row)[i]].toString().indexOf('Date(') >= 0) {
                        var ts = $row[Object.keys($row)[i]].replace('/Date(', '').replace(')/', '');
                        var date = new Date(Number(ts));
                        if (Object.keys($row)[i].toLowerCase() == 'createddate') {
                            tr += '<td class="center hidden-480"><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "width:" + $listcolwidth[i] + "px;" : "") + '">' + date.GetDateCustom(2) + "/" + date.GetMonthCustom(2) + "/" + date.getFullYear() + " " + date.GetHourCustom(2) + ":" + date.GetMinuteCustom(2) + ":" + date.GetSecondCustom(2) + '</span></td>';
                        }
                        else {
                            tr += '<td class="center hidden-480"><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "width:" + $listcolwidth[i] + "px;" : "") + '">' + date.GetDateCustom(2) + "/" + date.GetMonthCustom(2) + "/" + date.getFullYear() + '</span></td>';
                        }
                    }
                    else {
                        if (formatcol[i] == '1') {
                            if (formatSubStr[i] == '0') {
                                tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : 'style="text-align: right;"') + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "width:" + $listcolwidth[i] + "px;" : "") + '">' + $row[Object.keys($row)[i]].FormatNumberCustom() + '</span></td>';
                            }
                            else {
                                tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : 'style="text-align: right;"') + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "width:" + $listcolwidth[i] + "px;" : "") + '">' + $row[Object.keys($row)[i]].FormatNumberCustom(true) + '</span></td>';
                            }
                        }
                        else {
                            if (this.customtable_js.options.formatSubStr[i] == '0') {
                                tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : 'style="text-align: right;"') + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "width:" + $listcolwidth[i] + "px;" : "") + '">' + $row[Object.keys($row)[i]] + '</span></td>';
                            }
                            else {
                                tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : 'style="text-align: right;"') + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "width:" + $listcolwidth[i] + "px;" : "") + '">' + $row[Object.keys($row)[i]].FormatSubStrLength(15) + '</span></td>';
                            }
                        }
                    }
                }
                else {
                    tr += '<td class="center hidden-480"></td>';
                }
            }
        }
        else {
            var tableCol = TableCol;
            for (var j = 0; j < tableCol.length; j++) {
                if ($row[tableCol[j]] != null) {
                    if ($row[tableCol[j]].toString().indexOf('Date(') >= 0) {
                        var ts = $row[tableCol[j]].replace('/Date(', '').replace(')/', '');
                        var date = new Date(Number(ts));
                        if (tableCol[j].toLowerCase() == 'createddate') {
                            tr += '<td class="center hidden-480"><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "width:" + $listcolwidth[j] + "px;" : "") + '">' + date.GetDateCustom(2) + "/" + date.GetMonthCustom(2) + "/" + date.getFullYear() + " " + date.GetHourCustom(2) + ":" + date.GetMinuteCustom(2) + ":" + date.GetSecondCustom(2) + '</span></td>';
                        }
                        else {
                            tr += '<td class="center hidden-480"><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "width:" + $listcolwidth[j] + "px;" : "") + '">' + date.GetDateCustom(2) + "/" + date.GetMonthCustom(2) + "/" + date.getFullYear() + '</span></td>';
                        }
                    }
                    else {
                        if (formatcol[j] == '1') {
                            if (formatSubStr[j] == '0') {
                                tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : 'style="text-align: right;"') + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "width:" + $listcolwidth[j] + "px;" : "") + '">' + $row[tableCol[j]].FormatNumberCustom() + '</span></td>';
                            }
                            else {
                                //($listcolwidth.length > 0 && $listcolwidth[i] != '' ? "width:" + $listcolwidth[i] + "px;" : "")
                                tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : 'style="text-align: right;"') + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "width:" + $listcolwidth[j] + "px;" : "") + '">' + $row[tableCol[j]].FormatNumberCustom(true) + '</span></td>';
                            }
                        }
                        else {
                            if (formatSubStr[j] == '0') {
                                tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : 'style="text-align: right;"') + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "width:" + $listcolwidth[j] + "px;" : "") + '">' + $row[tableCol[j]] + '</span></td>';
                            }
                            else {
                                tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : 'style="text-align: right;"') + '><span style="' + ($listcolwidth.length > 0 && $listcolwidth[j] != '' ? "width:" + $listcolwidth[j] + "px;" : "") + '">' + $row[tableCol[j]].FormatSubStrLength(15) + '</span></td>';
                            }
                        }
                    }
                }
                else {
                    tr += '<td class="center hidden-480"></td>';
                }
            }
        }
        tr += "<td class='center hidden-480'>";
        //tr += "<button url='/" + Control + "/detail?id=" + (this.customtable_js.options.IDCol == '' ? $row["ID"] : $row[this.customtable_js.options.IDCol]) + "' onclick='GotoUrl(this)' class='btn'><span class='icon-edit'></span></button>";




        tr += "<button type='button' style='cursor: pointer;width:54px;'><span url='/" + Control + "/detail?id=" + $row[IDCol] + "' onclick='GotoUrl(this)' class='icon-edit'></span></button>";
        if (admin) {
            tr += "<button type='button' style='cursor: pointer;width:54px;'><span data-id='" + $row["ID"] + "' onclick='Delete(this)' class='icon-trash'></span></button>";
        }
        if (definebtn.length > 0) {
            var lstbtn = definebtn;
            var lstfnbtn = definefnbtn;
            for (var k = 0; k < lstbtn.length; k++) {
                if (lstfnbtn[k] != undefined) {
                    tr += "<button type='button' style='cursor: pointer;width:54px;'><span data-primval='" + (lstparambtn[k] != undefined ? $row[lstparambtn[k]] : $row["ID"]) + "' onclick='" + lstfnbtn[k] + "(this)' class='" + (iconbtn[k] != undefined ? iconbtn[k] : "") + "'></span></button>";
                }
            }
        }
        tr += '</td>';
        tr += '</tr>';
        $tbody.append(tr);
    }
    $item.append($tbody);
}

var IsHold = false;
var holdXBegin = 0;
var holdXAfter = 0;
var currentWidthElement = 0;

