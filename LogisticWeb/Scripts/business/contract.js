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
                url: '/contract/donecontract',
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
    })
}

async function AddNewItemForm() {
    countListItem++;
    var data = [];
    var code = $('input[name=CONTRACTCODE]').val() + '-' + countListItem;
    data.push(code);
    var html = await AjaxTemplate('ItemContract', data);
    $('#itemlist').append($(html));
    $('#itemlist').find('input[name=over_' + code + ']').each(function () { $(this).uniform(); })
}

function BeginLoadDataSelection(item) {
    var $item = $(item);
    $.ajax({
        method: 'POST',
        url: '/selection/getlist',
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
                    $item.attr('onchange', 'LoadSubSelRelated(this)');
                    LoadSubSelRelated($item);
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

async function LoadSubSelRelated(item) {
    var $item = $(item);
    var value = $item.val();
    $.ajax({
        method: 'POST',
        url: '/subsel/getlistfollowid',
        data: { value: value },
        success: function (res) {
            var $subsel = $item.closest('div[name=item]').find('select[name=SUBSELECTIONID]').first();
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

function LoadDetailConsignee(item) {
    var $item = $(item);
    var value = $item.val();
    if (value != '') {
        $.ajax({
            method: 'POST',
            url: '/consignee/getbyid',
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
        $('#consignee').find('input, textarea').each(function () {
            $(this).val('');
        })
    }
}

function LoadDetailCustomer(item) {
    var $item = $(item);
    var value = $item.val();
    if (value != '') {
        $.ajax({
            method: 'POST',
            url: '/customer/getbyid',
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
        $('#buyer').find('input, textarea').each(function () {
            $(this).val('');
        })
    }
}

function LoadContractCodeName() {
    $.ajax({
        method: 'POST',
        url: '/contract/GenerateCodeName',
        success: function (res) {
            if (res.IsOk) {
                $('input[name=CONTRACTCODE]').val(res.dataObj);
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

async function FormAddNewCustomer(item) {
    var $item = $(item);
    $item.closest('.portlet-title').find('select').hide();
    var data = [];
    var html = await AjaxTemplate('ActionBuyer', data);
    $('#buyer').append(html);
    $('#buyer').find('input, textarea').each(function () {
        $(this).removeAttr('readonly');
        $(this).val('');
    })
}

async function FormAddNewConsignee(item) {
    var $item = $(item);
    $item.closest('.portlet-title').find('select').hide();
    var data = [];
    var html = await AjaxTemplate('ActionConsignee', data);
    $('#consignee').append(html);
    $('#consignee').find('input, textarea').each(function () {
        $(this).removeAttr('readonly');
        $(this).val('');
    })
}

async function SaveBuyer(item) {
    var $item = $(item);
    var frm = {};
    var form = $('#buyer');
    var method = 'POST';
    var url = '/customer/save';
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
        $('input[name=CUSTOMERID]').val(res.dataObj);
        $('#actionbuyer').remove();
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


async function SaveConsignee(item) {
    var $item = $(item);
    var frm = {};
    var form = $('#consignee');
    var method = 'POST';
    var url = '/consignee/save';
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
        $('input[name=CONSIGNEEID]').val(res.dataObj);
        $('#actionconsignee').remove();
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

function CancelCreateBuyer(item) {
    var $item = $(item);
    $('#actionbuyer').remove();
    $('select[name=listcustomer]').show();
    $('#buyer').find('input, textarea').each(function () {
        $(this).val('');
        $(this).attr('readonly', 'readonly');
    })
}

function CancelCreateConsignee(item) {
    var $item = $(item);
    $('#actionconsignee').remove();
    $('select[name=listconsignee]').show();
    $('#consignee').find('input, textarea').each(function () {
        $(this).val('');
        $(this).attr('readonly', 'readonly');
    })
}

function LoadListCustomer() {
    $.ajax({
        method: 'POST',
        url: '/customer/getlist',
        data: { PageIndex: 0, PageSize: -1 },
        success: function (res) {
            var $list = $('select[name=listcustomer]');
            if (res.IsOk) {
                $list.html('');
                var $optionsList = [];
                var $nullableoption = $('<option value=""> -- Select Buyer -- </option>');
                $optionsList.push($nullableoption);
                if (res.dataObj != undefined) {
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.CUSTOMERNAME + '</option>');
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

function LoadListConsignee() {
    $.ajax({
        method: 'POST',
        url: '/consignee/getlist',
        data: { PageIndex: 0, PageSize: -1 },
        success: function (res) {
            var $list = $('select[name=listconsignee]');
            if (res.IsOk) {
                $list.html('');
                var $optionsList = [];
                var $nullableoption = $('<option value=""> -- Select Consignee -- </option>');
                $optionsList.push($nullableoption);
                if (res.dataObj != undefined) {
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.CONSIGNEENAME + '</option>');
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


function LoadListDeliveryMethod() {
    $.ajax({
        method: 'POST',
        url: '/deliverymethod/getlist',
        data: { PageIndex: 0, PageSize: -1 },
        success: function (res) {
            var $list = $('select[name=DELIVERYMETHODID]');
            if (res.IsOk) {
                $list.html('');
                var $optionsList = [];
                var $nullableoption = $('<option value=""> -- Select Delivery Method -- </option>');
                $optionsList.push($nullableoption);
                if (res.dataObj != undefined) {
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.NAME + '</option>');
                        $optionsList.push($option);
                    }
                }
                for (var i = 0; i < $optionsList.length; i++) {
                    $list.append($optionsList[i]);
                }
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

function LoadListContainerType() {
    $.ajax({
        method: 'POST',
        url: '/containertype/getlist',
        data: { PageIndex: 0, PageSize: -1 },
        success: function (res) {
            var $list = $('select[name=CONTAINERTYPEID]');
            if (res.IsOk) {
                $list.html('');
                var $optionsList = [];
                var $nullableoption = $('<option value=""> -- Select Type -- </option>');
                $optionsList.push($nullableoption);
                if (res.dataObj != undefined) {
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.NAME + '</option>');
                        $optionsList.push($option);
                    }
                }
                for (var i = 0; i < $optionsList.length; i++) {
                    $list.append($optionsList[i]);
                }
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

function RecallApproximate(item) {
    var $item = $(item);
    var $hub = $item.closest('div[name=item]');
    var sqft = $hub.find('input[name=QUANTITYSQFT]').val();
    var cnt = $hub.find('input[name=QUANTITYCNT]').val();
    var pcs = $hub.find('input[name=QUANTITYPCS]').val();
    var kgs = $hub.find('input[name=QUANTITYKGS]').val();
    var price = $hub.find('input[name=PRICE]').val();
    var checkDomestic = $('input[name=DomesticCheck]');
    var approxi = 0;
    var over = $hub.find('input[type=radio]:checked').val();
    $hub.find('input[name=OVERUNIT]').val(over);
    if ($item.attr('name') != 'QUANTITYKGS') {
        if (over == 'kgs') {
            if (checkDomestic.is(':checked')) {

                kgs = parseFloat(28000) * cnt;
            }
            else {
                kgs = parseFloat(26000) * cnt;
            }
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
    $hub.find('span[name=approximateunit]').html(over);

}

function SaveContract() {
    var fullcontract = {}
    var $itemList = [];
    $('#detail').find('input, textarea, select').each(function () {
        fullcontract[$(this).attr('name')] = $(this).val();
    });
    $('div[name=item]').each(function () {
        var $itemdetail = {};
        $(this).find('input, textarea, select').each(function () {
            $itemdetail[$(this).attr('name')] = $(this).val();
        })
        $itemList.push($itemdetail);
    });
    fullcontract['ItemList'] = $itemList;
    fullcontract['CUSTOMERID'] = $('input[name=CUSTOMERID]').val();
    fullcontract['CONSIGNEEID'] = $('input[name=CONSIGNEEID]').val();
    fullcontract['DELIVERYPLAN'] = ($('input[name=DELIVERYPLAN]').val() != '' ? $('input[name=DELIVERYPLAN]').val().datepicker('getDate') : '');
    $.ajax({
        method: 'POST',
        url: '/contract/save',
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


function UpdateContract() {
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
        $itemList.push($itemdetail);
    });
    fullcontract['ItemList'] = $itemList;
    fullcontract['CUSTOMERID'] = $('input[name=CUSTOMERID]').val();
    fullcontract['CONSIGNEEID'] = $('input[name=CONSIGNEEID]').val();
    fullcontract['DELIVERYPLAN'] = ($('input[name=DELIVERYPLAN]').val() != '' ? $('input[name=DELIVERYPLAN]').val().datepicker('getDate') : '');
    $.ajax({
        method: 'POST',
        url: '/contract/update',
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