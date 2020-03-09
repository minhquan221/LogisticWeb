async function BeginWarehousingClick() {
    var id = $('#formdetail input[name=ID]').val();
    var CntIdentity = $('#formdetail').find('label[name=PKLIDENTITY]').html();
    var Impfile = $('#formdetail').find('label[name=IMPFILE]').html();
    Swal.fire({
        title: 'Bạn có thực sự muốn nhập kho lô ' + CntIdentity + ' này?',
        text: "Bạn sẽ không thể hoàn tác!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý nhập kho!',
        cancelButtonText: 'Thoát'
    }).then(async (result) => {
        if (result.value) {
            var res = await GenerateCodeImpFile(id);
            if (!res.IsOk) {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: res.Msg
                });
            }
            else {
                //var datasocket = {
                //    Container: CntIdentity,
                //    ImpFile: Impfile
                //};

                var printhtml = await GetPrintList(id);
                var datasocket = {
                    TYPE: "WAREHOUSING",
                    URL: "",
                    MESSAGE: 'Cnt. ' + CntIdentity + ' of IMP: ' + Impfile + ' has stocked',
                    USERCREATED: loginUser.USERNAME,
                    READDATE: null
                };

                PushSocketWarehousing(datasocket);
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
    });
}

async function BeginWarehousing(id) {
    var $tr = $('#tbList').find('tr[item-key=' + id + ']');
    var CntIdentity = $($tr.find('td')[1]).find('span').html();
    Swal.fire({
        title: 'Bạn có thực sự muốn nhập kho lô ' + CntIdentity + ' này?',
        text: "Bạn sẽ không thể hoàn tác!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý nhập kho!',
        cancelButtonText: 'Thoát'
    }).then(async (result) => {
        if (result.value) {
            var res = await GenerateCodeImpFile(id);
            if (!res.IsOk) {
                Swal.fire({
                    type: 'error',
                    title: 'Process fail',
                    text: res.Msg
                });
            }
            else {
                var printhtml = await GetPrintList(id);
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
    });
}

async function GenerateCodeImpFile(id) {
    var res = await $.ajax({
        url: 'importpkl/beginwarehousing',
        type: 'POST',
        async: true,
        cache: false,
        data: { id: id }
    });
    return res;
}

async function GetPrintList(id) {
    var res = await $.ajax({
        url: 'importpkl/getallpalletprint',
        type: 'POST',
        async: true,
        cache: false,
        data: { id: id }
    });
    return res;
}

async function ShowInfo(item) {
    //var $item = $(item);
    //var itemkey = $item.attr('item-key');
    var detail = await GetDetailPKL(item);
    if (detail.IsOk) {
        $('#formdetail').find('label').each(function () {
            var name = $(this).attr('name');
            switch (name) {
                case "NUMBERPALLET":
                    $(this).html(detail.dataObj[name] + ' PK');
                    break;
                case "TOTALWEIGHT":
                    $(this).html(detail.dataObj[name] + ' KGS');
                    break;
                case "TOTALPCS":
                    $(this).html(detail.dataObj[name] + ' PCS');
                    break;
                default:
                    $(this).html(detail.dataObj[name]);
                    break;

            }
        });
        $('#formdetail').find('input[name=ID]').val(detail.dataObj.ID);
        $('#formdetail').show();
    }
    else {
        $('#formdetail').hide();
    }
}

async function GetDetailPKL(id) {
    var res = await $.ajax({
        url: 'importpkl/getdetailwarehousing',
        type: 'POST',
        async: true,
        cache: false,
        data: { id: id }
    });
    return res;
}