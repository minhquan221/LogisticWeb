function GoToDetail(subcontrol, subid, itemkey) {
    window.location.href = '/' + subcontrol.trim() + '/detail?id=' + subid;
}

function LoadDetailPallet(item) {
    var $row = $(item).closest('tr');
    var $table = $row.closest('table');
    var key = $row.attr('item-key');
    $table.find('tr').each(function () {
        if ($(this)[0].hasAttribute('linkto')) {
            $(this).hide();
            var datalink = $(this).attr('linkto');
            $table.find('tr[item-key="' + datalink + '"]').each(function () {
                var $icondata = $(this).find('i');
                if ($icondata.hasClass('icon-minus')) {
                    $icondata.addClass('icon-plus').removeClass('icon-minus');
                }
            });
        }
    });
    var filterquery = " PKLNAME = '" + key + "' ";
    var Pindex = 0;
    var Psize = -1;
    var linkUrl = "/report/getlistrmstock";
    $.ajax({
        url: linkUrl,
        method: 'POST',
        async: true,
        data: { pageindex: Pindex, pagesize: Psize, filterquery: filterquery },
        success: function (res) {
            if (res.IsOk) {
                if (res.dataObj != null) {
                    BuidTableRMStock($row, res.dataObj);
                    var $icondata = $row.find('i.icon-plus');
                    $icondata.addClass('icon-minus').removeClass('icon-plus');
                    $icondata.closest('tr').attr('onclick', 'ShowHideMiniTable(this)');
                }
                //else {
                //    $item.data($item.attr('id'), []);
                //    $item.attr('TotalRecords', 0);
                //}
            }

        }
    });

}
function ShowHideMiniTable(item) {
    var $row = $(item);
    var $table = $row.closest('table');
    var key = $row.attr('item-key');
    $table.find('tbody tr').each(function () {
        if ($(this)[0].hasAttribute('linkto') && $(this).attr('linkto') != key) {
            var keyatt = $(this).attr('linkto');
            $(this).hide(500);
            var $icondata = $table.find('tr[item-key="' + keyatt + '"]').find('td:first i');
            $icondata.addClass('icon-plus').removeClass('icon-minus');
        }
    });

    $table.find('tbody tr').each(function () {
        if ($(this)[0].hasAttribute('linkto')) {
            if ($(this).attr('linkto') == key) {
                var $icondata = $row.find('td:first i');
                if ($icondata.attr('class') == 'icon-minus') {
                    $(this).hide(500);
                    $icondata.addClass('icon-plus').removeClass('icon-minus');
                }
                else {
                    $(this).show(500);
                    $icondata.addClass('icon-minus').removeClass('icon-plus');
                }
                
            }
        }
    });
}

function BuidTableRMStock(row, data) {
    var $item = $(row);
    var key = $item.attr('item-key');
    var countcolumns = $item.find('td').length;
    var $parentTable = $item.closest('table');
    var HeaderCol = ($parentTable.attr('headerminitablecol') != undefined ? $parentTable.attr('headerminitablecol').split(',') : []);
    var TableCol = ($parentTable.attr('minitablecol') != undefined ? $parentTable.attr('minitablecol').split(',') : []);
    var $table = $('<table class="table table-striped table-bordered table-hover childtable"></table>');
    $table = BuildHeaderRmStock($table, data, $parentTable);
    $table = BuildRowDataRmStock($table, data, $parentTable);
    var $newrow = $('<tr class="odd gradeX" linkto="' + key + '"><td colspan="' + countcolumns + '">' + $table[0].outerHTML + '</td><tr>');
    $newrow.insertAfter($item);

}

function BuildHeaderRmStock(item, data, parenttable) {
    var $item = $(item);
    var $parentTable = parenttable;
    var HeaderCol = ($parentTable.attr('headerminitablecol') != undefined ? $parentTable.attr('headerminitablecol').split(',') : []);
    var TableCol = ($parentTable.attr('minitablecol') != undefined ? $parentTable.attr('minitablecol').split(',') : []);
    var $header = $('<thead></thead>');
    var obj = {};
    if (data != null && data.length > 0) {
        obj = data[0];
    }
    var tr = '<tr>';
    tr += "<th></th>";
    if (HeaderCol.length == 0) {
        if (TableCol.length == 0) {
            if (obj != undefined && obj != null) {
                for (var i = 0; i < Object.keys(obj).length; i++) {
                    tr += '<th class="hidden-480"><span>' + Object.keys(obj)[i] + '</span></th>';
                }
            }
        }
        else {
            for (var i = 0; i < TableCol.length; i++) {
                tr += '<th style="" class="hidden-480"><span>' + TableCol[i] + '</span></th>';
            }
        }
    }
    else {
        for (var i = 0; i < HeaderCol.length; i++) {
            tr += '<th style="" class="hidden-480"><span>' + HeaderCol[i] + '</span></th>';
        }
    }
    tr += '</tr>';
    $header.append(tr);
    $item.append($header);
    return $item;
}

function BuildRowDataRmStock(item, data, parenttable) {
    var $item = $(item);
    var $parentTable = parenttable;
    var $datarow = data;
    var HeaderCol = ($parentTable.attr('headerminitablecol') != undefined ? $parentTable.attr('headerminitablecol').split(',') : []);
    var TableCol = ($parentTable.attr('minitablecol') != undefined ? $parentTable.attr('minitablecol').split(',') : []);

    var $tbody;
    if ($item.find('tbody').length > 0) {
        $tbody = $item.find('tbody');
    }
    else {
        $tbody = $('<tbody></tbody>');
    }

    for (var k = 0; k < $datarow.length; k++) {
        var $row = $datarow[k];
        var tr = '';
        tr += '<tr class="odd gradeX">';
        var stt = k + 1;
        tr += '<td>' + stt + '</td>';
        if (TableCol.length == 0) {
            for (var i = 0; i < Object.keys($row).length; i++) {
                if ($row[Object.keys($row)[i]] != null) {
                    if ($row[Object.keys($row)[i]].toString().indexOf('Date(') >= 0) {
                        var ts = $row[Object.keys($row)[i]].replace('/Date(', '').replace(')/', '');
                        var date = new Date(Number(ts));
                        if (Object.keys($row)[i].toLowerCase() == 'createddate') {
                            tr += '<td class="center hidden-480"><span>' + date.GetMonthCustom(2) + "/" + date.GetDateCustom(2) + "/" + date.getFullYear() + " " + date.GetHourCustom(2) + ":" + date.GetMinuteCustom(2) + ":" + date.GetSecondCustom(2) + '</span></td>';
                        }
                        else {
                            tr += '<td class="center hidden-480"><span>' + date.GetMonthCustom(2) + "/" + date.GetDateCustom(2) + "/" + date.getFullYear() + '</span></td>';
                        }
                    }
                    else {
                        var str = $row[Object.keys($row)[i]].toString();
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
                        tr += '<td class="center hidden-480"><span>' + str + '</span></td>';
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
                            tr += '<td class="center hidden-480"><span>' + date.GetMonthCustom(2) + "/" + date.GetDateCustom(2) + "/" + date.getFullYear() + " " + date.GetHourCustom(2) + ":" + date.GetMinuteCustom(2) + ":" + date.GetSecondCustom(2) + '</span></td>';
                        }
                        else {
                            tr += '<td class="center hidden-480"><span>' + date.GetMonthCustom(2) + "/" + date.GetDateCustom(2) + "/" + date.getFullYear() + '</span></td>';
                        }
                    }
                    else {
                        var str = $row[tableCol[j]].toString();
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
                        tr += '<td class="center hidden-480"><span>' + str + '</span></td>';
                    }
                }
                else {
                    tr += '<td class="center hidden-480"></td>';
                }
            }
        }
        tr += '</tr>';
        $tbody.append(tr);
    }
    $item.append($tbody);
    return $item;
}