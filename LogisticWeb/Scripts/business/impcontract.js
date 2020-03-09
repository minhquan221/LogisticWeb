function LoadDetailSupplier(item) {
    var $item = $(item);
    var value = $item.val();
    if (value != '') {
        $.ajax({
            method: 'POST',
            url: '/supplier/getbyid',
            data: { id: value },
            success: function (res) {
                if (res.IsOk) {
                    var data = res.dataObj;
                    if (data != undefined) {
                        for (var i = 0; i < Object.keys(data).length; i++) {
                            $('input[name=' + Object.keys(data)[i] + ']').val(data[Object.keys(data)[i]]);
                            $('textarea[name=' + Object.keys(data)[i] + ']').val(data[Object.keys(data)[i]]);
                        }
                    }
                }
            }
        });
    }
    else {
        $('#supplier').find('input, textarea').each(function () {
            $(this).val('');
        })
    }
}

function LoadDetailShipper(item) {
    var $item = $(item);
    var value = $item.val();
    if (value != '') {
        $.ajax({
            method: 'POST',
            url: '/shipper/getbyid',
            data: { id: value },
            success: function (res) {
                if (res.IsOk) {
                    var data = res.dataObj;
                    if (data != undefined) {
                        for (var i = 0; i < Object.keys(data).length; i++) {
                            $('input[name=' + Object.keys(data)[i] + ']').val(data[Object.keys(data)[i]]);
                            $('textarea[name=' + Object.keys(data)[i] + ']').val(data[Object.keys(data)[i]]);
                        }
                    }
                }
            }
        });
    }
    else {
        $('#shipper').find('input, textarea').each(function () {
            $(this).val('');
        })
    }
}
function LoadListSupplier() {
    $.ajax({
        method: 'POST',
        url: '/supplier/getlist',
        data: { PageIndex: 0, PageSize: -1 },
        success: function (res) {
            var $list = $('select[name=listsupplier]');
            if (res.IsOk) {
                $list.html('');
                var $optionsList = [];
                var $nullableoption = $('<option value=""> -- Select Supplier -- </option>');
                $optionsList.push($nullableoption);
                if (res.dataObj != undefined) {
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.SUPPLIERNAME + '</option>');
                        $optionsList.push($option);
                    }
                }
                for (var i = 0; i < $optionsList.length; i++) {
                    $list.append($optionsList[i]);

                }
            }
        }
    });
}


function LoadListShipper() {
    $.ajax({
        method: 'POST',
        url: '/shipper/getlist',
        data: { PageIndex: 0, PageSize: -1 },
        success: function (res) {
            var $list = $('select[name=listshipper]');
            if (res.IsOk) {
                $list.html('');
                var $optionsList = [];
                var $nullableoption = $('<option value=""> -- Select Shipper -- </option>');
                $optionsList.push($nullableoption);
                if (res.dataObj != undefined) {
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.SHIPPERNAME + '</option>');
                        $optionsList.push($option);
                    }
                }
                for (var i = 0; i < $optionsList.length; i++) {
                    $list.append($optionsList[i]);

                }
            }
        }
    });
}



function DoneContract(item) {
    var $item = $(item);
    var dataparam = $item.attr('data-primval');
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Done This Contract!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                method: 'POST',
                url: '/importcon/donecontract',
                data: { itemcode: dataparam },
                success: function (res) {
                    if (res.IsOk) {
                        Swal.fire(
                            'Done!',
                            'Your contract ' + dataparam + ' has been done manually.',
                            'success'
                        );
                        if ($('#ISDONE').val() == "1") {
                            $item.closest('tr').remove();
                        }
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

            //Swal.fire(
            //    'Done!',
            //    'Your contract ' + dataparam + ' has been done manually.',
            //    'success'
            //);
        }
    });
}

async function AddNewItemForm() {
    var importcode = $('input[name=IMPORTCODE]').val();
    if (importcode == '') {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            text: 'Please fill in contract code before insert item'
        });
        return;
    }
    countListItem++;
    var data = [];
    var code = $('input[name=IMPORTCODE]').val() + '-' + countListItem;
    data.push(code);
    var html = await AjaxTemplate('ImportItemContract', data);
    $('#itemlist').append($(html));
    $('#itemlist').find('input[name=over_' + code + ']').each(function () {
        $(this).uniform();
    });
    var text = $('select[name=CONTAINERTYPE] option:selected').html();
    $('span[name=unitquantity]').each(function () {
        $(this).html(text);
    });
}

function BeginLoadDataMaterial(item) {
    var $item = $(item);
    $.ajax({
        method: 'POST',
        url: '/material/getlist',
        data: { PageIndex: 0, PageSize: -1 },
        beforeSend: function () {
            BlockUI();
        },
        success: function (res) {
            if (res.IsOk) {
                $item.html('');
                if (res.dataObj != undefined) {
                    var $optionsList = [];
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.NAME + '</option>');
                        $optionsList.push($option);
                    }
                    for (var i = 0; i < $optionsList.length; i++) {
                        $item.append($optionsList[i]);
                    }
                    $item.removeAttr('onclick', '');
                    //$item.unbind('click');
                    $item.attr('onchange', 'LoadSubMaterialRelated(this)');
                    LoadSubMaterialRelated($item);
                }
            }
            //else {
            //    $('#SUBSELECTION').html('');
            //    $('#SUBSELECTION').closest('.controls-left-50').hide();
            //}
        },
        complete: function () {
            unBlockUI();
        }
    });
}


function BeginLoadDataMaterialFull(item) {
    var $item = $(item);
    $.ajax({
        method: 'POST',
        url: '/material/getfullinone',
        beforeSend: function () {
            BlockUI();
        },
        success: function (res) {
            if (res.IsOk) {
                $item.html('');
                if (res.dataObj != undefined) {
                    var $optionsList = [];
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.MATERIALFULL + '</option>');
                        $optionsList.push($option);
                    }
                    for (var i = 0; i < $optionsList.length; i++) {
                        $item.append($optionsList[i]);
                    }
                    $item.removeAttr('onclick', '');
                    //$item.unbind('click');
                    //$item.attr('onchange', 'LoadSubMaterialRelated(this)');
                    //LoadSubMaterialRelated($item);
                }
            }
            //else {
            //    $('#SUBSELECTION').html('');
            //    $('#SUBSELECTION').closest('.controls-left-50').hide();
            //}
        },
        complete: function () {
            unBlockUI();
        }
    });
}

async function LoadSubMaterialRelated(item) {
    var $item = $(item);
    var value = $item.val();
    $.ajax({
        method: 'POST',
        url: '/submat/getlistfollowid',
        data: { value: value },
        success: function (res) {
            var $subsel = $item.closest('div[name=item]').find('select[name=SUBMATERIALID]').first();
            if (res.IsOk) {
                $subsel.html('');
                if (res.dataObj != undefined) {
                    var $optionsList = [];
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.NAME + '</option>');
                        $optionsList.push($option);
                    }
                    for (var i = 0; i < $optionsList.length; i++) {
                        $subsel.append($optionsList[i]);

                    }

                }
                if ($subsel.attr('data-selected') != undefined) {
                    $subsel.val($subsel.attr('data-selected'));
                }
            }
        }
    });
}

function ChangeUnitCNT() {
    var text = $('select[name=CONTAINERTYPE] option:selected').html();
    $('span[name=unitquantity]').each(function () {
        $(this).html(text);
    });
}

function RecallApproximate(item) {
    var $item = $(item);
    var containerType = $('select[name=CONTAINERTYPE]').val();
    var kgsPerCon = 0;
    switch (containerType) {
        case "20DC":
            kgsPerCon = 19000;
            break;
        case "40DC":
            kgsPerCon = 25000;
            break;
        case "40HC":
            kgsPerCon = 25000;
            break;
    }
    var $hub = $item.closest('div[name=item]');
    var sqft = $hub.find('input[name=QUANTITYSQFT]').val();
    var cnt = $hub.find('input[name=QUANTITYCNT]').val();
    var pcs = $hub.find('input[name=QUANTITYPCS]').val();
    var kgs = $hub.find('input[name=QUANTITYKGS]').val();
    var price = $hub.find('input[name=PRICE]').val();
    var checkDomestic = $('input[name=DomesticCheck]');
    var approxi = 0;
    var over = $hub.find('input[type=radio]:checked').val();
    $hub.find('input[name=OVERUNIT]').val('kgs');
    if ($item.attr('name') != 'QUANTITYKGS') {
        if (over == 'kgs') {
            kgs = kgsPerCon * cnt;
        }
        $hub.find('input[name=QUANTITYKGS]').val(kgs);
    }
    switch (over) {
        case 'kgs':
            approxi = parseFloat(price) * parseFloat(kgs);
            break;
        case 'pcs':
            approxi = parseFloat(price) * parseFloat(pcs);
            break;
        case 'sqft':
            approxi = parseFloat(price) * parseFloat(sqft);
            break;
        default:
            approxi = 0;
            break;
    }
    $hub.find('input[name=Approximate]').val(approxi);
    $hub.find('span[name=approximateunit]').html('USD');

}

function SaveImportContract() {
    var fullcontract = {};
    var $itemList = [];
    $('#detail').find('input, textarea, select').each(function () {
        fullcontract[$(this).attr('name')] = $(this).val();
    });
    $('div[name=item]').each(function () {
        var $itemdetail = {};
        $(this).find('input, textarea, select').each(function () {
            $itemdetail[$(this).attr('name')] = $(this).val();
        });
        $itemdetail['MATERIALID'] = $itemdetail['MATERIALFULL'].split('_')[0];
        $itemdetail['SUBMATERIALID'] = $itemdetail['MATERIALFULL'].split('_')[1];
        $itemList.push($itemdetail);
    });
    fullcontract['ItemList'] = $itemList;
    fullcontract['SUPPLIERID'] = $('input[name=SUPPLIERID]').val();
    fullcontract['SHIPPERID'] = $('input[name=SHIPPERID]').val();
    $.ajax({
        method: 'POST',
        url: '/importcon/save',
        data: { info: fullcontract },
        success: function (res) {
            if (res.IsOk) {
                Swal.fire(
                    'Save data successful',
                    '',
                    'Ok'
                );
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


function UpdateImportContract() {
    var fullcontract = {};
    var $itemList = [];
    $('#detail').find('input, textarea, select').each(function () {
        fullcontract[$(this).attr('name')] = $(this).val();
    });
    $('div[name=item]').each(function () {
        var $itemdetail = {};
        $(this).find('input, textarea, select').each(function () {
            $itemdetail[$(this).attr('name')] = $(this).val();
        });
        $itemdetail['MATERIALID'] = $itemdetail['MATERIALFULL'].split('_')[0];
        $itemdetail['SUBMATERIALID'] = $itemdetail['MATERIALFULL'].split('_')[1];
        $itemList.push($itemdetail);
    });
    fullcontract['ItemList'] = $itemList;
    fullcontract['SUPPLIERID'] = $('input[name=SUPPLIERID]').val();
    fullcontract['SHIPPERID'] = $('input[name=SHIPPERID]').val();
    $.ajax({
        method: 'POST',
        url: '/importcon/update',
        data: { info: fullcontract },
        success: function (res) {
            if (res.IsOk) {
                Swal.fire(
                    'Save data successful',
                    '',
                    'Ok'
                );
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


function UpdateDoneImportContract() {
    var fullcontract = {};
    var $itemList = [];
    $('#detail').find('input, textarea, select').each(function () {
        fullcontract[$(this).attr('name')] = $(this).val();
    });
    $('div[name=item]').each(function () {
        var $itemdetail = {};
        $(this).find('input, textarea, select').each(function () {
            $itemdetail[$(this).attr('name')] = $(this).val();
        });
        $itemdetail['MATERIALID'] = $itemdetail['MATERIALFULL'].split('_')[0];
        $itemdetail['SUBMATERIALID'] = $itemdetail['MATERIALFULL'].split('_')[1];
        $itemList.push($itemdetail);
    });
    fullcontract['ItemList'] = $itemList;
    fullcontract['SUPPLIERID'] = $('input[name=SUPPLIERID]').val();
    fullcontract['SHIPPERID'] = $('input[name=SHIPPERID]').val();
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Done This Contract!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                method: 'POST',
                url: '/importcon/updatedone',
                data: { info: fullcontract },
                success: function (res) {
                    if (res.IsOk) {
                        Swal.fire(
                            'Save data successful',
                            '',
                            'Ok'
                        );
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


async function FormAddNewSupplier(item) {
    var $item = $(item);
    $item.closest('.portlet-title').find('select').hide();
    var data = [];
    var html = await AjaxTemplate('ActionSupplier', data);
    $('#supplier').append(html);
    $('#supplier').find('input, textarea').each(function () {
        $(this).removeAttr('readonly');
        $(this).val('');
    })
}


async function FormAddNewShipper(item) {
    var $item = $(item);
    $item.closest('.portlet-title').find('select').hide();
    var data = [];
    var html = await AjaxTemplate('ActionShipper', data);
    $('#shipper').append(html);
    $('#shipper').find('input, textarea').each(function () {
        $(this).removeAttr('readonly');
        $(this).val('');
    })
}

async function SaveSupplier(item) {
    var $item = $(item);
    var frm = {};
    var form = $('#supplier');
    var method = 'POST';
    var url = '/supplier/save';
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
        $('input[name=SUPPLIERID]').val(res.dataObj);
        $('#actionsupplier').remove();
        Swal.fire(
            'Save data successful',
            '',
            'Ok'
        );
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            text: res.Msg
        });
    }
}


async function SaveShipper(item) {
    var $item = $(item);
    var frm = {};
    var form = $('#shipper');
    var method = 'POST';
    var url = '/shipper/save';
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
        $('input[name=SHIPPERID]').val(res.dataObj);
        $('#actionshipper').remove();
        Swal.fire(
            'Save data successful',
            '',
            'Ok'
        );
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            text: res.Msg
        });
    }
}

function CancelCreateSupplier(item) {
    var $item = $(item);
    $('#actionsupplier').remove();
    $('select[name=listsupplier]').show();
    $('#supplier').find('input, textarea').each(function () {
        $(this).val('');
        $(this).attr('readonly', 'readonly');
    })
}


function CancelCreateShipper(item) {
    var $item = $(item);
    $('#actionshipper').remove();
    $('select[name=listshipper]').show();
    $('#supplier').find('input, textarea').each(function () {
        $(this).val('');
        $(this).attr('readonly', 'readonly');
    });
}
