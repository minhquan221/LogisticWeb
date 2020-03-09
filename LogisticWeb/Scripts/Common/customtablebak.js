!function ($) {
    'use strict';
    $.fn.customtable_js = async function (o, args) {
        var $this = $(o), data = $(o).data('customtable_js');
        if (!data) $this.data('customtable_js', data = new customtable_js(this));
        if (!o) {
            await data.init($(this));
        }
        var options = $.extend(
            {},
            $.fn.customtable_js.options,
            args || {}
        );
        if (typeof o == 'string') {
            await data[o].call($(this), options);
        }
    };
    $.fn.customtable_js.options = {
        PageIndex: 0,
        PageSize: 50,
        StepPage: 10,
        TotalPages: 0,
        TotalRecords: 0,
        dbClickAction: '',
        admin: false,
        HeaderCol: [],
        TableCol: [],
        ColItemWidth: [],
        formatcol: [],
        formatSubStr: [],
        IDCol: '',
        ajaxUrl: '',
        Control: '',
        Table: null,
        datamix: '',
        data: [],
        Ele: null,
        filter: [],
        filterquery: '',
        orderby: '',
        ordertable: false,
        definebtn: [],
        definefnbtn: [],
        iconbtn: [],
        lstparambtn: [],
        actioncolwidth: ''
    };
    var customtable_js = function (e) {
        this.$elements = e;
    };

    customtable_js.prototype = {
        init: async function (options) {
            var $this = $(this);
            $this.customtable_js.options.PageIndex = ($($this[0].$elements).attr('pageindex') != undefined ? parseFloat($($this[0].$elements).attr('pageindex')) - 1 : 0);
            $this.customtable_js.options.ajaxUrl = $($this[0].$elements).attr('urlquery');
            $this.customtable_js.options.ordertable = ($($this[0].$elements).attr('ordertable') != undefined && $($this[0].$elements).attr('ordertable') == "true" ? true : false);
            $this.customtable_js.options.ColItemWidth = ($($this[0].$elements).attr('colwidth') != undefined ? $($this[0].$elements).attr('colwidth').split(';') : []);
            $this.customtable_js.options.formatcol = ($($this[0].$elements).attr('formatcol') != undefined ? $($this[0].$elements).attr('formatcol').split(';') : []);
            $this.customtable_js.options.formatSubStr = ($($this[0].$elements).attr('formatsubstr') != undefined ? $($this[0].$elements).attr('formatsubstr').split(';') : []);
            $this.customtable_js.options.definebtn = ($($this[0].$elements).attr('definebtn') != undefined ? $($this[0].$elements).attr('definebtn').split(';') : []);
            $this.customtable_js.options.definefnbtn = ($($this[0].$elements).attr('definefnbtn') != undefined ? $($this[0].$elements).attr('definefnbtn').split(';') : []);
            $this.customtable_js.options.iconbtn = ($($this[0].$elements).attr('iconbtn') != undefined ? $($this[0].$elements).attr('iconbtn').split(';') : []);
            $this.customtable_js.options.lstparambtn = ($($this[0].$elements).attr('lstparambtn') != undefined ? $($this[0].$elements).attr('lstparambtn').split(';') : []);
            $this.customtable_js.options.actioncolwidth = ($($this[0].$elements).attr('actioncolwidth') != undefined ? $($this[0].$elements).attr('actioncolwidth') : '');
            $this.customtable_js.options.Control = $($this[0].$elements).attr('control');
            $this.customtable_js.options.admin = $($this[0].$elements).attr('data-admin');
            $this.customtable_js.options.datamix = ($($this[0].$elements).attr('data-mix-select') != undefined ? $($this[0].$elements).attr('data-mix-select') : '');
            $this.customtable_js.options.dbClickAction = ($($this[0].$elements).attr('data-dbclickaction') != undefined ? $($this[0].$elements).attr('data-dbclickaction') : '');
            if ($('body').find('.customdatatable_filter').length > 0) {
                var filter = [];
                $('.customdatatable_filter').find('input[type=text], input[type=checkbox], select, textarea').each(function () {
                    filter.push($(this).attr('name'));
                });
                $this.customtable_js.options.filter = filter;
                $('body').find('.btn-search').bind('click', function () {
                    $this.customtable_js('subtmitSeach');
                })
            }
            if ($($this[0].$elements).attr('idCol') != undefined)
                $this.customtable_js.options.IDCol = $($this[0].$elements).attr('idCol');
            if ($($this[0].$elements).attr('arrCol') != undefined) {
                $this.customtable_js.options.TableCol = $($this[0].$elements).attr('arrCol').split(',');
            }
            if ($($this[0].$elements).attr('headerCol') != undefined) {
                $this.customtable_js.options.HeaderCol = $($this[0].$elements).attr('headerCol').split(',');
            }
            $this.customtable_js.options.Table = $($this[0].$elements);
            var data = null;
            if ($this.customtable_js.options.data.length == 0) {
                await $this.customtable_js('callAjax');
            }
            if ($this.customtable_js.options.data != null && $this.customtable_js.options.TotalRecords == 0) {
                data = $this.customtable_js.options.data;
            }
            $this.customtable_js.options.TotalPages = parseInt($this.customtable_js.options.TotalRecords / $this.customtable_js.options.PageSize);
            if ($this.customtable_js.options.TotalRecords % $this.customtable_js.options.PageSize > 0)
                $this.customtable_js.options.TotalPages++;
            var $Container = $('<div class="row-fluid"><div class="span6"></div></div>');
            var $span6 = $('<div class="span6"></div>');
            var $Pagination = $('<div class="dataTables_paginate paging_bootstrap pagination"></div>');
            var $ul = $('<ul></ul>');
            var $PrevBtn = $('<li class="prev ' + ($this.customtable_js.options.PageIndex == 0 ? "disabled" : "") + '"><a href="javascript:void(0)">← <span class="hidden-480">Prev</span></a></li>');
            var $NextBtn = $('<li class="next  ' + ($this.customtable_js.options.PageIndex == ($this.customtable_js.options.TotalPages - 1) ? "disabled" : "") + '"><a href="javascript:void(0)"><span class="hidden-480">Next</span> → </a></li>');
            var arrPage = [];
            for (var i = 1; i <= $this.customtable_js.options.TotalPages; i++) {
                var $page = $('<li class="paging ' + ($this.customtable_js.options.PageIndex == (i - 1) ? "active" : "") + '"><a href="javascript:void(0)" data-page="' + (i - 1) + '">' + i + '</a></li>');
                arrPage.push($page);
            }
            await $ul.append($PrevBtn);
            for (var i = 0; i < arrPage.length; i++) {
                await $ul.append(arrPage[i]);
            }
            await $ul.append($NextBtn);
            await $Pagination.append($ul);
            await $span6.append($Pagination);
            await $Container.append($span6);
            $($this.customtable_js.options.Table).before($Container);
            $('body').find('.prev').bind('click', function () {
                $this.customtable_js('prev');
            });
            $('body').find('.next').bind('click', async function () {
                $this.customtable_js('next');
            });
            $('body').find('.paging').each(function () {
                $(this).bind('click', async function () {
                    $this.customtable_js.options.Ele = $(this);
                    await $this.customtable_js('goTo');
                })
            });
            await $this.customtable_js('sweetviewpaging');
            await $this.customtable_js('buildTable');
        },
        sweetviewpaging: async function () {
            var PageIndex = this.customtable_js.options.PageIndex;
            var steppage = this.customtable_js.options.StepPage;
            $('body').find('.paging').each(function () {
                var pageindex = $(this).find('a').attr('data-page');
                if ((parseFloat(pageindex) + 1 <= ((PageIndex + 1) + (steppage / 2))) && (parseFloat(pageindex) + 1 >= ((PageIndex + 1) - (steppage / 2)))) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            })
        },
        activepaging: async function () {
            if (this.customtable_js.options.PageIndex > 0) {
                $('body').find('.prev').removeClass('disabled');
            }
            else {
                $('body').find('.prev').addClass('disabled');
            }
            if (this.customtable_js.options.PageIndex >= this.customtable_js.options.TotalPages - 1) {
                $('body').find('.next').addClass('disabled');
            }
            else {
                $('body').find('.next').removeClass('disabled');
            }
            $('body').find('.paging').removeClass('active');
            $('body').find('.paging a[data-page="' + this.customtable_js.options.PageIndex + '"]').closest('li').addClass('active');
        },
        subtmitSeach: async function () {
            await this.customtable_js('callAjax');
            await this.customtable_js('buildTable');
            await this.customtable_js('activepaging');
        },
        updaterow: async function () {
            await this.customtable_js('buildTable');
            await this.customtable_js('activepaging');
        },
        prev: async function () {
            if (this.customtable_js.options.PageIndex == 0)
                return;
            this.customtable_js.options.PageIndex--;
            window.history.pushState(null, '', "/" + this.customtable_js.options.Control + "?pageindex=" + (this.customtable_js.options.PageIndex + 1));
            await this.customtable_js('callAjax');
            await this.customtable_js('buildTable');
            await this.customtable_js('activepaging');
            await this.customtable_js('sweetviewpaging');
        },
        goTo: async function () {
            var pageindex = $(this.customtable_js.options.Ele).find('a').attr('data-page');
            this.customtable_js.options.PageIndex = parseFloat(pageindex);
            window.history.pushState(null, '', "/" + this.customtable_js.options.Control + "?pageindex=" + (this.customtable_js.options.PageIndex + 1));
            await this.customtable_js('callAjax');
            await this.customtable_js('buildTable');
            await this.customtable_js('activepaging');
            await this.customtable_js('sweetviewpaging');

        },
        next: async function () {
            if (this.customtable_js.options.PageIndex >= this.customtable_js.options.TotalPages - 1)
                return;
            this.customtable_js.options.PageIndex++;
            window.history.pushState(null, '', "/" + this.customtable_js.options.Control + "?pageindex=" + (this.customtable_js.options.PageIndex + 1));
            await this.customtable_js('callAjax');
            await this.customtable_js('buildTable');
            await this.customtable_js('activepaging');
            await this.customtable_js('sweetviewpaging');
        },
        getOrderBy: function () {
            var orderBy = '';
            $(this.customtable_js.options.Table).find('th').each(function () {
                if ($(this).attr('order') != undefined && $(this).attr('order') != '') {
                    orderBy = ' ' + $(this).attr('dataorder') + ' ' + $(this).attr('order') + ' ';
                }
            });
            this.customtable_js.options.orderby = orderBy;
        },
        getFilter: function () {
            var filterquery = '';
            for (var i = 0; i < this.customtable_js.options.filter.length; i++) {
                var $this = this.customtable_js.options.filter[i];
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
                            var queryplaintext = '';
                            var listParam = $('#' + $this).attr('data-compare').split(';');
                            for (var j = 0; j < listParam.length; j++) {
                                queryplaintext += listParam[j] + " LIKE '%' + '" + $('#' + $this).val() + "' + '%' OR ";
                            }
                            filterquery += "( " + queryplaintext.substr(0, queryplaintext.length - 3) + " ) AND ";
                        }
                        else {
                            if ($('#' + $this).val() != '' && $('#' + $this).val() != null) {
                                filterquery += $this + " LIKE '%' + '" + $('#' + $this).val() + "' + '%' AND ";
                            }
                        }

                        //else if ($('#' + $this).val().indexOf(';') >= 0) {
                        //    var queryplaintext = '';
                        //    var listParam = $('#' + $this).val().split(';');
                        //    for (var j = 0; j < listParam.length; j++) {
                        //        queryplaintext += $this + " LIKE '%' + '" + listParam[j] + "' + '%' OR ";
                        //    }
                        //    filterquery += "( " + queryplaintext.substr(0, queryplaintext.length - 3) + " ) AND ";
                        //}
                        //else {
                        //    if ($('#' + $this).val() != '' && $('#' + $this).val() != null) {
                        //        filterquery += $this + " LIKE '%' + '" + $('#' + $this).val() + "' + '%' AND ";
                        //    }
                        //}
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
            this.customtable_js.options.filterquery = filterquery;
        },
        callAjax: async function () {
            this.customtable_js('getFilter');
            this.customtable_js('getOrderBy');
            var res = await $.ajax({
                url: this.customtable_js.options.ajaxUrl,
                method: 'POST',
                async: true,
                data: { pageindex: this.customtable_js.options.PageIndex, pagesize: this.customtable_js.options.PageSize, filterquery: this.customtable_js.options.filterquery, orderby: this.customtable_js.options.orderby }
            });
            if (res.IsOk) {
                if (res.dataObj != null) {
                    this.customtable_js.options.data = res.dataObj;
                    this.customtable_js.options.TotalRecords = res.totalrows;
                }
                else {
                    this.customtable_js.options.data = [];
                    this.customtable_js.options.TotalRecords = 0;
                }
            }
        },
        actionOrderBy: async function () {
            var $this = this;
            $(this.customtable_js.options.Table).find('th').each(function () {
                $(this).on('click', function () {
                    var $item = $(this);
                    $item.closest('thead').find('th').each(function () {
                        if ($(this).attr('dataorder') != $item.attr('dataorder')) {
                            $(this).attr('order', '');
                            $(this).attr('class', '');
                        }
                    })
                    if ($item.attr('order') == '') {
                        $item.attr('order', 'asc');
                        $item.attr("class", '');
                        $item.addClass('asc');
                    }
                    else if ($item.attr('order') == 'asc') {
                        $item.attr('order', 'desc');
                        $item.attr("class", '');
                        $item.addClass('desc');
                    }
                    else if ($item.attr('order') == 'desc') {
                        $item.attr('order', '');
                        $item.attr("class", '');
                    }
                    $this.customtable_js('subtmitSeach');
                })
            });
        },
        buildTable: async function () {
            if ($(this.customtable_js.options.Table).find('thead th').length == 0) {
                await this.customtable_js('buildHeader');
            }
            else {
                $($(this.customtable_js.options.Table).find('tbody')).html('');
            }
            await this.customtable_js('buildDataRow');
        },
        buildDataRow: async function () {
            var $datarow = this.customtable_js.options.data;
            var Control = this.customtable_js.options.Control;
            var $tbody = $('<tbody></tbody>');
            for (var i = 0; i < $datarow.length; i++) {
                var $row = $datarow[i];
                var tr = '';
                if (this.customtable_js.options.dbClickAction != '') {
                    tr += '<tr class="odd gradeX" ondblclick="' + this.customtable_js.options.dbClickAction + '(' + $row["ID"] + ')">';
                }
                else {
                    tr += '<tr class="odd gradeX">';
                }
                var stt = i + 1 + (this.customtable_js.options.PageIndex * this.customtable_js.options.PageSize);
                tr += '<td>' + stt + '</td>';
                //tr += '<td><input type="checkbox" class="checkboxes" /></td>';
                if (this.customtable_js.options.TableCol.length == 0) {
                    for (var i = 0; i < Object.keys($row).length; i++) {
                        if ($row[Object.keys($row)[i]] != null) {
                            if ($row[Object.keys($row)[i]].toString().indexOf('Date(') >= 0) {
                                var ts = $row[Object.keys($row)[i]].replace('/Date(', '').replace(')/', '');
                                var date = new Date(Number(ts));
                                if (Object.keys($row)[i].toLowerCase() == 'createddate') {
                                    tr += '<td class="center hidden-480">' + date.GetDateCustom(2) + "/" + date.GetMonthCustom(2) + "/" + date.getFullYear() + " " + date.GetHourCustom(2) + ":" + date.GetMinuteCustom(2) + ":" + date.GetSecondCustom(2) + '</td>';
                                }
                                else {
                                    tr += '<td class="center hidden-480">' + date.GetDateCustom(2) + "/" + date.GetMonthCustom(2) + "/" + date.getFullYear() + '</td>';
                                }
                            }
                            else {
                                if (this.customtable_js.options.formatcol[i] == '1') {
                                    if (this.customtable_js.options.formatSubStr[i] == '0') {
                                        tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : 'style="text-align: right;"') + '>' + $row[Object.keys($row)[i]].FormatNumberCustom() + '</td>';
                                    }
                                    else {
                                        tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : 'style="text-align: right;"') + '>' + $row[Object.keys($row)[i]].FormatNumberCustom(true) + '</td>';
                                    }
                                }
                                else {
                                    if (this.customtable_js.options.formatSubStr[i] == '0') {
                                        tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : 'style="text-align: right;"') + '>' + $row[Object.keys($row)[i]] + '</td>';
                                    }
                                    else {
                                        tr += '<td class="center hidden-480" ' + (isNaN($row[Object.keys($row)[i]]) ? '' : 'style="text-align: right;"') + '>' + $row[Object.keys($row)[i]].FormatSubStrLength(15) + '</td>';
                                    }
                                }
                            }
                        }
                        else {
                            tr += '<td class="center hidden-480"></td>';
                        }
                    }
                }
                else {
                    var tableCol = this.customtable_js.options.TableCol;
                    for (var j = 0; j < tableCol.length; j++) {
                        if ($row[tableCol[j]] != null) {
                            if ($row[tableCol[j]].toString().indexOf('Date(') >= 0) {
                                var ts = $row[tableCol[j]].replace('/Date(', '').replace(')/', '');
                                var date = new Date(Number(ts));
                                if (tableCol[j].toLowerCase() == 'createddate') {
                                    tr += '<td class="center hidden-480">' + date.GetDateCustom(2) + "/" + date.GetMonthCustom(2) + "/" + date.getFullYear() + " " + date.GetHourCustom(2) + ":" + date.GetMinuteCustom(2) + ":" + date.GetSecondCustom(2) + '</td>';
                                }
                                else {
                                    tr += '<td class="center hidden-480">' + date.GetDateCustom(2) + "/" + date.GetMonthCustom(2) + "/" + date.getFullYear() + '</td>';
                                }
                            }
                            else {
                                if (this.customtable_js.options.formatcol[j] == '1') {
                                    if (this.customtable_js.options.formatSubStr[j] == '0') {
                                        tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : 'style="text-align: right;"') + '>' + $row[tableCol[j]].FormatNumberCustom() + '</td>';
                                    }
                                    else {
                                        tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : 'style="text-align: right;"') + '>' + $row[tableCol[j]].FormatNumberCustom(true) + '</td>';
                                    }
                                }
                                else {
                                    if (this.customtable_js.options.formatSubStr[j] == '0') {
                                        tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : 'style="text-align: right;"') + '>' + $row[tableCol[j]] + '</td>';
                                    }
                                    else {
                                        tr += '<td class="center hidden-480" ' + (isNaN($row[tableCol[j]]) ? '' : 'style="text-align: right;"') + '>' + $row[tableCol[j]].FormatSubStrLength(15) + '</td>';
                                    }
                                }
                            }
                        }
                        else {
                            tr += '<td class="center hidden-480"></td>';
                        }
                    }
                }
                tr += "<td class='center hidden-480'>";
                //tr += "<button url='/" + Control + "/detail?id=" + (this.customtable_js.options.IDCol == '' ? $row["ID"] : $row[this.customtable_js.options.IDCol]) + "' onclick='GotoUrl(this)' class='btn'><span class='icon-edit'></span></button>";

                if (this.customtable_js.options.definebtn.length > 0) {
                    var lstbtn = this.customtable_js.options.definebtn;
                    var lstparambtn = this.customtable_js.options.lstparambtn;
                    var lstfnbtn = this.customtable_js.options.definefnbtn;
                    var iconbtn = this.customtable_js.options.iconbtn;
                    for (var k = 0; k < lstbtn.length; k++) {
                        if (lstfnbtn[k] != undefined) {
                            tr += "<button type='button' style='cursor: pointer;width:54px;'><span data-primval='" + (lstparambtn[k] != undefined ? $row[lstparambtn[k]] : $row["ID"]) + "' onclick='" + lstfnbtn[k] + "(this)' class='" + (iconbtn[k] != undefined ? iconbtn[k] : "") + "'></span></button>";
                        }
                    }
                }


                tr += "<button type='button' style='cursor: pointer;width:54px;'><span url='/" + Control + "/detail?id=" + (this.customtable_js.options.IDCol == '' ? $row["ID"] : $row[this.customtable_js.options.IDCol]) + "' onclick='GotoUrl(this)' class='icon-edit'></span></button>";
                if (this.customtable_js.options.admin) {
                    tr += "<button type='button' style='cursor: pointer;width:54px;'><span data-id='" + $row["ID"] + "' onclick='Delete(this)' class='icon-trash'></span></button>";
                }
                tr += '</td>';
                tr += '</tr>';
                $tbody.append(tr);
            }
            $(this.customtable_js.options.Table).append($tbody);
        },
        buildHeader: async function () {
            var $datarow = this.customtable_js.options.data;
            var $listcolwidth = this.customtable_js.options.ColItemWidth;

            if ($datarow == null || $datarow.length == 0)
                return;
            var obj = $datarow[0];
            var $header = $('<thead></thead>');
            var tr = '<tr>';
            tr += "<th></th>";
            if (this.customtable_js.options.HeaderCol == 0) {
                if (this.customtable_js.options.TableCol.length == 0) {
                    for (var i = 0; i < Object.keys(obj).length; i++) {
                        if ($listcolwidth.length > 0 && $listcolwidth[i] != '') {
                            tr += '<th class="hidden-480" style="min-width:' + $listcolwidth[i] + 'px;">' + Object.keys(obj)[i] + '</th>';
                        }
                        else {
                            tr += '<th class="hidden-480">' + Object.keys(obj)[i] + '</th>';
                        }
                    }
                }
                else {
                    for (var i = 0; i < this.customtable_js.options.TableCol.length; i++) {
                        if ($listcolwidth.length > 0 && $listcolwidth[i] != '') {
                            tr += '<th style="cursor: pointer;min-width:' + $listcolwidth[i] + 'px;" class="hidden-480" dataorder="' + this.customtable_js.options.TableCol[i] + '" order="">' + this.customtable_js.options.TableCol[i] + '</th>';
                        }
                        else {
                            tr += '<th style="cursor: pointer;" class="hidden-480" dataorder="' + this.customtable_js.options.TableCol[i] + '" order="">' + this.customtable_js.options.TableCol[i] + '</th>';
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < this.customtable_js.options.HeaderCol.length; i++) {
                    if ($listcolwidth.length > 0 && $listcolwidth[i] != '') {
                        tr += '<th style="cursor: pointer;min-width:' + $listcolwidth[i] + 'px;" class="hidden-480" dataorder="' + this.customtable_js.options.TableCol[i] + '" order="">' + this.customtable_js.options.HeaderCol[i] + '</th>';
                    }
                    else {
                        tr += '<th style="cursor: pointer;" class="hidden-480" dataorder="' + this.customtable_js.options.TableCol[i] + '" order="">' + this.customtable_js.options.HeaderCol[i] + '</th>';
                    }
                }
            }
            tr += "<th class='hidden-480' style='min-width:" + (this.customtable_js.options.actioncolwidth != '' ? this.customtable_js.options.actioncolwidth : "110") + "px;'></th>";
            tr += '</tr>';
            $header.append(tr);
            $(this.customtable_js.options.Table).append($header);
            if (this.customtable_js.options.ordertable == true) {
                await this.customtable_js('actionOrderBy');
            }
        }
    }

    $.fn.customtable_js.Constructor = customtable_js;
    $(function () {
        $('.customdatatable').customtable_js();
    });
}(window.jQuery);


function OrderCol(name, item) {
    var $item = $(item);
    if ($item.attr('order') == '') {
        $item.attr('order', 'asc');
    }
    else if ($item.attr('order') == 'asc') {
        $item.attr('order', 'desc');
    }
    else if ($item.attr('order') == 'desc') {
        $item.attr('order', '');
    }
}