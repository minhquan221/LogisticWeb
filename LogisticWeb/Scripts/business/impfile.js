async function InitDetailData() {
    var $item = $('#IMPORTCONTRACTCODE');
    var dataselected = $item.attr('data-selected');
    var cnttype = '';
    $.ajax({
        url: $item.attr('ajaxurl'),
        method: 'POST',
        data: { pageindex: 0, pagesize: -1 },
        success: function (res) {
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
                        if (dataselected != '') {
                            cnttype = row['CONTAINERTYPE'];
                        }
                        var $option = $('<option value="' + row[ValueCol] + '" ' + (selectItem == row[ValueCol] ? "selected" : "") + '>' + row[NameCol] + '</option>');
                        $optionList.push($option);
                    }
                    for (var i = 0; i < $optionList.length; i++) {
                        $item.append($optionList[i]);
                    }
                }
            }
            $('select[name=MATERIALFULL]').each(function () {
                InitMaterial($(this));
            });
            switch (cnttype) {
                case "20DC":
                    $('span[name=cnttype]').html('20\'DC');
                    break;
                case "40DC":
                    $('span[name=cnttype]').html('40\'DC');
                    break;
                case "40HC":
                    $('span[name=cnttype]').html('40\'HC');
                    break;
            }
            InitEnterSave($('div[name=containeritem]'));
        }

    });
}


async function AutoInitContainer2(item) {
    var $this = $(item);
    var value = parseInt($this.val());
    var initvalue = parseInt($this.attr('initvalue'));
    if (value < initvalue) {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            text: 'Please Delete Cnt Manually'
        });
        $this.val(initvalue);
        return;
    }
    $(this).attr('initvalue', value);
    if (value >= initvalue) {
        var countCurrent = 0;
        var hasVal = 0;
        await $('div[name=containeritem]').each(async function () {
            if ($(this).find('table.importpallet tbody tr[name=outputrow]').length == 0) {
                $(this).remove();
            }
            else {
                hasVal++;
            }
        });
        await $('div[name=fixlistpkl]').each(async function () { $(this).remove(); });
        var index = 0;
        await $('div[name=containeritem]').each(async function () {
            index++;
            countCurrent++;
            //$(this).find('name[titleCnt]').html('Lot No. ' + index);
            $(this).find('name[titleCnt]').html(index);
            $(this).attr('pkl_id', 'pkl_' + index);
            if (index % 2 == 0) {
                var $rowfix = $('<div name="fixlistpkl" class="clearfix"></div>');
                $(this).after($rowfix);
            }
        });
        for (var i = countCurrent; i < value; i++) {
            await AddNewPKL2();
        }
    }
}

async function AutoInitContainer(item) {
    var $this = $(item);
    var value = parseInt($this.val());
    var initvalue = parseInt($this.attr('initvalue'));
    if (value < initvalue) {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            text: 'Please Delete Cnt Manually'
        });
        $this.val(initvalue);
        return;
    }
    $(this).attr('initvalue', value);
    if (value >= initvalue) {
        var countCurrent = 0;
        var hasVal = 0;
        $('div[name=containeritem]').each(function () {
            if ($(this).find('table.importpallet tbody tr[name=outputrow]').length == 0) {
                $(this).remove();
            }
            else {
                hasVal++;
            }
        });
        $('div[name=fixlistpkl]').each(function () { $(this).remove(); });
        var index = 0;
        $('div[name=containeritem]').each(function () {
            index++;
            countCurrent++;
            //$(this).find('name[titleCnt]').html('Lot No. ' + index);
            $(this).find('name[titleCnt]').html(index);
            $(this).attr('pkl_id', 'pkl_' + index);
            if (index % 2 == 0) {
                var $rowfix = $('<div name="fixlistpkl" class="clearfix"></div>');
                $(this).after($rowfix);
            }
        });
        for (var i = countCurrent; i < value; i++) {
            await AddNewPKL();
        }
    }
}
function ReFixHeightList() {
    var height1 = 0;
    var height2 = 0;
    var index = 0;
    //$('div[name=containeritem]').each(function () {
    //    index++;
    //    if (index % 2 == 0) {
    //        height2 = $($(this).find('.portlet-body')).height();
    //    }
    //    else {
    //        height1 = $($(this).find('.portlet-body')).height();
    //    }
    //    if (index % 2 == 0 && height1 != height2) {
    //        if (height1 > height2) {
    //            $($('div[name=containeritem]')[index - 1]).find('.portlet-body').height(height1);
    //        }
    //        else if (height1 < height2) {
    //            $($('div[name=containeritem]')[index - 2]).find('.portlet-body').height(height2);
    //        }
    //    }
    //});
}

async function AddNewPKL2() {
    countListPKLS = $('div[name=containeritem]').length;
    countListPKLS++;
    var data = [];
    var impFile = $('input[name=IMPFILE]').val();
    var splitCode = impFile.split('-');

    //var code = $('input[name=CONTRACTCODE]').val() + '-' + countListItem;
    //var code = 'Cnt No. ' + countListPKLS;
    var pklCodeName = splitCode[0] + ConvertIntToAlphabet(countListPKLS) + '-' + splitCode[1];
    //var code = 'Lot No. ' + pklCodeName;
    var code = 'Cnt No. ' + countListPKLS;
    var indexPKL = 'pkl_' + countListPKLS;
    data.push(code);
    data.push(indexPKL);
    //data.push(pklCodeName);
    data.push(countListPKLS);
    var html = await AjaxTemplate('ImportPKL', data);
    $('#actioncontent').before($(html));
    var countList = $('div[name=containeritem]').length;
    if (countList % 2 == 0) {
        var $rowfix = $('<div name="fixlistpkl" class="clearfix"></div>');
        $('#actioncontent').before($rowfix);
    }
    var materialList = [];
    $('div[pklid=' + indexPKL + ']').find('select[name=MATERIALFULL]').each(function () {
        materialList.push($(this));
        //InitMaterial($(this));
    });

    for (var i = 0; i < materialList.length; i++) {
        //await InitMaterial(materialList[i]);
        var $item = materialList[i];
        var importcode = $('#IMPORTCONTRACTCODE').val();
        console.log(importcode);
        var res = await $.ajax({
            url: $item.attr('ajaxurl'),
            method: 'POST',
            async: true,
            cache: false,
            data: { importContract: importcode }
        });
        $item.html('');
        if (res.IsOk) {
            console.log(res.dataObj);
            var data2 = res.dataObj;
            if (data2 != null) {
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
                for (var j = 0; j < data2.length; j++) {
                    var row = data2[j];
                    var $option = $('<option value="' + row[ValueCol] + '" ' + (selectItem == row[ValueCol] ? "selected" : "") + '>' + row[NameCol] + '</option>');
                    $optionList.push($option);
                }
                for (var j = 0; j < $optionList.length; j++) {
                    $item.append($optionList[j]);
                }
            }
        }
        await LoadItemContractCode($item);
        $item.on('change', async function () {
            await LoadItemContractCode($(this));
        });
    }
    //var i = 0;
    //for (let $mate of materialList) {
    //    await InitMaterial($mate);
    //}

    //InitMaterial($($('div[pklid=' + indexPKL + ']').find('select[name=MATERIALID]')));
    InitEnterSave($('div[pklid=' + indexPKL + ']'));
    ReFixHeightList();
    //$('#contentbody').find('input[name=over_' + code + ']').each(function () { $(this).uniform(); })
}

async function AddNewPKL() {
    countListPKLS = $('div[name=containeritem]').length;
    countListPKLS++;
    var data = [];
    var impFile = $('input[name=IMPFILE]').val();
    var splitCode = impFile.split('-');

    //var code = $('input[name=CONTRACTCODE]').val() + '-' + countListItem;
    //var code = 'Cnt No. ' + countListPKLS;
    var pklCodeName = splitCode[0] + ConvertIntToAlphabet(countListPKLS) + '-' + splitCode[1];
    //var code = 'Lot No. ' + pklCodeName;
    var code = 'Cnt No. ' + countListPKLS;
    var indexPKL = 'pkl_' + countListPKLS;
    data.push(code);
    data.push(indexPKL);
    //data.push(pklCodeName);
    data.push(countListPKLS);
    var html = await AjaxTemplate('ImportPKL', data);
    $('#actioncontent').before($(html));
    var countList = $('div[name=containeritem]').length;
    if (countList % 2 == 0) {
        var $rowfix = $('<div name="fixlistpkl" class="clearfix"></div>');
        $('#actioncontent').before($rowfix);
    }
    var materialList = [];
    $('div[pklid=' + indexPKL + ']').find('select[name=MATERIALFULL]').each(function () {
        materialList.push($(this));
        //InitMaterial($(this));
    });
    var i = 0;
    for await (let $mate of materialList) {
        //var $mate = materialList[i];
        await InitMaterial($mate);
    }

    //InitMaterial($($('div[pklid=' + indexPKL + ']').find('select[name=MATERIALID]')));
    InitEnterSave($('div[pklid=' + indexPKL + ']'));
    ReFixHeightList();
    //$('#contentbody').find('input[name=over_' + code + ']').each(function () { $(this).uniform(); })
}


async function InitMaterial(item) {
    var $item = $(item);
    await callAjaxMaterialImpFile(item);
}


async function callAjaxMaterialImpFile(item) {
    var $item = $(item);
    var importcode = $('#IMPORTCONTRACTCODE').val();
    console.log(importcode);
    var res = await $.ajax({
        url: $item.attr('ajaxurl'),
        method: 'POST',
        async: true,
        cache: false,
        data: { importContract: importcode }
    });
    $item.html('');
    if (res.IsOk) {
        console.log(res.dataObj);
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
    await LoadItemContractCode($item);
    $item.on('change', function () {
        LoadItemContractCode($(this));
    });

    //$.ajax({
    //    url: $item.attr('ajaxurl'),
    //    method: 'POST',
    //    data: { importContract: importcode },
    //    success: function (res) {
    //        $item.html('');
    //        if (res.IsOk) {
    //            console.log(res.data);
    //            var data = res.dataObj;
    //            if (data != null) {
    //                var ValueCol = "ID";
    //                if ($item.attr('data-value') != undefined) {
    //                    ValueCol = $item.attr('data-value');
    //                }
    //                var NameCol = "NAME";
    //                if ($item.attr('data-name') != undefined) {
    //                    NameCol = $item.attr('data-name');
    //                }
    //                var selectItem = $item.attr('data-selected');
    //                var $optionList = [];
    //                for (var i = 0; i < data.length; i++) {
    //                    var row = data[i];
    //                    var $option = $('<option value="' + row[ValueCol] + '" ' + (selectItem == row[ValueCol] ? "selected" : "") + '>' + row[NameCol] + '</option>');
    //                    $optionList.push($option);
    //                }
    //                for (var i = 0; i < $optionList.length; i++) {
    //                    $item.append($optionList[i]);
    //                }
    //            }
    //        }
    //        LoadItemContractCode($item);
    //        $item.on('change', function () {
    //            LoadItemContractCode($(this));
    //        });

    //    }

    //});
}

//async function AddNewPallet(item) {
//    //countListItem++;
//    var data = [];
//    //var code = $('input[name=CONTRACTCODE]').val() + '-' + countListItem;
//    //data.push(code);
//    var html = await AjaxTemplate('ImportPalletDetail', data);
//    $(item).closest('.row-fluid').find('#palletlist').append($(html));
//    //$('#contentbody').find('input[name=over_' + code + ']').each(function () { $(this).uniform(); })
//}
function InitEnterSave(item) {
    $(item).find('table input,table select').each(function () {
        $(this).on('keypress', function (e) {
            var $this = $(this);
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) { //Enter keycode
                var $tr = $this.closest('tr');
                var CanSave = true;
                //$tr.find('input, select').each(function () {
                //    if ($(this).val() == '') {
                //        CanSave = false;
                //    }
                //});
                if (CanSave) {
                    $($tr.find('button[name=saverowbtn] span')).click();
                }
            }
        });

    });
}

function ReActivateRefMaterial() {
    $('select[name=MATERIALID]').each(function () {
        callAjaxMaterialImpFile($(this));
    });
}


function LoadSubMaterialImpFile(item) {
    var value = $(item).val();
    var $submaterial = $($(item).closest('table').find('select[name=SUBMATERIALID]'));
    var importcode = $('#IMPORTCONTRACTCODE').val();
    $.ajax({
        method: 'POST',
        url: '/submat/getlistforimpfile',
        data: { importContract: importcode, materialid: value },
        success: function (res) {
            $submaterial.html('');
            console.log(res.data);
            if (res.IsOk) {
                if (res.dataObj != undefined) {
                    if (res.dataObj == null) {
                        if ($submaterial.attr('loadallsuboption') == 'true') {
                            var $optionsList = [];
                            var $optionAll = $('<option value="">--All Sub Material--</option>');
                            $optionsList.push($optionAll);
                            for (var i = 0; i < $optionsList.length; i++) {
                                $submaterial.append($optionsList[i]);
                            }
                        }
                        return;
                    }
                    var $optionsList = [];
                    if ($submaterial.attr('loadallsuboption') == 'true') {
                        var $optionAll = $('<option value="">--All Sub Material--</option>');
                        $optionsList.push($optionAll);
                    }
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.NAME + '</option>');
                        $optionsList.push($option);
                    }
                    for (var i = 0; i < $optionsList.length; i++) {
                        $submaterial.append($optionsList[i]);
                    }
                    if ($optionsList.length > 0) {
                        $submaterial.closest('.controls-left-50').show();
                    }
                }
            }
            else {
                $submaterial.html('');
            }
            $item.on("change", function () {
                LoadSubMaterialImpFile($(this));
            });
            LoadItemContractCode($item);
        }
    });
}

//function LoadItemContractCode(item) {
//    var submaterial = $(item).val();
//    var $material = $($(item).closest('table').find('select[name=MATERIALID]'));
//    var $itemcode = $($(item).closest('table').find('input[name=ITEMCODE]'));
//    var material = $material.val();
//    var importcode = $('#IMPORTCONTRACTCODE').val();
//    $.ajax({
//        method: 'POST',
//        url: '/importcon/getitemcontractcode',
//        data: { importContract: importcode, materialid: material, submaterialid: submaterial },
//        success: function (res) {
//            console.log(res.data);
//            if (res.IsOk) {
//                $itemcode.val(res.dataObj);
//                //$('table.importpallet').each(function () {
//                //    $(this).find('tbody tr[name=outputrow]').remove();
//                //});
//            }
//        }
//    });
//}

async function LoadItemContractCode(item) {
    var $item = $(item);
    //var submaterial = $(item).val();
    var $materialFULL = $(item);
    var material = $materialFULL.val().split('_')[0];
    var submaterial = $materialFULL.val().split('_')[1];
    var $itemcode = $($(item).closest('table').find('input[name=ITEMCODE]'));
    var $overunit = $($(item).closest('table').find('input[name=OVERUNIT]'));
    var $pricecontractcode = $($(item).closest('table').find('input[name=PRICEPALLET]'));
    //var material = $material.val();
    var importcode = $('#IMPORTCONTRACTCODE').val();
    var res = await $.ajax({
        method: 'POST',
        url: '/importcon/getitemcontractcode',
        async: true,
        cache: false,
        data: { importContract: importcode, materialid: material, submaterialid: submaterial }
    });
    if (res.IsOk) {
        var data = res.dataObj[0];
        $itemcode.val(data.ITEMCODE);
        $overunit.val(data.OVERUNIT);
        $pricecontractcode.val(data.PRICE);
        //$('table.importpallet').each(function () {
        //    $(this).find('tbody tr[name=outputrow]').remove();
        //});
    }
    //$.ajax({
    //    method: 'POST',
    //    url: '/importcon/getitemcontractcode',
    //    data: { importContract: importcode, materialid: material, submaterialid: submaterial },
    //    success: function (res) {
    //        if (res.IsOk) {
    //            var data = res.dataObj[0];
    //            $itemcode.val(data.ITEMCODE);
    //            $overunit.val(data.OVERUNIT);
    //            $pricecontractcode.val(data.PRICE);
    //            //$('table.importpallet').each(function () {
    //            //    $(this).find('tbody tr[name=outputrow]').remove();
    //            //});
    //        }
    //    }
    //});
}

function LoadSubMaterial(item) {
    var value = $(item).val();
    var $submaterial = $($(item).closest('table').find('select[name=SUBMATERIALID]'));
    $.ajax({
        method: 'POST',
        url: '/submat/getlistbyId',
        data: { value: value },
        success: function (res) {
            $submaterial.html('');
            if (res.IsOk) {
                if (res.dataObj != undefined) {
                    if (res.dataObj == null) {
                        if ($submaterial.attr('loadallsuboption') == 'true') {
                            var $optionsList = [];
                            var $optionAll = $('<option value="">--All Sub Material--</option>');
                            $optionsList.push($optionAll);
                            for (var i = 0; i < $optionsList.length; i++) {
                                $submaterial.append($optionsList[i]);
                            }
                        }
                        return;
                    }
                    var $optionsList = [];
                    if ($submaterial.attr('loadallsuboption') == 'true') {
                        var $optionAll = $('<option value="">--All Sub Material--</option>');
                        $optionsList.push($optionAll);
                    }
                    for (var i = 0; i < res.dataObj.length; i++) {
                        var item = res.dataObj[i];
                        var $option = $('<option value="' + item.ID + '">' + item.NAME + '</option>');
                        $optionsList.push($option);
                    }
                    for (var i = 0; i < $optionsList.length; i++) {
                        $submaterial.append($optionsList[i]);

                    }
                    if ($optionsList.length > 0) {
                        $submaterial.closest('.controls-left-50').show();
                    }
                }
            }
            else {
                $submaterial.html('');
            }
        }
    });
}

function RemovePallet(item) {
    var $tr = $(item).closest('tr');
    var $table = $(item).closest('table');
    var PALLETID = $tr.find('input[name=PALLETID]').val();
    if (PALLETID == '') {
        $tr.remove();
        RecallAVG($tr);
        ReloadNo($table);
        ReFixHeightList();
        ReCallTotal();
        CalcTotalforImp();
    }
    else {
        Swal.fire({
            title: 'Bạn có thực sự muốn xoá pallet này không?',
            text: "Bạn sẽ không thể hoàn tác!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý xóa!',
            cancelButtonText: 'Thoát'
        }).then(async (result) => {
            if (result.value) {
                $.ajax({
                    method: 'POST',
                    url: '/importpkl/deletepallet',
                    data: { id: PALLETID },
                    success: function (res) {
                        if (res.IsOk) {
                            $tr.remove();
                            RecallAVG($tr);
                            ReloadNo($table);
                            ReFixHeightList();
                            ReCallTotal();
                            CalcTotalforImp();
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

        //Swal.fire({
        //    type: 'error',
        //    title: 'Process fail',
        //    text: 'Can not delete this pallet. Please call administrator'
        //});

        //$.ajax({
        //    method: 'POST',
        //    url: '/importpkl/deletepallet',
        //    data: { id: PALLETID },
        //    success: function (res) {
        //        if (res.IsOk) {
        //            $tr.remove();
        //            RecallAVG($tr);
        //            ReloadNo($table);
        //            ReFixHeightList();
        //            ReCallTotal();
        //            CalcTotalforImp();
        //        }
        //        else {
        //            Swal.fire({
        //                type: 'error',
        //                title: 'Process fail',
        //                text: res.Msg
        //            });
        //        }
        //    }
        //});
    }
}

function ReloadNo(item) {
    var $item = $(item);
    var number = 0;
    $item.find('tr[name=outputrow]').each(function () {
        number++;
        $(this).find('td:first').html(number);
    });
}

function AddRowPallet(item) {
    var $item = $(item);
    var $row = $item.closest('tr');
    var filecode = $('input[name=IMPFILE]').val();
    var $contentPKL = $item.closest('#palletlist');
    var input = {};
    $contentPKL.find('table tbody tr[name=inputrow] input, table tbody tr[name=inputrow] select').each(function () {
        if ($(this)[0].tagName.toLowerCase() != 'select') {
            input[$(this).attr('name')] = ($(this).val() != '' ? $(this).val() : '0');
        }
        else {
            input[$(this).attr('name')] = $(this).val();
        }
    });
    input['PKLNAME'] = $contentPKL.find('input[name=PKLNAME]').val();
    input['ITEMCODE'] = $contentPKL.find('input[name=ITEMCODE]').val();
    input['MATERIALNAME'] = $contentPKL.find('select[name=MATERIALFULL] option:selected').text();
    var MaterialID = input['MATERIALFULL'].split('_')[0];
    var SubMaterialID = input['MATERIALFULL'].split('_')[1];
    //input['SUBMATERIALNAME'] = $contentPKL.find('select[name=SUBMATERIALID] option:selected').text();
    var number = $(item).closest('tbody').find('tr[name=outputrow]').length;
    number++;
    var numberSeQ = parseInt($contentPKL.find('input[name=NoSEQ]').val());
    numberSeQ++;
    if (input['PKLNAME'] == '') {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            text: 'Please Fill In Cnt No.'
        });
        return;
    }
    var palletName = filecode + '-' + input['PKLNAME'] + "-" + numberSeQ.ToCustomLength(2);
    var MATERIALID = parseInt(MaterialID);
    var SUBMATERIALID = (SubMaterialID != '0' ? parseInt(SubMaterialID) : '');
    var itemcontractcode = input['ITEMCODE'];
    var PCS = parseFloat(input['PCS']);
    var NW = parseFloat(input['NW']);
    var SQFT = parseFloat(input['SQFT']);
    var pricepallet = parseFloat($contentPKL.find('input[name=PRICEPALLET]').val());
    var overunit = $contentPKL.find('input[name=OVERUNIT]').val();
    switch (overunit) {
        case "kgs":
            pricepallet = pricepallet * NW;
            break;
        case "pcs":
            pricepallet = pricepallet * PCS;
            break;
        case "sqft":
            pricepallet = pricepallet * SQFT;
            break;
    }
    var SAVG = PCS == 0 ? 0 : SQFT / PCS;
    var WAVG = PCS == 0 ? 0 : NW / PCS;
    var palletnameshow = numberSeQ.ToCustomLength(2);
    var $tr = $('<tr name="outputrow"></tr>');
    var $No = $('<td>' + number + '</td>');
    var $PalletNo = $('<td><input type="hidden" name="PALLETID" value=""/><input type="hidden" name="INDEXPKL" value="' + number + '"/><input type="hidden" name="PRICEPALLET" value="' + pricepallet + '"/><input type="hidden" name="NAME" value="' + palletName + '"/><input type="hidden" name="ITEMCONTRACTCODE" value="' + itemcontractcode + '" />' + palletnameshow + '</td>');
    var $Material = $('<td><input type="hidden" name="SELECTEDSUBMATERIAL" value="' + SUBMATERIALID + '" /><input type="hidden" name="SELECTEDMATERIAL" value="' + MATERIALID + '" />' + input['MATERIALNAME'] + '</td>');
    //var $SubMaterial = $('<td><input type="hidden" name="SELECTEDSUBMATERIAL" value="' + SUBMATERIALID + '" />' + input['SUBMATERIALNAME'] + '</td>');
    var $PCS = $('<td><input type="hidden" name="PCS" value="' + PCS + '"/>' + PCS + '</td>');
    var $NW = $('<td><input type="hidden" name="NW" value="' + NW + '"/><input type="hidden" name="WAVG" value="' + WAVG + '"/>' + NW + '</td>');
    var $SQFT = $('<td><input type="hidden" name="SQFT" value="' + SQFT + '"/><input type="hidden" name="SAVG" value="' + SAVG + '"/>' + SQFT + '</td>');
    var $WAVG = $('<td>' + WAVG.toString() + '</td>');
    var $SAVG = $('<td>' + SAVG.toString() + '</td>');
    var $actioncol = $('<td><button type="button" style="cursor: pointer;"><span onclick="RemovePallet(this)" class="icon-minus"></span></button></td>');
    //$tr.append($No).append($PalletNo).append($Material).append($SubMaterial).append($PCS).append($NW).append($SQFT).append($WAVG).append($SAVG).append($actioncol);
    $tr.append($No).append($PalletNo).append($Material).append($PCS).append($NW).append($SQFT).append($WAVG).append($SAVG).append($actioncol);
    $($(item).closest('tbody')).append($tr);
    $contentPKL.find('input[name=NoSEQ]').val(numberSeQ.toString());
    $item.closest('div[name=containeritem]').find('div[name=printimportpallet]').hide();
    var $table = $item.closest('table');
    var $avgrow = $item.closest('table').find('tbody tr[name=avgrow]');
    var $totalrow = $item.closest('table').find('tfoot tr[name=totalrow]');
    var sumavg = 0;
    var sumsavg = 0;
    var sumpcs = 0;
    var avgavg = 0;
    var avgsavg = 0;
    //var countoutputrow = 0;
    $table.find('tbody tr[name=outputrow]').each(function () {
        var wavg = parseFloat($(this).find('input[name=NW]').val());
        var savg = parseFloat($(this).find('input[name=SQFT]').val());
        var pcs = parseFloat($(this).find('input[name=PCS]').val());
        sumavg += wavg;
        sumsavg += savg;
        sumpcs += pcs;
        //countoutputrow++;
    });
    avgavg = (sumpcs != 0 ? sumavg / sumpcs : 0);
    avgsavg = (sumpcs != 0 ? sumsavg / sumpcs : 0);
    $avgrow.find('span[name=avg]').html(avgavg.toFixed(1));
    $avgrow.find('span[name=savg]').html(avgsavg.toFixed(1));
    $totalrow.find('span[name=totalpcs]').html(sumpcs.toFixed(1));
    $totalrow.find('span[name=totalavg]').html(sumavg.toFixed(1));
    $totalrow.find('span[name=totalsavg]').html(sumsavg.toFixed(1));
    ReFixHeightList();
    ReCallTotal();
    CalcTotalforImp();
}

function CalcTotalforImp() {
    var totalpallet = 0;
    var totalpcs = 0;
    var totalnw = 0;
    var totalsqft = 0;
    $('body').find('tr[name=outputrow]').each(function () {
        totalpallet++;
        var nw = parseFloat($(this).find('input[name=NW]').val());
        var sqft = parseFloat($(this).find('input[name=SQFT]').val());
        var pcs = parseFloat($(this).find('input[name=PCS]').val());
        totalnw += nw;
        totalpcs += pcs;
        totalsqft += sqft;
    });
    $('input[name=TOTALPCS]').val(totalpcs);
    $('input[name=TOTALPALLET]').val(totalpallet);
    $('input[name=TOTALNW]').val(totalnw);
    $('input[name=TOTALSQFT]').val(totalsqft);
}

function RecallAVG(item) {
    var $item = $(item);
    var $table = $item.closest('table');
    var $avgrow = $item.closest('table').find('tbody tr[name=avgrow]');
    var $totalrow = $item.closest('table').find('tfoot tr[name=totalrow]');
    var sumavg = 0;
    var sumsavg = 0;
    var sumpcs = 0;
    var avgavg = 0;
    var avgsavg = 0;
    var countoutputrow = 0;
    $table.find('tbody tr[name=outputrow]').each(function () {
        var wavg = parseFloat($(this).find('input[name=NW]').val());
        var savg = parseFloat($(this).find('input[name=SQFT]').val());
        var pcs = parseFloat($(this).find('input[name=PCS]').val());
        sumavg += wavg;
        sumsavg += savg;
        sumpcs += pcs;
        countoutputrow++;
    });
    avgavg = sumavg / sumpcs;
    avgsavg = sumsavg / sumpcs;
    $avgrow.find('span[name=avg]').html(avgavg.toFixed(1));
    $avgrow.find('span[name=savg]').html(avgsavg.toFixed(1));
    $totalrow.find('span[name=totalavg]').html(avgavg.toFixed(1));
    $totalrow.find('span[name=totalsavg]').html(avgsavg.toFixed(1));
}

function ReCallTotal() {
    var total = 0;
    $('body').find('tr[name=outputrow] input[name=PRICEPALLET]').each(function () {
        total = total + parseFloat($(this).val());
    });
    $('input[name=INVOICEVALUE]').val(total.toFixed(2));
    CalcTotalforImp();
}


async function PrintImportPallet(item) {
    var $item = $(item);
    var $palletitem = $item.closest('div[name=containeritem]').find('#palletlist');
    var pklName = $palletitem.find('input[name=PKLNAME]').val();
    var printhtml = '';
    var lstPrintData = $palletitem.find('table.importpallet tbody tr[name=outputrow]');
    for (var i = 0; i < lstPrintData.length; i++) {
        var palletcode = $(lstPrintData[i]).find('input[name=NAME]').val();
        var palletSingle = await GetPalletTemplatePrint(palletcode);
        printhtml += palletSingle;
        printhtml += '<div style="clear:both;height: 36.5mm;"></div>';
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
async function CallGetTemplatePrint(url, data) {
    var res = await $.ajax({
        url: url,
        type: 'POST',
        async: true,
        cache: false,
        data: { info: data }
    });
    return res;
}

async function GetPalletTemplatePrint(palletcode) {
    var res = await CallGetTemplatePrint('/importfile/getpalletcode', palletcode);
    if (res.IsOk) {
        return res.dataObj.TEMPLATEPRINT;
    }
    else {
        return '';
    }
}

function SaveImportFileContract() {
    var fullcontract = {};
    var $itemContainer = [];
    $('#detail').find('input, textarea, select').each(function () {
        fullcontract[$(this).attr('name')] = $(this).val();
    });
    if ($('input[name=ISLWG]').is(':checked')) {
        fullcontract['ISLWG'] = true;
    }
    else {
        fullcontract['ISLWG'] = false;
    }
    $('div[name=containeritem]').each(function () {
        var $containerdetail = {};
        $containerdetail['PKLNAME'] = $(this).find('input[name=PKLNAME]').val();
        $containerdetail['IMPFILE'] = fullcontract['IMPFILE'];
        $containerdetail['PKLIDENTITY'] = $(this).find('input[name=PKLIDENTITY]').val();
        var $PalletList = [];
        $(this).find('table.importpallet tr[name=outputrow]').each(function () {
            var $pallet = {};
            $(this).find('input, select').each(function () {
                $pallet[$(this).attr('name')] = $(this).val();
            });
            $PalletList.push($pallet);
        });
        $containerdetail['PalletList'] = $PalletList;
        $itemContainer.push($containerdetail);
    });
    fullcontract['ListContainer'] = $itemContainer;
    $.ajax({
        method: 'POST',
        url: '/importfile/save',
        data: { info: fullcontract },
        success: function (res) {
            if (res.IsOk) {
                Swal.fire(
                    'Save data successful',
                    '',
                    'Ok'
                );
                $("#contentbody").find('div[name=printimportpallet]').each(function () {
                    $(this).show();
                });
                window.location.href = '/importfile';
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


function UpdateImportFileContract() {
    var fullcontract = {};
    var $itemContainer = [];
    $('#detail').find('input, textarea, select').each(function () {
        fullcontract[$(this).attr('name')] = $(this).val();
    });
    if ($('input[name=ISLWG]').is(':checked')) {
        fullcontract['ISLWG'] = true;
    }
    else {
        fullcontract['ISLWG'] = false;
    }
    $('div[name=containeritem]').each(function () {
        var $containerdetail = {};
        $containerdetail['PKLNAME'] = $(this).find('input[name=PKLNAME]').val();
        $containerdetail['CNTID'] = $(this).find('input[name=CNTID]').val();
        $containerdetail['IMPFILE'] = fullcontract['IMPFILE'];
        $containerdetail['PKLIDENTITY'] = $(this).find('input[name=PKLIDENTITY]').val();
        var $PalletList = [];
        $(this).find('table.importpallet tr[name=outputrow]').each(function () {
            var $pallet = {};
            $(this).find('input, select').each(function () {
                $pallet[$(this).attr('name')] = $(this).val();
            });
            $PalletList.push($pallet);
        });
        $containerdetail['PalletList'] = $PalletList;
        $itemContainer.push($containerdetail);
    });
    fullcontract['ListContainer'] = $itemContainer;
    $.ajax({
        method: 'POST',
        url: '/importfile/update',
        data: { info: fullcontract },
        success: function (res) {
            if (res.IsOk) {
                Swal.fire(
                    'Save data successful',
                    '',
                    'Ok'
                );
                $("#contentbody").find('div[name=printimportpallet]').each(function () {
                    $(this).show();
                });
                window.location.href = '/importfile';
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

function RemoveCnt(item, idData) {
    var $item = $(item);
    var $container = $item.closest('div[name=containeritem]');
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
                url: '/importpkl/delete',
                data: { id: idData },
                success: function (res) {
                    if (res.IsOk) {
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        );
                        $container.remove();
                        $('input[name=QUANTITYPKL]').val(parseInt($('input[name=QUANTITYPKL]').val()) - 1);
                        ReCallTotal();
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
}

function InitImportFileName(item) {
    var $item = $(item);
    $.ajax({
        url: '/importfile/generatename',
        type: 'POST',
        success: function (res) {
            if (res.IsOk) {
                $item.val(res.dataObj);
            }
        }
    });
}

function UploadClick(item) {
    var $item = $(item);
    var $uploadcomponent = $item.closest('.portlet-title').find('input[name=fileupload]');
    $uploadcomponent.click();
}


function UploadAllClick() {
    var $uploadcomponent = $('input[name=fileuploadall]');
    $uploadcomponent.click();
}

async function UploadFileExcelAll(item) {
    $('div[name=containeritem]').remove();
    var $item = $(item);
    var data = new FormData();
    var files = $(item)[0].files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        data.append('file', file);
    }
    var res = await AjaxUpload('/importfile/uploadfilepalletall', 'POST', data);
    if (res.IsOk) {
        var dataList = res.dataObj;
        var pklCount = 0;
        var pklList = [];
        for (var i = 0; i < dataList.length; i++) {
            var ele = dataList[i];
            //dataList.forEach(ele => {
            if (pklList.length == 0) {
                pklList.push(ele.PKLIDENTITY);
                pklCount++;
            }
            else {
                if (pklList.filter(x => x == ele.PKLIDENTITY).length == 0) {
                    pklList.push(ele.PKLIDENTITY);
                    pklCount++;
                }
            }
        }
        //);
        $('input[name=QUANTITYPKL]').val(pklCount.toString());
        await AutoInitContainer2($('input[name=QUANTITYPKL]'));

        var index = 0;
        var arrDiv = $('div[name=containeritem]');
        for (var i = 0; i < arrDiv.length; i++) {
            var $item = $(arrDiv[i]);
            //await $('div[name=containeritem]').each(async function () {
            //var $item = $(this);
            var pkliden = pklList[index];
            $item.find('input[name=PKLIDENTITY]').val(pkliden);
            var $parent = $item.find('#palletlist');
            var dataIn = dataList.filter(x => x.PKLIDENTITY == pkliden);
            await FillPalletData(dataIn, $parent);
            ReFixHeightList();
            ReCallTotal();
            CalcTotalforImp();
            index++;
        }
        //);

    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: res.Msg
        });
    }
}

async function UploadFileExcel(item) {
    var $item = $(item);
    var data = new FormData();
    var files = $(item)[0].files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        data.append('file', file);
    }
    var res = await AjaxUpload('/importfile/uploadfilepallet', 'POST', data);
    if (res.IsOk) {
        var $parent = $item.closest('.portlet').find('#palletlist');
        await FillPalletData(res.dataObj, $parent);
        ReFixHeightList();
        ReCallTotal();
        CalcTotalforImp();
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: res.Msg
        });
    }
}
async function FillPalletData(lst, item) {
    for (var i = 0; i < lst.length; i++) {
        var ele = lst[i];
        //lst.forEach(ele => {
        //var $item = $(item);
        //var $row = $item.closest('tr');
        var filecode = $('input[name=IMPFILE]').val();
        var $contentPKL = $(item);
        var input = {};
        //$contentPKL.find('table tbody tr[name=inputrow] input, table tbody tr[name=inputrow] select').each(function () {
        //    if ($(this)[0].tagName.toLowerCase() != 'select') {
        //        input[$(this).attr('name')] = ($(this).val() != '' ? $(this).val() : '0');
        //    }
        //    else {
        //        input[$(this).attr('name')] = $(this).val();
        //    }
        //});
        input['PCS'] = ele.PCS;
        input['NW'] = ele.NW;
        input['SQFT'] = ele.SQFT;
        var optionMATERIAL = [];
        $contentPKL.find('select[name=MATERIALFULL] option').each(function () {
            var value = $(this).val();
            var text = $(this).html();
            optionMATERIAL.push({ id: value, text: text });
        });
        var IDMERGE;
        var findMerge = optionMATERIAL.filter(x => x.text == ele.SELECTIONNAME);
        if (findMerge != undefined && findMerge.length > 0) {
            IDMERGE = findMerge[0].id;
        }
        if (IDMERGE != undefined) {
            $contentPKL.find('select[name=MATERIALFULL]').val(IDMERGE);
            await LoadItemContractCode($contentPKL.find('select[name=MATERIALFULL]'));
            input['PKLNAME'] = $contentPKL.find('input[name=PKLNAME]').val();
            input['ITEMCODE'] = $contentPKL.find('input[name=ITEMCODE]').val();
            input['MATERIALNAME'] = ele.SELECTIONNAME;
            var MaterialID = IDMERGE.split('_')[0];
            var SubMaterialID = IDMERGE.split('_')[1];
            var number = $contentPKL.find('table tbody tr[name=outputrow]').length;
            number++;
            var numberSeQ = parseInt($contentPKL.find('input[name=NoSEQ]').val());
            numberSeQ++;
            //$contentPKL.find('input[name=NoSEQ]').val(numberSeQ.toString());
            if (input['PKLNAME'] == '') {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: 'Please Fill In Cnt No.'
                });
                return;
            }
            var palletName = filecode + '-' + input['PKLNAME'] + "-" + numberSeQ.ToCustomLength(2);
            var MATERIALID = parseInt(MaterialID);
            var SUBMATERIALID = (SubMaterialID != '0' ? parseInt(SubMaterialID) : '');
            var itemcontractcode = input['ITEMCODE'];
            var PCS = input['PCS'] != '' ? parseFloat(input['PCS']) : 0;
            var NW = input['NW'] != '' ? parseFloat(input['NW']) : 0;
            var SQFT = input['SQFT'] != '' ? parseFloat(input['SQFT']) : 0;
            var pricepallet = parseFloat($contentPKL.find('tr[name=inputrow] input[name=PRICEPALLET]').val());
            var overunit = $contentPKL.find('input[name=OVERUNIT]').val();
            switch (overunit) {
                case "kgs":
                    pricepallet = pricepallet * NW;
                    break;
                case "pcs":
                    pricepallet = pricepallet * PCS;
                    break;
                case "sqft":
                    pricepallet = pricepallet * SQFT;
                    break;
            }
            var SAVG = PCS == 0 ? 0 : SQFT / PCS;
            var WAVG = PCS == 0 ? 0 : NW / PCS;
            var palletnameshow = numberSeQ.ToCustomLength(2);
            var $tr = $('<tr name="outputrow"></tr>');
            var $No = $('<td>' + number + '</td>');
            var $PalletNo = $('<td><input type="hidden" name="PALLETID" value=""/><input type="hidden" name="INDEXPKL" value="' + number + '"/><input type="hidden" name="PRICEPALLET" value="' + pricepallet + '"/><input type="hidden" name="NAME" value="' + palletName + '"/><input type="hidden" name="ITEMCONTRACTCODE" value="' + itemcontractcode + '" />' + palletnameshow + '</td>');
            var $Material = $('<td><input type="hidden" name="SELECTEDSUBMATERIAL" value="' + SUBMATERIALID + '" /><input type="hidden" name="SELECTEDMATERIAL" value="' + MATERIALID + '" />' + input['MATERIALNAME'] + '</td>');
            //var $SubMaterial = $('<td><input type="hidden" name="SELECTEDSUBMATERIAL" value="' + SUBMATERIALID + '" />' + input['SUBMATERIALNAME'] + '</td>');
            var $PCS = $('<td><input type="hidden" name="PCS" value="' + PCS + '"/>' + PCS + '</td>');
            var $NW = $('<td><input type="hidden" name="NW" value="' + NW + '"/><input type="hidden" name="WAVG" value="' + WAVG + '"/>' + NW + '</td>');
            var $SQFT = $('<td><input type="hidden" name="SQFT" value="' + SQFT + '"/><input type="hidden" name="SAVG" value="' + SAVG + '"/>' + SQFT + '</td>');
            var $WAVG = $('<td>' + WAVG.toFixed(2) + '</td>');
            var $SAVG = $('<td>' + SAVG.toFixed(2) + '</td>');
            var $actioncol = $('<td><button type="button" style="cursor: pointer;"><span onclick="RemovePallet(this)" class="icon-minus"></span></button></td>');
            //$tr.append($No).append($PalletNo).append($Material).append($SubMaterial).append($PCS).append($NW).append($SQFT).append($WAVG).append($SAVG).append($actioncol);
            $tr.append($No).append($PalletNo).append($Material).append($PCS).append($NW).append($SQFT).append($WAVG).append($SAVG).append($actioncol);
            var $table = $contentPKL.find('.importpallet');
            $($table.find('tbody')).append($tr);
            $contentPKL.find('input[name=NoSEQ]').val(numberSeQ.toString());
            //$item.closest('div[name=containeritem]').find('div[name=printimportpallet]').hide();
            var $avgrow = $table.find('tbody tr[name=avgrow]');
            var $totalrow = $table.find('tfoot tr[name=totalrow]');
            var sumavg = 0;
            var sumsavg = 0;
            var sumpcs = 0;
            var avgavg = 0;
            var avgsavg = 0;
            //var countoutputrow = 0;
            $table.find('tbody tr[name=outputrow]').each(function () {
                var wavg = parseFloat($(this).find('input[name=NW]').val());
                var savg = parseFloat($(this).find('input[name=SQFT]').val());
                var pcs = parseFloat($(this).find('input[name=PCS]').val());
                sumavg += wavg;
                sumsavg += savg;
                sumpcs += pcs;
                //countoutputrow++;
            });
            avgavg = (sumpcs != 0 ? sumavg / sumpcs : 0);
            avgsavg = (sumpcs != 0 ? sumsavg / sumpcs : 0);
            $avgrow.find('span[name=avg]').html(avgavg.toFixed(1));
            $avgrow.find('span[name=savg]').html(avgsavg.toFixed(1));
            $totalrow.find('span[name=totalpcs]').html(sumpcs.toFixed(1));
            $totalrow.find('span[name=totalavg]').html(sumavg.toFixed(1));
            $totalrow.find('span[name=totalsavg]').html(sumsavg.toFixed(1));
        }

    }
    //);
}

function UpdateDateIMP() {
    var impfileNew = $('input[name=IMPFILE]').val();
    $('#palletlist').find('tr[name=outputrow]').each(function () {
        var $inputhidden = $(this).find('input[name=NAME]');
        var currValue = $inputhidden.val();
        var oldimpVal = currValue.split('-')[0];
        $inputhidden.val(currValue.replace(oldimpVal, impfileNew));
    });
}