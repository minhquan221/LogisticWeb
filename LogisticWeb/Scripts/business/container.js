var $firstLi = {};
function DispatcheData(id) {
    var rowData = $('#tbList').data("tbList").find(x => x.ID == id);
    if (rowData.STATUS == 'Ready to ship') {
        Swal.fire({
            title: '<strong>Dispatch PKL</strong>',
            type: 'info',
            html:
                '<form class="form-horizontal"><div class="control-group"><label class="control-label">Dispatch date:</label><div class="controls"><input id="DispatchedDate" name="DispatchedDate" onkeydown="return false" type="text" value="' + new Date().GetFullDateCustom() + '" /></div></div><div class="control-group"><label class="control-label">PKL No:</label><div class="controls"><input id="PKLNO" name="PKLNO" readonly type="text" value="" /></div></div><div class="control-group"><label class="control-label">Max Weight:</label><div class="controls"><input id="MW" name="MW" readonly  type="text" value="" /></div></div><div class="control-group"><label class="control-label">Status:</label><div class="controls"><input id="Stts" name="Stts" readonly type="text" value="" /></div></div></form>',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Ok',
            cancelButtonText: 'Cancel',
            onBeforeOpen: () => {
                $('#DispatchedDate').datepicker({
                    "setDate": new Date(),
                    "autoclose": true,
                    format: 'dd/mm/yyyy',
                    beforeShow: function (input) {
                        $(input).css({
                            "z-index": "1060"
                        });
                    }
                });
                var rowData = $('#tbList').data("tbList").find(x => x.ID == id);
                $('#PKLNO').val(rowData.NAME);
                $('#MW').val(rowData.MAXWEIGHT);
                $('#Stts').val(rowData.STATUS);

            },
        }).then((result) => {
            if (result.value) {
                var rowData = $('#tbList').data("tbList").find(x => x.ID == id);
                var datedispatched = $('#DispatchedDate').datepicker('getDate');
                var frm = {};
                for (var i = 0; i < Object.keys(rowData).length; i++) {
                    if (Object.keys(rowData)[i] != 'SELECTIONLIST') {
                        frm[Object.keys(rowData)[i]] = rowData[Object.keys(rowData)[i]];
                    }
                }
                frm['Selection'] = '';
                frm['SELECTION'] = '';
                //frm['SELECTIONLIST'] = '';
                var currentD = new Date();
                $.ajax({
                    method: 'POST',
                    url: '/container/dispatch',
                    data: { container: frm, dispatchedDate: datedispatched.GetFullReverseDateCustom() + " " + (new Date()).GetHourCustom(2) + ":" + (new Date()).GetMinuteCustom(2) + ":" + (new Date()).GetSecondCustom(2) },
                    success: function (res) {
                        if (res.IsOk) {
                            Swal.fire(
                                'Dispatched PKL',
                                'You have successful Dispatch PKL',
                                'success'
                            );
                            UpdateRow(res.dataObj);
                        }
                        else {
                            Swal.fire({
                                type: 'error',
                                title: 'Error',
                                text: res.Msg
                            });
                        }
                    }
                });
            }
        })
    }
    else if (rowData.STATUS == 'Dispatched') {
        Swal.fire({
            type: 'info',
            title: 'Warning',
            text: 'This PKL has been dispatched'
        });
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: 'This PKL has not done yet'
        });
    }
}

function UpdateRow(row) {
    for (var j = 0; j < $('#tbList').data("tbList").length; j++) {
        //$('#tbList').data("tbList").each(function () {
        if ($('#tbList').data("tbList")[j].NAME == row.NAME && $('#tbList').data("tbList")[j].ID == row.ID) {
            for (var i = 0; i < Object.keys(row).length; i++) {
                $('#tbList').data("tbList")[j][Object.keys(row)[i]] = row[Object.keys(row)[i]];
            }
        }
    }
    //);
    //$('#tbList').customtable_js('updaterow');
}

function Delete(item) {
    var $item = $(item);
    var idData = $item.attr('data-id');
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                method: 'POST',
                url: '/container/delete',
                data: { id: idData },
                success: function (res) {
                    if (res.IsOk) {
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        );
                        $item.closest('tr').remove();
                    }
                    else {
                        Swal.fire({
                            type: 'error',
                            title: 'Error',
                            text: res.Msg
                        });
                    }
                }
            });

        }
    });
    var $item = $(item);

}

function MoveAllIn() {
    $('#palletunsign').find('li').each(function () {
        var $item = $(this);
        var id = ($item.attr('data-id') != "null" ? $item.attr('data-id') : "");
        var nw = ($item.attr('data-nw') != "null" ? $item.attr('data-nw') : "0");
        var gw = ($item.attr('data-gw') != "null" ? $item.attr('data-gw') : "0");
        var selection = ($item.attr('data-selection') != "null" ? $item.attr('data-selection') : "");
        var subsel = ($item.attr('data-subsel') != "null" ? $item.attr('data-subsel') : "");
        var sqft = ($item.attr('data-sqft') != "null" ? $item.attr('data-sqft') : "");
        var layer = ($item.attr('data-layer') != "null" ? $item.attr('data-layer') : "");
        var resa = ($item.attr('data-resa') != "null" ? $item.attr('data-resa') : "");
        var resaNo = ($item.attr('data-indexresa') != "null" ? $item.attr('data-indexresa') : "");
        var name = $item.html();
        var selFull = selection + " " + subsel;
        var index = $('#table tbody tr').length;
        var $tr = $('<tr data-item="' + id + '"><td>' + (index + 1).toString() + '</td><td>' + selFull + '</td><td>' + name + '</td><td style="text-align: right;">' + layer + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + gw + '</td><td style="text-align: right;">' + sqft + '</td><td>' + resa + '</td><td>' + resaNo + '</td><td><button type="button" onclick="RemoveSelect(this)"><span class="icon-play"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td><td><input type="checkbox" /></td></tr>');
        $('#table tbody').append($tr);
        var heighttable = $('#table').height();
        $('#container').height(heighttable);
        var totalcurrent = parseFloat($('#TOTAL').val());
        var maxweight = parseFloat($('#MAXWEIGHT').val());
        totalcurrent += parseFloat(nw);
        $('#TOTAL').val(totalcurrent);
        $('#NUMBERPALLET').val((parseFloat($('#NUMBERPALLET').val()) + 1));
        $(this).hide();
    });
}

function getListContainer() {
    $.ajax({
        method: 'POST',
        url: '/pallet/getlistbyContainer',
        data: { container: $('#NAME').val() },
        success: function (res) {
            if (res.IsOk) {
                if (res.dataObj == null) {
                    return;
                }
                var $liList = [];
                if (res.dataObj != null && res.dataObj.length > 0) {
                    $firstLi = res.dataObj[0];
                }
                for (var i = 0; i < res.dataObj.length; i++) {
                    var $item = res.dataObj[i];
                    if ($('#container').find('li[data-id="' + $item.ID + '"]').length == 0) {
                        var $li = $('<li data-id="' + $item.ID + '" data-layer="' + $item.HIDE + '" data-selection="' + $item.SELECTION + '" data-subsel="' + $item.SUBSELECTION + '" data-sqft="' + $item.SQUAREFOOT + '" data-gw="' + $item.GROSSWEIGHT + '" data-nw="' + $item.NETWEIGHT + '" data-resa="' + $item.RESACODE + '" data-indexresa="' + $item.INDEXRESA + '" class="ui-state-highlight" style="display: none;" ondblclick="LoadPop(this)">' + $item.NAME + '</li>');
                        $liList.push($li);
                        var index = i + 1;
                        var id = $item.ID;
                        var nw = parseFloat($item.NETWEIGHT);
                        var gw = $item.GROSSWEIGHT;
                        var selection = $item.SELECTION;
                        var subsel = $item.SUBSELECTION == null ? "" : $item.SUBSELECTION;
                        var sqft = $item.SQUAREFOOT == null ? "" : $item.SQUAREFOOT;
                        var layer = $item.HIDE == null ? "" : $item.HIDE;
                        var name = $item.NAME;
                        var resa = $item.RESACODE;
                        var resaNo = $item.INDEXRESA;
                        var selFull = selection + " " + subsel;
                        var $tr = $('<tr data-item="' + id + '"><td>' + index + '</td><td>' + selFull + '</td><td>' + name + '</td><td style="text-align: right;">' + layer + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + gw + '</td><td style="text-align: right;">' + sqft + '</td><td>' + resa + '</td><td>' + resaNo + '</td><td><button type="button" onclick="RemoveSelect(this)"><span class="icon-play"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td><td><input type="checkbox" /></td></tr>');
                        $('#table tbody').append($tr);
                        var heighttable = $('#table').height();
                        $('#container').height(heighttable);
                        var totalcurrent = parseFloat($('#TOTAL').val());
                        totalcurrent += parseFloat(nw);
                        $('#TOTAL').val(totalcurrent);
                    }
                }
                for (var i = 0; i < $liList.length; i++) {
                    $('#container').append($liList[i]);
                }
                $('#NUMBERPALLET').val($liList.length);
                $('#SELECTION').val($firstLi.SELECTION);
                LoadSubSel();
            }
            AutoCheckSub();
            filtercontract();
        }
    });
}
function CreateNew(item) {
    $.ajax({
        method: 'POST',
        url: '/container/CreateNewContainer',
        success: function (res) {
            if (res.IsOk) {
                $('#NAME').val(res.dataObj.PKL);
                $('#CREATEDDATE').val(res.dataObj.Date);
                window.history.pushState(null, '', "/container/detail?id=" + res.dataObj.PKL);
                var datanotify =
                {
                    TYPE: "NEWCNT",
                    URL: "/container/detail?id=" + res.dataObj.PKL,
                    MESSAGE: "Cnt. " + + res.dataObj.PKL + " has been create by " + loginUser.USERNAME,
                    USERCREATED: loginUser.USERNAME
                };
                socket.emit('pushnotification', datanotify);
                $(item).hide();
            }
        }
    });
}

function LoadPalletUnsign() {
    var sel = $('#SELECTION').val();
    var subsel = $('#SUBSELECTION').val() != null ? $('#SUBSELECTION').val() : "";
    $.ajax({
        method: 'POST',
        url: '/pallet/getlistbyFullSelection',
        data: { selection: sel, subselection: subsel },
        success: function (res) {
            $('#palletunsign').html('');
            if (res.IsOk) {
                if (res.dataObj != undefined) {
                    if (res.dataObj == null) {
                        return;
                    }
                    var $liList = [];
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        if ($('#container').find('li[data-id="' + item.ID + '"]').length == 0) {
                            var $li = $('<li data-id="' + item.ID + '" data-layer="' + item.HIDE + '" data-selection="' + item.SELECTION + '" data-subsel="' + item.SUBSELECTION + '" data-sqft="' + item.SQUAREFOOT + '" data-gw="' + item.GROSSWEIGHT + '" data-nw="' + item.NETWEIGHT + '" data-resa="' + item.RESACODE + '" data-indexresa="' + item.INDEXRESA + '"  class="ui-state-highlight" ondblclick="LoadPop(this)">' + item.NAME + '</li>');
                            $liList.push($li);
                        }
                    }
                    for (var i = 0; i < $liList.length; i++) {
                        $('#palletunsign').append($liList[i]);

                    }
                }
            }
        }
    });
}

function LoadPop(item) {
    var $item = $(item);
    var id = $item.attr('data-id');
    var nw = ($item.attr('data-nw') != 'null' ? $item.attr('data-nw') : "0");
    var gw = ($item.attr('data-gw') != 'null' ? $item.attr('data-gw') : "0");
    var selection = ($item.attr('data-selection') != 'null' ? $item.attr('data-selection') : "");
    var subsel = ($item.attr('data-subsel') != 'null' ? $item.attr('data-subsel') : "");
    var sqft = ($item.attr('data-sqft') != 'null' ? $item.attr('data-sqft') : "0");
    var layer = ($item.attr('data-layer') != 'null' ? $item.attr('data-layer') : "0");
    var resa = ($item.attr('data-resa') != 'null' ? $item.attr('data-resa') : "");
    var indexresa = ($item.attr('data-indexresa') != 'null' ? $item.attr('data-indexresa') : "");
    var name = $item.html();
    var $table = $('<table><thead></thead><tbody></tbody></table>');
    var $head = $('<tr><th>Pallet No.</th><th>Layer</th><th>Net Weight</th><th>Square Foot</th><th>Resa</th><th>No Resa</th></tr>')

    var $row = $('<tr><td>' + name + '</td><td>' + layer + '</td><td>' + nw + '</td><td>' + sqft + '</td><td>' + resa + '</td><td>' + indexresa + '</td></tr>');
    $table.find('thead').append($head);
    $table.find('tbody').append($row);
    sweetPopDisplay($table);
}

function AutoCheckAndLoadSub() {
    setTimeout(function () {
        var table = [];
        $('#container').find('li').each(function () {
            var option = {
                SELECTION: $(this).attr('data-selection'),
                SUBSELECTION: $(this).attr('data-subsel'),
            };
            table.push(option);
        })
        var isOne = true;
        for (var i = 0; i < table.length; i++) {
            var check = table[i];
            if (table.find(x => x.SELECTION == check.SELECTION && x.SUBSELECTION == check.SUBSELECTION).length > 1) {
                isOne = false;
                break;
            }
        }
        if (isOne) {
            if (check != undefined && check != null) {
                $('#SELECTION').val(check.SELECTION);
                $('#SUBSELECTION').val(check.SUBSELECTION);
            }
        }
        LoadSubSel();
    }, 3000);
}

function AutoCheckSub() {
    var table = [];
    $('#container').find('li').each(function () {
        var option = {
            SELECTION: $(this).attr('data-selection'),
            SUBSELECTION: $(this).attr('data-subsel'),
        };
        table.push(option);
    });
    var isOne = true;
    for (var i = 0; i < table.length; i++) {
        var check = table[i];
        if (table.find(x => x.SELECTION == check.SELECTION && x.SUBSELECTION == check.SUBSELECTION).length > 1) {
            isOne = false;
            break;
        }
    }
    if (isOne) {
        $('#SUBSELECTION').val(check.SUBSELECTION);
    }
}


function LoadSubSelIndex() {
    var value = $('#SELECTION').val();
    $.ajax({
        method: 'POST',
        url: '/subsel/getlistbyId',
        data: { value: value },
        success: function (res) {
            $('#SUBSELECTION').html('');
            if (res.IsOk) {
                if (res.dataObj != undefined) {
                    if (res.dataObj == null) {
                        if ($('#SELECTION').attr('loadallsuboption') == 'true') {
                            var $optionsList = [];
                            var $optionAll = $('<option value="">--All Sub Selection--</option>');
                            $optionsList.push($optionAll);
                            for (var i = 0; i < $optionsList.length; i++) {
                                $('#SUBSELECTION').append($optionsList[i]);

                            }
                        }
                        return;
                    }
                    var $optionsList = [];
                    if ($('#SELECTION').attr('loadallsuboption') == 'true') {
                        var $optionAll = $('<option value="">--All Sub Selection--</option>');
                        $optionsList.push($optionAll);
                    }
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.NAME + '">' + item.NAME + '</option>');
                        $optionsList.push($option);
                    }
                    for (var i = 0; i < $optionsList.length; i++) {
                        $('#SUBSELECTION').append($optionsList[i]);

                    }
                    if ($optionsList.length > 0) {
                        $('#SUBSELECTION').closest('.controls-left-50').show();
                    }
                }
            }
            else {
                $('#SUBSELECTION').html('');
                $('#SUBSELECTION').closest('.controls-left-50').hide();
            }
            if ($firstLi != undefined && $firstLi.SUBSELECTION !== undefined) {
                if ($firstLi.SUBSELECTION != null) {
                    $('#SUBSELECTION').val($firstLi.SUBSELECTION);
                }
            }
            LoadPalletUnsign();
            //AutoCheckSub();
        }
    });
}

function LoadSubSel() {
    var value = $('#SELECTION').val();
    $.ajax({
        method: 'POST',
        url: '/subsel/getlistbyId',
        data: { value: value },
        success: function (res) {
            $('#SUBSELECTION').html('');
            if (res.IsOk) {
                if (res.dataObj != undefined) {
                    if (res.dataObj == null) {
                        if ($('#SELECTION').attr('loadallsuboption') == 'true') {
                            var $optionsList = [];
                            var $optionAll = $('<option value="">--All Sub Selection--</option>');
                            $optionsList.push($optionAll);
                            for (var i = 0; i < $optionsList.length; i++) {
                                $('#SUBSELECTION').append($optionsList[i]);

                            }
                        }
                        return;
                    }
                    var $optionsList = [];
                    if ($('#SELECTION').attr('loadallsuboption') == 'true') {
                        var $optionAll = $('<option value="">--All Sub Selection--</option>');
                        $optionsList.push($optionAll);
                    }
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.NAME + '">' + item.NAME + '</option>');
                        $optionsList.push($option);
                    }
                    for (var i = 0; i < $optionsList.length; i++) {
                        $('#SUBSELECTION').append($optionsList[i]);

                    }
                    if ($optionsList.length > 0) {
                        $('#SUBSELECTION').closest('.controls-left-50').show();
                    }
                }
            }
            else {
                $('#SUBSELECTION').html('');
                $('#SUBSELECTION').closest('.controls-left-50').hide();
            }
            if ($firstLi != undefined && $firstLi.SUBSELECTION !== undefined) {
                if ($firstLi.SUBSELECTION != null) {
                    $('#SUBSELECTION').val($firstLi.SUBSELECTION);
                }
            }
            LoadPalletUnsign();
            //AutoCheckSub();
        }
    });
}
$(function () {
    $("#container, #palletunsign").sortable({
        connectWith: [".connectedTable", ".connectedSortable"],
        //beforeStop: getPosition,
        receive: function (e, ui) {
            console.log(ui.item.closest('ul').attr('id'));
            var $item = ui.item;
            var id = ($item.attr('data-id') != "null" ? $item.attr('data-id') : "");
            var nw = ($item.attr('data-nw') != "null" ? $item.attr('data-nw') : "0");
            var gw = ($item.attr('data-gw') != "null" ? $item.attr('data-gw') : "0");
            var selection = ($item.attr('data-selection') != "null" ? $item.attr('data-selection') : "");
            var subsel = ($item.attr('data-subsel') != "null" ? $item.attr('data-subsel') : "");
            var sqft = ($item.attr('data-sqft') != "null" ? $item.attr('data-sqft') : "");
            var layer = ($item.attr('data-layer') != "null" ? $item.attr('data-layer') : "");
            var resa = ($item.attr('data-resa') != "null" ? $item.attr('data-resa') : "");
            var resaNo = ($item.attr('data-indexresa') != "null" ? $item.attr('data-indexresa') : "");
            var name = $item.html();
            var selFull = selection + " " + subsel;
            var index = $('#table tbody tr').length;
            var $tr = $('<tr data-item="' + id + '"><td>' + (index + 1).toString() + '</td><td>' + selFull + '</td><td>' + name + '</td><td style="text-align: right;">' + layer + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + gw + '</td><td style="text-align: right;">' + sqft + '</td><td>' + resa + '</td><td>' + resaNo + '</td><td><button type="button" onclick="RemoveSelect(this)"><span class="icon-play"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td><td><input type="checkbox" /></td></tr>');
            $('#table tbody').append($tr);
            var heighttable = $('#table').height();
            $('#container').height(heighttable);
            var totalcurrent = parseFloat($('#TOTAL').val());
            var maxweight = parseFloat($('#MAXWEIGHT').val());
            totalcurrent += parseFloat(nw);
            $('#TOTAL').val(totalcurrent);
            $('#NUMBERPALLET').val((parseFloat($('#NUMBERPALLET').val()) + 1));
            ui.item.hide();
            if (totalcurrent > maxweight + 300) {
                RemoveSelect($('#table tbody').find('tr[data-item="' + id + '"]').first().find('button'));
                //RemoveSelect($('#table tbody').find('tr[data-item="' + id + '"]').first().find('span'));
                Swal.fire({
                    type: 'error',
                    title: 'Access Deny',
                    text: 'Out of maximum weight allowed'
                });
            }
            filtercontract();
        }
    }).disableSelection();
});

function RemoveSelect(item) {
    var $tr = $(item).closest('tr');
    var $li = $('#container').find('li[data-id="' + $tr.attr('data-item') + '"]');
    var nw = $li.attr('data-nw');
    $('#palletunsign').append($li);
    $('#palletunsign').find('li[data-id="' + $tr.attr('data-item') + '"]').show();
    var totalcurrent = parseFloat($('#TOTAL').val());
    totalcurrent = totalcurrent - parseFloat(nw);
    $('#TOTAL').val(totalcurrent);
    $('#container').find('li[data-id="' + $tr.attr('data-item') + '"]').remove();
    $('#NUMBERPALLET').val((parseFloat($('#NUMBERPALLET').val()) - 1));
    $tr.remove();
    filtercontract();
}

function UpdatePackageList(close) {
    if (close != undefined && close == true) {
        Swal.fire({
            title: 'Cảnh báo!!!',
            text: "Prod.PKL này chưa đủ số KG yêu cầu. Bạn thực sự muốn ĐÓNG Prod.PKL này?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancel<br/>Hủy',
            confirmButtonText: 'Yes, Close Prod.PKL<br/>Đúng, Đóng Prod.PKL'
        }).then((result) => {
            if (result.value) {
                $('#MAXWEIGHT').val($('#TOTAL').val());
                var table = [];
                $('#table tbody').find('tr').each(function () {
                    table.push($(this).attr('data-item'));
                });
                var frm = {};
                var form = $('#frm');
                $(form).find('input, select, textarea').each(function () {
                    frm[$(this).attr('name')] = $(this).val();
                });
                $(form).find('input[type=checkbox]').each(function () {
                    if ($(this).val() == 'on') {
                        frm[$(this).attr('name')] = true;
                    }
                    else if ($(this).val() == 'off') {
                        frm[$(this).attr('name')] = false;
                    }
                });
                $.ajax({
                    method: 'POST',
                    url: '/container/updateFullContainer',
                    data: { container: frm, list: table, close: (close !== undefined ? close : false) },
                    success: function (res) {
                        if (res.IsOk) {
                            var datanotify =
                            {
                                TYPE: "DONECNT",
                                URL: "/container/detail?id=" + frm["NAME"],
                                MESSAGE: "Cnt. " + frm["NAME"] + " has been close by " + loginUser.USERNAME,
                                USERCREATED: loginUser.USERNAME
                            };
                            socket.emit('pushnotification', datanotify);
                            Swal.fire({
                                type: 'success',
                                title: 'HOÀN TẤT',
                                timer: 500
                            });
                            //Swal.fire(
                            //    'Save data successful',
                            //    '',
                            //    'Ok'
                            //);
                            $('#update1').hide();
                            $('#update2').hide();
                            $('#issave').val('1');
                            //window.location.href = "/container";
                        }
                        else {
                            Swal.fire({
                                type: 'error',
                                title: 'Process fail',
                                text: res.Msg
                            });
                        }
                    },
                    error: function (err) {
                        Swal.fire({
                            type: 'error',
                            title: 'Process fail',
                            text: err
                        });
                    }
                });
            }
        })

    }
    else {
        var table = [];
        $('#table tbody').find('tr').each(function () {
            table.push($(this).attr('data-item'));
        });
        var frm = {};
        var form = $('#frm');
        $(form).find('input, select, textarea').each(function () {
            frm[$(this).attr('name')] = $(this).val();
        });
        $(form).find('input[type=checkbox]').each(function () {
            if ($(this).val() == 'on') {
                frm[$(this).attr('name')] = true;
            }
            else if ($(this).val() == 'off') {
                frm[$(this).attr('name')] = false;
            }
        });
        $.ajax({
            method: 'POST',
            url: '/container/updateFullContainer',
            data: { container: frm, list: table, close: (close !== undefined ? close : false) },
            success: function (res) {
                if (res.IsOk) {
                    //Swal.fire(
                    //    'Save data successful',
                    //    '',
                    //    'Ok'
                    //);
                    Swal.fire({
                        type: 'success',
                        title: 'HOÀN TẤT',
                        timer: 500
                    });
                    $('#update1').hide();
                    $('#update2').hide();
                    $('#issave').val('1');
                    //window.location.href = "/container";
                }
                else {
                    Swal.fire({
                        type: 'error',
                        title: 'Process fail',
                        text: res.Msg
                    });
                }
            },
            error: function (err) {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: err
                });
            }
        });
    }
}

function PrintPallet(item) {
    if ($('#issave').val() != '1') {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            html: 'Vui lòng lưu trước khi in Shipping Label<br/>Please save Prod.PKL before print'
        });
        return false;
    }
    var $tr = $(item).closest('tr');
    var $itemPrint = $(item);
    var id = $tr.attr('data-item');
    var url = '/pallet/LoadPrint';
    var method = 'POST';
    $.ajax({
        method: method,
        url: url,
        data: { id: id },
        success: function (res) {
            unBlockUI();
            if (res.IsOk) {
                printShippingMark(res.dataObj);
                $itemPrint.remove();
            }
            else {
                if (res.Msg.toUpperCase().indexOf('NAME DUPLICATE') >= 0) {
                    Swal.fire({
                        type: 'error',
                        title: 'Process fail',
                        text: 'Mã Pallet bị trùng, vui lòng click nút làm mới kế bên Pallet No để lấy lại số pallet mới'
                    });
                }
                else {
                    Swal.fire({
                        type: 'error',
                        title: 'Process fail',
                        text: res.Msg
                    });
                }
            }
        }
    });
}

function printShippingMark(content) {
    w = window.open();
    var css = '@@media print {body { width: 105mm }} @@page { size: A6 portrait; margin: 0;} body{ width: 105mm; height: 130mm; }';
    head = w.document.head || w.document.getElementsByTagName('head')[0];
    style = w.document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(w.document.createTextNode(css));
    }
    head.appendChild(style);
    w.document.write(content);
    $(w.document).imagesLoaded().then(function () {
        w.print();
        w.close();
    });
}

function filtercontract() {
    var table = [];
    $('#table tbody').find('tr').each(function () {
        table.push($(this).attr('data-item'));
    });
    var datacontract = $('#CONTRACTNUMBER').attr('selectedvalue');
    $.ajax({
        method: 'POST',
        url: '/contract/getfilter',
        data: { list: table, contractcode: datacontract },
        success: function (res) {
            var $list = $('#CONTRACTNUMBER');
            $list.html('');
            if (res.IsOk) {
                if (res.dataObj == null) {
                    var $optionsList = [];
                    var $nullableoption = $('<option value=""> -- Select Contract -- </option>');
                    $optionsList.push($nullableoption);
                    for (var i = 0; i < $optionsList.length; i++) {
                        $list.append($optionsList[i]);
                    }
                    return;
                }
                var $optionsList = [];
                var $nullableoption = $('<option value=""> -- Select Contract -- </option>');
                $optionsList.push($nullableoption);
                if (res.dataObj != undefined) {
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.CONTRACTCODE + '">' + item.CONTRACTCODE + '</option>');
                        $optionsList.push($option);
                    }
                }
                for (var i = 0; i < $optionsList.length; i++) {
                    $list.append($optionsList[i]);
                }
                if ($list.attr('selectedvalue') != undefined) {
                    $list.val($list.attr('selectedvalue'));
                }
            }
            else {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: res.Msg
                });
            }
            GetNameCustomer();
            $list.on('change', function () {
                GetNameCustomer();
            });
        }
    });
}

function GetNameCustomer() {
    var $list = $('#CONTRACTNUMBER');
    var dataList = $list.val();
    $.ajax({
        url: '/contract/getcustomercontract',
        type: 'POST',
        data: { contractcode: dataList },
        success: function (res) {
            if (res.IsOk) {
                $('#CUSTOMERSHOW').val(res.dataObj);
            }
        }
    });
}

function DetectCheckAll(item) {
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

async function PrintMultiple() {
    var count = 0;
    $('#table tbody tr').find('input[type=checkbox]').each(function () {
        if ($(this).is(':checked'))
            count++;
    });
    if (count > 0) {
        var printhtml = '';
        var lstPrintData = $('#table tbody tr');
        for (var i = 0; i < lstPrintData.length; i++) {
            var $tr = $(lstPrintData[i]);
            if ($tr.find("input[type=checkbox]").is(":checked")) {
                var id = $tr.attr('data-item');
                var palletSingle = await GetPalletPrint(id);
                printhtml += palletSingle;
                if (i != lstPrintData.length - 1) {
                    printhtml += '<div style="clear:both;height: 36.5mm;"></div>';
                }
            }
        }
        w = window.open();
        var css = '@@media print {body { width: 105mm }} @@page { size: A6 portrait; margin: 0;} body{ width: 105mm; height: 130mm; }';
        head = w.document.head || w.document.getElementsByTagName('head')[0];
        style = w.document.createElement('style');
        style.type = 'text/css';
        style.media = 'print';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(w.document.createTextNode(css));
        }
        head.appendChild(style);
        w.document.write(printhtml);
        $(w.document).imagesLoaded().then(function () {
            w.print();
            w.close();
        });
    }
}


async function GetPalletPrint(idpallet) {
    var res = await CallGetPrint('/pallet/LoadPrint', idpallet);
    if (res.IsOk) {
        return res.dataObj;
    }
    else {
        return '';
    }
}

async function CallGetPrint(url, data) {
    var res = await $.ajax({
        url: url,
        type: 'POST',
        async: true,
        cache: false,
        data: { id: data }
    });
    return res;
}