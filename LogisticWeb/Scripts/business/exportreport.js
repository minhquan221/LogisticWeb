function ValidateDate() {
    var datefrom = $('input[name=fromdate]').datepicker('getDate');
    var todate = $('input[name=todate]').datepicker('getDate');
    if (datefrom != null && todate != null) {
        if (todate < datefrom) {
            Swal.fire({
                type: 'error',
                title: 'Error',
                text: "DateTo must equal or higher than DateFrom"
            });
            $('input[name=todate]').datepicker('update', datefrom);
            $('input[name=todate]').datepicker('update', null);
        }
    }
}

function ExportData() {
    var datefrom = $('input[name=fromdate]').val();
    var todate = $('input[name=todate]').val();
    $.ajax({
        url: '/report/exportstock',
        type: 'POST',
        data: { datefrom: datefrom, dateto: todate },
        success: function (res) {
            if (res.IsOk) {
                if (res.dataObj != '') {
                    download("Export_IN_OUT_STORE.xlsx", res.dataObj);
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
}