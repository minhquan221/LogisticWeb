var pageindex = 1;
var pagesize = 10;
var IsLoadHistory = false;
var socket = io.connect(socketIp, { secure: true });
socket.on('connect', function () {
    //socket.emit('loadpost');
});

socket.on('disconnected', function () {
    socket.destroy();
});

socket.on('identify', function () {
    socket.emit('userlogged', loginUser);
    var dataSearch = {
        username: loginUser.USERNAME,
        pageindex: pageindex,
        pagesize: pagesize
    };
    socket.emit('loadlistnotification', dataSearch);
});

socket.on('userlogoff', function (data) {
    if (loginUser.USERNAME != data.USERNAME && loginUser.USERNAME != 'user') {
        var curroption = optionnotify;
        curroption.title = "";
        curroption.message = 'User "' + data.USERNAME + '" is now offline';
        myNotification(curroption);
    }
});

socket.on('showsocketuser', function (data) {
    console.log(data);
});

socket.on('loadmorenotification', function (result) {
    if (result.error == 0 && result.data != null) {
        result.data.forEach(ele => {
            BuildListNotification(ele);
        });
        CountNotification();
    }
    CountNotification();
});

socket.on('loadnotification', function (result) {
    if (!IsLoadHistory) {
        if (result.error == 0 && result.data != null) {
            result.data.forEach(ele => {
                BuildListNotification(ele);
            });
            //pageindex++;
            CountNotification();
        }
        IsLoadHistory = true;
    }
});

socket.on('broadcastnotify', function (data) {
    if (loginUser.USERNAME == data.USERNOTIFY) {
        BuildNotification(data);
        CountNotification();
    }
});


function MarkAsRead(item, url) {
    var $item = $(item);
    var $li = $item.closest('li');
    if ($li.hasClass('unread')) {
        var idnotify = $li.attr('noti-id');
        socket.emit('updatereaded', idnotify);
        $li.removeClass('unread');
        CountNotification();
    }
    if (url != undefined && url != null && url != '') {
        window.open(url, '_blank');
    }
}

function BuildNotification(ele) {
    var $notiarea = $('#header_notification_bar');
    var $lstnoti = $notiarea.find('ul.notification');
    if (ele.USERNOTIFY == loginUser.USERNAME) {
        if ($lstnoti.find('li[noti-id=' + ele._id + ']').length == 0) {
            var url = ele.URL;
            var html = '';
            html += '<li noti-id="' + ele._id.toString() + '" ' + (ele.ISREAD ? '' : 'class="unread"') + '>';
            html += '<a onclick="MarkAsRead(this, \'' + url + '\')" href="javascript:void(0)">';
            //html += '<span class="label label-success"><i class="icon-plus"></i></span>';
            html += ele.MESSAGE + ' <br/>';
            html += '<span class="time"> ' + new Date(ele.CREATEDDATE).GetFullDateTimeCustom() + '</span>';
            html += '</a>';
            html += '</li>';
            var $newLi = $(html);
            $lstnoti.prepend($newLi);
            var curroption = optionnotify;
            curroption.theme = "info";
            curroption.title = "";
            curroption.message = ele.MESSAGE;
            myNotification(curroption);
        }
    }
}

function BuildListNotification(ele) {
    var $notiarea = $('#header_notification_bar');
    var $lstnoti = $notiarea.find('ul.notification');
    if (ele.USERNOTIFY == loginUser.USERNAME) {
        if ($lstnoti.find('li[noti-id=' + ele._id + ']').length == 0) {
            var url = ele.URL;
            var html = '';
            html += '<li noti-id="' + ele._id.toString() + '" ' + (ele.ISREAD ? '' : 'class="unread"') + '>';
            html += '<a onclick="MarkAsRead(this, \'' + url + '\')" href="javascript:void(0)">';
            //html += '<span class="label label-success"><i class="icon-plus"></i></span>';
            html += ele.MESSAGE + ' <br/>';
            html += '<span class="time"> ' + new Date(ele.CREATEDDATE).GetFullDateTimeCustom() + '</span>';
            html += '</a>';
            html += '</li>';
            var $newLi = $(html);
            $lstnoti.append($newLi);
        }
    }
}

function CountNotification() {
    var $notiarea = $('#header_notification_bar');
    var $lstnoti = $notiarea.find('ul.notification');
    var count = 0;
    count = $lstnoti.find('li.unread').length;
    $notiarea.find('span.badge').html(count > 0 ? count.toString() : '');
}

function PushSocketWarehousing(data) {
    socket.emit('pushnotification', data);
}

function LogoutServerNode() {
    socket.emit('userlogout', loginUser);
}

socket.on('broadcastusermultidevice', function (data) {
    if (loginUser.USERNAME == data.USERNAME && loginUser.SESSIONID != data.SESSIONID) {
        var curroption = optionnotify;
        curroption.title = "";
        curroption.message = "Another device has logged to this user";
        myNotification(curroption);
        setTimeout(function () {
            window.location.href = '/account/logout';
        }, 3000);
    }
});

socket.on('broadcastusernotify', function (data) {
    if (loginUser.USERNAME != data.USERNAME) {
        var curroption = optionnotify;
        curroption.title = "";
        curroption.message = 'User "' + data.USERNAME + '" is now online';
        myNotification(curroption);
    }
});

socket.on('broadcastresainfo', function (data) {
    var $notiarea = $('#header_notification_bar');
    var $lstnoti = $notiarea.find('ul.notification');
    var url = "/resa/detail?id=" + data.Resacode;
    var html = '';
    html += '<li>';
    html += '<a onclick="SelfRemoveNoti(this, \'' + url + '\')" href="javascript:void(0)">';
    //html += '<span class="label label-success"><i class="icon-plus"></i></span>';
    html += 'Resa ' + data.Resacode + ' has done by ' + data.User + ' <br/>';
    html += '<span class="time"> ' + new Date().GetFullDateTimeCustom() + '</span>';
    html += '</a>';
    html += '</li>';
    var $newLi = $(html);
    $lstnoti.append($newLi);
    CountNotification();
    var curroption = optionnotify;
    curroption.positionClass = "nfc-bottom-right";
    curroption.theme = "info";
    curroption.title = "";
    curroption.message = 'Resa ' + data.Resacode + ' has done by ' + data.User;
    myNotification(curroption);
});


socket.on('broadcastwarehousing', function (data) {
    var $notiarea = $('#header_notification_bar');
    var $lstnoti = $notiarea.find('ul.notification');
    var html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)">';
    //html += '<span class="label label-success"><i class="icon-plus"></i></span>';
    html += 'Cnt. ' + data.Container + ' of IMP: ' + data.ImpFile + ' has stocked <br/>';
    html += '<span class="time"> ' + new Date().GetFullDateTimeCustom() + '</span>';
    html += '</a>';
    html += '</li>';
    var $newLi = $(html);
    $lstnoti.append($newLi);
    CountNotification();
    var curroption = optionnotify;
    curroption.positionClass = "nfc-bottom-right";
    curroption.theme = "info";
    curroption.title = "";
    curroption.message = 'Cnt. ' + data.Container + ' of IMP: ' + data.ImpFile + ' has stocked';
    myNotification(curroption);
});



function SelfRemoveNoti(item, url) {
    var $item = $(item);
    $item.closest('li').remove();
    CountNotification();
    window.open(url, '_blank');
}
