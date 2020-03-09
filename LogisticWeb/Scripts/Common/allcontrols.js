function sweetPopDisplay(html) {
    Swal.fire({
        title: "",
        html: html,
    });
}
function BaoTri() {
    Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Function is under maintenance'
    });
    return;
}

async function AjaxCallback(url, method, data) {
    var res = await $.ajax({
        url: url,
        type: method,
        async: true,
        cache: false,
        data: { info: data }
    });
    return res;
}
async function Register(item) {
    var frm = $('#' + $(item).attr('data-frm'));
    var url = $(frm).attr('action');
    var method = $(frm).attr('method');
    var inputdata = {};
    $(frm).find('input, textarea, select').each(function () {
        if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
            if ($(this).is(":checked")) {
                inputdata[$(this).attr('name')] = true;
            }
            else {
                inputdata[$(this).attr('name')] = false;
            }
        }
        else {
            inputdata[$(this).attr('name')] = $(this).val();
        }
    });
    var res = await AjaxCallback(url, method, inputdata);
    if (res.IsOk) {
        Swal.fire({
            type: 'success',
            title: 'Register success',
            timer: 2000
        });
        window.location.href = '/';
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Register fail',
            text: 'Register fail'
        });
        console.log(res);
    }
}

async function LogOut() {
    LogoutServerNode();
    window.location.href = "/account/logout";
}

async function Login(item) {
    var frm = $('#' + $(item).attr('data-frm'));
    var url = $(frm).attr('action');
    var method = $(frm).attr('method');
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
        $.cookie('SessionId_LoginUser', res.dataObj.SESSIONID, { expires: 7, path: '/' });
        Swal.fire({
            type: 'success',
            title: 'Login success',
            timer: 2000
        });
        //Swal.fire(
        //    'Login success',
        //    '',
        //    'Ok'
        //);
        window.location.href = (res.Url == '' ? '/' : res.Url);
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Login fail',
            text: 'Please re-check your username and password'
        });
        console.log(res);
    }
}


async function ChangePass(item) {
    var frm = $('#' + $(item).attr('data-frm'));
    var url = $(frm).attr('action');
    var method = $(frm).attr('method');
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
        Swal.fire({
            type: 'success',
            title: 'Change password success',
            timer: 2000
        });
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Fail',
            text: res.Msg
        });
    }
}

async function Save(item) {
    var frm = {};
    var form = $(item).closest('form');
    var directlink = $(form).attr('control');
    var method = $(form).attr('method');
    var url = $(form).attr('action');
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
        Swal.fire(
            'Save data successful',
            '',
            'Ok'
        )
        window.location.href = directlink;
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Process fail',
            text: res.Msg
        });
    }
}

$(document).ready(function () {
    $('.loginbtn').each(function () {
        $(this).unbind('click').bind('click', function () {
            Login($(this));
        });
    });
    $('.changepassbtn').each(function () {
        $(this).unbind('click').bind('click', function () {
            ChangePass($(this));
        });
    });
    $('.registerbtn').each(function () {
        $(this).unbind('click').bind('click', function () {
            Register($(this));
        });
    });
    $('.newpostbtn').each(function () {
        $(this).unbind('click').bind('click', function () {
            Post($(this));
        });
    });

});



async function AjaxUpload(url, method, data) {
    var res = await $.ajax({
        url: url,
        type: method,
        async: true,
        cache: false,
        data: data,
        processData: false,
        contentType: false
    });
    return res;
}