function LoadResaName() {
    $.ajax({
        method: 'POST',
        url: '/resa/generatename',
        data: { prefix: $('select[name=TYPE]').val() },
        success: function (res) {
            if (res.IsOk) {
                $('input[name=RESACODE]').val(res.dataObj);
            }
            else {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: res.Msg
                });
            }
        }
    });
}

function CheckValidTrimTable() {
    var resaData = $('select[name=TRIMTABLE]').val();
    var resacode = $('input[name=RESACODE]').val();
    $.ajax({
        method: 'POST',
        url: '/resa/checkvalidtrimtable',
        data: { trimname: resaData, resacode: resacode },
        success: function (res) {
            if (!res.IsOk) {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: 'This trim table is not done resa yet'
                });
            }
        }
    });
}


function CheckValidSelectTable() {
    var resaData = $('select[name=SELECTTABLE]').val();
    var resacode = $('input[name=RESACODE]').val();
    $.ajax({
        method: 'POST',
        url: '/resa/checkvalidselecttable',
        data: { selectname: resaData, resacode: resacode },
        success: function (res) {
            if (!res.IsOk) {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: 'This select table is not done resa yet'
                });
            }
        }
    });
}


function CheckValidShoulderTable() {
    var resaData = $('select[name=SHOULDERTABLE]').val();
    var resacode = $('input[name=RESACODE]').val();
    $.ajax({
        method: 'POST',
        url: '/resa/checkvalidshouldertable',
        data: { shouldertable: resaData, resacode: resacode },
        success: function (res) {
            if (!res.IsOk) {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: 'This shoulder table is not done resa yet'
                });
            }
        }
    });
}

function DoneResa() {
    Swal.fire({
        title: 'Are you sure to done this Resa?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, done Resa!'
    }).then((result) => {
        if (result.value) {
            var resadata = {};
            $('#detail').find('input, textarea, select').each(function () {
                resadata[$(this).attr('name')] = $(this).val();
            });
            //if ($('input[name=ISDONE]').is(':checked')) {
            //    resadata['ISDONE'] = true;
            //}
            //else {
            //    resadata['ISDONE'] = false;
            //}
            resadata['ISDONE'] = true;
            var tableimp = [];
            $('#tableimp tbody').find('tr').each(function () {
                tableimp.push($(this).attr('data-item'));
            });
            var tablesemi = [];
            $('#tablesemi tbody').find('tr').each(function () {
                tablesemi.push($(this).attr('data-item'));
            });
            switch (resadata["TYPE"]) {
                case "0":
                    Swal.fire({
                        type: 'error',
                        title: 'Process fail',
                        text: 'Type resa is required'
                    });
                    return;
                case "1":
                    resadata['TRIMTABLE'] = '';
                    break;
                case "2":
                    break;
            }
            $.ajax({
                method: 'POST',
                url: '/resa/doneresa',
                data: { info: resadata, listimp: tableimp, listsemi: tablesemi },
                success: function (res) {
                    if (res.IsOk) {
                        Swal.fire(
                            'Save data successful',
                            '',
                            'Ok'
                        );
                        var datanotify =
                        {
                            TYPE: "RESA",
                            URL: "/resa/detail?id=" + resadata["RESACODE"],
                            MESSAGE: "Resa " + resadata["RESACODE"] + " has done by " + loginUser.USERNAME,
                            USERCREATED: loginUser.USERNAME
                        };
                        socket.emit('pushnotification', datanotify);
                        window.location.href = '/resa';
                    }
                    else {
                        Swal.fire({
                            type: 'error',
                            title: 'Process fail',
                            text: res.Msg
                        });
                    }
                }
            });
        }
    });
}

function SaveResa() {
    var resadata = {};
    $('#detail').find('input, textarea, select').each(function () {
        resadata[$(this).attr('name')] = $(this).val();
    });
    if ($('input[name=ISDONE]').is(':checked')) {
        resadata['ISDONE'] = true;
    }
    else {
        resadata['ISDONE'] = false;
    }

    if ($('input[name=ISCHECK]').is(':checked')) {
        resadata['ISCHECK'] = true;
    }
    else {
        resadata['ISCHECK'] = false;
    }
    var tableimp = [];
    $('#tableimp tbody').find('tr').each(function () {
        tableimp.push($(this).attr('data-item'));
    });
    var tablesemi = [];
    $('#tablesemi tbody').find('tr').each(function () {
        tablesemi.push($(this).attr('data-item'));
    });
    switch (resadata["TYPE"]) {
        case "0":
            Swal.fire({
                type: 'error',
                title: 'Process fail',
                text: 'Type resa is required'
            });
            return;
        case "1":
            resadata['TRIMTABLE'] = '';
            break;
        case "2":
            break;
    }
    $.ajax({
        method: 'POST',
        url: '/resa/save',
        data: { info: resadata, listimp: tableimp, listsemi: tablesemi, resatable: GetDataResaTable() },
        success: function (res) {
            if (res.IsOk) {
                Swal.fire(
                    'Save data successful',
                    '',
                    'Ok'
                );
                window.location.href = '/resa';
            }
            else {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: res.Msg
                });
            }
        }
    });
}


function getListPallet() {
    $.ajax({
        method: 'POST',
        url: '/resa/getlistPalletResaImported',
        data: { resacode: $('#RESACODE').val() },
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
                        var $li = $('<li style="display: none;" data-id="' + $item.ID + '" data-pcs="' + $item.PCS + '" data-material="' + $item.MATERIALID + '" data-submaterial="' + $item.SUBMATERIALID + '" data-sqft="' + $item.SQFT + '" data-impfile="' + $item.IMPFILEID + '" data-cnt="' + $item.IMPORTPKL + '" data-fullname="' + $item.MaterialFull + '" data-nw="' + $item.NW + '" data-donecode="' + $item.PALLETDONECODE + '" class="ui-state-highlight" ondblclick="LoadPop(this)">' + $item.NAME + '</li>');
                        //var $li = $('<li data-id="' + $item.ID + '" data-layer="' + $item.HIDE + '" data-selection="' + $item.SELECTION + '" data-subsel="' + $item.SUBSELECTION + '" data-sqft="' + $item.SQUAREFOOT + '" data-gw="' + $item.GROSSWEIGHT + '" data-nw="' + $item.NETWEIGHT + '" data-resa="' + $item.RESACODE + '" data-indexresa="' + $item.INDEXRESA + '" class="ui-state-highlight" style="display: none;" ondblclick="LoadPop(this)">' + $item.NAME + '</li>');

                        $liList.push($li);
                        var index = i + 1;
                        var id = $item.ID;
                        var nw = parseFloat($item.NW);
                        var material = $item.MATERIALID;
                        var submaterial = $item.SUBMATERIALID == null ? "" : $item.SUBMATERIALID;
                        var sqft = $item.SQFT == null ? "" : $item.SQFT;
                        var pcs = $item.PCS == null ? "" : $item.PCS;
                        var cnt = $item.IMPORTPKL;
                        var impfile = $item.IMPFILEID;
                        var name = $item.NAME;
                        var fullMaterialName = $item.MaterialFull;

                        //var id = $item.ID;
                        //var nw = parseFloat($item.NW);
                        //var gw = $item.GROSSWEIGHT;
                        //var material = $item.SELECTION;
                        //var subsel = $item.SUBSELECTION == null ? "" : $item.SUBSELECTION;
                        //var sqft = $item.SQUAREFOOT == null ? "" : $item.SQUAREFOOT;
                        //var layer = $item.HIDE == null ? "" : $item.HIDE;
                        //var name = $item.NAME;
                        //var resa = $item.RESACODE;
                        //var resaNo = $item.INDEXRESA;
                        //var selFull = selection + " " + subsel;
                        //var $tr = $('<tr data-item="' + id + '"><td>' + index + '</td><td>' + fullMaterialName + '</td><td>' + name + '</td><td>' + cnt + '</td><td>' + impfile + '</td><td style="text-align: right;">' + pcs + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + sqft + '</td><td><button type="button"><span class="icon-play" onclick="RemoveSelect(this)"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td></tr>');
                        var $tr = $('<tr data-item="' + id + '"><td>' + index + '</td><td>' + fullMaterialName + '</td><td>' + name + '</td><td style="text-align: right;">' + pcs + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + sqft + '</td><td><button type="button" onclick="RemoveSelect(this)"><span class="icon-play"></span></button></td></tr>');
                        $('#tableimp tbody').append($tr);
                    }
                }
                for (var i = 0; i < $liList.length; i++) {
                    $('#container').append($liList[i]);
                }
            }
            CalcTotalDetailResa();
        }
    });
}

function ShowUpLoadPage(item) {
    var $item = $(item);
    ActiveChosen($item);
    LoadPalletUnsign();
}



function LoadPalletUnsign() {
    var importcontainer = $('#importContainer').chosen().val();
    $.ajax({
        method: 'POST',
        url: '/resa/getlistpalletunsigncontainer',
        data: { cnt: importcontainer },
        success: function (res) {
            $('#palletunsign').html('');
            if (res.IsOk) {
                if (res.dataObj != undefined) {
                    if (res.dataObj == null) {
                        return;
                    }

                    var $lstGroup = [];
                    var $lstFinal = [];
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $itemGroup = { MaterialFull: item.MaterialFull, IMPORTPKL: item.IMPORTPKL };
                        if ($lstGroup.length == 0) {
                            $lstGroup.push($itemGroup);
                        }
                        else if ($lstGroup.filter(x => x.MaterialFull == item.MaterialFull).length == 0) {
                            $lstGroup.push($itemGroup);
                        }
                    }
                    for (var j = 0; j < $lstGroup.length; j++) {
                        var lst = res.dataObj.filter(x => x.MaterialFull == $lstGroup[j].MaterialFull);
                        var $group = $('<ul namecnt="' + $lstGroup[j].IMPORTPKL + '" namegroup="' + $lstGroup[j].MaterialFull + '" group="cnt" class="connectedSortable"></ul>');
                        var $title = $('<div class="title">' + $lstGroup[j].MaterialFull + '</div>');
                        //$group.append($('<div class="title">' + $lstGroup[j] + '</div>'));
                        var $liList = [];
                        for (var i = 0; i < lst.length; i++) {
                            var item = lst[i];
                            if ($('#container').find('li[data-id="' + item.ID + '"]').length == 0) {
                                var $li = $('<li data-id="' + item.ID + '" data-pcs="' + item.PCS + '" data-material="' + item.MATERIALID + '" data-submaterial="' + item.SUBMATERIALID + '" data-sqft="' + item.SQFT + '" data-impfile="' + item.IMPFILEID + '" data-cnt="' + item.IMPORTPKL + '" data-fullname="' + item.MaterialFull + '" data-nw="' + item.NW + '" data-donecode="' + item.PALLETDONECODE + '" class="ui-state-highlight" ondblclick="LoadPop(this)">' + item.PALLETDONECODE + '</li>');
                                $group.append($li);
                                //$liList.push($li);
                            }
                        }
                        var $separetor = $('<div style="clear:both"></div>');
                        var $content = $('<div></div>');
                        $content.append($title);
                        $content.append($group);
                        $content.append($separetor);
                        $liList.push($content);
                        //$group.push($liList);
                        $lstFinal.push($liList);
                    }
                    for (var i = 0; i < $lstFinal.length; i++) {
                        $('#palletunsign').append($lstFinal[i]);
                    }
                    //ActiveSortableItem($("#container"));
                    ActiveSortableItem($("#container, ul[group=cnt]"));
                    //$("ul[group=cnt]").sortable({
                    //    connectWith: [".connectedSortable"],
                    //    //beforeStop: getPosition,
                    //    receive: function (e, ui) {
                    //        //console.log(ui.item.closest('ul').attr('id'));
                    //        var $item = ui.item;
                    //        var id = ($item.attr('data-id') != "null" ? $item.attr('data-id') : "");
                    //        var nw = ($item.attr('data-nw') != "null" ? $item.attr('data-nw') : "0");
                    //        var gw = ($item.attr('data-gw') != "null" ? $item.attr('data-gw') : "0");
                    //        var selection = ($item.attr('data-selection') != "null" ? $item.attr('data-selection') : "");
                    //        var subsel = ($item.attr('data-subsel') != "null" ? $item.attr('data-subsel') : "");
                    //        var sqft = ($item.attr('data-sqft') != "null" ? $item.attr('data-sqft') : "");
                    //        var layer = ($item.attr('data-layer') != "null" ? $item.attr('data-layer') : "");
                    //        var resa = ($item.attr('data-resa') != "null" ? $item.attr('data-resa') : "");
                    //        var resaNo = ($item.attr('data-indexresa') != "null" ? $item.attr('data-indexresa') : "");
                    //        var name = $item.html();
                    //        var selFull = selection + " " + subsel;
                    //        var $tr = $('<tr data-item="' + id + '"><td>' + (ui.item.index() + 1).toString() + '</td><td>' + selFull + '</td><td>' + name + '</td><td style="text-align: right;">' + layer + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + gw + '</td><td style="text-align: right;">' + sqft + '</td><td>' + resa + '</td><td>' + resaNo + '</td><td><button type="button"><span class="icon-play" onclick="RemoveSelect(this)"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td></tr>');
                    //        $('#table tbody').append($tr);
                    //        var totalcurrent = parseFloat($('#TOTAL').val());
                    //        var maxweight = parseFloat($('#MAXWEIGHT').val());
                    //        totalcurrent += parseFloat(nw);
                    //        $('#TOTAL').val(totalcurrent);
                    //        $('#NUMBERPALLET').val((parseFloat($('#NUMBERPALLET').val()) + 1));
                    //        ui.item.hide();
                    //        if (totalcurrent > maxweight + 300) {
                    //            RemoveSelect($('#table tbody').find('tr[data-item="' + id + '"]').first().find('span'));
                    //            Swal.fire({
                    //                type: 'error',
                    //                title: 'Access Deny',
                    //                text: 'Out of maximum weight allowed'
                    //            });
                    //        }
                    //        filtercontract();
                    //    }
                    //}).disableSelection();
                }
            }
        }
    });
}

function ActiveSortableItem(item) {
    $(item).sortable({
        connectWith: [".connectedSortable"],
        //beforeStop: getPosition,
        receive: function (e, ui) {
            //var $li = $('<li data-id="' + item.ID + '" data-pcs="' + item.PCS + '" data-material="' + item.MATERIALID + '" data-submaterial="' + item.SUBMATERIALID + '" data-sqft="' + item.SQFT + '" data-fullname="' + item.MaterialFull + '" data-nw="' + item.NETWEIGHT + '" class="ui-state-highlight" ondblclick="LoadPop(this)">' + item.NAME + '</li>');
            //console.log(ui.item.closest('ul').attr('id'));
            var $item = ui.item;
            var id = ($item.attr('data-id') != "null" ? $item.attr('data-id') : "");
            var nw = ($item.attr('data-nw') != "null" ? $item.attr('data-nw') : "0");
            var material = ($item.attr('data-material') != "null" ? $item.attr('data-material') : "");
            var submaterial = ($item.attr('data-submaterial') != "null" ? $item.attr('data-submaterial') : "");
            var sqft = ($item.attr('data-sqft') != "null" ? $item.attr('data-sqft') : "");
            var pcs = ($item.attr('data-pcs') != "null" ? $item.attr('data-pcs') : "");
            var donecode = ($item.attr('data-donecode') != "null" ? $item.attr('data-donecode') : "");
            var cnt = ($item.attr('data-cnt') != "null" ? $item.attr('data-cnt') : "");
            var impfile = ($item.attr('data-impfile') != "null" ? $item.attr('data-impfile') : "");
            var name = $item.html();
            var fullMaterialName = ($item.attr('data-fullname') != "null" ? $item.attr('data-fullname') : "");
            //var $tr = $('<tr data-item="' + id + '"><td>' + (ui.item.index() + 1).toString() + '</td><td>' + fullMaterialName + '</td><td>' + name + '</td><td>' + cnt + '</td><td>' + impfile + '</td><td style="text-align: right;">' + pcs + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + sqft + '</td><td><button type="button"><span class="icon-play" onclick="RemoveSelect(this)"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td></tr>');

            var $tr = $('<tr data-item="' + id + '"><td>' + (ui.item.index() + 1).toString() + '</td><td>' + fullMaterialName + '</td><td>' + donecode + '</td><td style="text-align: right;">' + pcs + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + sqft + '</td><td><button type="button" onclick="RemoveSelect(this)"><span class="icon-play"></span></button></td></tr>');
            $('#tableimp tbody').append($tr);
            //var totalcurrent = parseFloat($('#TOTAL').val());
            //var maxweight = parseFloat($('#MAXWEIGHT').val());
            //totalcurrent += parseFloat(nw);
            //$('#TOTAL').val(totalcurrent);
            //$('#NUMBERPALLET').val((parseFloat($('#NUMBERPALLET').val()) + 1));
            ui.item.hide();
            //if (totalcurrent > maxweight + 300) {
            //    RemoveSelect($('#table tbody').find('tr[data-item="' + id + '"]').first().find('span'));
            //    Swal.fire({
            //        type: 'error',
            //        title: 'Access Deny',
            //        text: 'Out of maximum weight allowed'
            //    });
            //}
            //filtercontract();
        }
    }).disableSelection();
}

$(function () {
    //ActiveSortableItem($("#container"));

    //$("#container").sortable({
    //    connectWith: [".connectedSortable"],
    //    //beforeStop: getPosition,
    //    receive: function (e, ui) {
    //        console.log(ui.item.closest('ul').attr('id'));
    //        var $item = ui.item;
    //        var id = ($item.attr('data-id') != "null" ? $item.attr('data-id') : "");
    //        var nw = ($item.attr('data-nw') != "null" ? $item.attr('data-nw') : "0");
    //        var gw = ($item.attr('data-gw') != "null" ? $item.attr('data-gw') : "0");
    //        var selection = ($item.attr('data-selection') != "null" ? $item.attr('data-selection') : "");
    //        var subsel = ($item.attr('data-subsel') != "null" ? $item.attr('data-subsel') : "");
    //        var sqft = ($item.attr('data-sqft') != "null" ? $item.attr('data-sqft') : "");
    //        var layer = ($item.attr('data-layer') != "null" ? $item.attr('data-layer') : "");
    //        var resa = ($item.attr('data-resa') != "null" ? $item.attr('data-resa') : "");
    //        var resaNo = ($item.attr('data-indexresa') != "null" ? $item.attr('data-indexresa') : "");
    //        var name = $item.html();
    //        var selFull = selection + " " + subsel;
    //        var $tr = $('<tr data-item="' + id + '"><td>' + (ui.item.index() + 1).toString() + '</td><td>' + selFull + '</td><td>' + name + '</td><td style="text-align: right;">' + layer + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + gw + '</td><td style="text-align: right;">' + sqft + '</td><td>' + resa + '</td><td>' + resaNo + '</td><td><button type="button"><span class="icon-play" onclick="RemoveSelect(this)"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td></tr>');
    //        $('#table tbody').append($tr);
    //        var totalcurrent = parseFloat($('#TOTAL').val());
    //        var maxweight = parseFloat($('#MAXWEIGHT').val());
    //        totalcurrent += parseFloat(nw);
    //        $('#TOTAL').val(totalcurrent);
    //        $('#NUMBERPALLET').val((parseFloat($('#NUMBERPALLET').val()) + 1));
    //        ui.item.hide();
    //        if (totalcurrent > maxweight + 300) {
    //            RemoveSelect($('#table tbody').find('tr[data-item="' + id + '"]').first().find('span'));
    //            Swal.fire({
    //                type: 'error',
    //                title: 'Access Deny',
    //                text: 'Out of maximum weight allowed'
    //            });
    //        }
    //        filtercontract();
    //    }
    //}).disableSelection();
});

function ActiveChosen(item) {
    $(item).chosen();
    $(item).on('change', function (e) {
        LoadPalletUnsign();
    });
}

function RemoveSelect(item) {
    var $tr = $(item).closest('tr');
    var $li = $('#container').find('li[data-id="' + $tr.attr('data-item') + '"]');
    //var nw = $li.attr('data-nw');
    var fullname = $li.attr('data-fullname');
    var cnt = $li.attr('data-cnt');
    $('#palletunsign ul[group=cnt][namegroup="' + fullname + '"][namecnt="' + cnt + '"]').append($li);
    $('#palletunsign').find('li[data-id="' + $tr.attr('data-item') + '"]').show();
    //var totalcurrent = parseFloat($('#TOTAL').val());
    //totalcurrent = totalcurrent - parseFloat(nw);
    //$('#TOTAL').val(totalcurrent);
    $('#container').find('li[data-id="' + $tr.attr('data-item') + '"]').remove();
    //$('#NUMBERPALLET').val((parseFloat($('#NUMBERPALLET').val()) - 1));
    $tr.remove();
    //filtercontract();
}

function CheckType(item) {
    var $item = $(item);
    var valuedata = $item.val();
    switch (valuedata) {
        case "0":
            $('#trimrequired').hide();
            $('#selectrequired').hide();
            $('#shoulderrequired').hide();
            break;
        case "1":
            $('#selectrequired').show();
            $('#trimrequired').hide();
            $('#shoulderrequired').hide();
            CheckValidSelectTable();
            break;
        case "2":
            $('#trimrequired').show();
            $('#selectrequired').hide();
            $('#shoulderrequired').hide();
            CheckValidTrimTable();
            break;
        case "3":
            $('#trimrequired').hide();
            $('#selectrequired').hide();
            $('#shoulderrequired').show();
            CheckValidShoulderTable();
            break;
    }
    LoadResaName();
}

function ApproveSource() {
    var sourcedata = $('#sourcePallet').val();
    switch (sourcedata) {
        case "0":
            Swal.fire({
                type: 'error',
                title: 'Process fail',
                text: 'Please choose source Pallet'
            });
            return;
        case "1":
            $('#srcImport').show();
            ShowUpLoadPage($('#importContainer'));
            break;
        case "2":
            $('#srcSemiProduction').show();
            getListSemiProduct();
            ActiveDragDropSemi();
            break;

    }
    $('#sourceChosen').remove();
}

function getListSemiProduct() {
    var resa = $('#RESACODE').val();
    $.ajax({
        method: 'POST',
        url: '/pallet/getlistSemiProduct',
        data: { resacode: resa },
        success: function (res) {
            if (res.IsOk) {
                if (res.dataObj != undefined) {
                    if (res.dataObj == null) {
                        return;
                    }
                    var $liList = [];
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        if ($('#containersemi').find('li[data-id="' + item.ID + '"]').length == 0) {
                            var $li = $('<li data-id="' + item.ID + '" data-layer="' + item.HIDE + '" data-selection="' + item.SELECTION + '" data-subsel="' + item.SUBSELECTION + '" data-sqft="' + item.SQUAREFOOT + '" data-gw="' + item.GROSSWEIGHT + '" data-nw="' + item.NETWEIGHT + '" data-resa="' + item.RESACODE + '" data-indexresa="' + item.INDEXRESA + '"  class="ui-state-highlight" ondblclick="LoadPop(this)">' + item.NAME + '</li>');
                            $liList.push($li);
                        }
                    }
                    for (var i = 0; i < $liList.length; i++) {
                        $('#palletsemiunsign').append($liList[i]);

                    }
                }
            }
        }
    });
}

function ActiveDragDropSemi() {
    $("#containersemi, #palletsemiunsign").sortable({
        connectWith: [".connectedTable", ".connectedSortable2"],
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
            var $tr = $('<tr data-item="' + id + '"><td>' + (ui.item.index() + 1).toString() + '</td><td>' + selFull + '</td><td>' + name + '</td><td style="text-align: right;">' + layer + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + gw + '</td><td style="text-align: right;">' + sqft + '</td><td>' + resa + '</td><td>' + resaNo + '</td><td><button type="button" onclick="RemoveSelect(this)"><span class="icon-play"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td></tr>');
            $('#tablesemi tbody').append($tr);
            ui.item.hide();
        }
    }).disableSelection();
}


function getListSemiImported() {
    $.ajax({
        method: 'POST',
        url: '/pallet/getlistSemiImported',
        data: { resacode: $('#RESACODE').val() },
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
                    if ($('#containersemi').find('li[data-id="' + $item.ID + '"]').length == 0) {
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
                        var $tr = $('<tr data-item="' + id + '"><td>' + index + '</td><td>' + selFull + '</td><td>' + name + '</td><td style="text-align: right;">' + layer + '</td><td style="text-align: right;">' + nw + '</td><td style="text-align: right;">' + gw + '</td><td style="text-align: right;">' + sqft + '</td><td>' + resa + '</td><td>' + resaNo + '</td><td><button type="button" onclick="RemoveSelect(this)"><span class="icon-play"></span></button></td><td><button type="button"><span class="icon-print" onclick="PrintPallet(this)"></span></button></td></tr>');
                        $('#tablesemi tbody').append($tr);
                    }
                }
                for (var i = 0; i < $liList.length; i++) {
                    $('#containersemi').append($liList[i]);
                }
            }
            CalcTotalDetailResa();
        }
    });
}

function SearchFilterResaStart() {
    var lststartResa = $('#resastartfilter').chosen().val();
    $.ajax({
        url: '/resa/searchfilterresastart',
        type: 'POST',
        success: function (res) {
            if (res.IsOk) {
                $('#resastartList').find(' tbody tr').each(function () {
                    if (res.dataObj.filter(x => x.ID == $(this).attr('idname')).length == 0) {
                        $(this).hide();
                    }
                });
            }
        }
    });
}

function GetDataResaTable() {
    var $table = $('#resatable');
    var resadetaillist = [];
    var groupSelection = [];
    $table.find('tbody tr').each(function () {
        var namegroup = $(this).attr('name');
        if (groupSelection.length == 0) {
            groupSelection.push(namegroup);
        }
        else if (groupSelection.filter(x => x == namegroup).length == 0) {
            groupSelection.push(namegroup);
        }
    });
    groupSelection.forEach(group => {
        var endresadata = {};
        endresadata['RESACODE'] = $('#RESACODE').val();
        endresadata['IDENDRESA'] = $table.find('tbody tr[name=' + group + ']').find('input[name=IDENDRESA]').val();
        endresadata['MERGESELECTIONID'] = $table.find('tbody tr[name=' + group + ']').find('input[name=MERGESELECTIONID]').val();
        endresadata['SELECTIONID'] = $table.find('tbody tr[name=' + group + ']').find('input[name=SELECTIONID]').val();
        endresadata['LISTSTARTID'] = $table.find('tbody tr[name=' + group + ']').find('input[name=LISTSTARTID]').val();
        endresadata['SUBSELECTIONID'] = $table.find('tbody tr[name=' + group + ']').find('input[name=SUBSELECTIONID]').val();
        endresadata['ENDPCS'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=ENDPCS]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=ENDPCS]').val() : 0);
        endresadata['ENDNW'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=ENDNW]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=ENDNW]').val() : 0);
        endresadata['ENDSQFT'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=ENDSQFT]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=ENDSQFT]').val() : 0);
        endresadata['PCS'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=PCS]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=PCS]').val() : 0);
        endresadata['NW'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=NW]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=NW]').val() : 0);
        endresadata['SQFT'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=SQFT]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=SQFT]').val() : 0);
        endresadata['totalpcs'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=totalpcs]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=totalpcs]').val() : 0);
        endresadata['totalnw'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=totalnw]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=totalnw]').val() : 0);
        endresadata['totalsqft'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=totalsqft]').length > 0 ? $table.find('tbody tr[name=' + group + ']').find('input[name=totalsqft]').val() : 0);
        resadetaillist.push(endresadata);
    });
    return resadetaillist;
}

function ShowTableResaStart() {
    $('#containresastart').show();
}

function ActiveFilterStart() {
    $('#resastartfilter').chosen();
    $('#resastartfilter').chosen().change(function () {
        SearchFilterResaStart();
    });
}

function AddRowResaStart(item) {
    var $table = $('#resatable');
    var data = {};
    var $item = $(item);
    var $tr = $item.closest('tr');
    data['ID'] = $tr.attr('idname');
    data['NAME'] = $tr.find('input[name=NAME]').val();
    data['SELECTIONID'] = $tr.find('input[name=SELECTIONID]').val();
    data['SUBSELECTIONID'] = $tr.find('input[name=SUBSELECTIONID]').val();
    data['SELECTIONFULL'] = $tr.find('input[name=SELECTIONFULL]').chosen().val();
    data['NW'] = parseFloat($tr.find('input[name=NW]').val());
    data['PCS'] = parseFloat($tr.find('input[name=PCS]').val());
    data['SQFT'] = parseFloat($tr.find('input[name=SQFT]').val());
    data['MERGESELECTIONID'] = data['SELECTIONID'] + '_' + data['SUBSELECTIONID'];
    var countcontent = 0;
    var datacolspan = $table.attr('datacolspan') == "0" ? "1" : $table.attr('datacolspan');
    $table.find('input[name=MERGESELECTIONID]').each(function () {
        if ($(this).val() == data['MERGESELECTIONID'])
            countcontent++;
    });
    if (countcontent > 0) {
        var group = data['MERGESELECTIONID'];
        var endresadata = {};
        endresadata['RESACODE'] = $('#RESACODE').val();
        endresadata['IDENDRESA'] = $table.find('tbody tr[name=' + group + ']').attr('idendresa') == undefined ? '' : $table.find('tbody tr[name=' + group + ']').attr('idendresa');
        endresadata['MERGESELECTIONID'] = $table.find('tbody tr[name=' + group + ']').find('input[name=MERGESELECTIONID]').val();
        endresadata['SELECTIONID'] = $table.find('tbody tr[name=' + group + ']').find('input[name=SELECTIONID]').val();
        endresadata['LISTSTARTID'] = $table.find('tbody tr[name=' + group + ']').find('input[name=LISTSTARTID]').val();
        endresadata['SUBSELECTIONID'] = $table.find('tbody tr[name=' + group + ']').find('input[name=SUBSELECTIONID]').val();
        endresadata['ENDPCS'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=ENDPCS]').val());
        endresadata['ENDNW'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=ENDNW]').val());
        endresadata['ENDSQFT'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=ENDSQFT]').val());
        endresadata['PCS'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=PCS]').val());
        endresadata['NW'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=NW]').val());
        endresadata['SQFT'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=SQFT]').val());
        endresadata['STARTPCS'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=STARTPCS]').val());
        endresadata['STARTNW'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=STARTNW]').val());
        endresadata['STARTSQFT'] = parseFloat($table.find('tbody tr[name=' + group + ']').find('input[name=STARTSQFT]').val());

        endresadata['STARTPCS'] = endresadata['STARTPCS'] + data['PCS'];
        endresadata['STARTNW'] = endresadata['STARTNW'] + data['NW'];
        endresadata['STARTSQFT'] = endresadata['STARTSQFT'] + data['SQFT'];
        $table.find('tbody tr[name=' + group + ']').find('input[name=LISTSTARTID]').val($table.find('tbody tr[name=' + group + ']').find('input[name=LISTSTARTID]').val() + ';' + data['NAME']);
        $table.find('tbody tr[name=' + group + ']').find('input[name=STARTPCS]').val(endresadata['STARTPCS']);
        $table.find('tbody tr[name=' + group + ']').find('td[name=startpcs]').html(endresadata['STARTPCS']);
        $table.find('tbody tr[name=' + group + ']').find('input[name=STARTNW]').val(endresadata['STARTNW']);
        $table.find('tbody tr[name=' + group + ']').find('td[name=startnw]').html(endresadata['STARTNW']);
        $table.find('tbody tr[name=' + group + ']').find('input[name=STARTSQFT]').val(endresadata['STARTSQFT']);
        $table.find('tbody tr[name=' + group + ']').find('td[name=startsqft]').html(endresadata['STARTSQFT']);

    }
    else {
        var html = '';
        html += '<tr name="' + data['MERGESELECTIONID'] + '">';
        html += '<td style="background-color: #e6eef1;font-weight: bold;" rowspan="3">';
        html += '<input type="hidden" group="' + data['MERGESELECTIONID'] + '" name="LISTSTARTID" value="' + data['NAME'] + '" />';
        html += '<input type="hidden" name="MERGESELECTIONID" group="' + data['MERGESELECTIONID'] + '" value="' + data['MERGESELECTIONID'] + '" />';
        html += '<input type="hidden" name="SELECTIONID" group="' + data['MERGESELECTIONID'] + '" value="' + data['SELECTIONID'] + '" />';
        html += '<input type="hidden" name="SUBSELECTIONID" group="' + data['MERGESELECTIONID'] + '" value="' + data['SUBSELECTIONID'] + '" />';
        html += '<input type="hidden" group="' + data['MERGESELECTIONID'] + '" name="STARTPCS" value="' + data['PCS'] + '">';
        html += '<input type="hidden" group="' + data['MERGESELECTIONID'] + '" name="STARTNW" value="' + data['NW'] + '">';
        html += '<input type="hidden" group="' + data['MERGESELECTIONID'] + '" name="STARTSQFT" value="' + data['SQFT'] + '">';
        html += '<input type="hidden" group="' + data['MERGESELECTIONID'] + '" name="totalpcs" value="-' + data['PCS'] + '">';
        html += '<input type="hidden" group="' + data['MERGESELECTIONID'] + '" name="totalnw" value="-' + data['NW'] + '">';
        html += '<input type="hidden" group="' + data['MERGESELECTIONID'] + '" name="totalsqft" value="-' + data['SQFT'] + '">';
        html += '<input type="hidden" group="' + data['MERGESELECTIONID'] + '" name="IDENDRESA" value="">';
        html += data['SELECTIONFULL'];
        html += '</td>';
        html += '<td style="background-color: #e6eef1;font-weight: bold;" name="startpcs">' + data['PCS'] + '</td>';
        for (var i = 0; i < parseInt(datacolspan); i++) {
            html += '<td style="background-color: #e6eef1;font-weight: bold;">-</td>';
        }
        html += '<td style="background-color: #e6eef1;font-weight: bold;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="ENDRESA" name="ENDPCS" type="number" value="0" /></td>';
        html += '<td style="background-color: #e6eef1;font-weight: bold;" name="selectionresultpcs">0</td>';
        html += '<td style="background-color: #e6eef1;font-weight: bold;"></td>';
        html += '<td style="background-color: #e6eef1;font-weight: bold;"></td>';
        html += '</tr>';


        html += '<tr name="' + data['MERGESELECTIONID'] + '">';
        html += '<td style="background-color:#bac2c5;" name="startnw">' + data['NW'] + '</td>';
        for (var i = 0; i < parseInt(datacolspan); i++) {
            html += '<td style="background-color:#bac2c5;">-</td>';
        }
        html += '<td style="background-color:#bac2c5;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + data['MERGESELECTIONID'] + '" name="ENDNW" type="number" value="0" /></td>';
        html += '<td style="background-color:#bac2c5;"></td>';
        html += '<td style="background-color:#bac2c5;" name="selectionresultnw">0</td>';
        html += '<td style="background-color:#bac2c5;"></td>';
        html += '</tr>';


        html += '<tr name="' + data['MERGESELECTIONID'] + '">';
        html += '<td style="background-color: #83a0a5;" name="startsqft">' + data['SQFT'] + '</td>';
        for (var i = 0; i < parseInt(datacolspan); i++) {
            html += '<td style="background-color: #83a0a5;">-</td>';
        }
        html += '<td style="background-color: #83a0a5;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + data['MERGESELECTIONID'] + '" name="ENDSQFT" type="number" value="0" /></td>';
        html += '<td style="background-color: #83a0a5;"></td>';
        html += '<td style="background-color: #83a0a5;"></td>';
        html += '<td style="background-color: #83a0a5;" name="selectionresultsqft">0</td>';
        html += '</tr>';
        $table.find('tbody').append(html);
    }
    $tr.remove();
    CalcTotalTableResa();
}



function ActiveChoseFilter(item) {
    var $item = $(item);
    $item.chosen();
    $item.chosen().change(function () {
        var filt = $(this).val();
        var arr = '';
        filt.forEach(el => {
            arr += el + ',';
        });
        arr = arr.substr(0, arr.length - 1);
        BuilResaTableJS();
        //$.ajax({
        //    url: '/resa/resatablefilterjs',
        //    type: 'GET',
        //    data: { resacode: $('#RESACODE').val(), listfilter: arr },
        //    success: function (res) {
        //        $('#resatable')[0].outerHTML = res;
        //    },
        //    error: function (res) {
        //    }
        //});
    });
}

function ShowResaInsertResa() {
    if ($("#filtertable").val().length < 3) {
        var filt = ["PCS", "KGS", "SQFT"];
        $('#filtertable').val(filt).trigger("chosen:updated");
        var arr = '';
        filt.forEach(el => {
            arr += el + ',';
        });
        arr = arr.substr(0, arr.length - 1);
        BuilResaTableJS(true);
        //$.ajax({
        //    url: '/resa/resatablefilterjs',
        //    type: 'GET',
        //    data: { resacode: $('#RESACODE').val(), listfilter: arr },
        //    success: function (res) {
        //        $('#resatable')[0].outerHTML = res;
        //        $('#resatable').find('tfoot').show();
        //    },
        //    error: function (res) {
        //    }
        //});
    }
    else {
        $('#resatable').find('tfoot').show();
    }

}
function OutAddResaStartExtend() {
    $('#resatable').find('tfoot').hide();
}

function AddResaStartExtend() {
    var $table = $('#resatable');
    var datacolspan = $table.attr('datacolspan') == "0" ? "1" : $table.attr('datacolspan');
    var datarowspan = $table.attr('datarowspan');
    var $tfoot = $table.find('tfoot');
    var selectionfull = $tfoot.find('select[name=SELECTIONFULL]').chosen().val();
    var countcontent = 0;
    $table.find('input[name=MERGESELECTIONID]').each(function () {
        if ($(this).val() == selectionfull)
            countcontent++;
    });
    if (countcontent > 0) {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            text: 'Duplicate Selection on Table'
        });
        return;
    }
    //var selectionText = $tfoot.find('select[name=SELECTIONFULL] option:selected').text();
    var selectionText = $tfoot.find('select[name=SELECTIONFULL] option[value=' + $tfoot.find('select[name=SELECTIONFULL]').chosen().val() + ']').text();
    var selectionid = selectionfull.split('_')[0];
    var subselectionid = selectionfull.split('_')[1];
    var endpcs = $tfoot.find('input[name=ENDPCS]').val();
    var endnw = $tfoot.find('input[name=ENDNW]').val();
    var endsqft = $tfoot.find('input[name=ENDSQFT]').val();
    var html = '';

    html += '<tr name="' + selectionfull + '">';
    html += '<td style="background-color: #e6eef1;font-weight: bold;" rowspan="3">';
    html += '<input type="hidden" group="' + selectionfull + '" name="LISTSTARTID" value="" />';
    html += '<input type="hidden" name="MERGESELECTIONID" group="' + selectionfull + '" value="' + selectionfull + '" />';
    html += '<input type="hidden" name="SELECTIONID" group="' + selectionfull + '" value="' + selectionid + '" />';
    html += '<input type="hidden" name="SUBSELECTIONID" group="' + selectionfull + '" value="' + subselectionid + '" />';
    html += '<input type="hidden" group="' + selectionfull + '" name="STARTPCS" value="0">';
    html += '<input type="hidden" group="' + selectionfull + '" name="STARTNW" value="0">';
    html += '<input type="hidden" group="' + selectionfull + '" name="STARTSQFT" value="0">';
    html += '<input type="hidden" group="' + selectionfull + '" name="totalpcs" value="' + endpcs + '">';
    html += '<input type="hidden" group="' + selectionfull + '" name="totalnw" value="' + endnw + '">';
    html += '<input type="hidden" group="' + selectionfull + '" name="totalsqft" value="' + endsqft + '">';
    html += '<input type="hidden" group="' + selectionfull + '" name="IDENDRESA" value="">';
    html += selectionText;
    html += '</td>';
    html += '<td style="background-color: #e6eef1;font-weight: bold;" name="startpcs">0</td>';
    for (var i = 0; i < parseInt(datacolspan); i++) {
        html += '<td style="background-color: #e6eef1;font-weight: bold;">-</td>';
    }
    html += '<td style="background-color: #e6eef1;font-weight: bold;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + selectionfull + '" name="ENDPCS" type="number" value="' + endpcs + '" /></td>';
    html += '<td style="background-color: #e6eef1;font-weight: bold;" name="selectionresultpcs">' + endpcs + '</td>';
    html += '<td style="background-color: #e6eef1;font-weight: bold;"></td>';
    html += '<td style="background-color: #e6eef1;font-weight: bold;"></td>';
    html += '</tr>';


    html += '<tr name="' + selectionfull + '">';
    html += '<td style="background-color:#bac2c5;" name="startnw">0</td>';
    for (var i = 0; i < parseInt(datacolspan); i++) {
        html += '<td style="background-color:#bac2c5;">-</td>';
    }
    html += '<td style="background-color:#bac2c5;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + selectionfull + '" name="ENDNW" type="number" value="' + endnw + '" /></td>';
    html += '<td style="background-color:#bac2c5;"></td>';
    html += '<td style="background-color:#bac2c5;" name="selectionresultnw">' + endnw + '</td>';
    html += '<td style="background-color:#bac2c5;"></td>';
    html += '</tr>';


    html += '<tr name="' + selectionfull + '">';
    html += '<td style="background-color: #83a0a5;" name="startsqft">0</td>';
    for (var i = 0; i < parseInt(datacolspan); i++) {
        html += '<td style="background-color: #83a0a5;">-</td>';
    }
    html += '<td style="background-color: #83a0a5;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + selectionfull + '" name="ENDSQFT" type="number" value="' + endsqft + '" /></td>';
    html += '<td style="background-color: #83a0a5;"></td>';
    html += '<td style="background-color: #83a0a5;"></td>';
    html += '<td style="background-color: #83a0a5;" name="selectionresultsqft">' + endsqft + '</td>';
    html += '</tr>';
    $table.find('tbody').append(html);
    $tfoot.hide();
}

function CalcTotalTableResa() {
    var $table = $('#resatable');
    var data = GetDataResaTable();
    var grandtotalpcs = 0;
    var grandtotalkgs = 0;
    var grandtotalsqft = 0;
    if (data.length > 0) {
        data.forEach(row => {
            var sumpcs = 0;
            var sumkgs = 0;
            var sumsqft = 0;
            $table.find('tbody tr[name=' + row['MERGESELECTIONID'] + ']').each(function () {
                $(this).find('input[name=PCS]').each(function () {
                    sumpcs += parseFloat($(this).val() != '' && $(this).val() != undefined ? $(this).val() : '0');
                });
                $(this).find('input[name=NW]').each(function () {
                    sumkgs += parseFloat($(this).val() != '' && $(this).val() != undefined ? $(this).val() : '0');
                });
                $(this).find('input[name=SQFT]').each(function () {
                    sumsqft += parseFloat($(this).val() != '' && $(this).val() != undefined ? $(this).val() : '0');
                });

            });
            var endresapcs = parseFloat($table.find('tbody input[group=' + row['MERGESELECTIONID'] + '][name=ENDPCS]').val());
            var endresakgs = parseFloat($table.find('tbody input[group=' + row['MERGESELECTIONID'] + '][name=ENDNW]').val());
            var endresasqft = parseFloat($table.find('tbody  input[group=' + row['MERGESELECTIONID'] + '][name=ENDSQFT]').val());

            var startresapcs = parseFloat($table.find('tbody input[group=' + row['MERGESELECTIONID'] + '][name=STARTPCS]').val());
            var startresakgs = parseFloat($table.find('tbody  input[group=' + row['MERGESELECTIONID'] + '][name=STARTNW]').val());
            var startresasqft = parseFloat($table.find('tbody  input[group=' + row['MERGESELECTIONID'] + '][name=STARTSQFT]').val());

            var resultpcsselection = sumpcs + endresapcs - startresapcs;
            var resultkgsselection = sumkgs + endresakgs - startresakgs;
            var resultsqftselection = sumsqft + endresasqft - startresasqft;
            $table.find('tbody tr[name=' + row['MERGESELECTIONID'] + '] td[name=selectionresultpcs]').html(resultpcsselection.toFixed(2));
            $table.find('tbody tr[name=' + row['MERGESELECTIONID'] + '] td[name=selectionresultnw]').html(resultkgsselection.toFixed(2));
            $table.find('tbody tr[name=' + row['MERGESELECTIONID'] + '] td[name=selectionresultsqft]').html(resultsqftselection.toFixed(2));


            $table.find('tbody tr[name=' + row['MERGESELECTIONID'] + '] input[name=totalpcs]').html(resultpcsselection);
            $table.find('tbody tr[name=' + row['MERGESELECTIONID'] + '] input[name=totalnw]').html(resultkgsselection);
            $table.find('tbody tr[name=' + row['MERGESELECTIONID'] + '] input[name=totalsqft]').html(resultsqftselection);
            if ($('select[name=TYPE]').val() == "2" && row['MERGESELECTIONID'].indexOf("5_") >= 0) {
                grandtotalpcs += 0;
            }
            else {
                grandtotalpcs += parseFloat(resultpcsselection);
            }
            //grandtotalpcs += parseFloat(resultpcsselection);
            grandtotalkgs += parseFloat(resultkgsselection);
            grandtotalsqft += parseFloat(resultsqftselection);
        });
    }
    $('input[name=grandtotalpcs]').val(grandtotalpcs);
    $('input[name=grandtotalkgs]').val(grandtotalkgs);
    $('input[name=grandtotalsqft]').val(grandtotalsqft);
    CalcRateResa();
}

function CalcTotalDetailResa() {
    var data = GetDataPallet();
    var pallettotalpcs = 0;
    var pallettotalkgs = 0;
    var pallettotalsqft = 0;
    if (data.length > 0) {
        data.forEach(row => {
            //if ($('select[name=TYPE]').val() == "2" && row['MERGESELECTIONID'].indexOf("5_") >= 0) {
            //    pallettotalpcs += 0;
            //}
            //else {
            //    pallettotalpcs += (row['layer'] != undefined ? parseFloat(row['layer']) : 0) + (row['pcs'] != undefined ? parseFloat(row['pcs']) : 0);
            //}
            pallettotalpcs += (row['layer'] != undefined ? parseFloat(row['layer']) : 0) + (row['pcs'] != undefined ? parseFloat(row['pcs']) : 0);
            pallettotalkgs += parseFloat(row['nw']);
            pallettotalsqft += parseFloat(row['sqft']);
        });
    }
    $('input[name=pallettotalpcs]').val(pallettotalpcs);
    $('input[name=pallettotalkgs]').val(pallettotalkgs);
    $('input[name=pallettotalsqft]').val(pallettotalsqft);
    CalcRateResa();
}

function GetDataPallet() {
    var lstdata = [];
    $('#containersemi, #container').find('li').each(function () {
        var $item = $(this);
        var data = {};
        var nw = ($item.attr('data-nw') != "null" ? $item.attr('data-nw') : "0");
        var sqft = ($item.attr('data-sqft') != "null" ? $item.attr('data-sqft') : "");
        var layer = ($item.attr('data-layer') != "null" ? $item.attr('data-layer') : "");
        var pcs = ($item.attr('data-pcs') != "null" ? $item.attr('data-pcs') : "");

        data['nw'] = nw;
        data['sqft'] = sqft;
        data['layer'] = layer;
        data['pcs'] = pcs;
        lstdata.push(data);
    });

    return lstdata;
}


function CalcRateResa() {
    var grandtotalpcs = parseFloat($('input[name=grandtotalpcs]').val());
    var grandtotalkgs = parseFloat($('input[name=grandtotalkgs]').val());
    var grandtotalsqft = parseFloat($('input[name=grandtotalsqft]').val());
    var pallettotalpcs = parseFloat($('input[name=pallettotalpcs]').val());
    var pallettotalkgs = parseFloat($('input[name=pallettotalkgs]').val());
    var pallettotalsqft = parseFloat($('input[name=pallettotalsqft]').val());
    var ratepcs = 0;
    var ratekgs = 0;
    var ratesqft = 0;
    ratepcs = grandtotalpcs - pallettotalpcs;
    ratekgs = grandtotalkgs - pallettotalkgs;
    ratesqft = grandtotalsqft - pallettotalsqft;

    $('input[name=ratepcs]').val(ratepcs);
    $('input[name=ratekgs]').val(ratekgs);
    $('input[name=ratesqft]').val(ratesqft);

    var percentpcs = 0;
    var percentkgs = 0;
    var percentsqft = 0;

    percentpcs = pallettotalpcs != 0 ? ratepcs / pallettotalpcs * 100 : 0;
    percentkgs = pallettotalkgs != 0 ? ratekgs / pallettotalkgs * 100 : 0;
    percentsqft = pallettotalsqft != 0 ? ratesqft / pallettotalsqft * 100 : 0;

    var resultLossGain = '';

    if (ratepcs > 0) {
        resultLossGain += 'Gain ' + ratepcs + ' PCS,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    else if (ratepcs < 0) {
        resultLossGain += 'Loss ' + ratepcs + ' PCS,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    if (ratekgs > 0) {
        resultLossGain += 'Gain ' + ratekgs + ' KGS,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    else if (ratekgs < 0) {
        resultLossGain += 'Loss ' + ratekgs + ' KGS,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    if (ratesqft > 0) {
        resultLossGain += 'Gain ' + ratesqft + ' SQFT,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    else if (ratesqft < 0) {
        resultLossGain += 'Loss ' + ratesqft + ' SQFT,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    resultLossGain = resultLossGain.substr(0, resultLossGain.length - 1);

    $('input[name=percentpcs]').val(percentpcs.toFixed(2) + " %");
    $('input[name=percentkgs]').val(percentkgs.toFixed(2) + " %");
    $('input[name=percentsqft]').val(percentsqft.toFixed(2) + " %");
    var resultconclude = 'PASS';
    if (Math.abs(percentpcs) > 3) {
        $('input[name=percentpcs]').addClass('error-valid');
        resultconclude = 'NOT PASS, CHECK YOUR RESA AGAIN';
    }
    else {
        $('input[name=percentpcs]').removeClass('error-valid');
    }
    if (percentkgs > 3) {
        $('input[name=percentkgs]').addClass('error-valid');
        resultconclude = 'NOT PASS, CHECK YOUR RESA AGAIN';
    }
    else {
        $('input[name=percentkgs]').removeClass('error-valid');
    }
    if (Math.abs(percentsqft) > 3) {
        $('input[name=percentsqft]').addClass('error-valid');
        resultconclude = 'NOT PASS, CHECK YOUR RESA AGAIN';
    }
    else {
        $('input[name=percentsqft]').removeClass('error-valid');
    }
    $('label[name=conclude]').html(resultLossGain + ' - ' + resultconclude);
}

function BuilResaTableJS(isshowfoot) {
    var resacode = $('input[name=RESACODE]').val();
    var listfilter = $('#filtertable').chosen().val();
    $.ajax({
        url: '/resa/resatablebuildjs',
        type: 'POST',
        data: { resacode: resacode, listfilter: listfilter.join(',') },
        success: function (res) {
            if (res.IsOk) {
                var listpallet = res.ProductionTable;
                var selectList = res.SelectInOne;
                var filter = res.listfilter.split(',');
                var startpallet = listpallet.filter(x => x.TYPE == 0);
                var productionpallet = listpallet.filter(x => x.TYPE == 1);
                var uncompletepallet = listpallet.filter(x => x.TYPE == 2);
                var numperrow = filter.length;
                var rowspan = 0;
                var tablerowspan;
                var tablecolspan = 10;
                var listselection = [];
                listpallet.forEach(row => {
                    if (listselection.length == 0) {
                        var data = { MERGESELECTIONID: row.MERGESELECTIONID, SELECTIONFULL: row.SELECTIONFULL, SELECTIONID: row.SELECTIONID, SUBSELECTIONID: row.SUBSELECTIONID };
                        listselection.push(data);
                    }
                    else if (listselection.filter(x => x.MERGESELECTIONID == row.MERGESELECTIONID).length == 0) {
                        var data = { MERGESELECTIONID: row.MERGESELECTIONID, SELECTIONFULL: row.SELECTIONFULL, SELECTIONID: row.SELECTIONID, SUBSELECTIONID: row.SUBSELECTIONID };
                        listselection.push(data);
                    }
                });
                var maxele = 0;
                listpallet.forEach(ele => {
                    var countmax = productionpallet.filter(x => x.MERGESELECTIONID == ele.MERGESELECTIONID).length;
                    if (countmax > maxele) {
                        maxele = countmax;
                    }
                });
                if (productionpallet.length > 10) {
                    rowspan = parseInt(productionpallet.length / 10);
                }
                else {
                    tablecolspan = maxele;
                }
                if (productionpallet.length % 10 > 0 || productionpallet.length == 10) {
                    rowspan++;
                }
                tablerowspan = tablerowspan > 0 ? rowspan * numperrow : numperrow;
                tablecolspan = tablecolspan > 0 ? tablecolspan : 1;
                var $table = $('<table id="resatable" class="table table-striped table-bordered table-hover" datacolspan="' + tablecolspan + '" datarowspan="' + tablerowspan + '"></table>');
                var $tableHeader = $table.append($(BuilTableHeadResa(tablecolspan)));

                var html = '';
                for (var i = 0; i < listselection.length; i++) {
                    var IsBindStart = 0;
                    var IsBindEnd = 0;
                    var IsBindSelectTitle = 0;
                    var IsBindTotal = 0;
                    //for (var filtercount = 0; filtercount < filter.length; filtercount++) {
                    //var currentFilter = filter[filtercount];
                    var select = listselection[i];
                    var start = startpallet.filter(x => x.MERGESELECTIONID == select.MERGESELECTIONID);
                    var listst = [];
                    start.forEach(e => { listst.push(e.NAME); });
                    var liststart = listst.join(';');
                    var production = productionpallet.filter(x => x.MERGESELECTIONID == select.MERGESELECTIONID);
                    var end = uncompletepallet.filter(x => x.MERGESELECTIONID == select.MERGESELECTIONID);
                    var rowspanselect = 0;
                    if (production.length > 10) {
                        rowspanselect = parseInt(production.length / 10);
                    }
                    if (production.length % 10 > 0 || production.length == 10) {
                        rowspanselect++;
                    }
                    var rowtotablespan = (rowspanselect == 0 ? 1 : rowspanselect) * numperrow;

                    var rowbuild = [];
                    var maxcol = 10;
                    var counteach = 0;
                    var counttol = 0;
                    var build = [];
                    production.forEach(e => {
                        build.push(e);
                        counteach++;
                        counttol++;
                        if (counteach == 10 || counttol == production.length) {
                            rowbuild.push(build);
                            build = [];
                            counteach = 0;
                        }
                    });


                    //row start

                    var totalstartPCS = 0;
                    var totalstartNW = 0;
                    var totalstartSQFT = 0;
                    if (start.length > 0) {
                        start.forEach(e => {
                            totalstartPCS += e.PCS;
                            totalstartNW += e.NW;
                            totalstartSQFT += e.SQFT;
                        });
                    }

                    //end row start

                    //row Uncomplete 
                    var totalendPCS = 0;
                    var totalendNW = 0;
                    var totalendSQFT = 0;
                    if (end.length > 0) {
                        end.forEach(e => {
                            totalendPCS += e.PCS;
                            totalendNW += e.NW;
                            totalendSQFT += e.SQFT;
                        });
                    }
                    //end row Uncomplete

                    //row Total 
                    var totalPCS = 0;
                    var totalNW = 0;
                    var totalSQFT = 0;
                    if (production.length > 0) {
                        production.forEach(e => {
                            totalPCS += e.PCS;
                            totalNW += e.NW;
                            totalSQFT += e.SQFT;
                        });
                    }
                    totalPCS = totalPCS + totalendPCS - totalstartPCS;
                    totalNW = totalNW + totalendNW - totalstartNW;
                    totalSQFT = totalSQFT + totalendSQFT - totalstartSQFT;

                    //end row Total

                    //row pallet
                    var rowbui = 0;
                    if (production.length > 0) {
                        rowbuild.forEach(build => {
                            rowbui++;
                            for (var filtercount = 0; filtercount < filter.length; filtercount++) {
                                var currentFilter = filter[filtercount];
                                if (IsBindSelectTitle == 0) {
                                    html += '<tr name="' + select.MERGESELECTIONID + '">';
                                    html += '<td rowspan="' + rowtotablespan + '" style="background-color: #e6eef1;">';
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="SELECTIONID" value="' + select.SELECTIONID + '"/>';
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="SUBSELECTIONID" value="' + select.SUBSELECTIONID + '"/>';

                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="LISTSTARTID" value="' + liststart + '"/>';
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="MERGESELECTIONID" value="' + select.MERGESELECTIONID + '"/>';
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="STARTPCS" value="' + totalstartPCS + '"/>';
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="STARTNW" value="' + totalstartNW + '"/>';
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="STARTSQFT" value="' + totalstartSQFT + '"/>';

                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="totalpcs" value="' + totalPCS + '"/>';
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="totalnw" value="' + totalNW + '"/>';
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="totalsqft" value="' + totalSQFT + '"/>';
                                    var lstend = [];
                                    end.forEach(e => { lstend.push(e.PALLETID); });
                                    html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="IDENDRESA" value="' + lstend.join(',') + '"/>';

                                    html += select.SELECTIONFULL + '</td > ';
                                    IsBindSelectTitle++;
                                }
                                else {
                                    html += '<tr name="' + select.MERGESELECTIONID + '">';
                                }
                                if (IsBindStart < filter.length) {
                                    switch (currentFilter) {
                                        case "PCS":
                                            html += '<td style="background-color: white;" name="startpcs">' + totalstartPCS + '</td>';
                                            IsBindStart++;
                                            break;
                                        case "KGS":
                                            html += '<td style="background-color:#dde1e2;" name="startnw">' + totalstartNW + '</td>';
                                            IsBindStart++;
                                            break;
                                        case "SQFT":
                                            html += '<td style="background-color: #83a0a5;" name="startsqft">' + totalstartSQFT + '</td>';
                                            IsBindStart++;
                                            break;
                                    }
                                }
                                else {
                                    var style = "";
                                    switch (currentFilter) {
                                        case "PCS":
                                            style = 'style="background-color: white;"';
                                            break;
                                        case "KGS":
                                            style = 'style="background-color:#dde1e2;"';
                                            break;
                                        case "SQFT":
                                            style = 'style="background-color: #83a0a5;"';
                                            break;
                                    }
                                    html += '<td ' + style + '></td>';
                                }
                                build.forEach(row => {
                                    switch (currentFilter) {
                                        case "PCS":
                                            html += '<td style="background-color: white;">';
                                            html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="PCS" value="' + row.PCS + '"/>';
                                            html += row.PCS + '</td>';
                                            break;
                                        case "KGS":
                                            html += '<td style="background-color:#dde1e2;">';
                                            html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="NW" value="' + row.NW + '"/>';
                                            html += row.NW + '</td>';
                                            break;
                                        case "SQFT":
                                            html += '<td style="background-color: #83a0a5;">';
                                            html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="SQFT" value="' + row.SQFT + '"/>';
                                            html += row.SQFT + '</td>';
                                            break;
                                    }
                                });
                                if (build.length < tablecolspan) {
                                    for (var k = (tablecolspan - build.length); k > 0; k--) {
                                        var style = "";
                                        switch (currentFilter) {
                                            case "PCS":
                                                style = 'style="background-color: white;"';
                                                break;
                                            case "KGS":
                                                style = 'style="background-color:#dde1e2;"';
                                                break;
                                            case "SQFT":
                                                style = 'style="background-color: #83a0a5;"';
                                                break;
                                        }
                                        html += '<td ' + style + '>-</td>';
                                    }
                                }

                                if (IsBindEnd < filter.length) {
                                    switch (currentFilter) {
                                        case "PCS":
                                            html += '<td style="background-color: white;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + select.MERGESELECTIONID + '" name="ENDPCS" type="number" value="' + totalendPCS + '" /></td>';
                                            IsBindEnd++;
                                            break;
                                        case "KGS":
                                            html += '<td style="background-color:#dde1e2;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + select.MERGESELECTIONID + '" name="ENDNW" type="number" value="' + totalendNW + '" /></td>';
                                            IsBindEnd++;
                                            break;
                                        case "SQFT":
                                            html += '<td style="background-color: #83a0a5;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + select.MERGESELECTIONID + '" name="ENDSQFT" type="number" value="' + totalendSQFT + '" /></td>';
                                            IsBindEnd++;
                                            break;
                                    }
                                }
                                else {
                                    var style = "";
                                    switch (currentFilter) {
                                        case "PCS":
                                            style = 'style="background-color: white;"';
                                            break;
                                        case "KGS":
                                            style = 'style="background-color:#dde1e2;"';
                                            break;
                                        case "SQFT":
                                            style = 'style="background-color: #83a0a5;"';
                                            break;
                                    }
                                    html += '<td ' + style + '></td>';
                                }
                                if (rowbui == 1) {
                                    if (IsBindTotal < filter.length) {
                                        var style = "";
                                        switch (currentFilter) {
                                            case "PCS":
                                                style = 'style="background-color: white;"';
                                                html += '<td ' + style + ' name="selectionresultpcs">';
                                                html += totalPCS + '</td><td ' + style + '></td><td ' + style + '></td>';
                                                break;
                                            case "KGS":
                                                style = 'style="background-color:#dde1e2;"';
                                                html += '<td ' + style + '></td><td ' + style + ' name="selectionresultnw">';
                                                html += totalNW + '</td><td ' + style + '></td>';
                                                break;
                                            case "SQFT":
                                                style = 'style="background-color: #83a0a5;"';
                                                html += '<td ' + style + '></td><td ' + style + '></td><td ' + style + ' name="selectionresultsqft">';
                                                html += totalSQFT + '</td>';
                                                break;
                                        }
                                    }
                                }
                                else {
                                    if (IsBindTotal < filter.length) {
                                        var style = "";
                                        switch (currentFilter) {
                                            case "PCS":
                                                style = 'style="background-color: white;"';
                                                html += '<td ' + style + ' >';
                                                html += '</td><td ' + style + '></td><td ' + style + '></td>';
                                                break;
                                            case "KGS":
                                                style = 'style="background-color:#dde1e2;"';
                                                html += '<td ' + style + '></td><td ' + style + ' >';
                                                html += '</td><td ' + style + '></td>';
                                                break;
                                            case "SQFT":
                                                style = 'style="background-color: #83a0a5;"';
                                                html += '<td ' + style + '></td><td ' + style + '></td><td ' + style + ' >';
                                                html += '</td>';
                                                break;
                                        }
                                    }
                                }
                                html += '</tr>';
                            }
                        });
                        //end row pallet
                    }
                    else {
                        rowbui++;
                        for (var filtercount = 0; filtercount < filter.length; filtercount++) {
                            var currentFilter = filter[filtercount];
                            if (IsBindSelectTitle == 0) {
                                html += '<tr name="' + select.MERGESELECTIONID + '">';
                                html += '<td rowspan="' + rowtotablespan + '" style="background-color: #e6eef1;">';
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="SELECTIONID" value="' + select.SELECTIONID + '"/>';
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="SUBSELECTIONID" value="' + select.SUBSELECTIONID + '"/>';

                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="LISTSTARTID" value="' + liststart + '"/>';
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="MERGESELECTIONID" value="' + select.MERGESELECTIONID + '"/>';
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="STARTPCS" value="' + totalstartPCS + '"/>';
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="STARTNW" value="' + totalstartNW + '"/>';
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="STARTSQFT" value="' + totalstartSQFT + '"/>';

                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="totalpcs" value="' + totalPCS + '"/>';
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="totalnw" value="' + totalNW + '"/>';
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="totalsqft" value="' + totalSQFT + '"/>';
                                var lstend = [];
                                end.forEach(e => { lstend.push(e.PALLETID); });
                                html += '<input type="hidden" group="' + select.MERGESELECTIONID + '" name="IDENDRESA" value="' + lstend.join(',') + '"/>';
                                html += select.SELECTIONFULL + '</td > ';
                                IsBindSelectTitle++;
                            }
                            else {
                                html += '<tr name="' + select.MERGESELECTIONID + '">';
                            }
                            if (IsBindStart < filter.length) {
                                switch (currentFilter) {
                                    case "PCS":
                                        html += '<td style="background-color: white;" name="startpcs">' + totalstartPCS + '</td>';
                                        IsBindStart++;
                                        break;
                                    case "KGS":
                                        html += '<td style="background-color:#dde1e2;" name="startnw">' + totalstartNW + '</td>';
                                        IsBindStart++;
                                        break;
                                    case "SQFT":
                                        html += '<td style="background-color: #83a0a5;" name="startsqft">' + totalstartSQFT + '</td>';
                                        IsBindStart++;
                                        break;
                                }
                            }
                            else {
                                var style = "";
                                switch (currentFilter) {
                                    case "PCS":
                                        style = 'style="background-color: white;"';
                                        break;
                                    case "KGS":
                                        style = 'style="background-color:#dde1e2;"';
                                        break;
                                    case "SQFT":
                                        style = 'style="background-color: #83a0a5;"';
                                        break;
                                }
                                html += '<td ' + style + '></td>';
                            }
                            for (var k = (tablecolspan - build.length); k > 0; k--) {
                                var style = "";
                                switch (currentFilter) {
                                    case "PCS":
                                        style = 'style="background-color: white;"';
                                        break;
                                    case "KGS":
                                        style = 'style="background-color:#dde1e2;"';
                                        break;
                                    case "SQFT":
                                        style = 'style="background-color: #83a0a5;"';
                                        break;
                                }
                                html += '<td ' + style + '>-</td>';
                            }

                            if (IsBindEnd < filter.length) {
                                switch (currentFilter) {
                                    case "PCS":
                                        html += '<td style="background-color: white;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + select.MERGESELECTIONID + '" name="ENDPCS" type="number" value="' + totalendPCS + '" /></td>';
                                        IsBindEnd++;
                                        break;
                                    case "KGS":
                                        html += '<td style="background-color:#dde1e2;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + select.MERGESELECTIONID + '" name="ENDNW" type="number" value="' + totalendNW + '" /></td>';
                                        IsBindEnd++;
                                        break;
                                    case "SQFT":
                                        html += '<td style="background-color: #83a0a5;"><input style="border: none !important;" onblur="CalcTotalTableResa()" class="span12 m-wrap" group="' + select.MERGESELECTIONID + '" name="ENDSQFT" type="number" value="' + totalendSQFT + '" /></td>';
                                        IsBindEnd++;
                                        break;
                                }
                            }
                            else {
                                var style = "";
                                switch (currentFilter) {
                                    case "PCS":
                                        style = 'style="background-color: white;"';
                                        break;
                                    case "KGS":
                                        style = 'style="background-color:#dde1e2;"';
                                        break;
                                    case "SQFT":
                                        style = 'style="background-color: #83a0a5;"';
                                        break;
                                }
                                html += '<td ' + style + '></td>';
                            }
                            if (rowbui == 1) {
                                if (IsBindTotal < filter.length) {
                                    var style = "";
                                    switch (currentFilter) {
                                        case "PCS":
                                            style = 'style="background-color: white;"';
                                            html += '<td ' + style + ' >';
                                            html += totalPCS + '</td><td ' + style + '></td><td ' + style + '></td>';
                                            break;
                                        case "KGS":
                                            style = 'style="background-color:#dde1e2;"';
                                            html += '<td ' + style + '></td><td ' + style + ' >';
                                            html += totalNW + '</td><td ' + style + '></td>';
                                            break;
                                        case "SQFT":
                                            style = 'style="background-color: #83a0a5;"';
                                            html += '<td ' + style + '></td><td ' + style + '></td><td ' + style + '>';
                                            html += totalSQFT + '</td>';
                                            break;
                                    }
                                }
                            }
                            else {
                                if (IsBindTotal < filter.length) {
                                    var style = "";
                                    switch (currentFilter) {
                                        case "PCS":
                                            style = 'style="background-color: white;"';
                                            html += '<td ' + style + ' name="selectionresultpcs">';
                                            html += '</td><td ' + style + '></td><td ' + style + '></td>';
                                            break;
                                        case "KGS":
                                            style = 'style="background-color:#dde1e2;"';
                                            html += '<td ' + style + '></td><td ' + style + ' name="selectionresultnw">';
                                            html += '</td><td ' + style + '></td>';
                                            break;
                                        case "SQFT":
                                            style = 'style="background-color: #83a0a5;"';
                                            html += '<td ' + style + '></td><td ' + style + '></td><td ' + style + ' name="selectionresultsqft">';
                                            html += '</td>';
                                            break;
                                    }
                                }
                            }

                            html += '</tr>';
                        }
                    }

                    //}
                }
                var $body = $('<tbody>' + html + '</tbody>');
                var $footer = $(BuilTableFooterResa(tablecolspan, selectList));
                $table.append($tableHeader).append($body).append($footer);
                $('div[name=tableresa]').html('').append($table);
                $('div[name=tableresa]').find('select[name=SELECTIONFULL]').chosen();
            }
            CalcTotalTableResa();
            CalcTotalDetailResa();
            if (isshowfoot != undefined) {
                $('div[name=tableresa]').find('tfoot').show();
            }
        }
    });
}

function BuilTableHeadResa(countproduction) {
    var html = '';
    html += '<thead>';
    html += '<tr>';
    html += '<th>Selection</th>';
    html += '<th>Input Pallet</th>';
    html += '<th colspan="' + countproduction + '">Detail</th>';
    html += '<th style="width: 100px;">Uncomplete Pallet</th>';
    html += '<th colspan="3">Selection Result</th>';
    html += '</tr>';
    html += '</thead>';
    return html;
}

function BuilTableFooterResa(countproduction, selectList) {
    var html = '';
    html += '<tfoot style="display: none;">';
    html += '<tr name="selectionout">';
    html += '<td>';
    html += '<select id="SELECTIONFULLDROPDOWN" name="SELECTIONFULL" class="span12">';
    for (var i = 0; i < selectList.length; i++) {
        html += '<option value="' + selectList[i].ID + '">' + selectList[i].SELECTIONFULL + '</option>';
    }
    html += '</select>';
    html += '</td>';
    html += '<td></td>';
    html += '<td colspan="' + countproduction + '"></td>';
    html += '<td>';
    html += '<input class="span12 m-wrap" name="ENDPCS" type="number" value="0" />';
    html += '<input class="span12 m-wrap" name="ENDNW" type="number" value="0" />';
    html += '<input class="span12 m-wrap" name="ENDSQFT" type="number" value="0" />';
    html += '</td>';
    html += '<td colspan="3">';
    html += '<button type="button" onclick="AddResaStartExtend()" class="btn blue">Add</button>';
    html += '<button type="button" onclick="OutAddResaStartExtend()" class="btn blue">Cancel</button>';
    html += '</td>';
    html += '</tr>';
    html += '</tfoot>';
    return html;
}
function BuildResaRow(row) {
    html += '';
}

function BuildTableRS(ProductionTable, eleFilter, SelectInOne) {
    var maxCol = 10;
    var perRow = eleFilter != null ? eleFilter.Count : 3;
    var maxPalletPerSelection = 0;
    var singlerow = 0;
    if (ProductionTable != null) {
        var SelectionList = listProduction.filter(x => x.SELECTIONFULL);
    }
}

async function PrintUncompletePallet() {
    var resacode = $('#RESACODE').val();

    var lstSelection = [];
    var printhtml = '';
    $('#resatable').find('tr').each(function () {
        var name = $(this).attr('name');
        if (name != undefined && name != '') {
            if (lstSelection.length == 0) {
                lstSelection.push(name);
            }
            if (lstSelection.filter(x => x == name).length == 0) {
                lstSelection.push(name);
            }
        }
    });

    for (var i = 0; i < lstSelection.length; i++) {
        var resultSinglePrint = await GetUncompletePalletTemplatePrint(resacode, lstSelection[i]);
        if (resultSinglePrint != '') {
            printhtml += await GetUncompletePalletTemplatePrint(resacode, lstSelection[i]);
            printhtml += '<div style="clear: both;height: 36.5mm;"></div>';
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


async function GetUncompletePalletTemplatePrint(resacode, mergeid) {
    var data = { resacode: resacode, mergeselectionid: mergeid };
    var res = await CallGetUncompleteTemplatePrint('/resa/getpalletcode', data);
    if (res.IsOk) {
        if (res.dataObj != null) {
            return res.dataObj;
        }
        else {
            return '';
        }
    }
    else {
        return '';
    }
}

async function CallGetUncompleteTemplatePrint(url, data) {
    var res = await $.ajax({
        url: url,
        type: 'POST',
        async: true,
        cache: false,
        data: data
    });
    return res;
}