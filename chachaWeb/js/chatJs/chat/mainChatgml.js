function getTimeNow() {
    var e = new Date;
    return e.toLocaleTimeString() + " " + e.getMilliseconds() + "ms"
}
var CHAT = {
    index: 0,
    MAX: 200,
    login: {
        name: "",
        type: "admin",
        id: 0,
        src: ""
    },
    language: "Cn",
    containDiv: null,
    containUl: null,
    scroll: null,
    timer: new Date,
    ArrRec: [],
    teaID: 0,
    classType: "1v1",
    allBlock: !1,
    ArrRecAll: [],
    ArrRecTea: [],
    signTea: !1,
    timeArr: [],
    blockArr: [],
    blockImgArr: [],
    menu: {
        target: $("#myMenu"),
        width: 0,
        height: 0,
        conf: {
            copy: {
                display: !0,
                disable: !1
            },
            saveAs: {
                display: !0,
                disable: !1,
                src: ""
            },
            all: {
                display: !0,
                disable: !0,
                clicked: !1
            },
            clearAll: {
                display: !0,
                disable: !0
            },
            kickUser: {
                display: !0,
                disable: !1,
                id: 0
            },
            block: {
                display: !0,
                disable: !1,
                id: 0
            },
            unblock: {
                display: !0,
                disable: !1,
                id: 0
            },
            blockImage: {
                display: !0,
                disable: !1,
                id: 0
            },
            unblockImage: {
                display: !0,
                disable: !1,
                id: 0
            },
            blockAll: {
                display: !0,
                disable: !0
            },
            unblockAll: {
                display: !0,
                disable: !1
            }
        }
    },
    selected: "",
    sdkCupId: 0,
    tranID: 0,
    numUnknowRecord: 0,
    imgOnly: !1,
    recordOwnerIsMe: !1,
    recordOpenId: 0,
    imgId: 0,
    tranTarCopy: "",
    tranTarContextCopy: "",
    colorsData: {},
    clienttype: 0,
    initialize: function(e) {
        console.log("[" + getTimeNow() + "]-----------\x3edata to init：" + JSON.stringify(e)),
        this.language = e.lang || "Cn",
        this.login.name = e.name || "",
        this.login.type = void 0 != e.type && ("tea" == e.type || "admin" == e.type) ? "admin": "guest",
        this.login.id = e.id || 0,
        this.login.src = e.headImg || "",
        this.classType = e.classType || "1v1",
        this.allBlock = e.allBlock || !1,
        this.is1vNPDF = e.is1vNPDF || !1,
        this.clienttype = e.clienttype || 0,
        this.containDiv = $("#tem_record"),
        this.containUl = $("#c-list"),
        this.scroll = $("#scroll_record"),
        this.eventBind(),
        this.ii = 0,
        this.recordOpenId = 0,
        this.sdkCupId = 0,
        this.tranID = 0,
        this.ArrRec = [],
        this.ArrRecTea = [],
        this.ArrRecAll = [],
        this.blockArr = [],
        this.index = 0,
        this.menu.target = $("#myMenu"),
        "guest" != this.login.type && "1v1" != this.classType || (this.menu.conf.kickUser.display = !1, this.menu.conf.block.display = !1, this.menu.conf.unblock.display = !1, this.menu.conf.blockImage.display = !1, this.menu.conf.unblockImage.display = !1, this.menu.conf.blockAll.display = !1, this.menu.conf.unblockAll.display = !1, this.menu.target.find(".kickUser").css("display", "none"), this.menu.target.find(".block").css("display", "none"), this.menu.target.find(".unblock").css("display", "none"), this.menu.target.find(".blockImage").css("display", "none"), this.menu.target.find(".unblockImage").css("display", "none"), this.menu.target.find(".blockAll").css("display", "none"), this.menu.target.find(".unblockAll").css("display", "none")),
        this.allBlock ? (this.menu.conf.blockAll.disable = !1, this.menu.conf.unblockAll.disable = !0, $(".tip").show()) : $(".tip").hide(),
        this.menu.width = $("#myMenu").width(),
        this.menu.height = $("#myMenu").height(),
        "Cn" == this.language && ($(".copyMH").html("<span>复制(C)</span>"), $(".saveMH").html("<span>另存为(S)</span>"), $(".allSelectMH").html("<span>全选(A)</span>"), $(".clearAllMH").html("<span>清屏</span>"), $(".kickUserMH").html("<span>踢出该用户</span>"), $(".blockMH").html("<span>对该用户禁言</span>"), $(".unblockMH").html("<span>取消该用户禁言</span>"), $(".blockImageMH").html("<span>禁止发图</span>"), $(".unblockImageMH").html("<span>取消禁止发图</span>"), $(".blockAllMH").html("<span>对所有人禁言</span>"), $(".unblockAllMH").html("<span>取消所有人禁言</span>"))
    },
    add: function(e) {
        if (CHAT.index += 1, CHAT.index >= CHAT.MAX) {
            var s = CHAT.ArrRec.shift();
            s && (s.handle_delete(), CHAT.index--),
            s = null
        }
        if ("" != e.value.time) {
            var t = new Record;
            t.handle_add("time", e.value.time),
            CHAT.ArrRec.push(t)
        }
        var a = "";
        CHAT.signTea || (a = CHAT.initRecord(e.type, e.value)),
        console.log("[" + getTimeNow() + "]-----------\x3eadded record：" + JSON.stringify(e));
        var s = new Record(e.userInfo.courserole); - 1 == e.type.indexOf("tip") && "SwitchSDKReq" != e.type && "recordTip" != e.type ? CHAT.signTea ? 1 != e.userInfo.courserole && 4 != e.userInfo.courserole && 6 != e.userInfo.courserole && 7 != e.userInfo.courserole || (a = CHAT.initRecord(e.type, e.value), s.handle_add("chat_other", a, e.userInfo.headImg, e.userInfo)) : e.userInfo.id == CHAT.login.id ? s.handle_add("chat_self", a, e.userInfo.headImg, e.userInfo) : s.handle_add("chat_other", a, e.userInfo.headImg, e.userInfo) : s.handle_add(e.type, a),
        CHAT.ArrRec.push(s)
    },
    initRecord: function(e, s) {
        var t = "",
        a = 0,
        n = -1,
        i = "",
        l = "",
        o = "error",
        r = "";
        r = "tipSelfStyle" != e ? CHAT.removeDanger(s.data) : s.data;
        for (this.imgOnly = !0, this.recordOwnerIsMe = "False" != s.isMe;
        "" != r;) {
            if ( - 1 == (a = r.indexOf("[SPE_"))) {
                "" != r && (this.imgOnly = !1),
                t += r;
                break
            }
            if ( - 1 == (n = r.indexOf('"]'))) {
                t += r,
                "" != r && (this.imgOnly = !1);
                break
            }
            switch (r.charAt(a + 5)) {
            case "I":
                if (0 != a && (this.imgOnly = !1), "False" != s.isMe) {
                    if (t += r.substring(0, a) + '<img id="img_' + CHAT.imgId + '" src="' + r.substring(a + 12, n).replace(/&quot;/g, "\\") + '" />', 7 == parseInt(CHAT.clienttype)) {
                        var c = r.substring(a + 12, n).replace(/&quot;/g, "\\"),
                        d = {
                            type: "cbImg",
                            data: {
                                value: c,
                                id: "img_" + CHAT.imgId
                            }
                        };
                        comm_chat_send("cbImg", Base64.encode(JSON.stringify(d)))
                    }
                    CHAT.imgId++,
                    !0
                } else {
                    t += r.substring(0, a) + '<img id="img_' + CHAT.imgId + '" src="./images/chat-client/receiving.gif" />';
                    var c = r.substring(a + 12, n).replace(/&quot;/g, "\\"),
                    d = {
                        type: "cbImg",
                        data: {
                            value: c,
                            id: "img_" + CHAT.imgId
                        }
                    };
                    comm_chat_send("cbImg", Base64.encode(JSON.stringify(d))),
                    CHAT.imgId++,
                    !0
                }
                r = r.substr(n + 2),
                !0;
                break;
            case "B":
                "recordTip" == e ? (i = "" == i ? "recordTipFile": "recordTipFolder", "recordTipFile" == i && (this.recordOpenId++, t += r.substring(0, a) + "<br />"), t += '<u class="' + i + '" data-id="' + this.recordOpenId + '">' + r.substring(a + 13, n) + "</u> ") : "SwitchSDKReq" == e && (l = "" == l ? "sdkY": "sdkN", "sdkY" == l && (this.sdkCupId++, t += r.substring(0, a) + "<br />"), t += '<u class="' + l + '" data-id="' + this.sdkCupId + '">' + r.substring(a + 13, n) + "</u> "),
                r = r.substr(n + 2),
                this.imgOnly = !1;
                break;
            case "L":
                t += r.substring(0, a) + '<a class="linkC" href="' + r.substring(a + 11, r.indexOf('", "')) + '">' + r.substring(r.indexOf('", "') + 4, r.indexOf('"]')) + "</a>",
                r = r.substr(n + 2),
                this.imgOnly = !1;
                break;
            default:
                o = r.charAt(a + 5),
                this.imgOnly = !1
            }
            if ("error" != o) {
                t = "",
                console.error("error when init record : " + o);
                break
            }
        }
        return t
    },
    destroy: function() {
        var e, s, t = this.ArrRec.slice(0);
        for (this.ArrRec.length = 0, e = 0, s = t.length; e < s; e++) t.pop().handle_delete();
        $(".overview").css("top", "0px")
    },
    handleTranSent: function(e, s) {
        var t = null;
        if ("tranCut" == e) {
            "1v1" == CHAT.classType ? s.target.style.backgroundImage = 'url("./images/chat/loadingChange.gif")': (s.target.style.backgroundImage = 'url("./images/chat/loading.gif")', s.target.style.width = "22px", s.target.style.height = "22px");
            var a = s.target.offsetParent.childNodes[1].textContent;
            a.length > 0 && (t = {
                type: "tranCut",
                data: {
                    value: a,
                    id: s.target.offsetParent.childNodes[1].id
                }
            },
            comm_chat_send("tranCut", Base64.encode(JSON.stringify(t))))
        } else "tranCopy" == e && (t = {
            type: "tranCopy",
            data: {
                value: s.selected
            }
        },
        comm_chat_send("tranCopy", Base64.encode(JSON.stringify(t))), CHAT.tranTarCopy = "")
    },
    handleTranGet: function(e, s) {
        if ("tranCut" == e) {
            var t = $("#" + s.id);
            if (t[0].parentNode.lastChild.remove(), t) {
                var a = null,
                n = "",
                i = "";
                try {
                    if (a = JSON.parse(s.data), a.basic) {
                        i = a.query,
                        (a.basic["uk-phonetic"] || a.basic.phonetic) && (i += "[", i += a.basic["uk-phonetic"] ? a.basic["uk-phonetic"] : a.basic.phonetic, i += "]");
                        for (var l = 0; l < a.basic.explains.length; l++) n += a.basic.explains[l],
                        l + 1 < a.basic.explains.length && (n += "\n")
                    } else {
                        i = a.query;
                        for (var l = 0; l < a.translation.length; l++) n += a.translation[l],
                        l + 1 < a.translation.length && (n += "\n")
                    }
                    n = CHAT.removeDanger(n)
                } catch(e) {
                    n = "Cn" == CHAT.language ? "没有找到对应的翻译结果": "Fail to find the corresponding translation"
                }
                "1v1" == CHAT.classType ? $('<p><hr size="1"  style="width: 100%"/></p>').appendTo(t) : $('<p><hr size="1"  style="border:1px #a1aaa8 dotted;width: 100%"/></p>').appendTo(t),
                $('<p class="tran_result_show">' + n + "</p>").appendTo(t),
                scrollHandle.handle_scroll(2, "#scroll_record")
            }
        } else "tranCopy" == e && CHAT.showTranCopy(JSON.parse(s.data))
    },
    showTranCopy: function(e) {
        var s = "",
        t = e.query;
        $(".chatContainer").find(".tranConCopy");
        try {
            for (var a = 0; a < e.basic.explains.length; a++) s += e.basic.explains[a],
            a + 1 < e.basic.explains.length && (s += "\r\n")
        } catch(t) {
            s = e.query
        }
        $(".trans_select").css("display", "block"),
        $("#src_selected").text(t),
        $("#res_selected").text(s)
    },
    tranClick: function(e) {
        var s = null;
        switch ("" == e.target.className ? e.target.parentNode.className: e.target.className) {
        case "close":
            $(".trans_select").css("display", "none");
            break;
        case "copy":
            s = {
                type: "copy",
                data: {
                    value: $("#src_selected").text() + "\r\n" + $("#res_selected").text()
                }
            };
            break;
        case "send":
            s = {
                type: "sent",
                data: {
                    value: $("#src_selected").text() + "\r\n" + $("#res_selected").text()
                }
            },
            $(".trans_select").css("display", "none")
        }
        s && comm_chat_send("ButTrans", Base64.encode(JSON.stringify(s)))
    },
    eventClick: function(e) {
        if (e.target.parentElement.className || e.target.className) {
            var s = null;
            if (document.getElementById("tem_record").focus(), -1 != e.target.className.indexOf("MH") || -1 != e.target.parentElement.className.indexOf("MH")) this.clickMenu(e);
            else {
                if ( - 1 != e.target.className.indexOf("sdk"))"sdkY" == e.target.className && e.target.dataset.id == this.sdkCupId ? s = {
                    type: "sdkCupY"
                }: "sdkN" == e.target.className && e.target.dataset.id == this.sdkCupId && (s = {
                    type: "sdkCupN"
                }),
                s && comm_chat_send("sdkCup", Base64.encode(JSON.stringify(s)));
                else if ( - 1 != e.target.className.indexOf("record"))"recordTipFile" == e.target.className ? s = {
                    type: "recordOpenFile"
                }: "recordTipFolder" == e.target.className && (s = {
                    type: "recordOpenFolder"
                }),
                s && comm_chat_send("recordOpen", Base64.encode(JSON.stringify(s)));
                else if ("RLImgTran" == e.target.className) this.handleTranSent("tranCut", e);
                else if ("linkC" == e.target.className) s = {
                    type: "linkClick",
                    data: {
                        value: e.target.href
                    }
                },
                comm_chat_send("linkClick", Base64.encode(JSON.stringify(s)));
                else if (this.selectedTarget().selected.length > 0) {
                    var t = this.selectedTarget();
                    t.status && "" != CHAT.tranTarCopy && -1 != CHAT.tranTarCopy.indexOf(t.selected) && this.handleTranSent("tranCopy", t)
                }
                this.menu.conf.all.clicked = !1,
                CHAT.menu.target.css("visibility", "hidden")
            }
        } else this.menu.conf.all.clicked = !1,
        CHAT.menu.target.css("visibility", "hidden")
    },
    eventDBClick: function(e) {
        if ("IMG" == e.target.nodeName && "RSImg" != e.target.className && "RLImgPic" != e.target.className) {
            var s = null;
            s = {
                type: "DBClickImg",
                data: {
                    value: decodeURI(e.target.src).replace("file:///", "")
                }
            },
            comm_chat_send("DBClickImg", Base64.encode(JSON.stringify(s)))
        }
    },
    handleMenu: function(e) {
        var s = this.winSize("client").width,
        t = this.winSize("client").height,
        a = s - e.clientX - this.menu.width,
        n = t - e.clientY - this.menu.height;
        a = a > 0 ? e.clientX: e.clientX + a,
        n = n > 0 ? e.clientY: e.clientY + n;
        var i = this.selectedTarget();
        this.menu.conf.unblock.disable = !1,
        this.menu.conf.block.disable = !1,
        this.menu.conf.unblockImage.disable = !1,
        this.menu.conf.blockImage.disable = !1,
        this.menu.conf.kickUser.disable = !1,
        7 != parseInt(this.clienttype) && ("1v1" == this.classType ? (this.menu.conf.unblock.disable = !1, this.menu.conf.block.disable = !1, this.menu.conf.kickUser.disable = !1, this.menu.conf.blockAll.disable = !1, this.menu.conf.unblockAll.disable = !1) : (this.menu.conf.unblock.disable = !1, this.menu.conf.block.disable = !1, this.menu.conf.kickUser.disable = !1, -1 == e.target.className.indexOf("RLImgPic") && -1 == e.target.className.indexOf("RLName") || ( - 1 != this.blockArr.indexOf(e.target.dataset.id) ? (this.menu.conf.unblock.disable = !0, this.menu.conf.unblock.id = e.target.dataset.id) : (this.menu.conf.block.disable = !0, this.menu.conf.block.id = e.target.dataset.id), -1 != this.blockImgArr.indexOf(e.target.dataset.id) ? (this.menu.conf.unblockImage.disable = !0, this.menu.conf.unblockImage.id = e.target.dataset.id) : (this.menu.conf.blockImage.disable = !0, this.menu.conf.blockImage.id = e.target.dataset.id), this.menu.conf.kickUser.disable = !0, this.menu.conf.kickUser.id = e.target.dataset.id)), e.target.nodeName && -1 != e.target.nodeName.indexOf("IMG") ? (this.menu.conf.copy.disable = !0, this.menu.conf.saveAs.disable = !0, this.menu.conf.saveAs.src = e.target.currentSrc) : i.status && (0 != i.selected.length ? (this.menu.conf.copy.disable = !0, this.menu.conf.saveAs.disable = !1) : (this.menu.conf.copy.disable = !1, this.menu.conf.saveAs.disable = !1)), this.showMenu(a, n))
    },
    showMenu: function(e, s) {
        var t = this.menu.conf,
        a = this.menu.target;
        t.copy.disable ? a.find(".copy").removeClass("unuse") : a.find(".copy").addClass("unuse"),
        t.saveAs.disable ? a.find(".save").removeClass("unuse") : a.find(".save").addClass("unuse"),
        t.all.disable ? a.find(".allSelect").removeClass("unuse") : a.find(".allSelect").addClass("unuse"),
        t.clearAll.disable ? a.find(".clearAll").removeClass("unuse") : a.find(".clearAll").addClass("unuse"),
        t.kickUser.disable ? a.find(".kickUser").removeClass("unuse") : a.find(".kickUser").addClass("unuse"),
        t.block.disable ? a.find(".block").removeClass("unuse") : a.find(".block").addClass("unuse"),
        t.unblock.disable ? a.find(".unblock").removeClass("unuse") : a.find(".unblock").addClass("unuse"),
        t.blockImage.disable ? a.find(".blockImage").removeClass("unuse") : a.find(".blockImage").addClass("unuse"),
        t.unblockImage.disable ? a.find(".unblockImage").removeClass("unuse") : a.find(".unblockImage").addClass("unuse"),
        t.blockAll.disable ? a.find(".blockAll").removeClass("unuse") : a.find(".blockAll").addClass("unuse"),
        t.unblockAll.disable ? a.find(".unblockAll").removeClass("unuse") : a.find(".unblockAll").addClass("unuse"),
        this.menu.target.css({
            left: e,
            top: s,
            visibility: "visible"
        }),
        this.menu.target.focus()
    },
    clickMenu: function(e, s) {
        var t = this.menu.conf,
        a = null,
        n = s || e.target.className || e.target.parentElement.className;
        switch (n) {
        case "copyMH":
            t.copy.disable && (a = 0 != this.selectedTarget().selected.length ? {
                type: "copy",
                data: {
                    value: ""
                }
            }: {
                type: "copy_img",
                data: {
                    value: decodeURI(this.menu.conf.saveAs.src.replace("file:///", ""))
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "saveMH":
            t.saveAs.disable && (a = {
                type: "saveAs",
                data: {
                    value: decodeURI(this.menu.conf.saveAs.src.replace("file:///", ""))
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "allSelectMH":
            t.all.disable && (a = {
                type: "all",
                data: {
                    value: ""
                }
            },
            this.menu.conf.all.clicked = !0, CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "clearAllMH":
            t.clearAll.disable && (CHAT.menu.target.css("visibility", "hidden"), this.destroy(), this.index = 0, this.ArrRec.length = 0, CHAT.throttle(CHAT.updateScroll));
            break;
        case "kickUserMH":
            t.kickUser.disable && (a = {
                type: "kickUser",
                data: {
                    value: this.menu.conf.kickUser.id + ""
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "blockMH":
            t.block.disable && (a = {
                type: "block",
                data: {
                    value: this.menu.conf.block.id + ""
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "unblockMH":
            t.unblock.disable && (a = {
                type: "unblock",
                data: {
                    value: this.menu.conf.unblock.id + ""
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "blockImageMH":
            t.blockImage.disable && (a = {
                type: "blockimage",
                data: {
                    value: this.menu.conf.blockImage.id + ""
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "unblockImageMH":
            t.unblockImage.disable && (a = {
                type: "unblockimage",
                data: {
                    value: this.menu.conf.unblockImage.id + ""
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "blockAllMH":
            t.blockAll.disable && (a = {
                type: "blockAll",
                data: {
                    value: ""
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        case "unblockAllMH":
            t.unblockAll.disable && (a = {
                type: "unblockAll",
                data: {
                    value: ""
                }
            },
            CHAT.menu.target.css("visibility", "hidden"));
            break;
        default:
            CHAT.menu.target.css("visibility", "hidden")
        }
        a && ("allSelectMH" != n && (this.menu.conf.all.clicked = !1), comm_chat_send("menu", Base64.encode(JSON.stringify(a))))
    },
    keyMenu: function(e) {
        if ("hidden" != $("#myMenu").css("visibility")) switch (e.keyCode) {
        case 67:
            CHAT.clickMenu(e, "copyMH");
            break;
        case 65:
            CHAT.clickMenu(e, "allSelectMH");
            break;
        case 83:
            CHAT.clickMenu(e, "saveMH")
        }
    },
    selectedTarget: function() {
        var e = "",
        s = !1;
        return this.selected = e,
        window.getSelection ? (s = !0, e = window.getSelection().toString(), this.selected = e) : document.selection ? (s = !0, e = document.selection().toString(), this.selected = e) : (s = !1, console.error("can not read selected words")),
        {
            status: s,
            selected: e
        }
    },
    seeTeaOnly: function(e) {
        if (e) {
            console.log("[" + getTimeNow() + "]-----------\x3esee teacher only"),
            this.destroy(),
            this.index = 0,
            this.ArrRec = [],
            this.signTea = !0;
            var s, t, a = this.ArrRecTea.slice(0);
            if (0 == a.length) scrollHandle.handle_scroll(1, "#scroll_record");
            else for (s = 0, t = a.length; s < t; s++) this.add(a.shift())
        } else {
            console.log("[" + getTimeNow() + "]-----------\x3ecancel see teacher only"),
            this.destroy(),
            this.index = 0,
            this.ArrRec = [],
            this.signTea = !1;
            var s, t, a = this.ArrRecAll.slice(0);
            if (0 == a.length) scrollHandle.handle_scroll(1, "#scroll_record");
            else for (s = 0, t = a.length; s < t; s++) this.add(a.shift())
        }
    },
    eventBind: function() {
        $(".chatContainer").contextmenu(function(e) {
            e = e || window.event,
            CHAT.handleMenu(e)
        }),
        document.onselectstart = function(e) {
            var s = ["infoSpan", "timeSpan", "RSSpan", "RLRecord", "tran_result_show"];
            return ! ((!e.target.parentElement || -1 == s.indexOf(e.target.parentElement.className) && -1 == e.target.parentElement.className.indexOf("RSSpan") && -1 == e.target.parentElement.className.indexOf("RLRecord")) && !CHAT.menu.conf.all.clicked) || ("getSelection" in window ? window.getSelection().removeAllRanges() : document.selection.empty(), !1)
        },
        document.addEventListener("keyup",
        function(e) {
            CHAT.keyMenu(e),
            e.preventDefault(),
            e.stopPropagation()
        },
        !0),
        document.addEventListener("keydown",
        function(e) {
            CHAT.keyMenu(e),
            e.preventDefault(),
            e.stopPropagation()
        },
        !0),
        $(".chatContainer").bind("mousedown",
        function(e) {
            var s = e.button;
            2 != s && 3 != s && -1 == e.target.className.indexOf("MH") && -1 == e.target.parentElement.className.indexOf("MH") && ("getSelection" in window ? window.getSelection().removeAllRanges() : document.selection.empty()),
            CHAT.tranTarCopy = e.target.textContent,
            CHAT.menu.conf.all.clicked && "hidden" != CHAT.menu.target.css("visibility") && e.preventDefault()
        }),
        $(".chat-list").delegate(".RSImg,.RLImgPic", "click",
        function(e) {
            var s = $(e.target);
            comm_chat_send("clickHeadPic", Base64.encode(JSON.stringify({
                id: s.data("id"),
                top: s.offset().top
            })))
        }),
        window.addEventListener("blur",
        function() {
            CHAT.menu.target.css("visibility", "hidden")
        }),
        $(".chatContainer").bind("click",
        function(e) {
            CHAT.eventClick(e),
            e.preventDefault(),
            e.stopPropagation()
        }),
        $(".chatContainer").bind("dblclick",
        function(e) {
            CHAT.eventDBClick(e),
            e.preventDefault(),
            e.stopPropagation()
        }),
        $(".trans_select").bind("click",
        function(e) {
            CHAT.tranClick(e),
            e.preventDefault(),
            e.stopPropagation()
        }),
        $("#recordTip").bind("click",
        function(e) {
            CHAT.handleTip("hide"),
            scrollHandle.handle_scroll(1, "#scroll_record")
        }),
        window.addEventListener("resize",
        function() {
            var e = $("#tem_record").height() - $(".overview").height();
            e > 0 ? $(".overview").css("top", e) : $(".overview").css("top", "0px"),
            scrollHandle.handle_scroll(1, "#scroll_record")
        })
    },
    winSize: function(e) {
        var s = e,
        t = document.documentElement || document.body;
        return {
            width: t[s + "Width"],
            height: t[s + "Height"]
        }
    },
    blockRes: function(e) {
        switch (console.log("[" + getTimeNow() + "]-----------\x3eblock handle :" + e.type), e.type) {
        case "block":
            this.blockArr.push(e.id);
            break;
        case "unblock":
            var s, t, a = e.id;
            for (s = 0, t = this.blockArr.length; s < t; s++) if (this.blockArr[s] == a) {
                this.blockArr[s] = -1;
                break
            }
            break;
        case "blockAll":
            this.menu.conf.blockAll.disable = !1,
            this.menu.conf.unblockAll.disable = !0,
            $(".tip").show();
            break;
        case "unblockAll":
            this.menu.conf.blockAll.disable = !0,
            this.menu.conf.unblockAll.disable = !1,
            $(".tip").hide();
            break;
        case "blockimage":
            this.blockImgArr.push(e.id);
            break;
        case "unblockimage":
            var s, t, a = e.id;
            for (s = 0, t = this.blockImgArr.length; s < t; s++) if (this.blockImgArr[s] == a) {
                this.blockImgArr[s] = -1;
                break
            }
        }
    },
    checkCef: function(e, s, t) {
        "1v1" == CHAT.classType ? setTimeout(function() {
            var e = [];
            e = CHAT.timeArr.length > CHAT.MAX ? CHAT.timeArr.slice(CHAT.timeArr.length - CHAT.MAX) : CHAT.timeArr.slice(0),
            CHAT.timeArr.length = 0;
            for (var a = 0,
            n = e.length; a < n; a++) {
                var i = e.pop();
                i && s.call(t, i)
            }
        },
        200) : setTimeout(function() {
            var e = [];
            e = CHAT.timeArr.length > CHAT.MAX ? CHAT.timeArr.slice(CHAT.timeArr.length - CHAT.MAX) : CHAT.timeArr.slice(0),
            CHAT.timeArr.length = 0;
            for (var a = 0,
            n = e.length; a < n; a++) {
                var i = e.pop();
                i && s.call(t, i)
            }
        },
        500)
    },
    throttle: function(e, s) {
        clearTimeout(e.tid),
        e.tid = setTimeout(function() {
            e.call(s)
        },
        100)
    },
    handleTip: function(e) {
        "show" == e ? ($("#recordTip").find(".tip_data").html("<span>" + CHAT.numUnknowRecord + "条新消息</span>"), $("#recordTip").show()) : (CHAT.numUnknowRecord = 0, $("#recordTip").hide())
    },
    updateScroll: function() {
        var e = parseFloat($(".thumb").css("height").replace("px", "")),
        s = parseFloat($(".thumb").css("top").replace("px", "")),
        t = parseFloat($("#scroll_record").height());
        Math.round(e + s) >= t - 5 ? (scrollHandle.handle_scroll(1, "#scroll_record"), CHAT.handleTip("hide")) : (scrollHandle.handle_scroll(2, "#scroll_record"), CHAT.handleTip("show"))
    },
    colorSet: function(e) {
        e.length > 0 && ($.each(e,
        function(e, s) {
            CHAT.colorsData[s.uid] = s.color
        }), console.log("penColors下发的昵称颜色:%s", JSON.stringify(e)))
    },
    removeDanger: function(e) {
        var s = e;
        return s = s.replace(/&/g, "&amp;"),
        s = s.replace(/\\/g, "&quot;"),
        s = s.replace(/'/g, "&#039;"),
        s = s.replace(/</g, "&lt;"),
        s = s.replace(/>/g, "&gt;")
    }
},
Record = function(e) {
    this.item = null,
    this.ownerType = 1 == e || 4 == e || 6 == e || 7 == e ? "tea": 240 == e ? "admin": "stu"
};
Record.prototype.handle_add = function(e, s, t, a) {
    this.item = $("<li></li>").appendTo(CHAT.containUl),
    this.p = $("<p></p>").appendTo(this.item),
    this.item.addClass("recordLi");
    var n = ["tipInfo", "SwitchSDKReq", "recordTip", "tipWarning", "tipError"];
    if("tipInfo" == e)
    {this.p[0].style.width="100%";}
    else if ("SwitchSDKReq" == e || "recordTip" == e) s = s.replace(/&amp;nbsp;/g, ""),
    this.img = $('<img src="./images/chat-client/ok.png" />').appendTo(this.p);
    else switch (e) {
    case "tipWarning":
        s = s.replace(/&amp;nbsp;/g, ""),
        CHAT.signTea || (this.img = $('<img src="./images/chat-client/warning.png" />').appendTo(this.p));
        break;
    case "tipError":
        s = s.replace(/&amp;nbsp;/g, ""),
        this.img = $('<img src="./images/chat-client/error.png" />').appendTo(this.p);
        break;
    case "tipSelfStyle":
        this.span = $("<span>" + s + "</span>").appendTo(this.p);
        break;
    case "tipELRoom":
        var i = JSON.parse(s),
        l = "";
        this.p.addClass("infoELTip"),
        i.list.map(function(e) {
            void 0 !== e.enter ? l += '<span><img class="tipELIMG" src="./images/chat/tipEnter.png" /><span>' + e.enter + "</span></span>": void 0 !== e.leave && (l += '<span><img class="tipELIMG" src="./images/chat/tipLeave.png" /><span>' + e.leave + "</span></span>")
        }),
        this.span = $(l).appendTo(this.p),
        this.span.addClass("infoELCon");
        break;
    case "time":
        this.span = $("<span>" + s + "</span>").appendTo(this.p),
        this.p.addClass("timeCon"),
        this.span.addClass("timeSpan");
        break;
    case "chat_self":
        s.length > 0 && ("1v1" == CHAT.classType ? (this.spanCon = $("<span></span>").appendTo(this.p), this.spanName = $('<span class="spanName_' + a.id + '">' + a.name + "</span>").appendTo(this.spanCon), this.RecordCon = $("<span>" + s + "</span>").appendTo(this.spanCon), this.p.addClass("RSCon"), this.spanCon.addClass("RSSpanCon"), this.spanName.addClass("RSName"), this.RecordCon.addClass("RSSpan")) : "1VNmulti" == CHAT.classType ? (this.p.addClass("RSCon"), this.ConBak = $("<span></span>").appendTo(this.p), this.spanName = $('<span class="spanName_' + a.id + '">' + a.name + "</span>").appendTo(this.ConBak), this.spanCon = $("<span>" + s + "</span>").appendTo(this.ConBak), this.spanName.addClass("RRName"), this.ConBak.addClass("RSSpanBak"), this.spanCon.addClass("RSSpan")) : (this.img = $('<img src="' + t + '" data-id="' + CHAT.login.id + '"/>').appendTo(this.p), this.ConBak = $("<span></span>").appendTo(this.p), this.spanCon = $("<span></span>").appendTo(this.p), this.spanName = $('<p class="spanName_' + a.id + '">' + a.name + "</p>").appendTo(this.spanCon), this.spanStr = $("<p>" + s + "</p>").appendTo(this.spanCon), this.p.addClass("RSCon"), this.img.addClass("RSImg"), this.ConBak.addClass("RSSpanBak"), this.spanCon.addClass("con-1"), this.spanName.addClass("name-1"), this.spanStr.addClass("RSSpan"), this.ownerType && "tea" == this.ownerType && this.spanCon.addClass("teaRecord")), this.handle_imageSize(s));
        break;
    case "chat_other":
        s.length > 0 && (this.p.addClass("RLCon"), "1vN" == CHAT.classType && (this.imgPic = $('<img src="' + t + '" data-id="' + a.id + '" />').appendTo(this.p), this.imgPic.addClass("RLImgPic")), this.spanCon = $("<span></span>").appendTo(this.p), "1VNmulti" == CHAT.classType ? this.spanName = $('<span class="spanName_' + a.id + '" data-id="' + a.id + '">' + a.name + "</span>").appendTo(this.spanCon) : this.spanName = $('<span data-id="' + a.id + '">' + a.name + "</span>").appendTo(this.spanCon), this.RecordCon = $('<span id="tran_' + CHAT.tranID + '">' + s + "</span>").appendTo(this.spanCon), this.spanCon.addClass("RLSpanCon"), this.spanName.addClass("RLName"), this.RecordCon.addClass("RLRecord"), this.ownerType && "tea" == this.ownerType && "1vN" == CHAT.classType && this.RecordCon.addClass("teaRecord"), CHAT.imgOnly || (this.imgTran = $("<span></span>").appendTo(this.spanCon), this.imgTran.addClass("RLImgTran")), CHAT.tranID++, this.handle_imageSize(s))
    } - 1 != n.indexOf(e) && (this.span = $("<span" +("tipInfo" == e ? " style='width:100%;text-align:center;'" : "")+ ">" + s + "</span>").appendTo(this.p), this.p.addClass("infoCon"), this.img ? this.img.addClass("infoImg") : console.log("img不用添加样式"), this.span.addClass("infoSpan")),
    CHAT.recordOwnerIsMe ? (CHAT.handleTip("hide"), scrollHandle.handle_scroll(1, "#scroll_record")) : (CHAT.numUnknowRecord++, CHAT.throttle(CHAT.updateScroll));
    for (var o in CHAT.colorsData) $(".spanName_" + o).css("color", "#" + CHAT.colorsData[o]),
    console.log(".spanName_" + o + "颜色值:" + CHAT.colorsData[o] + "\n")
},
Record.prototype.handle_imageSize = function(e) {
    var s = $(this.spanCon),
    t = [];
    if (e.indexOf("<img") >= 0) for (var a = /<img[^>]*>/gi,
    n = e.match(a), i = 0; i < n.length; i++) {
        var l = n[i].indexOf("src"),
        o = n[i].indexOf(" />"),
        r = n[i].substring(l + 5, o - 1); !
        function(e) {
            t[e] = new Image,
            t[e].onload = function() {
                var a = t[e].width,
                n = $("#scroll_record").width() - 60;
                n <= 0 && (n = 250),
                parseInt(a) > parseInt(n) && s.find("img:eq(" + e + ")").css({
                    width: "100%",
                    height: "auto"
                }),
                CHAT.throttle(CHAT.updateScroll)
            },
            t[e].src = r
        } (i)
    }
},
Record.prototype.handle_delete = function() {
    var e = this;
    e.imgTran && (this.imgTran.remove(), delete e.imgTran),
    e.spanName && (this.spanName.remove(), delete e.spanName),
    e.RecordCon && (this.RecordCon.remove(), delete e.RecordCon),
    e.spanCon && (this.spanCon.remove(), delete e.spanCon),
    e.img && (this.img.remove(), delete e.img),
    e.ConBak && (this.ConBak.remove(), delete e.ConBak),
    e.span && (this.span.remove(), delete e.span),
    e.imgPic && (this.imgPic.remove(), delete e.imgPic),
    e.p && (this.p.remove(), delete e.p),
    e.item && (this.item.remove(), delete e.item),
    e.ownerType = null,
    delete e.ownerType
};
var comm_chat_send = function(e, s) {
    console.log("js向客户端发送信息type:%s", e),
    console.log("js向客户端发送信息str:%s", s),
    7 == parseInt(CHAT.clienttype) ? window.webkit.messageHandlers.AcJs_get.postMessage(JSON.stringify({
        type: e,
        value: s
    })) : window.AcJs_get(e, s)
},
comm_chat_set = function(e, s) {
    if (s && "" != s) var t = JSON.parse(Base64.decode(s));
    console.log("客户端向js发送信息type:%s", e),
    console.log("客户端向js发送信息tem_e:%s", JSON.stringify(t));
    try {
        if ("init" == e) CHAT.timeArr = [],
        CHAT.initialize(t);
        else if ("data" == e)"tranCopy" == t.type ? CHAT.handleTranGet("tranCopy", t.value) : "tranCut" == t.type ? CHAT.handleTranGet("tranCut", t.value) : (1 != t.userInfo.courserole && 4 != t.userInfo.courserole && 6 != t.userInfo.courserole && 7 != t.userInfo.courserole || CHAT.ArrRecTea.push(t), CHAT.ArrRecAll.length >= 2 * CHAT.MAX && (CHAT.ArrRecAll = CHAT.ArrRecAll.slice(CHAT.ArrRecAll.length - CHAT.MAX)), CHAT.ArrRecAll.push(t), CHAT.timeArr.length > 0 ? CHAT.timeArr.unshift(t) : (CHAT.timeArr.unshift(t), CHAT.checkCef(CHAT.timeArr, CHAT.add)));
        else if ("handle" == e)"onlySeeTeacher" == t.type ? CHAT.seeTeaOnly(!0) : "cancelSeeTeacher" == t.type && CHAT.seeTeaOnly(!1);
        else if ("update" == e) {
            var a, n, i = new Image;
            i.onload = function() {
                var e = i.width,
                s = $("#scroll_record").width() - 60;
                if (s <= 0 && (s = 250), console.log("@@@@@@@@@@@@@", parseInt(e), "   ", parseInt(s)), parseInt(e) > parseInt(s)) for (a = 0, n = t.id.length; a < n; a++) $("#" + t.id[a]).attr("src", t.imgSrc).css({
                    width: "100%",
                    height: "auto"
                });
                else for (a = 0, n = t.id.length; a < n; a++) $("#" + t.id[a]).attr("src", t.imgSrc).css({
                    width: "auto",
                    height: "auto"
                });
                CHAT.throttle(CHAT.updateScroll)
            },
            i.src = t.imgSrc
        } else "blockRes" == e ? CHAT.blockRes(t) : "penColors" == e ? CHAT.colorSet(t) : "clearAllMH" == e && CHAT.clickMenu(null, "clearAllMH")
    } catch(e) {
        console.log(e)
    }
    return null
},
Base64 = {
    table: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"],
    UTF16ToUTF8: function(e) {
        for (var s = [], t = e.length, a = 0; a < t; a++) {
            var n = e.charCodeAt(a);
            if (n > 0 && n <= 127) s.push(e.charAt(a));
            else if (n >= 128 && n <= 2047) {
                var i = 192 | n >> 6 & 31,
                l = 128 | 63 & n;
                s.push(String.fromCharCode(i), String.fromCharCode(l))
            } else if (n >= 2048 && n <= 65535) {
                var i = 224 | n >> 12 & 15,
                l = 128 | n >> 6 & 63,
                o = 128 | 63 & n;
                s.push(String.fromCharCode(i), String.fromCharCode(l), String.fromCharCode(o))
            }
        }
        return s.join("")
    },
    UTF8ToUTF16: function(e) {
        for (var s = [], t = e.length, a = 0, a = 0; a < t; a++) {
            var n = e.charCodeAt(a);
            if (0 == (n >> 7 & 255)) s.push(e.charAt(a));
            else if (6 == (n >> 5 & 255)) {
                var i = e.charCodeAt(++a),
                l = (31 & n) << 6,
                o = 63 & i,
                r = l | o;
                s.push(String.fromCharCode(r))
            } else if (14 == (n >> 4 & 255)) {
                var i = e.charCodeAt(++a),
                c = e.charCodeAt(++a),
                l = n << 4 | i >> 2 & 15,
                o = (3 & i) << 6 | 63 & c;
                r = (255 & l) << 8 | o,
                s.push(String.fromCharCode(r))
            }
        }
        return s.join("")
    },
    encode: function(e) {
        if (!e) return "";
        for (var s = this.UTF16ToUTF8(e), t = 0, a = s.length, n = []; t < a;) {
            var i = 255 & s.charCodeAt(t++);
            if (n.push(this.table[i >> 2]), t == a) {
                n.push(this.table[(3 & i) << 4]),
                n.push("==");
                break
            }
            var l = s.charCodeAt(t++);
            if (t == a) {
                n.push(this.table[(3 & i) << 4 | l >> 4 & 15]),
                n.push(this.table[(15 & l) << 2]),
                n.push("=");
                break
            }
            var o = s.charCodeAt(t++);
            n.push(this.table[(3 & i) << 4 | l >> 4 & 15]),
            n.push(this.table[(15 & l) << 2 | (192 & o) >> 6]),
            n.push(this.table[63 & o])
        }
        return n.join("")
    },
    decode: function(e) {
        if (!e) return "";
        for (var s = e.length,
        t = 0,
        a = []; t < s;) code1 = this.table.indexOf(e.charAt(t++)),
        code2 = this.table.indexOf(e.charAt(t++)),
        code3 = this.table.indexOf(e.charAt(t++)),
        code4 = this.table.indexOf(e.charAt(t++)),
        c1 = code1 << 2 | code2 >> 4,
        c2 = (15 & code2) << 4 | code3 >> 2,
        c3 = (3 & code3) << 6 | code4,
        a.push(String.fromCharCode(c1)),
        64 != code3 && a.push(String.fromCharCode(c2)),
        64 != code4 && a.push(String.fromCharCode(c3));
        return this.UTF8ToUTF16(a.join(""))
    }
},
scrollHandle = function(e) {
    function s(s, t) {
        function r() {
            var e = w.toLowerCase();
            S.start = v.obj.offset()[H],
            A.obj.css(e, T[t.axis]),
            T.obj.css(e, T[t.axis]),
            v.obj.css(e, Math.max(v[t.axis], l)),
            T[t.axis] - v[t.axis] > 0 && (o = (T[t.axis] - Math.max(v[t.axis], l)) / (T[t.axis] - v[t.axis])),
            i = v[t.axis] / T[t.axis],
            T[t.axis] == v[t.axis] ? T.obj.css("display", "none") : (T.obj.css("display", "block"), x = -k.obj[0].offsetTop, a && n && m())
        }
        function c() {
            _ ? C.obj[0].ontouchstart = function(e) {
                1 === e.touches.length && (d(e.touches[0]), e.stopPropagation())
            }: (v.obj.bind("mousedown", d), T.obj.bind("mouseup", u)),
            t.scroll && window.addEventListener ? (b[0].addEventListener("DOMMouseScroll", p, !1), b[0].addEventListener("mousewheel", p, !1), b[0].addEventListener("MozMousePixelScroll",
            function(e) {
                e.preventDefault()
            },
            !1)) : t.scroll && (b[0].onmousewheel = p)
        }
        function d(s) {
            var t = parseInt(v.obj.css(H), 10);
            S.start = y ? s.pageX: s.pageY,
            I.start = "auto" == t ? 0 : t,
            _ ? (document.ontouchmove = function(e) {
                e.preventDefault(),
                u(e.touches[0])
            },
            document.ontouchend = g) : (e(document).bind("mousemove", u), e(document).bind("mouseup", g), v.obj.bind("mouseup", g))
        }
        function h() {
            var s = parseFloat(e(".thumb").css("height").replace("px", "")),
            t = parseFloat(e(".thumb").css("top").replace("px", "")),
            a = parseFloat(e("#scroll_record").height());
            Math.round(s + t) >= a - 5 && CHAT.handleTip("hide")
        }
        function p(s) {
            if (k.ratio < 1) {
                var a = s || window.event,
                n = a.wheelDelta ? a.wheelDelta / 120 : -a.detail / 3;
                s.deltaY,
                s.srcElement.parentElement.className;
                x = -k.obj[0].offsetTop,
                x -= n * t.wheel,
                x = Math.min(k[t.axis] - C[t.axis], Math.max(0, x)),
                v.obj.css(H, x / A.ratio * o),
                k.obj.css(H, -x),
                h(),
                (t.lockscroll || x !== k[t.axis] - C[t.axis] && 0 !== x) && (a = e.event.fix(a), a.preventDefault())
            }
        }
        function u(e) {
            k.ratio < 1 && (t.invertscroll && _ ? I.now = Math.min(T[t.axis] - v[t.axis], Math.max(0, I.start + (S.start - (y ? e.pageX: e.pageY)))) : I.now = Math.min(T[t.axis] - v[t.axis], Math.max(0, I.start + ((y ? e.pageX: e.pageY) - S.start))), x = I.now * A.ratio, k.obj.css(H, -x), v.obj.css(H, I.now * o), h())
        }
        function m() {
            if (S.start = 0, I.start = 0, k.ratio < 1 && (a && (I.now = Math.max(0, e("#scroll_record").find("#tem_record").height() - e(".chatContainer").find("#scroll_record").height())), 0 != I.now)) {
                var s = (T[t.axis] - v[t.axis]) / I.now;
                x = I.now / A.ratio,
                k.obj.css(H, -I.now),
                v.obj.css(H, I.now * s * o)
            }
        }
        function g() {
            e("body").removeClass("noSelect"),
            e(document).unbind("mousemove", u),
            e(document).unbind("mouseup", g),
            v.obj.unbind("mouseup", g),
            document.ontouchmove = document.ontouchend = null
        }
        var f = this,
        b = s,
        C = {
            obj: e(".viewport", s)
        },
        k = {
            obj: e(".overview", s)
        },
        A = {
            obj: e(".scrollbar", s)
        },
        T = {
            obj: e(".track", A.obj)
        },
        v = {
            obj: e(".thumb", A.obj)
        },
        y = "x" === t.axis,
        H = y ? "left": "top",
        w = y ? "Width": "Height",
        x = 0,
        I = {
            start: 0,
            now: 0
        },
        S = {},
        _ = !1;
        return this.update = function(e) {
            try {
                C[t.axis] = C.obj[0]["offset" + w],
                k[t.axis] = k.obj[0]["scroll" + w],
                k.ratio = C[t.axis] / k[t.axis],
                A.obj.toggleClass("disable", k.ratio >= 1),
                T[t.axis] = "auto" === t.size ? C[t.axis] : t.size,
                v[t.axis] = Math.min(T[t.axis], Math.max(0, "auto" === t.sizethumb ? T[t.axis] * k.ratio: t.sizethumb)),
                A.ratio = "auto" === t.sizethumb ? k[t.axis] / T[t.axis] : (k[t.axis] - C[t.axis]) / (T[t.axis] - v[t.axis]),
                x = "relative" === e && k.ratio <= 1 ? Math.min(k[t.axis] - C[t.axis], Math.max(0, x)) : 0,
                x = "bottom" === e && k.ratio <= 1 ? k[t.axis] - C[t.axis] : isNaN(parseInt(e, 10)) ? x: parseInt(e, 10),
                r()
            } catch(e) {}
        },
        function() {
            return f.update(),
            c(),
            f
        } ()
    }
    var t, a = !1,
    n = !0,
    i = 1,
    l = 20,
    o = 1;
    return e.tiny = e.tiny || {},
    e.tiny.scrollbar = {
        options: {
            axis: "y",
            wheel: 40,
            scroll: !0,
            lockscroll: !0,
            size: "auto",
            sizethumb: "auto",
            invertscroll: !1
        }
    },
    e.fn.tinyscrollbar = function(n) {
        var i = e.extend({},
        e.tiny.scrollbar.options, n);
        return this.each(function() {
            e(this).data("tsb", new s(e(this), i))
        }),
        a && (t = this),
        this
    },
    e.fn.tinyscrollbar_update = function(s) {
        if (a) return e(t).data("tsb").update(s)
    },
    {
        handle_scroll: function(s, t) {
            0 == s ? "#scroll_record" == t && (a = !0, e(t).tinyscrollbar(), a = !1) : 1 == s ? (n = !0, "#scroll_record" == t && (a = !0, e(t).tinyscrollbar_update(), a = !1)) : 2 == s && (n = !1, "#scroll_record" == t && (a = !0, e(t).tinyscrollbar_update(), a = !1))
        }
    }
} (jQuery);