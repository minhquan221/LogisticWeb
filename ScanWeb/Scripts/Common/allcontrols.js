function sweetPopDisplay(html) {
    Swal.fire({
        title: "",
        html: html,
    });
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
        if ($(this).attr('type') == 'checkbox') {

        }
        else {
            inputdata[$(this).attr('name')] = $(this).val();
        }
    });
    var res = await AjaxCallback(url, method, inputdata);
    if (res.IsOk) {
        Swal.fire(
            'Register success',
            '',
            'Ok'
        )
        window.location.href = '/account/login';
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


async function LoginFunct() {
    var $frm = $('#frm');
    try {
        var stringCookie = $.cookie("RememberUser_LoginUser");
        var userList = [];
        if (stringCookie != '' && stringCookie != undefined) {
            userList = JSON.parse(stringCookie);
        }
        if (!Array.isArray(userList)) {
            userList = [];
        }
        var url = $frm.attr('action');
        var method = $frm.attr('method');
        var inputdata = {};
        $frm.find('input, textarea, select').each(function () {
            if ($(this).attr('type') == 'checkbox') {

            }
            else {
                inputdata[$(this).attr('name')] = $(this).val();
            }
        });
        var UserName = inputdata['UserName'];
        var Password = inputdata['Password'];
        if (UserName == '' || Password == '') {
            Swal.fire({
                type: 'error',
                title: 'Login fail',
                text: 'UserName and Password null'
            });
            return;
        }
        var rememberLog = {
            US: UserName,
            PS: Password
        };
        var res = await AjaxCallback(url, method, inputdata);
        if (res.IsOk) {
            $.cookie('SessionId_LoginUser', res.dataObj.SESSIONID, { expires: 7, path: '/' });
            Swal.fire(
                'Login success',
                '',
                'Ok'
            );
            if ($('input[name=remember]').is(':checked')) {
                var newList = [];
                for (var i = 0; i < userList.length; i++) {
                    var item = userList[i];
                    if (item.US != rememberLog.US) {
                        newList.push(item);
                    }
                }
                newList.push(rememberLog);
                $.cookie('RememberUser_LoginUser', JSON.stringify(newList), { expires: 365, path: '/' });
            }
            window.location.href = '/';
        }
        else {
            Swal.fire({
                type: 'error',
                title: 'Login fail',
                text: 'Please re-check your username and password'
            });
        }
    }
    catch (ex) {
        alert(ex);
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
