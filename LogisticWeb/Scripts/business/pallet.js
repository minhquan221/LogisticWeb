function printPallet(optional, directlink, content) {
    if (content === undefined || content == null) {
        var datatemplate = [];
        datatemplate.push($('input[name="NAME"]').val());
        datatemplate.push($('#SELECTION').val());
        datatemplate.push(($('#SUBSELECTION').val() == null ? "" : $('#SUBSELECTION').val()));
        datatemplate.push($('input[name="HIDE"]').val());
        datatemplate.push($("input[name='NETWEIGHT']").val());
        datatemplate.push($("input[name='GROSSWEIGHT']").val());
        datatemplate.push(($('#SQUAREFOOT').val() == null ? "-" : $('#SQUAREFOOT').val()));
        var date = new Date();
        datatemplate.push(date.getFullYear() + "-" + date.GetMonthCustom() + "-" + date.GetDateCustom());
        datatemplate.push($("select[name='RESACODE']").chosen().val());
        datatemplate.push($("input[name='BARCODE']").val());
        datatemplate.push($("input[name='CONTAINERID']").val());
        //var printContent = await AjaxTemplate('ShippingMarkPrint', datatemplate);
        $.ajax({
            url: '/common/responseviewtemplate',
            type: 'POST',
            data: datatemplate,
            success: function (printContent) {
                w = window.open();
                var css = '@@media print {body { width: 105mm }} @@page { size: A6 portrait; margin: auto;} body{ width: 105mm; height: 130mm; }';
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
                w.document.write(printContent);
                $(w.document).imagesLoaded().then(function () {
                    w.print();
                    w.close();
                    //if (optional == 1) {
                    //    window.location.reload(true);
                    //}
                    //else {
                    //    window.location.href = directlink;
                    //}
                });
            }
        });
    }
    else {
        w = window.open();
        var css = '@@media print {body { width: 105mm }} @@page { size: A6 portrait; margin: auto;} body{ width: 105mm; height: 130mm; }';
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
            //if (optional == 1) {
            //    window.location.reload(true);
            //}
            //else {
            //    window.location.href = directlink;
            //}
        });
    }

}
async function LoadPreviewPrint() {
    await CreateQRCode();
    var datatemplate = [];
    datatemplate.push($('input[name="NAME"]').val());
    datatemplate.push($('#SELECTION').val());
    datatemplate.push(($('#SUBSELECTION').val() == null ? "" : $('#SUBSELECTION').val()));
    datatemplate.push($('input[name="HIDE"]').val());
    datatemplate.push($("input[name='NETWEIGHT']").val());
    datatemplate.push($("input[name='GROSSWEIGHT']").val());
    datatemplate.push(($('#SQUAREFOOT').val() == null ? "-" : $('#SQUAREFOOT').val()));
    var date = new Date();
    datatemplate.push(date.getFullYear() + "-" + date.GetMonthCustom() + "-" + date.GetDateCustom());
    datatemplate.push($("select[name='RESACODE']").chosen().val());
    datatemplate.push($("input[name='BARCODE']").val());
    datatemplate.push($("input[name='CONTAINERID']").val());
    var html = await AjaxTemplate('ShippingMarkPreview', datatemplate);

    w = window.open();
    var css = '@@media print {body { width: 105mm }} @@page { size: A6 portrait; margin: auto;} body{ width: 105mm; height: 130mm; }';
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
    w.document.write(html);

}
function ReCalCGrossWeight() {
    var palletweight = parseFloat($("select[name='PALLETWEIGHT']").val() != '' ? $("select[name='PALLETWEIGHT']").val() : 0);
    var netweight = parseFloat($("input[name='NETWEIGHT']").val() != '' ? $("input[name='NETWEIGHT']").val() : 0);
    var grossweight = palletweight + netweight;
    var hide = parseFloat($("input[name='HIDE']").val() != '' ? $("input[name='HIDE']").val() : 0);
    var avg = netweight;
    if (hide > 0) {
        avg = (netweight / hide).toFixed(2);
    }
    $("input[name='GROSSWEIGHT']").val(grossweight);
    $("input[name='WAVG']").val(avg);
}

function ReCalCSAVG() {
    var SQUAREFOOT = parseFloat($("input[name='SQUAREFOOT']").val() != '' ? $("input[name='SQUAREFOOT']").val() : 0);
    var hide = parseFloat($("input[name='HIDE']").val() != '' ? $("input[name='HIDE']").val() : 0);
    var savg = SQUAREFOOT;
    if (hide > 0) {
        savg = (SQUAREFOOT / hide).toFixed(2);
    }
    $("input[name='SAVG']").val(savg);
}

function LoadPrint() {
    var url = '/pallet/LoadPrint';
    var method = 'POST';
    var id = $('#ID').val();
    $.ajax({
        method: method,
        url: url,
        data: { id: id },
        success: function (res) {
            if (res.IsOk) {
                printPallet(1, '', res.dataObj);
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
async function SavePallet(item, optional, noprint) {
    var frm = {};
    var form = $(item).closest('form');
    var directlink = $(form).attr('control');
    var method = $(form).attr('method');
    var url = $(form).attr('action');
    $(form).find('input, select, textarea').each(function () {
        frm[$(this).attr('name')] = $(this).val();
    });
    $(form).find('input[type=checkbox]').each(function () {
        if ($(this).is(':checked')) {
            frm[$(this).attr('name')] = true;
        }
        else if (!$(this).is(':checked')) {
            frm[$(this).attr('name')] = false;
        }
    });

    frm["RESACODE"] = $('select[name=RESACODE]').chosen().val();
    var res = await AjaxCallback(url, method, frm);
    if (res.IsOk) {
        if (noprint === undefined)
            //console.log('success');
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
        //printPallet(optional, directlink, res.dataObj);
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
async function GenerateNumber() {
    var frm = $('#frm');
    var url = '/shippingmarkprint/createpalletnumber';
    var method = 'POST';
    var inputdata = {};
    $(frm).find('input, textarea, select').each(function () {
        if ($(this).attr('type') == 'checkbox') {

        }
        else {
            inputdata[$(this).attr('name')] = $(this).val();
        }
    });
    var res = await AjaxCallback(url, method, inputdata);
    if (res.IsOk) {
        $('input[name="NAME"]').val(res.dataObj);
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: res.Msg
        });
        console.log(res);
    }
    CheckSemiProduct();
}
async function CreateQRCode() {
    var url = '/shippingmarkprint/CreateQRCode';
    var method = 'POST';
    var frm = {};
    var form = $('#frm');
    var directlink = $(form).attr('control');
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
    var res = await AjaxCallback(url, method, frm);
    if (res.IsOk) {
        $('input[name="BARCODE"]').val(res.dataObj);
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: res.Msg
        });
        console.log(res);
    }

}

function LoadSubSel() {
    var value = $('#SELECTION').val();
    $.ajax({
        method: 'POST',
        url: '/subsel/getlistbyId',
        data: { value: value },
        success: function (res) {
            if (res.IsOk) {
                $('#SUBSELECTION').html('');
                if (res.dataObj != undefined) {
                    var $optionsList = [];
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
            GenerateNumber();
        }
    });
}


function LoadSubSelEdit() {
    var value = $('#SELECTION').val();
    $.ajax({
        method: 'POST',
        url: '/subsel/getlistbyId',
        data: { value: value },
        success: function (res) {
            if (res.IsOk) {
                $('#SUBSELECTION').html('');
                if (res.dataObj != undefined) {
                    var $optionsList = [];
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
                $('#SUBSELECTION').val($('#SUBSELECTION').attr('data-selected'));
            }
            else {
                $('#SUBSELECTION').html('');
                $('#SUBSELECTION').closest('.controls-left-50').hide();
            }
            //GenerateNumber();
        }
    });
}

function ActiveChosenPallet(item) {
    $(item).chosen();
    var valuechosen = $(item).chosen().val();
    GetNameNavigator(valuechosen);
    $(item).chosen().change(function () {
        var $item = $(this);
        var valuechosen = $item.chosen().val();
        GetNameNavigator(valuechosen);
    });
}

function GetNameNavigator(valuechosen) {
    $.ajax({
        url: '/resa/getnavigator',
        type: 'POST',
        data: { resacode: valuechosen },
        success: function (res) {
            if (res.IsOk) {
                $('#NAVIGATORNAME').val(res.dataObj);
            }
            else {
                console.log(res.Msg);
                //Swal.fire({
                //    type: 'error',
                //    title: 'Error',
                //    text: res.Msg
                //});
            }
        }
    });
}

function CheckSemiProduct() {
    $.ajax({
        url: '/selection/getconfig',
        type: 'POST',
        success: function (res) {
            if (res.IsOk) {
                var selection = $('select[name=SELECTION]').val();
                var subselection = $('select[name=SUBSELECTION]').val() != undefined && $('select[name=SUBSELECTION]').val() != '' ? $('select[name=SUBSELECTION]').val() : '';
                var fullselect = selection + ' ' + subselection;
                var data = res.dataObj;
                var listcheck = data.filter(x => x.SELECTIONFULL == fullselect);
                if (listcheck.length > 0) {
                    if (listcheck[0].ISSEMIPRODUCTION) {
                        $('input[name=ISSEMIPRODUCTION]').prop('checked', true);
                        $('input[name=ISSEMIPRODUCTION]').uniform.update();
                    }
                    else {
                        $('input[name=ISSEMIPRODUCTION]').prop('checked', false);
                        $('input[name=ISSEMIPRODUCTION]').uniform.update();
                    }
                }
            }
        }
    });
}

async function PrintAll(item) {
    var $item = $(item);
    var count = 0;
    $item.closest('.tablejs').find('table tbody tr input[type=checkbox]').each(function () {
        if ($(this).is(':checked'))
            count++;
    });
    if (count > 0) {
        var printhtml = '';
        var lstPrintData = $item.closest('.tablejs').find('table tbody tr');
        for (var i = 0; i < lstPrintData.length; i++) {
            var $tr = $(lstPrintData[i]);
            if ($tr.find("input[type=checkbox]").is(":checked")) {
                var id = $tr.attr('idrow');
                var palletSingle = await GetPalletInListPrint(id);
                printhtml += palletSingle;
                if (i != lstPrintData.length - 1) {
                    printhtml += '<div style="clear:both;height: 29.85mm;"></div>';
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


async function GetPalletInListPrint(idpallet) {
    var res = await CallGetListPrint('/pallet/LoadPrint', idpallet);
    if (res.IsOk) {
        return res.dataObj;
    }
    else {
        return '';
    }
}

async function CallGetListPrint(url, data) {
    var res = await $.ajax({
        url: url,
        type: 'POST',
        async: true,
        cache: false,
        data: { id: data }
    });
    return res;
}