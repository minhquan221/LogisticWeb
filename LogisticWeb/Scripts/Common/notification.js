
//--define node js client with socket.io and TCP----

var notifycontent = $("#div__DropShip__NotificationPush");
var listnotify = notifycontent.find(".di__list-notify");
var countnotifyArea = notifycontent.find(".small-badge");


const socket = io.connect('http://' + IPsocket, { reconnect: true });
socket.on('connect', function (socketdata) {
    console.log('Connected to socket IO');
    console.log(socket.id);
    //if (currentUser == '' || currentUser == undefined) {
    //    currentUser = "25298";
    //    var fullcontent = {
    //        ReceivedUser: '',
    //        Text: "",
    //        VendorId: currentUser,
    //        type: "login",
    //        gui: "",
    //        Title: "",
    //        time: ""
    //    }
    //    this.emit('login', JSON.stringify(fullcontent));
    //}
});

socket.on('newtask', function (data) {
    var json = JSON.parse(data);
    var html = BuilHtmlTask(json);
    var findin = tasklist.find('li[id=' + json.Id + ']');
    if (findin.length > 0) {
        findin.remove();
    }
    tasklist.append(html);
});
socket.on('history', function (msg) {
    console.log('history');
    listnotify.html('');
    var json = JSON.parse(msg);
    var countnotify = 0;
    countnotifyArea.html(countnotify.toString());
    countnotifyArea.hide();
    for (var i = 0; i < json.length; i++) {
        PushRowNotification(json[i].gui, json[i].Text, json[i].VendorId, json[i].time, json[i].UrlData);
    }
});
socket.on('emit_from_server', function (msg) {
    console.log('emit_from_server');
    //this.emit('message', msg);
    var json = JSON.parse(msg);
    if (json.ReceivedUser == currentUser) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});
var purchaseOrders = [];
var genBackOrder = false;


socket.on('finish_gen_invoice', function (msg) {
    console.log('finish_gen_invoice');
    var result = JSON.parse(msg);
    if (result.IsOk) {
        if (result.result.length > 0) {
            //ShowSucessMessage(result.result[0].MessageContent);
            $.ajax({
                url: '/notification/insertnotification',
                type: 'POST',
                data: { ReceivedUser: currentUser, Text: result.result[0].MessageContent, VendorId: currentUser },
                success: function (guiresult) {
                    if (guiresult.IsOk) {
                        var message = {
                            ReceivedUser: currentUser,
                            Text: result.result[0].MessageContent,
                            VendorId: currentUser,
                            type: "message",
                            gui: guiresult.GuiData,
                            Title: "",
                            time: "",
                            UrlData: '/manageinvoice'
                        }
                        socket.emit('message', JSON.stringify(message));
                    }
                },
                error: function (err) {

                }
            });
        }
    }
    else {
        $.ajax({
            url: '/notification/insertnotification',
            type: 'POST',
            data: { ReceivedUser: currentUser, Text: result.result[0].MessageContent, VendorId: currentUser },
            success: function (guiresult) {
                if (guiresult.IsOk) {
                    var message = {
                        ReceivedUser: currentUser,
                        Text: result.result[0].MessageContent,
                        VendorId: currentUser,
                        type: "message",
                        gui: guiresult.GuiData,
                        Title: "",
                        time: "",
                        UrlData: '/manageinvoice'
                    }
                    socket.emit('message', JSON.stringify(message));
                }
            },
            error: function (err) {

            }
        });
    }
});
//socket.on('finish_gen_ack', function (msg) {
//    socket.emit('finish_gen_ack', JSON.stringify(msg));
//})

//socket.on('finish_gen_ack', function (msg) {
//    console.log('finish_gen_ack');
//    var result = JSON.parse(msg);
//    if (result.ServerSideResponse.Responses.length > 0) {
//        if (result.ServerSideResponse.Responses.length > 1 || (result.ServerSideResponse.Responses.length === 1 && result.ServerSideResponse.Responses[0].ResponseType === 4)) {
//            // Add errors to model & show popup
//            //errorsScope.LstErrorMessage = [];
//            //result.ServerSideResponse.Responses.forEach(function (result) {
//            //    errorsScope.LstErrorMessage.push(result);
//            //});
//            if (result.ServerSideResponse.AllSuccessful == true) {
//                $.ajax({
//                    url: '/notification/insertnotification',
//                    type: 'POST',
//                    data: { ReceivedUser: currentUser, Text: 'Complete Generate ACK', VendorId: currentUser },
//                    success: function (guiresult) {
//                        if (guiresult.IsOk) {
//                            var message = {
//                                ReceivedUser: currentUser,
//                                Text: 'Complete Generate ACK',
//                                VendorId: currentUser,
//                                type: "message",
//                                gui: guiresult.GuiData,
//                                Title: "",
//                                time: "",
//                                UrlData: '/poacknowledment'
//                            }
//                            socket.emit('message', JSON.stringify(message));
//                        }
//                    },
//                    error: function (err) {

//                    }
//                });

//                //$("#message-controller").modal("show");
//                //$("#message-controller").show();
//                //setTimeout(function () {
//                //    window.location.href = $("#divManageOrder").attr('data-url-listing-ack');
//                //}, 1000);
//            } else {
//                $.ajax({
//                    url: '/notification/insertnotification',
//                    type: 'POST',
//                    data: { ReceivedUser: currentUser, Text: 'Error Generate ACK', VendorId: currentUser },
//                    success: function (guiresult) {
//                        if (guiresult.IsOk) {
//                            var message = {
//                                ReceivedUser: currentUser,
//                                Text: 'Error Generate ACK',
//                                VendorId: currentUser,
//                                type: "message",
//                                gui: guiresult.GuiData,
//                                Title: "",
//                                time: "",
//                                UrlData: '/'
//                            }
//                            socket.emit('message', JSON.stringify(message));
//                        }
//                    },
//                    error: function (err) {

//                    }
//                });

//            }
//        } else {
//            // Show flash messege instead popup
//            if (result.ServerSideResponse.Responses[0].ResponseType === 2) {
//                $.ajax({
//                    url: '/notification/insertnotification',
//                    type: 'POST',
//                    data: { ReceivedUser: currentUser, Text: result.ServerSideResponse.Responses[0].Message, VendorId: currentUser },
//                    success: function (guiresult) {
//                        if (guiresult.IsOk) {
//                            var message = {
//                                ReceivedUser: currentUser,
//                                Text: result.ServerSideResponse.Responses[0].Message,
//                                VendorId: currentUser,
//                                type: "message",
//                                gui: guiresult.GuiData,
//                                Title: "",
//                                time: "",
//                                UrlData: '/'
//                            }
//                            socket.emit('message', JSON.stringify(message));
//                        }
//                    },
//                    error: function (err) {

//                    }
//                });
//                //errorsScope.ShowMessage("bg-red", "top-right", result.ServerSideResponse.Responses[0].Message);
//            }
//            else if (result.ServerSideResponse.Responses[0].ResponseType === 3) {

//                $.ajax({
//                    url: '/notification/insertnotification',
//                    type: 'POST',
//                    data: { ReceivedUser: currentUser, Text: result.ServerSideResponse.Responses[0].Message, VendorId: currentUser },
//                    success: function (guiresult) {
//                        if (guiresult.IsOk) {
//                            var message = {
//                                ReceivedUser: currentUser,
//                                Text: result.ServerSideResponse.Responses[0].Message,
//                                VendorId: currentUser,
//                                type: "message",
//                                gui: guiresult.GuiData,
//                                Title: "",
//                                time: "",
//                                UrlData: '/'
//                            }
//                            socket.emit('message', JSON.stringify(message));
//                        }
//                    },
//                    error: function (err) {

//                    }
//                });
//                //errorsScope.ShowMessage("warning", "top-right", result.ServerSideResponse.Responses[0].Message);
//            }
//            else {

//                $.ajax({
//                    url: '/notification/insertnotification',
//                    type: 'POST',
//                    data: { ReceivedUser: currentUser, Text: result.ServerSideResponse.Responses[0].Message, VendorId: currentUser },
//                    success: function (guiresult) {
//                        if (guiresult.IsOk) {
//                            var message = {
//                                ReceivedUser: currentUser,
//                                Text: result.ServerSideResponse.Responses[0].Message,
//                                VendorId: currentUser,
//                                type: "message",
//                                gui: guiresult.GuiData,
//                                Title: "",
//                                time: "",
//                                UrlData: '/poacknowledment'
//                            }
//                            socket.emit('message', JSON.stringify(message));
//                        }
//                    },
//                    error: function (err) {

//                    }
//                });
//                //errorsScope.ShowMessage("bg-green", "top-right", result.ServerSideResponse.Responses[0].Message);
//                //setTimeout(function () {
//                //    window.location.href = $("#divManageOrder").attr('data-url-listing-ack');
//                //}, 500);
//            }
//        }

//    }
//});

socket.on('finish_gen_asn', function (msg) {
    console.log('finish_gen_asn');
    var data = JSON.parse(msg);
    if (data.IsOk) {
        var asnPreview = data.asns;
        if (asnPreview && asnPreview.length > 0) {
            asnPreview.forEach(function (c) {
                if (c.AsnPos && c.AsnPos.length > 0) {
                    c.AsnPos.forEach(function (v) {
                        var po = data.purchaseOrders.filter(function (k) { return k.Id === v.PO_ID })[0];
                        if (po) {
                            po.PODATE = po.PODATEString;
                            v.PODATE = po.PODATEString;
                        }
                    });
                }
            });
        }
        $(data.asns).each(function (i) {
            var myObject = data.asns[i];
            for (var property in myObject) {
                var item = myObject[property];
                if (IsDateTime(item)) {
                    var date = data.asns[i][property];
                    //var nowDate = new Date(parseInt(date.substr(6)));
                    //data.asns[i][property] = nowDate.format("mm/dd/yyyy");

                    var nowDate = new Date(new Date(parseInt(date.substr(6))).getTime() + (new Date().getTimezoneOffset() * 60000) + (DestinationOffset * 60000));
                    data.asns[i][property] = nowDate.format(FormatDateTime);
                }
            }
            //detail asnPO
            var myAsnPo = data.asns[i].AsnPos;
            if (myAsnPo != undefined) {
                if (myAsnPo.length > 0) {
                    $(myAsnPo).each(function (j) {
                        var asnPo = myAsnPo[j];
                        for (var property in asnPo) {
                            var item2 = asnPo[property];
                            if (IsDateTime(item2)) {
                                var date = data.asns[i].AsnPos[j][property];
                                //var nowDate = new Date(parseInt(date.substr(6)));
                                //data.asns[i].AsnPos[j][property] = nowDate.format("mm/dd/yyyy");
                                var nowDate = new Date(new Date(parseInt(date.substr(6))).getTime() + (new Date().getTimezoneOffset() * 60000) + (DestinationOffset * 60000));
                                data.asns[i].AsnPos[j][property] = nowDate.format(FormatDateTime);
                            }
                        }
                    });
                }
            }
        });

        if (data.purchaseOrders.length > 1) {
            var datacommit = { asns: asnPreview, purchaseOrders: data.purchaseOrders, genBackOrder: data.genBackOrderOld };
            socket.emit('commit_gen_asn', JSON.stringify(datacommit));
            return;
        }
        else {
            var dataOptionASN = {};
            dataOptionASN.POHeaders = data.purchaseOrders;
            dataOptionASN.Asns = asnPreview;
            dataOptionASN.genBackOrder = data.genBackOrder;
            dataOptionASN.transport = data.transport;
            dataOptionASN.transportTypeList = data.transportTypeList;
            dataOptionASN.carrierList = data.carrierList;
            dataOptionASN.packageTypeList = data.packageTypeList;
            dataOptionASN.uomWeight = data.uomWeight;
            dataOptionASN.uomVolume = data.uomVolume;
            sessionStorage.POHeaders = JSON.stringify(dataOptionASN.POHeaders);
            sessionStorage.Asns = JSON.stringify(dataOptionASN.Asns);
            sessionStorage.genBackOrder = JSON.stringify(dataOptionASN.genBackOrder);
            sessionStorage.transport = JSON.stringify(dataOptionASN.transport);
            sessionStorage.transportTypeList = JSON.stringify(dataOptionASN.transportTypeList);
            sessionStorage.carrierList = JSON.stringify(dataOptionASN.carrierList);
            sessionStorage.packageTypeList = JSON.stringify(dataOptionASN.packageTypeList);
            sessionStorage.uomWeight = JSON.stringify(dataOptionASN.uomWeight);
            sessionStorage.uomVolume = JSON.stringify(dataOptionASN.uomVolume);

            var messagetext = data.purchaseOrders[0].PONUMBER + ' Complete Generate Preview ASN';
            var messagedata = {
                ReceivedUser: currentUser,
                Text: messagetext,
                VendorId: currentUser,
                UrlData: '/',
                SocketID: currentUser,
                ListId: data.ids
            };
            socket.emit('finish_gen_asn_step', JSON.stringify(messagedata));
            return;
        }
    }
    else {
        var messagetext = data.purchaseOrders[0].PONUMBER + ' Error Generate Preview ASN';
        var messagedata = {
            ReceivedUser: currentUser,
            Text: messagetext,
            VendorId: currentUser,
            UrlData: '/createasn',
            SocketID: socket.id
        };
        socket.emit('finish_gen_asn_step', JSON.stringify(messagedata));
    }
});

socket.on('message_clear_cookie', function (msg) {
    console.log('message_clear_cookie');
    sessionStorage.Asns = undefined;
    sessionStorage.genBackOrder = undefined;
    sessionStorage.orderIds = undefined;
    purchaseOrders = undefined;
    sessionStorage.transport = undefined;
    sessionStorage.transportTypeList = undefined;
    sessionStorage.packageTypeList = undefined;
    sessionStorage.carrierList = undefined;
    sessionStorage.uomVolume = undefined;
    sessionStorage.uomWeight = undefined;
    var result = JSON.parse(msg);
    var json = JSON.parse(result);
    console.log(json);
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});

socket.on('requirelogin', function (msg) {
    console.log('requirelogin');
    var fullcontent = {
        ReceivedUser: '',
        Text: "",
        VendorId: currentUser,
        type: "login",
        gui: "",
        Title: "",
        time: "",
        UrlData: ""
    }
    this.emit('login', JSON.stringify(fullcontent));
});
socket.on('message_exportacksdatatoany', function (msg) {
    var json = JSON.parse(msg);
    if (json.idlist.length > 1) {
        for (var i = 0; i < json.idlist.length; i++) {
            //GetDataJSCallingId(json.idlist[i]);
            ShowPODetailDataJSCalling(json.idlist[i]);
            GetDataJSCallingId(json.idlist[i]);
        }
    }
    else if (json.idlist.length == 1) {
        //GetDataJSCallingId(json.idlist[0]);
        ShowPODetailDataJSCalling(json.idlist[0]);
        GetDataJSCallingId(json.idlist[0]);
    }
    //GetDataJSCalling();
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});

socket.on('message_exportinvoicesdatatoany', function (msg) {
    var json = JSON.parse(msg);
    if (json.idlist.length > 1) {
        for (var i = 0; i < json.idlist.length; i++) {
            ShowPODetailDataJSCalling(json.idlist[i]);
            GetDataJSCallingId(json.idlist[i]);
        }
    }
    else if (json.idlist.length == 1) {
        ShowPODetailDataJSCalling(json.idlist[0]);
        GetDataJSCallingId(json.idlist[0]);
    }
    //GetDataJSCalling();
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});

socket.on('message_calculatinginvoice', function (msg) {
    var json = JSON.parse(msg);
    if (json.idlist.length > 1) {
        for (var i = 0; i < json.idlist.length; i++) {
            ShowPODetailDataJSCalling(json.idlist[i]);
            GetDataJSCallingId(json.idlist[i]);
        }
    }
    else if (json.idlist.length == 1) {
        ShowPODetailDataJSCalling(json.idlist[0]);
        GetDataJSCallingId(json.idlist[0]);
    }
    //GetDataJSCalling();
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});

socket.on('message_updateack', function (msg) {
    var json = JSON.parse(msg);
    if (json.idlist.length > 1) {
        for (var i = 0; i < json.idlist.length; i++) {
            GetDataJSCallingId(json.idlist[i]);
            ShowPODetailDataJSCalling(json.idlist[i]);
        }
    }
    else if (json.idlist.length == 1) {
        GetDataJSCallingId(json.idlist[0]);
        ShowPODetailDataJSCalling(json.idlist[0]);
    }
    //GetDataJSCalling();
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});

socket.on('message_sendasns', function (msg) {
    var json = JSON.parse(msg);
    if (json.idlist.length > 1) {
        for (var i = 0; i < json.idlist.length; i++) {
            GetDataJSCallingId(json.idlist[i]);
            ShowPODetailDataJSCalling(json.idlist[i]);
        }
    }
    else if (json.idlist.length == 1) {
        GetDataJSCallingId(json.idlist[0]);
        ShowPODetailDataJSCalling(json.idlist[0]);
    }
    //GetDataJSCalling();
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});

socket.on('message_generateacks', function (msg) {
    var json = JSON.parse(msg);
    if (json.idlist.length > 1) {
        for (var i = 0; i < json.idlist.length; i++) {
            GetDataJSCallingId(json.idlist[i]);
            ShowPODetailDataJSCalling(json.idlist[i]);
        }
    }
    else if (json.idlist.length == 1) {
        GetDataJSCallingId(json.idlist[0]);
        ShowPODetailDataJSCalling(json.idlist[0]);
    }
    //GetDataJSCalling();
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});

socket.on('message_generateasn', function (msg) {
    var json = JSON.parse(msg);
    //if (json.idlist.length > 1) {
    //    for (var i = 0; i < json.idlist.length; i++) {
    //        GetDataJSCallingId(json.idlist[i]);
    //        ShowPODetailDataJSCalling(json.idlist[i]);
    //    }
    //}
    //else if (json.idlist.length == 1) {
    //    GetDataJSCallingId(json.idlist[0]);
    //    ShowPODetailDataJSCalling(json.idlist[0]);
    //}
    //GetDataJSCalling();
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});

socket.on('message_broadcaster', function (msg) {
    var json = JSON.parse(msg);
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});
socket.on('message', function (msg) {
    console.log('message');
    var json = JSON.parse(msg);
    var idnotify = json.gui;
    if (json.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length == 0) {
        PushRowNotification(json.gui, json.Text, json.VendorId, json.time, json.UrlData);
    }
});
socket.on('updatecomplete', function (msg) {
    var datasend = JSON.parse(msg);
    var idnotify = datasend.NotificationId;
    if (datasend.ReceivedUser == currentUser && listnotify.find("[data-id=" + idnotify + "]").length > 0) {
        var countnotify = countnotifyArea != undefined ? parseInt(countnotifyArea[0].innerHTML) : 0;
        countnotify = countnotify - 1;
        countnotifyArea.html(countnotify.toString());
        if (countnotify == 0) {
            countnotifyArea.hide();
        }
        listnotify.find("[data-id=" + idnotify + "]").remove();
    }
});
function SendMessage(sesion, content) {
    var message = {
        ReceivedUser: currentUser,
        Text: content,
        VendorId: currentUser,
        type: "message",
        gui: sesion,
        Title: "",
        time: "",
        UrlData: ""
    }
    $.ajax({
        url: '/notification/pushmessagetonode',
        type: 'POST',
        data: { Text: content },
        before: function () {

        },
        success: function (result) {
            if (result.IsOk) {
                //alert('success');
            }
            else {
                //alert(result.Error);

            }
        },
        error: function (err) {

        }
    });
    //socket.emit('message', JSON.stringify(message));
};

function ClickView($this) {
    var idnoti = $($this).attr('data-id');
    socket.emit('updateread', idnoti);
    var dataurl = $($this).attr('data-url');
    if (dataurl != '')
        window.location.href = dataurl;
};

function PushRowNotification(sesion, content, vendorid, timeData, urldata) {
    var time = new Date(timeData);
    var timestring = time.toLocaleDateString() + " " + (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
    var countnotify = countnotifyArea != undefined ? parseInt(countnotifyArea[0].innerHTML) : 0;
    countnotify = countnotify + 1;
    var html = "<li style='cursor: pointer;' data-id='" + sesion + "' onclick='ClickView(this)' data-url='" + urldata + "'>";
    html += "<div data-sessionId='" + sesion + "' class='message-detail-notify'>";
    html += "<span class='icon-notification di__circle-notify'><i class='di-iconnotification'></i></span><span class='text-warning'>" + content + "</span>";
    html += "<div class='notification-time'>" + timestring + " <span class='glyph-icon icon-clock-o' title='" + timestring + "'></span></div>";
    html += "</div>";
    html += "</li>";
    listnotify.prepend(html);
    countnotifyArea.html(countnotify.toString());
    countnotifyArea.show();
};

function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

function Guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//----------------End----------------
