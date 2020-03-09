$.fn.imagesLoaded = function () {
    var $imgs = this.find('img[src!=""]');
    if (!$imgs.length) { return $.Deferred().resolve().promise(); }
    var dfds = [];
    $imgs.each(function () {

        var dfd = $.Deferred();
        dfds.push(dfd);
        var img = new Image();
        img.onload = function () { dfd.resolve(); }
        img.onerror = function () { dfd.resolve(); }
        img.src = this.src;

    });
    return $.when.apply($, dfds);
};
Number.prototype.FormatNumberCustom = function(isSubStr) {
    try {
        var data = this.toString();
        var convert = '';
        var count = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            count++;
            if (count == 3) {
                convert += data[i] + ',';
                count = 0;
            }
            else {
                convert += data[i];
            }
        }
        var result = '';
        for (var i = convert.length - 1; i >= 0; i--) {
            if (convert[i] == ',' && i == convert.length - 1)
                continue
            else
                result += convert[i];
        }
        return result;
    }
    catch (err) {
        return this;
    }
}

Number.prototype.FormatSubStrLength = function (lengthString) {
    var currentlength = this.toString().length;
    if (currentlength > lengthString) {
        var fullVal = this.toString();
        var SubVal = this.toString().substr(0, lengthString - 3) + "...";
        //return "<span title='" + fullVal + "'>" + SubVal + "</span>";
        return SubVal;
    }
    else {
        return this.toString();
    }


    //var currentlength = this.toString().length;
    //if (currentlength > lengthString) {
    //    var fullVal = this.toString();
    //    var SubVal = this.toString().substr(0, lengthString - 3) + "...";
    //    return "<span title='" + fullVal + "'>" + fullVal + "</span>";
    //}
    //else {
    //    return this.toString();
    //}
}

String.prototype.FormatSubStrLength = function (lengthString) {
    var currentlength = this.length;
    if (currentlength > lengthString) {
        var fullVal = this;
        var SubVal = this.substr(0, lengthString - 3) + "...";
        //return "<span title='" + fullVal + "'>" + SubVal + "</span>";
        return SubVal;
    }
    else {
        return this;
    }


    //var currentlength = this.length;
    //if (currentlength > lengthString) {
    //    var fullVal = this;
    //    var SubVal = this.substr(0, lengthString - 3) + "...";
    //    return "<span title='" + fullVal + "'>" + fullVal + "</span>";
    //}
    //else {
    //    return this;
    //}
}

String.prototype.FormatNumberCustom = function (isSubStr) {
    try {
        if (!isNaN(parseFloat(this))) {
            var data = this;
            var convert = '';
            var count = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                count++;
                if (count == 3) {
                    convert += data[i] + ',';
                    count = 0;
                }
                else {
                    convert += data[i];
                }
            }
            var result = '';
            for (var i = convert.length - 1; i >= 0; i--) {
                if (convert[i] == ',' && i == convert.length - 1)
                    continue
                else
                    result += convert[i];
            }
            return result;
        }
        else {
            if (isSubStr == true) {
                return this.FormatSubStrLength(15);
            }
            else {
                return this;
            }
        }
    }
    catch (err) {
        if (isSubStr == true) {
            return this.FormatSubStrLength(15);
        }
        else {
            return this;
        }
    }
}



Number.prototype.ToCustomLength = function (num) {
    var data = this;
    var resultString = '';
    if (data.toString().length < num) {
        for (var i = 1; i <= num - data.toString().length; i++) {
            resultString += "0";
        }
        resultString += data.toString();
    }
    else {
        resultString = data.toString();
    }
    return resultString;
}
Date.prototype.GetDateCustom = function (num) {
    var date = new Date(this.valueOf());
    var data = date.getDate();
    var resultString = '';
    if (data.toString().length < num) {
        for (var i = 1; i <= num - data.toString().length; i++) {
            resultString += "0";
        }
        resultString += data.toString();
    }
    else {
        resultString = data.toString();
    }
    return resultString;
};
Date.prototype.GetMonthCustom = function (num) {
    var date = new Date(this.valueOf());
    var data = date.getMonth() + 1;
    var resultString = '';
    if (data.toString().length < num) {
        for (var i = 1; i <= num - data.toString().length; i++) {
            resultString += "0";
        }
        resultString += data.toString();
    }
    else {
        resultString = data.toString();
    }
    return resultString;
};
Date.prototype.GetHourCustom = function (num) {
    var date = new Date(this.valueOf());
    var data = date.getHours();
    var resultString = '';
    if (data.toString().length < num) {
        for (var i = 1; i <= num - data.toString().length; i++) {
            resultString += "0";
        }
        resultString += data.toString();
    }
    else {
        resultString = data.toString();
    }
    return resultString;
};
Date.prototype.GetMinuteCustom = function (num) {
    var date = new Date(this.valueOf());
    var data = date.getMinutes();
    var resultString = '';
    if (data.toString().length < num) {
        for (var i = 1; i <= num - data.toString().length; i++) {
            resultString += "0";
        }
        resultString += data.toString();
    }
    else {
        resultString = data.toString();
    }
    return resultString;
};
Date.prototype.GetSecondCustom = function (num) {
    var date = new Date(this.valueOf());
    var data = date.getSeconds();
    var resultString = '';
    if (data.toString().length < num) {
        for (var i = 1; i <= num - data.toString().length; i++) {
            resultString += "0";
        }
        resultString += data.toString();
    }
    else {
        resultString = data.toString();
    }
    return resultString;
};
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
};
    
Date.prototype.GetFullDateCustom = function (h) {
    return this.GetDateCustom() + "/" + this.GetMonthCustom() + "/" + this.getFullYear();
};

Date.prototype.GetFullReverseDateCustom = function (h) {
    return this.getFullYear() + "-" + this.GetMonthCustom() + "-" + this.GetDateCustom();
};

async function AjaxTemplate(nameTemplate, data) {
    var templateLoad = {
        Name: nameTemplate,
        array: data
    };
    var res = await $.ajax({
        url: '/common/responseviewtemplate',
        type: 'POST',
        async: true,
        cache: false,
        data: templateLoad
    });
    return res.data;
}

function Delete(item) {
    var $item = $(item);
    var idData = $item.attr('data-id');
    var control = $item.closest("table").attr("control");
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
                url: '/' + control + '/delete',
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

function GenerateSiteMap() {
    var locationW = window.location.href;
    var parseLocation = locationW.split('/');
    var $sitemap = [];
    var $liHome = $('<li><i class="icon-home"></i><a href="/">Home</a><i class="icon-angle-right"></i></li>');
    var urlString = '';
    for (var i = 0; i < parseLocation.length; i++) {
        var $item = parseLocation[i];
        if ($item.indexOf('https') >= 0 || $item.indexOf('http') >= 0) {
            continue;
        }
        if ($item.indexOf('.com') >= 0) {
            continue;
        }
        if ($item == '') {
            continue;
        }
        urlString += '/' + $item;
        if (i == parseLocation.length - 1 && $item != '') {
            $sitemap.push($('<li><a href="javascript:void(0)">' + $item.split('?')[0] + '</a><i class="icon-angle-right"></i></li>'));
        }
        else {
            $sitemap.push($('<li><a href="' + urlString + '">' + $item.split('?')[0] + '</a><i class="icon-angle-right"></i></li>'));
        }
    }
    $('.sitemap').append($liHome);
    for (var i = 0; i < $sitemap.length; i++) {
        $('.sitemap').append($sitemap[i]);
    }

}

function GotoUrl(item) {
    window.location.href = $(item).attr('url');
}

function PopUp(title, message, type, action, callbackrejectevent, typenote, datastring, returnlink, attrnote) {
    var options = {
        title: title,
        message: message,
        type: type,
        action: action,
        callbackrejectevent: callbackrejectevent,
        typenote: typenote,
        datastring: datastring,
        returnlink: returnlink,
        attrnote: attrnote,
        notemaxlength: PopupNote.maxlength,
        noteminlength: PopupNote.minlength,
    };
    $('.popupjs').popup_js('reinit', options);
}
function CallBackReturnPop(url) {
    if (url != '') {
        window.location.href = url;
    }
}

function BlockUI(msg) {
    $('#maskBoxes').show();
    if (typeof msg !== undefined) {
        $('#sgLoading').text(msg);
    }
}
function unBlockUI() {
    $('#maskBoxes').hide();
}

$(document).ready(function () {
    $.ajaxSetup({
        beforeSend: function () {
            BlockUI();
        },
        error: function (err) {
            unBlockUI();
            if (err.StatusCode === 403) {
                window.location.href = '/account/login';
            }
            else {
                //console.log(err);
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: err
                    //footer: '<a href>Why do I have this issue?</a>'
                });
                console.log(err);
            }
        },
        complete: function () {
            unBlockUI();
        }
    });
    var datahref = window.location.href;
    $('#menusitemap').find('li').each(function () {
        if ($(this).attr('data-url') != undefined) {
            if ($(this).attr('data-url') != '') {
                if (datahref.toLowerCase().indexOf($(this).attr('data-url').toLowerCase()) >= 0) {
                    $(this).addClass('active');
                }
            }
        }
    });
    if ($('#menusitemap').find('li.active').length == 0) {
        $('#menusitemap').find('li[data-url=""]').addClass('active');
    }
});
function ExportSearch() {
    GetFilter();
}

function GetFilter() {
    var filter = [];
    if ($('body').find('.customdatatable_filter').length > 0) {
        $('.customdatatable_filter').find('input[type=text], input[type=checkbox], select, textarea').each(function () {
            filter.push($(this).attr('name'));
        });
    }
    var filterquery = '';
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
                    if ($('#' + $this).val() != '' && $('#' + $this).val() != null) {
                        var queryplaintext = '';
                        var listParam = $('#' + $this).attr('data-compare').split(';');
                        for (var j = 0; j < listParam.length; j++) {
                            queryplaintext += listParam[j] + " LIKE '%' + '" + $('#' + $this).val() + "' + '%' OR ";
                        }
                        filterquery += "( " + queryplaintext.substr(0, queryplaintext.length - 3) + " ) AND ";
                    }
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
    ExportExcelFilter(filterquery);
}

function ExportExcelFilter(filter) {
    $.ajax({
        url: '/' + $('#tbList').attr('control') + '/exportexcel',
        type: 'POST',
        data: { pageindex: 0, pagesize: -1, filterquery: filter, listColumn: ($('#tbList').attr('exportCol') !== undefined ? $('#tbList').attr('exportCol') : $('#tbList').attr('arrCol')) },
        success: function (res) {
            if (res.IsOk) {
                if (res.dataObj != '') {
                    download("Export_" + $('#tbList').attr('control') + ".xlsx", res.dataObj);
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

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', text);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
$('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
    e.preventDefault();
    var el = jQuery(this).closest(".portlet").children(".portlet-body");
    if ($(this).hasClass("collapse")) {
        $(this).removeClass("collapse").addClass("expand");
        el.slideUp(200);
    } else {
        $(this).removeClass("expand").addClass("collapse");
        el.slideDown(200);
    }
});

function BackLink() {
    window.location.href = '/common/backlinkaction';
}

function LogOut() {
    window.location.href = '/account/LogOut';
}


function CloseResa() {
    var resacode = $('#RESACODE').val();
    Swal.fire({
        title: 'Are you sure to want done this resa?',
        text: "This action can not be reverse",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: '/common/doneresamobile',
                type: 'POST',
                data: { resacode: resacode },
                success: function (res) {
                    if (res.IsOk) {
                        Swal.fire({
                            title: 'Successful',
                            text: "Close Resa Successful",
                            type: 'warning',
                            showCancelButton: true,
                            showConfirmButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Continue new Resa',
                            cancelButtonText: 'Back to Home'
                        }).then((result) => {
                            if (result.value) {
                                window.location.reload();
                            }
                            else {
                                window.location.href = '/';
                            }
                        });
                    }
                    else {
                        Swal.fire({
                            title: 'Error',
                            text: "Scan Error " + res.Msg,
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Reload Page',
                            cancelButtonText: 'Back to Home'
                        }).then((result) => {
                            if (result.value) {
                                window.location.reload();
                            }
                            else {
                                window.location.href = '/';
                            }
                        });
                    }
                },
                error: function (errorPush) {
                    Swal.fire({
                        title: 'Error',
                        text: "Scan Error " + errorPush.responseText,
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Reload Page',
                        cancelButtonText: 'Back to Home'
                    }).then((result) => {
                        if (result.value) {
                            window.location.reload();
                        }
                        else {
                            window.location.href = '/';
                        }
                    });
                }
            });
        }
        else {
            return;
        }
    });
}

function activeBTN(item) {
    $('.scan').each(function () {
        $(this).removeClass('activedata');
    });
    $(item).addClass('activedata');
}