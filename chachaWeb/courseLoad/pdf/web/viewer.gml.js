function getTimeNow() {
    var e = new Date,
    t = e.toLocaleTimeString() + " " + e.getMilliseconds() + "ms";
    return t
}
function getViewerConfiguration() {
    return {
        appContainer: document.body,
        mainContainer: document.getElementById("viewerContainer"),
        viewerContainer: document.getElementById("viewer"),
        toolbar: {
            numPages: document.getElementById("numPages"),
            pageNumber: document.getElementById("pageNumber"),
            scaleSelectContainer: document.getElementById("scaleSelectContainer"),
            scaleSelect: document.getElementById("scaleSelect"),
            customScaleOption: document.getElementById("customScaleOption"),
            previous: document.getElementById("previous"),
            next: document.getElementById("next"),
            firstPage: document.getElementById("firstPage"),
            lastPage: document.getElementById("lastPage"),
            zoomIn: document.getElementById("zoomIn"),
            zoomOut: document.getElementById("zoomOut"),
            viewFind: document.getElementById("viewFind"),
            openFile: document.getElementById("openFile"),
            print: document.getElementById("print"),
            presentationModeButton: document.getElementById("presentationMode"),
            download: document.getElementById("download"),
            viewBookmark: document.getElementById("viewBookmark")
        },
        secondaryToolbar: {
            toolbar: document.getElementById("secondaryToolbar"),
            toggleButton: document.getElementById("secondaryToolbarToggle"),
            presentationModeButton: document.getElementById("secondaryPresentationMode"),
            openFile: document.getElementById("secondaryOpenFile"),
            print: document.getElementById("secondaryPrint"),
            download: document.getElementById("secondaryDownload"),
            viewBookmark: document.getElementById("secondaryViewBookmark"),
            firstPage: document.getElementById("firstPage"),
            lastPage: document.getElementById("lastPage"),
            pageRotateCw: document.getElementById("pageRotateCw"),
            pageRotateCcw: document.getElementById("pageRotateCcw"),
            documentPropertiesButton: document.getElementById("documentProperties"),
            toggleHandTool: document.getElementById("toggleHandTool")
        },
        fullscreen: {
            contextFirstPage: document.getElementById("contextFirstPage"),
            contextLastPage: document.getElementById("contextLastPage"),
            contextPageRotateCw: document.getElementById("contextPageRotateCw"),
            contextPageRotateCcw: document.getElementById("contextPageRotateCcw")
        },
        sidebar: {
            mainContainer: document.getElementById("mainContainer"),
            outerContainer: document.getElementById("outerContainer"),
            toggleButton: document.getElementById("sidebarToggle"),
            thumbnailButton: document.getElementById("viewThumbnail"),
            outlineButton: document.getElementById("viewOutline"),
            attachmentsButton: document.getElementById("viewAttachments"),
            thumbnailView: document.getElementById("thumbnailView"),
            outlineView: document.getElementById("outlineView"),
            attachmentsView: document.getElementById("attachmentsView")
        },
        findBar: {
            bar: document.getElementById("findbar"),
            toggleButton: document.getElementById("viewFind"),
            findField: document.getElementById("findInput"),
            highlightAllCheckbox: document.getElementById("findHighlightAll"),
            caseSensitiveCheckbox: document.getElementById("findMatchCase"),
            findMsg: document.getElementById("findMsg"),
            findResultsCount: document.getElementById("findResultsCount"),
            findStatusIcon: document.getElementById("findStatusIcon"),
            findPreviousButton: document.getElementById("findPrevious"),
            findNextButton: document.getElementById("findNext")
        },
        passwordOverlay: {
            overlayName: "passwordOverlay",
            container: document.getElementById("passwordOverlay"),
            label: document.getElementById("passwordText"),
            input: document.getElementById("password"),
            submitButton: document.getElementById("passwordSubmit"),
            cancelButton: document.getElementById("passwordCancel")
        },
        documentProperties: {
            overlayName: "documentPropertiesOverlay",
            container: document.getElementById("documentPropertiesOverlay"),
            closeButton: document.getElementById("documentPropertiesClose"),
            fields: {
                fileName: document.getElementById("fileNameField"),
                fileSize: document.getElementById("fileSizeField"),
                title: document.getElementById("titleField"),
                author: document.getElementById("authorField"),
                subject: document.getElementById("subjectField"),
                keywords: document.getElementById("keywordsField"),
                creationDate: document.getElementById("creationDateField"),
                modificationDate: document.getElementById("modificationDateField"),
                creator: document.getElementById("creatorField"),
                producer: document.getElementById("producerField"),
                version: document.getElementById("versionField"),
                pageCount: document.getElementById("pageCountField")
            }
        },
        errorWrapper: {
            container: document.getElementById("errorWrapper"),
            errorMessage: document.getElementById("errorMessage"),
            closeButton: document.getElementById("errorClose"),
            errorMoreInfo: document.getElementById("errorMoreInfo"),
            moreInfoButton: document.getElementById("errorShowMore"),
            lessInfoButton: document.getElementById("errorShowLess")
        },
        printContainer: document.getElementById("printContainer"),
        openFileInputName: "fileInput"
    }
}
function webViewerLoad() {
    var e = getViewerConfiguration();
    window.PDFViewerApplication = pdfjsWebLibs.pdfjsWebApp.PDFViewerApplication,
    pdfjsWebLibs.pdfjsWebApp.PDFViewerApplication.run(e)
}
var Parent_get = window.parent.window.iFrameParIO,
DEFAULT_URL = Parent_get.getUrlO().pdf,
cur_page_num = 1,
cur_page_sign = !0,
outMemoryMsg = !0,
pdfjsWebLibs = {
    pdfjsWebPDFJS: window.pdfjsDistBuildPdf
},
handleChlIO = function() {
    var e = function(e) {
        PDFViewerApplication.page = e,
        cur_page_num = e
    },
    t = function() {
        try {
            if (console.log("[" + getTimeNow() + "]----------->resize event"), PDFViewerApplication.initialized) {
                var e = PDFViewerApplication.pdfViewer.currentScaleValue;
                "auto" === e || "page-fit" === e || "page-width" === e ? PDFViewerApplication.pdfViewer.currentScaleValue = e: e || (PDFViewerApplication.pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE),
                PDFViewerApplication.pdfViewer.update()
            }
        } catch(e) {}
    },
    i = function(e) {
        0 !== PDFViewerApplication.pagesCount ? Parent_get.initI(PDFViewerApplication.page, PDFViewerApplication.pagesCount) : setTimeout(function() {
            e < 5 && (i(++e), console.log("[" + getTimeNow() + "]----------->CountPage is undefined ,try " + e + "s times"))
        },
        100 * e)
    },
    n = function(e, t) {
        e = parseInt(e.replace("px", "")),
        t = parseInt(t.replace("px", ""));
        var i = parseInt(document.getElementById("mainContainer").clientHeight),
        n = (i - t) / 2;
        n = n >= 0 ? n: 0,
        Parent_get.dataDrawI(e, t, 0, n),
        document.getElementById("viewerContainer").style.height = t + "px",
        document.getElementById("viewerContainer").style.top = n + "px"
    },
    s = function(e) {
        Parent_get.removeScrollI(e)
    };
    return {
        init: function(e) {
            i(e)
        },
        resize: function() {
            t()
        },
        draw: function(e, t) {
            n(e, t)
        },
        setPage: function(t) {
            e(t)
        },
        removescroll: function(e) {
            s(e)
        },
        loadError: function(e) {
            if ("memoryOut" === e) {
                if (!outMemoryMsg) return;
                outMemoryMsg = !1
            }
            Parent_get.loadMes(e)
        }
    }
} (); (function() { !
    function(e, t) {
        t(e.pdfjsWebGrabToPan = {})
    } (this,
    function(e) {
        function t(e) {
            this.element = e.element,
            this.document = e.element.ownerDocument,
            "function" == typeof e.ignoreTarget && (this.ignoreTarget = e.ignoreTarget),
            this.onActiveChanged = e.onActiveChanged,
            this.activate = this.activate.bind(this),
            this.deactivate = this.deactivate.bind(this),
            this.toggle = this.toggle.bind(this),
            this._onmousedown = this._onmousedown.bind(this),
            this._onmousemove = this._onmousemove.bind(this),
            this._endPan = this._endPan.bind(this);
            var t = this.overlay = document.createElement("div");
            t.className = "grab-to-pan-grabbing"
        }
        function i(e) {
            return "buttons" in e && s ? !(1 | e.buttons) : o || a ? 0 === e.which: void 0
        }
        t.prototype = {
            CSS_CLASS_GRAB: "grab-to-pan-grab",
            activate: function() {
                this.active || (this.active = !0, this.element.addEventListener("mousedown", this._onmousedown, !0), this.element.classList.add(this.CSS_CLASS_GRAB), this.onActiveChanged && this.onActiveChanged(!0))
            },
            deactivate: function() {
                this.active && (this.active = !1, this.element.removeEventListener("mousedown", this._onmousedown, !0), this._endPan(), this.element.classList.remove(this.CSS_CLASS_GRAB), this.onActiveChanged && this.onActiveChanged(!1))
            },
            toggle: function() {
                this.active ? this.deactivate() : this.activate()
            },
            ignoreTarget: function(e) {
                return e[n]("a[href], a[href] *, input, textarea, button, button *, select, option")
            },
            _onmousedown: function(e) {
                if (0 === e.button && !this.ignoreTarget(e.target)) {
                    if (e.originalTarget) try {
                        e.originalTarget.tagName
                    } catch(e) {
                        return
                    }
                    this.scrollLeftStart = this.element.scrollLeft,
                    this.scrollTopStart = this.element.scrollTop,
                    this.clientXStart = e.clientX,
                    this.clientYStart = e.clientY,
                    this.document.addEventListener("mousemove", this._onmousemove, !0),
                    this.document.addEventListener("mouseup", this._endPan, !0),
                    this.element.addEventListener("scroll", this._endPan, !0),
                    e.preventDefault(),
                    e.stopPropagation(),
                    this.document.documentElement.classList.add(this.CSS_CLASS_GRABBING);
                    var t = document.activeElement;
                    t && !t.contains(e.target) && t.blur()
                }
            },
            _onmousemove: function(e) {
                if (this.element.removeEventListener("scroll", this._endPan, !0), i(e)) return void this._endPan();
                var t = e.clientX - this.clientXStart,
                n = e.clientY - this.clientYStart;
                this.element.scrollTop = this.scrollTopStart - n,
                this.element.scrollLeft = this.scrollLeftStart - t,
                this.overlay.parentNode || document.body.appendChild(this.overlay)
            },
            _endPan: function() {
                this.element.removeEventListener("scroll", this._endPan, !0),
                this.document.removeEventListener("mousemove", this._onmousemove, !0),
                this.document.removeEventListener("mouseup", this._endPan, !0),
                this.overlay.parentNode && this.overlay.parentNode.removeChild(this.overlay)
            }
        };
        var n; ["webkitM", "mozM", "msM", "oM", "m"].some(function(e) {
            var t = e + "atches";
            return t in document.documentElement && (n = t),
            t += "Selector",
            t in document.documentElement && (n = t),
            n
        });
        var s = !document.documentMode || document.documentMode > 9,
        r = window.chrome,
        o = r && (r.webstore || r.app),
        a = /Apple/.test(navigator.vendor) && /Version\/([6-9]\d*|[1-5]\d+)/.test(navigator.userAgent);
        e.GrabToPan = t
    }),
    function(e, t) {
        t(e.pdfjsWebMozPrintCallbackPolyfill = {})
    } (this,
    function(e) {
        function t(e) {
            var t = document.createEvent("CustomEvent");
            t.initCustomEvent(e, !1, !1, "custom"),
            window.dispatchEvent(t)
        }
        function i() {
            if (r) if (s(), ++o < r.length) {
                var e = r[o];
                "function" == typeof e.mozPrintCallback ? e.mozPrintCallback({
                    context: e.getContext("2d"),
                    abort: n,
                    done: i
                }) : i()
            } else s(),
            a.call(window),
            setTimeout(n, 20)
        }
        function n() {
            r && (r = null, s(), t("afterprint"))
        }
        function s() {
            var e = document.getElementById("mozPrintCallback-shim");
            if (r && r.length) {
                var t = Math.round(100 * o / r.length),
                i = e.querySelector("progress"),
                s = e.querySelector(".relative-progress");
                i.value = t,
                s.textContent = t + "%",
                e.removeAttribute("hidden"),
                e.onclick = n
            } else e.setAttribute("hidden", "")
        }
        if (! ("mozPrintCallback" in document.createElement("canvas"))) {
            HTMLCanvasElement.prototype.mozPrintCallback = void 0;
            var r, o, a = window.print;
            window.print = function() {
                if (r) return void console.warn("Ignored window.print() because of a pending print job.");
                try {
                    t("beforeprint")
                } finally {
                    r = document.querySelectorAll("canvas"),
                    o = -1,
                    i()
                }
            };
            var d = !!document.attachEvent;
            if (window.addEventListener("keydown",
            function(e) {},
            !0), d && document.attachEvent("onkeydown",
            function(e) {}), "onbeforeprint" in window);
        }
    }),
    function(e, t) {
        t(e.pdfjsWebOverlayManager = {})
    } (this,
    function(e) {
        var t = {
            overlays: {},
            active: null,
            register: function(e, t, i, n) {
                return new Promise(function(s) {
                    var r;
                    if (! (e && t && (r = t.parentNode))) throw new Error("Not enough parameters.");
                    if (this.overlays[e]) throw new Error("The overlay is already registered.");
                    this.overlays[e] = {
                        element: t,
                        container: r,
                        callerCloseMethod: i || null,
                        canForceClose: n || !1
                    },
                    s()
                }.bind(this))
            },
            unregister: function(e) {
                return new Promise(function(t) {
                    if (!this.overlays[e]) throw new Error("The overlay does not exist.");
                    if (this.active === e) throw new Error("The overlay cannot be removed while it is active.");
                    delete this.overlays[e],
                    t()
                }.bind(this))
            },
            open: function(e) {
                return new Promise(function(t) {
                    if (!this.overlays[e]) throw new Error("The overlay does not exist.");
                    if (this.active) {
                        if (!this.overlays[e].canForceClose) throw this.active === e ? new Error("The overlay is already active.") : new Error("Another overlay is currently active.");
                        this._closeThroughCaller()
                    }
                    this.active = e,
                    this.overlays[this.active].element.classList.remove("hidden"),
                    this.overlays[this.active].container.classList.remove("hidden"),
                    window.addEventListener("keydown", this._keyDown),
                    t()
                }.bind(this))
            },
            close: function(e) {
                return new Promise(function(t) {
                    if (!this.overlays[e]) throw new Error("The overlay does not exist.");
                    if (!this.active) throw new Error("The overlay is currently not active.");
                    if (this.active !== e) throw new Error("Another overlay is currently active.");
                    this.overlays[this.active].container.classList.add("hidden"),
                    this.overlays[this.active].element.classList.add("hidden"),
                    this.active = null,
                    window.removeEventListener("keydown", this._keyDown),
                    t()
                }.bind(this))
            },
            _keyDown: function(e) {},
            _closeThroughCaller: function() {
                this.overlays[this.active].callerCloseMethod && this.overlays[this.active].callerCloseMethod(),
                this.active && this.close(this.active)
            }
        };
        e.OverlayManager = t
    }),
    function(e, t) {
        t(e.pdfjsWebPDFHistory = {})
    } (this,
    function(e) {
        function t(e) {
            this.linkService = e.linkService,
            this.initialized = !1,
            this.initialDestination = null,
            this.initialBookmark = null
        }
        t.prototype = {
            initialize: function(e) {
                function t() {
                    r.previousHash = window.location.hash.slice(1),
                    r._pushToHistory({
                        hash: r.previousHash
                    },
                    !1, !0),
                    r._updatePreviousBookmark()
                }
                function i(e, t) {
                    function i() {
                        window.removeEventListener("popstate", i),
                        window.addEventListener("popstate", n),
                        r._pushToHistory(e, !1, !0),
                        history.forward()
                    }
                    function n() {
                        window.removeEventListener("popstate", n),
                        r.allowHashChange = !0,
                        r.historyUnlocked = !0,
                        t()
                    }
                    r.historyUnlocked = !1,
                    r.allowHashChange = !1,
                    window.addEventListener("popstate", i),
                    history.back()
                }
                function n() {
                    var e = r._getPreviousParams(null, !0);
                    if (e) {
                        var t = !r.current.dest && r.current.hash !== r.previousHash;
                        r._pushToHistory(e, !1, t),
                        r._updatePreviousBookmark()
                    }
                    window.removeEventListener("beforeunload", n, !1)
                }
                this.initialized = !0,
                this.reInitialized = !1,
                this.allowHashChange = !0,
                this.historyUnlocked = !0,
                this.isViewerInPresentationMode = !1,
                this.previousHash = window.location.hash.substring(1),
                this.currentBookmark = "",
                this.currentPage = 0,
                this.updatePreviousBookmark = !1,
                this.previousBookmark = "",
                this.previousPage = 0,
                this.nextHashParam = "",
                this.fingerprint = e,
                this.currentUid = this.uid = 0,
                this.current = {};
                var s = window.history.state;
                this._isStateObjectDefined(s) ? (s.target.dest ? this.initialDestination = s.target.dest: this.initialBookmark = s.target.hash, this.currentUid = s.uid, this.uid = s.uid + 1, this.current = s.target) : (s && s.fingerprint && this.fingerprint !== s.fingerprint && (this.reInitialized = !0), this._pushOrReplaceState({
                    fingerprint: this.fingerprint
                },
                !0));
                var r = this;
                window.addEventListener("popstate",
                function(e) {
                    if (r.historyUnlocked) {
                        if (e.state) return void r._goTo(e.state);
                        if (0 === r.uid) {
                            var n = r.previousHash && r.currentBookmark && r.previousHash !== r.currentBookmark ? {
                                hash: r.currentBookmark,
                                page: r.currentPage
                            }: {
                                page: 1
                            };
                            i(n,
                            function() {
                                t()
                            })
                        } else t()
                    }
                },
                !1),
                window.addEventListener("beforeunload", n, !1),
                window.addEventListener("pageshow",
                function(e) {
                    window.addEventListener("beforeunload", n, !1)
                },
                !1),
                window.addEventListener("presentationmodechanged",
                function(e) {
                    r.isViewerInPresentationMode = !!e.detail.active
                })
            },
            clearHistoryState: function() {
                this._pushOrReplaceState(null, !0)
            },
            _isStateObjectDefined: function(e) {
                return !! (e && e.uid >= 0 && e.fingerprint && this.fingerprint === e.fingerprint && e.target && e.target.hash)
            },
            _pushOrReplaceState: function(e, t) {
                t ? window.history.replaceState(e, "", document.URL) : window.history.pushState(e, "", document.URL)
            },
            get isHashChangeUnlocked() {
                return ! this.initialized || this.allowHashChange
            },
            _updatePreviousBookmark: function() {
                this.updatePreviousBookmark && this.currentBookmark && this.currentPage && (this.previousBookmark = this.currentBookmark, this.previousPage = this.currentPage, this.updatePreviousBookmark = !1)
            },
            updateCurrentBookmark: function(e, t) {
                this.initialized && (this.currentBookmark = e.substring(1), this.currentPage = 0 | t, this._updatePreviousBookmark())
            },
            updateNextHashParam: function(e) {
                this.initialized && (this.nextHashParam = e)
            },
            push: function(e, t) {
                if (this.initialized && this.historyUnlocked) {
                    if (e.dest && !e.hash && (e.hash = this.current.hash && this.current.dest && this.current.dest === e.dest ? this.current.hash: this.linkService.getDestinationHash(e.dest).split("#")[1]), e.page && (e.page |= 0), t) {
                        var i = window.history.state.target;
                        return i || (this._pushToHistory(e, !1), this.previousHash = window.location.hash.substring(1)),
                        this.updatePreviousBookmark = !this.nextHashParam,
                        void(i && this._updatePreviousBookmark())
                    }
                    if (this.nextHashParam) {
                        if (this.nextHashParam === e.hash) return this.nextHashParam = null,
                        void(this.updatePreviousBookmark = !0);
                        this.nextHashParam = null
                    }
                    e.hash ? this.current.hash ? this.current.hash !== e.hash ? this._pushToHistory(e, !0) : (!this.current.page && e.page && this._pushToHistory(e, !1, !0), this.updatePreviousBookmark = !0) : this._pushToHistory(e, !0) : this.current.page && e.page && this.current.page !== e.page && this._pushToHistory(e, !0)
                }
            },
            _getPreviousParams: function(e, t) {
                if (!this.currentBookmark || !this.currentPage) return null;
                if (this.updatePreviousBookmark && (this.updatePreviousBookmark = !1), this.uid > 0 && (!this.previousBookmark || !this.previousPage)) return null;
                if (!this.current.dest && !e || t) {
                    if (this.previousBookmark === this.currentBookmark) return null
                } else {
                    if (!this.current.page && !e) return null;
                    if (this.previousPage === this.currentPage) return null
                }
                var i = {
                    hash: this.currentBookmark,
                    page: this.currentPage
                };
                return this.isViewerInPresentationMode && (i.hash = null),
                i
            },
            _stateObj: function(e) {
                return {
                    fingerprint: this.fingerprint,
                    uid: this.uid,
                    target: e
                }
            },
            _pushToHistory: function(e, t, i) {
                if (this.initialized) {
                    if (!e.hash && e.page && (e.hash = "page=" + e.page), t && !i) {
                        var n = this._getPreviousParams();
                        if (n) {
                            var s = !this.current.dest && this.current.hash !== this.previousHash;
                            this._pushToHistory(n, !1, s)
                        }
                    }
                    this._pushOrReplaceState(this._stateObj(e), i || 0 === this.uid),
                    this.currentUid = this.uid++,
                    this.current = e,
                    this.updatePreviousBookmark = !0
                }
            },
            _goTo: function(e) {
                if (this.initialized && this.historyUnlocked && this._isStateObjectDefined(e)) {
                    if (!this.reInitialized && e.uid < this.currentUid) {
                        var t = this._getPreviousParams(!0);
                        if (t) return this._pushToHistory(this.current, !1),
                        this._pushToHistory(t, !1),
                        this.currentUid = e.uid,
                        void window.history.back()
                    }
                    this.historyUnlocked = !1,
                    e.target.dest ? this.linkService.navigateTo(e.target.dest) : this.linkService.setHash(e.target.hash),
                    this.currentUid = e.uid,
                    e.uid > this.uid && (this.uid = e.uid),
                    this.current = e.target,
                    this.updatePreviousBookmark = !0;
                    var i = window.location.hash.substring(1);
                    this.previousHash !== i && (this.allowHashChange = !1),
                    this.previousHash = i,
                    this.historyUnlocked = !0
                }
            },
            back: function() {
                this.go( - 1)
            },
            forward: function() {
                this.go(1)
            },
            go: function(e) {
                if (this.initialized && this.historyUnlocked) {
                    var t = window.history.state;
                    e === -1 && t && t.uid > 0 ? window.history.back() : 1 === e && t && t.uid < this.uid - 1 && window.history.forward()
                }
            }
        },
        e.PDFHistory = t
    }),
    function(e, t) {
        t(e.pdfjsWebPDFPresentationMode = {})
    } (this,
    function(e) {
        var t = 1500,
        i = 3e3,
        n = "pdfPresentationMode",
        s = "pdfPresentationModeControls",
        r = function() {
            function e(e) {
                this.container = e.container,
                this.viewer = e.viewer || e.container.firstElementChild,
                this.pdfViewer = e.pdfViewer;
                var t = e.contextMenuItems || null;
                if (this.active = !1, this.args = null, this.contextMenuOpen = !1, this.mouseScrollTimeStamp = 0, this.mouseScrollDelta = 0, t) for (var i = 0,
                n = t.length; i < n; i++) {
                    var s = t[i];
                    s.element.addEventListener("click",
                    function(e) {
                        this.contextMenuOpen = !1,
                        e()
                    }.bind(this, s.handler))
                }
            }
            return e.prototype = {
                request: function() {
                    if (this.switchInProgress || this.active || !this.viewer.hasChildNodes()) return ! 1;
                    if (this._addFullscreenChangeListeners(), this._setSwitchInProgress(), this._notifyStateChange(), this.container.requestFullscreen) this.container.requestFullscreen();
                    else if (this.container.mozRequestFullScreen) this.container.mozRequestFullScreen();
                    else if (this.container.webkitRequestFullscreen) this.container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    else {
                        if (!this.container.msRequestFullscreen) return ! 1;
                        this.container.msRequestFullscreen()
                    }
                    return this.args = {
                        page: this.pdfViewer.currentPageNumber,
                        previousScale: this.pdfViewer.currentScaleValue
                    },
                    !0
                },
                mouseScroll: function(e) {
                    if (this.active) {
                        var t = 50,
                        i = 120,
                        n = {
                            UP: -1,
                            DOWN: 1
                        },
                        s = (new Date).getTime(),
                        r = this.mouseScrollTimeStamp;
                        if (! (s > r && s - r < t) && ((this.mouseScrollDelta > 0 && e < 0 || this.mouseScrollDelta < 0 && e > 0) && this._resetMouseScrollState(), this.mouseScrollDelta += e, Math.abs(this.mouseScrollDelta) >= i)) {
                            var o = this.mouseScrollDelta > 0 ? n.UP: n.DOWN,
                            a = this.pdfViewer.currentPageNumber;
                            if (this._resetMouseScrollState(), 1 === a && o === n.UP || a === this.pdfViewer.pagesCount && o === n.DOWN) return;
                            this.pdfViewer.currentPageNumber = a + o,
                            this.mouseScrollTimeStamp = s
                        }
                    }
                },
                get isFullscreen() {
                    return !! (document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement)
                },
                _notifyStateChange: function() {
                    var e = document.createEvent("CustomEvent");
                    e.initCustomEvent("presentationmodechanged", !0, !0, {
                        active: this.active,
                        switchInProgress: !!this.switchInProgress
                    }),
                    window.dispatchEvent(e)
                },
                _setSwitchInProgress: function() {
                    this.switchInProgress && clearTimeout(this.switchInProgress),
                    this.switchInProgress = setTimeout(function() {
                        this._removeFullscreenChangeListeners(),
                        delete this.switchInProgress,
                        this._notifyStateChange()
                    }.bind(this), t)
                },
                _resetSwitchInProgress: function() {
                    this.switchInProgress && (clearTimeout(this.switchInProgress), delete this.switchInProgress)
                },
                _enter: function() {
                    this.active = !0,
                    this._resetSwitchInProgress(),
                    this._notifyStateChange(),
                    this.container.classList.add(n),
                    setTimeout(function() {
                        this.pdfViewer.currentPageNumber = this.args.page,
                        this.pdfViewer.currentScaleValue = "page-fit"
                    }.bind(this), 0),
                    this._addWindowListeners(),
                    this._showControls(),
                    this.contextMenuOpen = !1,
                    this.container.setAttribute("contextmenu", "viewerContextMenu"),
                    window.getSelection().removeAllRanges()
                },
                _exit: function() {
                    var e = this.pdfViewer.currentPageNumber;
                    this.container.classList.remove(n),
                    setTimeout(function() {
                        this.active = !1,
                        this._removeFullscreenChangeListeners(),
                        this._notifyStateChange(),
                        this.pdfViewer.currentScaleValue = this.args.previousScale,
                        this.pdfViewer.currentPageNumber = e,
                        this.args = null
                    }.bind(this), 0),
                    this._removeWindowListeners(),
                    this._hideControls(),
                    this._resetMouseScrollState(),
                    this.container.removeAttribute("contextmenu"),
                    this.contextMenuOpen = !1
                },
                _mouseDown: function(e) {
                    if (this.contextMenuOpen) return this.contextMenuOpen = !1,
                    void e.preventDefault();
                    if (0 === e.button) {
                        var t = e.target.href && e.target.classList.contains("internalLink");
                        t || (e.preventDefault(), this.pdfViewer.currentPageNumber += e.shiftKey ? -1 : 1)
                    }
                },
                _contextMenu: function() {
                    this.contextMenuOpen = !0
                },
                _showControls: function() {
                    this.controlsTimeout ? clearTimeout(this.controlsTimeout) : this.container.classList.add(s),
                    this.controlsTimeout = setTimeout(function() {
                        this.container.classList.remove(s),
                        delete this.controlsTimeout
                    }.bind(this), i)
                },
                _hideControls: function() {
                    this.controlsTimeout && (clearTimeout(this.controlsTimeout), this.container.classList.remove(s), delete this.controlsTimeout)
                },
                _resetMouseScrollState: function() {
                    this.mouseScrollTimeStamp = 0,
                    this.mouseScrollDelta = 0
                },
                _addWindowListeners: function() {
                    this.showControlsBind = this._showControls.bind(this),
                    this.mouseDownBind = this._mouseDown.bind(this),
                    this.resetMouseScrollStateBind = this._resetMouseScrollState.bind(this),
                    this.contextMenuBind = this._contextMenu.bind(this),
                    window.addEventListener("mousemove", this.showControlsBind),
                    window.addEventListener("mousedown", this.mouseDownBind),
                    window.addEventListener("keydown", this.resetMouseScrollStateBind),
                    window.addEventListener("contextmenu", this.contextMenuBind)
                },
                _removeWindowListeners: function() {
                    window.removeEventListener("mousemove", this.showControlsBind),
                    window.removeEventListener("mousedown", this.mouseDownBind),
                    window.removeEventListener("keydown", this.resetMouseScrollStateBind),
                    window.removeEventListener("contextmenu", this.contextMenuBind),
                    delete this.showControlsBind,
                    delete this.mouseDownBind,
                    delete this.resetMouseScrollStateBind,
                    delete this.contextMenuBind
                },
                _fullscreenChange: function() {
                    this.isFullscreen ? this._enter() : this._exit()
                },
                _addFullscreenChangeListeners: function() {
                    this.fullscreenChangeBind = this._fullscreenChange.bind(this),
                    window.addEventListener("fullscreenchange", this.fullscreenChangeBind),
                    window.addEventListener("mozfullscreenchange", this.fullscreenChangeBind),
                    window.addEventListener("webkitfullscreenchange", this.fullscreenChangeBind),
                    window.addEventListener("MSFullscreenChange", this.fullscreenChangeBind)
                },
                _removeFullscreenChangeListeners: function() {
                    window.removeEventListener("fullscreenchange", this.fullscreenChangeBind),
                    window.removeEventListener("mozfullscreenchange", this.fullscreenChangeBind),
                    window.removeEventListener("webkitfullscreenchange", this.fullscreenChangeBind),
                    window.removeEventListener("MSFullscreenChange", this.fullscreenChangeBind),
                    delete this.fullscreenChangeBind
                }
            },
            e
        } ();
        e.PDFPresentationMode = r
    }),
    function(e, t) {
        t(e.pdfjsWebPDFRenderingQueue = {})
    } (this,
    function(e) {
        var t = 3e4,
        i = {
            INITIAL: 0,
            RUNNING: 1,
            PAUSED: 2,
            FINISHED: 3
        },
        n = function() {
            function e() {
                this.pdfViewer = null,
                this.pdfThumbnailViewer = null,
                this.onIdle = null,
                this.highestPriorityPage = null,
                this.idleTimeout = null,
                this.printing = !1,
                this.isThumbnailViewEnabled = !1
            }
            return e.prototype = {
                setViewer: function(e) {
                    this.pdfViewer = e
                },
                setThumbnailViewer: function(e) {
                    this.pdfThumbnailViewer = e
                },
                isHighestPriority: function(e) {
                    return this.highestPriorityPage === e.renderingId
                },
                renderHighestPriority: function(e) {
                    this.idleTimeout && (clearTimeout(this.idleTimeout), this.idleTimeout = null),
                    this.pdfViewer.forceRendering(e) || this.pdfThumbnailViewer && this.isThumbnailViewEnabled && this.pdfThumbnailViewer.forceRendering() || this.printing || this.onIdle && (this.idleTimeout = setTimeout(this.onIdle.bind(this), t))
                },
                getHighestPriority: function(e, t, i) {
                    var n = e.views,
                    s = n.length;
                    if (0 === s) return ! 1;
                    for (var r = 0; r < s; ++r) {
                        var o = n[r].view;
                        if (!this.isViewFinished(o)) return o
                    }
                    if (i) {
                        var a = e.last.id;
                        if (t[a] && !this.isViewFinished(t[a])) return t[a]
                    } else {
                        var d = e.first.id - 2;
                        if (t[d] && !this.isViewFinished(t[d])) return t[d]
                    }
                    return null
                },
                isViewFinished: function(e) {
                    return e.renderingState === i.FINISHED
                },
                renderView: function(e) {
                    var t = e.renderingState;
                    switch (t) {
                    case i.FINISHED:
                        return ! 1;
                    case i.PAUSED:
                        this.highestPriorityPage = e.renderingId,
                        e.resume();
                        break;
                    case i.RUNNING:
                        this.highestPriorityPage = e.renderingId;
                        break;
                    case i.INITIAL:
                        this.highestPriorityPage = e.renderingId;
                        var n = function() {
                            this.renderHighestPriority()
                        }.bind(this);
                        e.draw().then(n, n)
                    }
                    return ! 0
                }
            },
            e
        } ();
        e.RenderingStates = i,
        e.PDFRenderingQueue = n
    }),
    function(e, t) {
        t(e.pdfjsWebPreferences = {})
    } (this,
    function(e) {
        var t = {
            showPreviousViewOnLoad: !0,
            defaultZoomValue: "",
            sidebarViewOnLoad: 0,
            enableHandToolOnLoad: !1,
            enableWebGL: !1,
            pdfBugEnabled: !1,
            disableRange: !1,
            disableStream: !1,
            disableAutoFetch: !1,
            disableFontFace: !1,
            disableTextLayer: !1,
            useOnlyCssZoom: !1,
            externalLinkTarget: 0
        },
        i = {
            prefs: Object.create(t),
            isInitializedPromiseResolved: !1,
            initializedPromise: null,
            initialize: function() {
                return this.initializedPromise = this._readFromStorage(t).then(function(e) {
                    this.isInitializedPromiseResolved = !0,
                    e && (this.prefs = e)
                }.bind(this))
            },
            _writeToStorage: function(e) {
                return Promise.resolve()
            },
            _readFromStorage: function(e) {
                return Promise.resolve()
            },
            reset: function() {
                return this.initializedPromise.then(function() {
                    return this.prefs = Object.create(t),
                    this._writeToStorage(t)
                }.bind(this))
            },
            reload: function() {
                return this.initializedPromise.then(function() {
                    this._readFromStorage(t).then(function(e) {
                        e && (this.prefs = e)
                    }.bind(this))
                }.bind(this))
            },
            set: function(e, i) {
                return this.initializedPromise.then(function() {
                    if (void 0 === t[e]) throw new Error("preferencesSet: '" + e + "' is undefined.");
                    if (void 0 === i) throw new Error("preferencesSet: no value is specified.");
                    var n = typeof i,
                    s = typeof t[e];
                    if (n !== s) {
                        if ("number" !== n || "string" !== s) throw new Error("Preferences_set: '" + i + "' is a \"" + n + '", expected "' + s + '".');
                        i = i.toString()
                    } else if ("number" === n && (0 | i) !== i) throw new Error("Preferences_set: '" + i + '\' must be an "integer".');
                    return this.prefs[e] = i,
                    this._writeToStorage(this.prefs)
                }.bind(this))
            },
            get: function(e) {
                return this.initializedPromise.then(function() {
                    var i = t[e];
                    if (void 0 === i) throw new Error("preferencesGet: '" + e + "' is undefined.");
                    var n = this.prefs[e];
                    return void 0 !== n ? n: i
                }.bind(this))
            }
        };
        i._writeToStorage = function(e) {
            return new Promise(function(t) {
                localStorage.setItem("pdfjs.preferences", JSON.stringify(e)),
                t()
            })
        },
        i._readFromStorage = function(e) {
            return new Promise(function(e) {
                var t = JSON.parse(localStorage.getItem("pdfjs.preferences"));
                e(t)
            })
        },
        e.Preferences = i
    }),
    function(e, t) {
        t(e.pdfjsWebViewHistory = {})
    } (this,
    function(e) {
        var t = 20,
        i = function() {
            function e(e, i) {
                this.fingerprint = e,
                this.cacheSize = i || t,
                this.isInitializedPromiseResolved = !1,
                this.initializedPromise = this._readFromStorage().then(function(e) {
                    this.isInitializedPromiseResolved = !0;
                    var t = JSON.parse(e || "{}");
                    "files" in t || (t.files = []),
                    t.files.length >= this.cacheSize && t.files.shift();
                    for (var i, n = 0,
                    s = t.files.length; n < s; n++) {
                        var r = t.files[n];
                        if (r.fingerprint === this.fingerprint) {
                            i = n;
                            break
                        }
                    }
                    "number" != typeof i && (i = t.files.push({
                        fingerprint: this.fingerprint
                    }) - 1),
                    this.file = t.files[i],
                    this.database = t
                }.bind(this))
            }
            return e.prototype = {
                _writeToStorage: function() {
                    return new Promise(function(e) {
                        var t = JSON.stringify(this.database);
                        localStorage.setItem("database", t),
                        e()
                    }.bind(this))
                },
                _readFromStorage: function() {
                    return new Promise(function(e) {
                        e(localStorage.getItem("database"))
                    })
                },
                set: function(e, t) {
                    if (this.isInitializedPromiseResolved) return this.file[e] = t,
                    this._writeToStorage()
                },
                setMultiple: function(e) {
                    if (this.isInitializedPromiseResolved) {
                        for (var t in e) this.file[t] = e[t];
                        return this._writeToStorage()
                    }
                },
                get: function(e, t) {
                    return this.isInitializedPromiseResolved ? this.file[e] || t: t
                }
            },
            e
        } ();
        e.ViewHistory = i
    }),
    function(e, t) {
        t(e.pdfjsWebDownloadManager = {},
        e.pdfjsWebPDFJS)
    } (this,
    function(e, t) {
        function i(e, t) {
            var i = document.createElement("a");
            if (i.click) i.href = e,
            i.target = "_parent",
            "download" in i && (i.download = t),
            (document.body || document.documentElement).appendChild(i),
            i.click(),
            i.parentNode.removeChild(i);
            else {
                if (window.top === window && e.split("#")[0] === window.location.href.split("#")[0]) {
                    var n = e.indexOf("?") === -1 ? "?": "&";
                    e = e.replace(/#|$/, n + "$&")
                }
                window.open(e, "_parent")
            }
        }
        function n() {}
        n.prototype = {
            downloadUrl: function(e, n) {
                t.isValidUrl(e, !0) && i(e + "#pdfjs.action=download", n)
            },
            downloadData: function(e, n, s) {
                if (navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([e], {
                    type: s
                }), n);
                var r = t.createObjectURL(e, s, t.PDFJS.disableCreateObjectURL);
                i(r, n)
            },
            download: function(e, t, n) {
                if (!URL) return void this.downloadUrl(t, n);
                if (navigator.msSaveBlob) return void(navigator.msSaveBlob(e, n) || this.downloadUrl(t, n));
                var s = URL.createObjectURL(e);
                i(s, n)
            }
        },
        e.DownloadManager = n
    }),
    function(e, t) {
        t(e.pdfjsWebFirefoxCom = {},
        e.pdfjsWebPreferences, e.pdfjsWebPDFJS)
    } (this,
    function(e, t, i) {}),
    function(e, t) {
        t(e.pdfjsWebPDFAttachmentViewer = {},
        e.pdfjsWebPDFJS)
    } (this,
    function(e, t) {
        var i = function() {
            function e(e) {
                this.attachments = null,
                this.container = e.container,
                this.downloadManager = e.downloadManager
            }
            return e.prototype = {
                reset: function() {
                    this.attachments = null;
                    for (var e = this.container; e.firstChild;) e.removeChild(e.firstChild)
                },
                _dispatchEvent: function(e) {
                    var t = document.createEvent("CustomEvent");
                    t.initCustomEvent("attachmentsloaded", !0, !0, {
                        attachmentsCount: e
                    }),
                    this.container.dispatchEvent(t)
                },
                _bindLink: function(e, t, i) {
                    e.onclick = function(e) {
                        return this.downloadManager.downloadData(t, i, ""),
                        !1
                    }.bind(this)
                },
                render: function(e) {
                    var i = e && e.attachments || null,
                    n = 0;
                    if (this.attachments && this.reset(), this.attachments = i, !i) return void this._dispatchEvent(n);
                    var s = Object.keys(i).sort(function(e, t) {
                        return e.toLowerCase().localeCompare(t.toLowerCase())
                    });
                    n = s.length;
                    for (var r = 0; r < n; r++) {
                        var o = i[s[r]],
                        a = t.getFilenameFromUrl(o.filename),
                        d = document.createElement("div");
                        d.className = "attachmentsItem";
                        var l = document.createElement("button");
                        this._bindLink(l, o.content, a),
                        l.textContent = t.removeNullCharacters(a),
                        d.appendChild(l),
                        this.container.appendChild(d)
                    }
                    this._dispatchEvent(n)
                }
            },
            e
        } ();
        e.PDFAttachmentViewer = i
    }),
    function(e, t) {
        t(e.pdfjsWebPDFOutlineViewer = {},
        e.pdfjsWebPDFJS)
    } (this,
    function(e, t) {
        var i = "–",
        n = function() {
            function e(e) {
                this.outline = null,
                this.lastToggleIsShow = !0,
                this.container = e.container,
                this.linkService = e.linkService
            }
            return e.prototype = {
                reset: function() {
                    this.outline = null,
                    this.lastToggleIsShow = !0;
                    for (var e = this.container; e.firstChild;) e.removeChild(e.firstChild)
                },
                _dispatchEvent: function(e) {
                    var t = document.createEvent("CustomEvent");
                    t.initCustomEvent("outlineloaded", !0, !0, {
                        outlineCount: e
                    }),
                    this.container.dispatchEvent(t)
                },
                _bindLink: function(e, i) {
                    if (i.url) return void t.addLinkAttributes(e, {
                        url: i.url
                    });
                    var n = this.linkService;
                    e.href = n.getDestinationHash(i.dest),
                    e.onclick = function(e) {
                        return n.navigateTo(i.dest),
                        !1
                    }
                },
                _setStyles: function(e, t) {
                    var i = "";
                    t.bold && (i += "font-weight: bold;"),
                    t.italic && (i += "font-style: italic;"),
                    i && e.setAttribute("style", i)
                },
                _addToggleButton: function(e) {
                    var t = document.createElement("div");
                    t.className = "outlineItemToggler",
                    t.onclick = function(i) {
                        if (i.stopPropagation(), t.classList.toggle("outlineItemsHidden"), i.shiftKey) {
                            var n = !t.classList.contains("outlineItemsHidden");
                            this._toggleOutlineItem(e, n)
                        }
                    }.bind(this),
                    e.insertBefore(t, e.firstChild)
                },
                _toggleOutlineItem: function(e, t) {
                    this.lastToggleIsShow = t;
                    for (var i = e.querySelectorAll(".outlineItemToggler"), n = 0, s = i.length; n < s; ++n) i[n].classList[t ? "remove": "add"]("outlineItemsHidden")
                },
                toggleOutlineTree: function() {
                    this.outline && this._toggleOutlineItem(this.container, !this.lastToggleIsShow)
                },
                render: function(e) {
                    var n = e && e.outline || null,
                    s = 0;
                    if (this.outline && this.reset(), this.outline = n, !n) return void this._dispatchEvent(s);
                    for (var r = document.createDocumentFragment(), o = [{
                        parent: r,
                        items: this.outline
                    }], a = !1; o.length > 0;) for (var d = o.shift(), l = 0, h = d.items.length; l < h; l++) {
                        var c = d.items[l],
                        u = document.createElement("div");
                        u.className = "outlineItem";
                        var f = document.createElement("a");
                        if (this._bindLink(f, c), this._setStyles(f, c), f.textContent = t.removeNullCharacters(c.title) || i, u.appendChild(f), c.items.length > 0) {
                            a = !0,
                            this._addToggleButton(u);
                            var g = document.createElement("div");
                            g.className = "outlineItems",
                            u.appendChild(g),
                            o.push({
                                parent: g,
                                items: c.items
                            })
                        }
                        d.parent.appendChild(u),
                        s++
                    }
                    a && this.container.classList.add("outlineWithDeepNesting"),
                    this.container.appendChild(r),
                    this._dispatchEvent(s)
                }
            },
            e
        } ();
        e.PDFOutlineViewer = n
    }),
    function(e, t) {
        t(e.pdfjsWebPDFSidebar = {},
        e.pdfjsWebPDFRenderingQueue)
    } (this,
    function(e, t) {
        var i = t.RenderingStates,
        n = {
            NONE: 0,
            THUMBS: 1,
            OUTLINE: 2,
            ATTACHMENTS: 3
        },
        s = function() {
            function e(e) {
                this.isOpen = !1,
                this.active = n.THUMBS,
                this.isInitialViewSet = !1,
                this.onToggled = null,
                this.pdfViewer = e.pdfViewer,
                this.pdfThumbnailViewer = e.pdfThumbnailViewer,
                this.pdfOutlineViewer = e.pdfOutlineViewer,
                this.mainContainer = e.mainContainer,
                this.outerContainer = e.outerContainer,
                this.toggleButton = e.toggleButton,
                this.thumbnailButton = e.thumbnailButton,
                this.outlineButton = e.outlineButton,
                this.attachmentsButton = e.attachmentsButton,
                this.thumbnailView = e.thumbnailView,
                this.outlineView = e.outlineView,
                this.attachmentsView = e.attachmentsView,
                this._addEventListeners()
            }
            return e.prototype = {
                reset: function() {
                    this.isInitialViewSet = !1,
                    this.close(),
                    this.switchView(n.THUMBS),
                    this.outlineButton.disabled = !1,
                    this.attachmentsButton.disabled = !1
                },
                get visibleView() {
                    return this.isOpen ? this.active: n.NONE
                },
                get isThumbnailViewVisible() {
                    return this.isOpen && this.active === n.THUMBS
                },
                get isOutlineViewVisible() {
                    return this.isOpen && this.active === n.OUTLINE
                },
                get isAttachmentsViewVisible() {
                    return this.isOpen && this.active === n.ATTACHMENTS
                },
                setInitialView: function(e) {
                    if (!this.isInitialViewSet) {
                        if (this.isInitialViewSet = !0, this.isOpen && e === n.NONE) return void this._dispatchEvent();
                        var t = e === this.visibleView;
                        this.switchView(e, !0),
                        t && this._dispatchEvent()
                    }
                },
                switchView: function(e, t) {
                    if (e === n.NONE) return void this.close();
                    var i = e !== this.active,
                    s = !1;
                    switch (e) {
                    case n.THUMBS:
                        this.thumbnailButton.classList.add("toggled"),
                        this.outlineButton.classList.remove("toggled"),
                        this.attachmentsButton.classList.remove("toggled"),
                        this.thumbnailView.classList.remove("hidden"),
                        this.outlineView.classList.add("hidden"),
                        this.attachmentsView.classList.add("hidden"),
                        this.isOpen && i && (this._updateThumbnailViewer(), s = !0);
                        break;
                    case n.OUTLINE:
                        if (this.outlineButton.disabled) return;
                        this.thumbnailButton.classList.remove("toggled"),
                        this.outlineButton.classList.add("toggled"),
                        this.attachmentsButton.classList.remove("toggled"),
                        this.thumbnailView.classList.add("hidden"),
                        this.outlineView.classList.remove("hidden"),
                        this.attachmentsView.classList.add("hidden");
                        break;
                    case n.ATTACHMENTS:
                        if (this.attachmentsButton.disabled) return;
                        this.thumbnailButton.classList.remove("toggled"),
                        this.outlineButton.classList.remove("toggled"),
                        this.attachmentsButton.classList.add("toggled"),
                        this.thumbnailView.classList.add("hidden"),
                        this.outlineView.classList.add("hidden"),
                        this.attachmentsView.classList.remove("hidden");
                        break;
                    default:
                        return void console.error('PDFSidebar_switchView: "' + e + '" is an unsupported value.')
                    }
                    return this.active = 0 | e,
                    t && !this.isOpen ? void this.open() : (s && this._forceRendering(), void(i && this._dispatchEvent()))
                },
                open: function() {
                    this.isOpen || (this.isOpen = !0, this.toggleButton.classList.add("toggled"), this.outerContainer.classList.add("sidebarMoving"), this.outerContainer.classList.add("sidebarOpen"), this.active === n.THUMBS && this._updateThumbnailViewer(), this._forceRendering(), this._dispatchEvent())
                },
                close: function() {
                    this.isOpen && (this.isOpen = !1, this.toggleButton.classList.remove("toggled"), this.outerContainer.classList.add("sidebarMoving"), this.outerContainer.classList.remove("sidebarOpen"), this._forceRendering(), this._dispatchEvent())
                },
                toggle: function() {
                    this.isOpen ? this.close() : this.open()
                },
                _dispatchEvent: function() {
                    var e = document.createEvent("CustomEvent");
                    e.initCustomEvent("sidebarviewchanged", !0, !0, {
                        view: this.visibleView
                    }),
                    this.outerContainer.dispatchEvent(e)
                },
                _forceRendering: function() {
                    this.onToggled ? this.onToggled() : (this.pdfViewer.forceRendering(), this.pdfThumbnailViewer.forceRendering())
                },
                _updateThumbnailViewer: function() {
                    for (var e = this.pdfViewer,
                    t = this.pdfThumbnailViewer,
                    n = e.pagesCount,
                    s = 0; s < n; s++) {
                        var r = e.getPageView(s);
                        if (r && r.renderingState === i.FINISHED) {
                            var o = t.getThumbnail(s);
                            o.setImage(r)
                        }
                    }
                    t.scrollThumbnailIntoView(e.currentPageNumber)
                },
                _addEventListeners: function() {
                    var e = this;
                    e.mainContainer.addEventListener("transitionend",
                    function(t) {
                        t.target === this && e.outerContainer.classList.remove("sidebarMoving")
                    }),
                    e.thumbnailButton.addEventListener("click",
                    function() {
                        e.switchView(n.THUMBS)
                    }),
                    e.outlineButton.addEventListener("click",
                    function() {
                        e.switchView(n.OUTLINE)
                    }),
                    e.outlineButton.addEventListener("dblclick",
                    function() {
                        e.pdfOutlineViewer.toggleOutlineTree()
                    }),
                    e.attachmentsButton.addEventListener("click",
                    function() {
                        e.switchView(n.ATTACHMENTS)
                    }),
                    e.outlineView.addEventListener("outlineloaded",
                    function(t) {
                        var i = t.detail.outlineCount;
                        e.outlineButton.disabled = !i,
                        i || e.active !== n.OUTLINE || e.switchView(n.THUMBS)
                    }),
                    e.attachmentsView.addEventListener("attachmentsloaded",
                    function(t) {
                        var i = t.detail.attachmentsCount;
                        e.attachmentsButton.disabled = !i,
                        i || e.active !== n.ATTACHMENTS || e.switchView(n.THUMBS)
                    }),
                    window.addEventListener("presentationmodechanged",
                    function(t) {
                        t.detail.active || t.detail.switchInProgress || !e.isThumbnailViewVisible || e._updateThumbnailViewer()
                    })
                }
            },
            e
        } ();
        e.SidebarView = n,
        e.PDFSidebar = s
    }),
    function(e, t) {
        t(e.pdfjsWebTextLayerBuilder = {},
        e.pdfjsWebPDFJS)
    } (this,
    function(e, t) {
        function i() {}
        var n = function() {
            function e(e) {
                this.textLayerDiv = e.textLayerDiv,
                this.renderingDone = !1,
                this.divContentDone = !1,
                this.pageIdx = e.pageIndex,
                this.pageNumber = this.pageIdx + 1,
                this.matches = [],
                this.viewport = e.viewport,
                this.textDivs = [],
                this.findController = e.findController || null,
                this.textLayerRenderTask = null,
                this._bindMouse()
            }
            return e.prototype = {
                _finishRendering: function() {
                    this.renderingDone = !0;
                    var e = document.createElement("div");
                    e.className = "endOfContent",
                    this.textLayerDiv.appendChild(e);
                    var t = document.createEvent("CustomEvent");
                    t.initCustomEvent("textlayerrendered", !0, !0, {
                        pageNumber: this.pageNumber
                    }),
                    this.textLayerDiv.dispatchEvent(t)
                },
                render: function(e) {
                    if (this.divContentDone && !this.renderingDone) {
                        this.textLayerRenderTask && (this.textLayerRenderTask.cancel(), this.textLayerRenderTask = null),
                        this.textDivs = [];
                        var i = document.createDocumentFragment();
                        this.textLayerRenderTask = t.renderTextLayer({
                            textContent: this.textContent,
                            container: i,
                            viewport: this.viewport,
                            textDivs: this.textDivs,
                            timeout: e
                        }),
                        this.textLayerRenderTask.promise.then(function() {
                            this.textLayerDiv.appendChild(i),
                            this._finishRendering(),
                            this.updateMatches()
                        }.bind(this),
                        function(e) {})
                    }
                },
                setTextContent: function(e) {
                    this.textLayerRenderTask && (this.textLayerRenderTask.cancel(), this.textLayerRenderTask = null),
                    this.textContent = e,
                    this.divContentDone = !0
                },
                convertMatches: function(e) {
                    for (var t = 0,
                    i = 0,
                    n = this.textContent.items,
                    s = n.length - 1,
                    r = null === this.findController ? 0 : this.findController.state.query.length, o = [], a = 0, d = e.length; a < d; a++) {
                        for (var l = e[a]; t !== s && l >= i + n[t].str.length;) i += n[t].str.length,
                        t++;
                        t === n.length && console.error("Could not find a matching mapping");
                        var h = {
                            begin: {
                                divIdx: t,
                                offset: l - i
                            }
                        };
                        for (l += r; t !== s && l > i + n[t].str.length;) i += n[t].str.length,
                        t++;
                        h.end = {
                            divIdx: t,
                            offset: l - i
                        },
                        o.push(h)
                    }
                    return o
                },
                renderMatches: function(e) {
                    function t(e, t) {
                        var n = e.divIdx;
                        s[n].textContent = "",
                        i(n, 0, e.offset, t)
                    }
                    function i(e, t, i, r) {
                        var o = s[e],
                        a = n[e].str.substring(t, i),
                        d = document.createTextNode(a);
                        if (r) {
                            var l = document.createElement("span");
                            return l.className = r,
                            l.appendChild(d),
                            void o.appendChild(l)
                        }
                        o.appendChild(d)
                    }
                    if (0 !== e.length) {
                        var n = this.textContent.items,
                        s = this.textDivs,
                        r = null,
                        o = this.pageIdx,
                        a = null !== this.findController && o === this.findController.selected.pageIdx,
                        d = null === this.findController ? -1 : this.findController.selected.matchIdx,
                        l = null !== this.findController && this.findController.state.highlightAll,
                        h = {
                            divIdx: -1,
                            offset: void 0
                        },
                        c = d,
                        u = c + 1;
                        if (l) c = 0,
                        u = e.length;
                        else if (!a) return;
                        for (var f = c; f < u; f++) {
                            var g = e[f],
                            p = g.begin,
                            m = g.end,
                            v = a && f === d,
                            w = v ? " selected": "";
                            if (this.findController && this.findController.updateMatchPosition(o, f, s, p.divIdx, m.divIdx), r && p.divIdx === r.divIdx ? i(r.divIdx, r.offset, p.offset) : (null !== r && i(r.divIdx, r.offset, h.offset), t(p)), p.divIdx === m.divIdx) i(p.divIdx, p.offset, m.offset, "highlight" + w);
                            else {
                                i(p.divIdx, p.offset, h.offset, "highlight begin" + w);
                                for (var b = p.divIdx + 1,
                                P = m.divIdx; b < P; b++) s[b].className = "highlight middle" + w;
                                t(m, "highlight end" + w)
                            }
                            r = m
                        }
                        r && i(r.divIdx, r.offset, h.offset)
                    }
                },
                updateMatches: function() {
                    if (this.renderingDone) {
                        for (var e = this.matches,
                        t = this.textDivs,
                        i = this.textContent.items,
                        n = -1,
                        s = 0,
                        r = e.length; s < r; s++) {
                            for (var o = e[s], a = Math.max(n, o.begin.divIdx), d = a, l = o.end.divIdx; d <= l; d++) {
                                var h = t[d];
                                h.textContent = i[d].str,
                                h.className = ""
                            }
                            n = o.end.divIdx + 1
                        }
                        null !== this.findController && this.findController.active && (this.matches = this.convertMatches(null === this.findController ? [] : this.findController.pageMatches[this.pageIdx] || []), this.renderMatches(this.matches))
                    }
                },
                _bindMouse: function() {
                    var e = this.textLayerDiv;
                    e.addEventListener("mousedown",
                    function(t) {
                        var i = e.querySelector(".endOfContent");
                        if (i) {
                            var n = t.target !== e;
                            if (n = n && "none" !== window.getComputedStyle(i).getPropertyValue("-moz-user-select")) {
                                var s = e.getBoundingClientRect(),
                                r = Math.max(0, (t.pageY - s.top) / s.height);
                                i.style.top = (100 * r).toFixed(2) + "%"
                            }
                            i.classList.add("active")
                        }
                    }),
                    e.addEventListener("mouseup",
                    function(t) {
                        var i = e.querySelector(".endOfContent");
                        i && (i.style.top = "", i.classList.remove("active"))
                    })
                }
            },
            e
        } ();
        i.prototype = {
            createTextLayerBuilder: function(e, t, i) {
                return new n({
                    textLayerDiv: e,
                    pageIndex: t,
                    viewport: i
                })
            }
        },
        e.TextLayerBuilder = n,
        e.DefaultTextLayerFactory = i
    }),
    function(e, t) {
        t(e.pdfjsWebUIUtils = {},
        e.pdfjsWebPDFJS)
    } (this,
    function(e, t) {
        function i(e) {
            var t = window.devicePixelRatio || 1,
            i = e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1,
            n = t / i;
            return {
                sx: n,
                sy: n,
                scaled: 1 !== n
            }
        }
        function n(e, t, i) {
            var n = e.offsetParent;
            if (!n) return void console.error("offsetParent is not set -- cannot scroll");
            for (var s = i || !1,
            r = e.offsetTop + e.clientTop,
            o = e.offsetLeft + e.clientLeft; n.clientHeight === n.scrollHeight || s && "hidden" === getComputedStyle(n).overflow;) if (n.dataset._scaleY && (r /= n.dataset._scaleY, o /= n.dataset._scaleX), r += n.offsetTop, o += n.offsetLeft, n = n.offsetParent, !n) return;
            t && (void 0 !== t.top && (r += t.top), void 0 !== t.left && (o += t.left, n.scrollLeft = o)),
            n.scrollTop = r
        }
        function s(e, t) {
            var i = function(i) {
                s || (s = window.requestAnimationFrame(function() {
                    s = null;
                    var i = e.scrollTop,
                    r = n.lastY;
                    i !== r && (n.down = i > r),
                    n.lastY = i,
                    t(n)
                }))
            },
            n = {
                down: !0,
                lastY: e.scrollTop,
                _eventHandler: i
            },
            s = null;
            return e.addEventListener("scroll", i, !0),
            n
        }
        function r(e) {
            for (var t = e.split("&"), i = {},
            n = 0, s = t.length; n < s; ++n) {
                var r = t[n].split("="),
                o = r[0].toLowerCase(),
                a = r.length > 1 ? r[1] : null;
                i[decodeURIComponent(o)] = decodeURIComponent(a)
            }
            return i
        }
        function o(e, t) {
            var i = 0,
            n = e.length - 1;
            if (0 === e.length || !t(e[n])) return e.length;
            if (t(e[i])) return i;
            for (; i < n;) {
                var s = i + n >> 1,
                r = e[s];
                t(r) ? n = s: i = s + 1
            }
            return i
        }
        function a(e) {
            if (Math.floor(e) === e) return [e, 1];
            var t = 1 / e,
            i = 8;
            if (t > i) return [1, i];
            if (Math.floor(t) === t) return [1, t];
            for (var n = e > 1 ? t: e, s = 0, r = 1, o = 1, a = 1;;) {
                var d = s + o,
                l = r + a;
                if (l > i) break;
                n <= d / l ? (o = d, a = l) : (s = d, r = l)
            }
            return n - s / r < o / a - n ? n === e ? [s, r] : [r, s] : n === e ? [o, a] : [a, o]
        }
        function d(e, t) {
            var i = e % t;
            return 0 === i ? e: Math.round(e - i + t)
        }
        function l(e, t, i) {
            function n(e) {
                var t = e.div,
                i = t.offsetTop + t.clientTop + t.clientHeight;
                return i > f
            }
            for (var s, r, a, d, l, h, c, u, f = e.scrollTop,
            g = f + e.clientHeight,
            p = e.scrollLeft,
            m = p + e.clientWidth,
            v = [], w = 0 === t.length ? 0 : o(t, n), b = w, P = t.length; b < P && (s = t[b], r = s.div, a = r.offsetTop + r.clientTop, d = r.clientHeight, !(a > g)); b++) c = r.offsetLeft + r.clientLeft,
            u = r.clientWidth,
            c + u < p || c > m || (l = Math.max(0, f - a) + Math.max(0, a + d - g), h = 100 * (d - l) / d | 0, v.push({
                id: s.id,
                x: c,
                y: a,
                view: s,
                percent: h
            }));
            var y = v[0],
            C = v[v.length - 1];
            return i && v.sort(function(e, t) {
                var i = e.percent - t.percent;
                return Math.abs(i) > .001 ? -i: e.id - t.id
            }),
            {
                first: y,
                last: C,
                views: v
            }
        }
        function h(e) {
            e.preventDefault()
        }
        function c(e) {
            var t = /^(?:([^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/,
            i = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i,
            n = t.exec(e),
            s = i.exec(n[1]) || i.exec(n[2]) || i.exec(n[3]);
            if (s && (s = s[0], s.indexOf("%") !== -1)) try {
                s = i.exec(decodeURIComponent(s))[0]
            } catch(e) {}
            return s || "document.pdf"
        }
        var u = 96 / 72,
        f = "page-width",
        g = 1,
        p = 0,
        m = 1.25,
        v = 0,
        w = 5,
        b = document.mozL10n || document.webL10n,
        P = t.PDFJS;
        P.disableFullscreen = void 0 !== P.disableFullscreen && P.disableFullscreen,
        P.useOnlyCssZoom = void 0 !== P.useOnlyCssZoom && P.useOnlyCssZoom,
        P.maxCanvasPixels = void 0 === P.maxCanvasPixels ? 16777216 : P.maxCanvasPixels,
        P.disableHistory = void 0 !== P.disableHistory && P.disableHistory,
        P.disableTextLayer = void 0 !== P.disableTextLayer && P.disableTextLayer,
        P.ignoreCurrentPositionOnZoom = void 0 !== P.ignoreCurrentPositionOnZoom && P.ignoreCurrentPositionOnZoom,
        P.locale = void 0 === P.locale ? navigator.language: P.locale;
        var y = function() {
            function e(e, t, i) {
                return Math.min(Math.max(e, t), i)
            }
            function t(e, t) {
                this.visible = !0,
                this.div = document.querySelector(e + " .progress"),
                this.bar = this.div.parentNode,
                this.height = t.height || 100,
                this.width = t.width || 100,
                this.units = t.units || "%",
                this.div.style.height = this.height + this.units,
                this.percent = 0
            }
            return t.prototype = {
                updateBar: function() {
                    if (this._indeterminate) return this.div.classList.add("indeterminate"),
                    void(this.div.style.width = this.width + this.units);
                    this.div.classList.remove("indeterminate");
                    var e = this.width * this._percent / 100;
                    this.div.style.width = e + this.units
                },
                get percent() {
                    return this._percent
                },
                set percent(t) {
                    this._indeterminate = isNaN(t),
                    this._percent = e(t, 0, 100),
                    this.updateBar()
                },
                setWidth: function(e) {
                    if (e) {
                        var t = e.parentNode,
                        i = t.offsetWidth - e.offsetWidth;
                        i > 0 && this.bar.setAttribute("style", "width: calc(100% - " + i + "px);")
                    }
                },
                hide: function() {
                    this.visible && (this.visible = !1, this.bar.classList.add("hidden"), document.body.classList.remove("loadingInProgress"))
                },
                show: function() {
                    this.visible || (this.visible = !0, document.body.classList.add("loadingInProgress"), this.bar.classList.remove("hidden"))
                }
            },
            t
        } ();
        e.CSS_UNITS = u,
        e.DEFAULT_SCALE_VALUE = f,
        e.DEFAULT_SCALE = g,
        e.UNKNOWN_SCALE = p,
        e.MAX_AUTO_SCALE = m,
        e.SCROLLBAR_PADDING = v,
        e.VERTICAL_PADDING = w,
        e.mozL10n = b,
        e.ProgressBar = y,
        e.getPDFFileNameFromURL = c,
        e.noContextMenuHandler = h,
        e.parseQueryString = r,
        e.getVisibleElements = l,
        e.roundToDivide = d,
        e.approximateFraction = a,
        e.getOutputScale = i,
        e.scrollIntoView = n,
        e.watchScroll = s,
        e.binarySearchFirstItem = o
    }),
    function(e, t) {
        t(e.pdfjsWebPasswordPrompt = {},
        e.pdfjsWebUIUtils, e.pdfjsWebOverlayManager, e.pdfjsWebPDFJS)
    } (this,
    function(e, t, i, n) {
        var s = t.mozL10n,
        r = i.OverlayManager,
        o = function() {
            function e(e) {
                this.overlayName = e.overlayName,
                this.container = e.container,
                this.label = e.label,
                this.input = e.input,
                this.submitButton = e.submitButton,
                this.cancelButton = e.cancelButton,
                this.updateCallback = null,
                this.reason = null,
                this.submitButton.addEventListener("click", this.verify.bind(this)),
                this.cancelButton.addEventListener("click", this.close.bind(this)),
                this.input.addEventListener("keydown",
                function(e) {}.bind(this)),
                r.register(this.overlayName, this.container, this.close.bind(this), !0)
            }
            return e.prototype = {
                open: function() {
                    r.open(this.overlayName).then(function() {
                        this.input.type = "password",
                        this.input.focus();
                        var e = s.get("password_label", null, "Enter the password to open this PDF file.");
                        this.reason === n.PasswordResponses.INCORRECT_PASSWORD && (e = s.get("password_invalid", null, "Invalid password. Please try again.")),
                        this.label.textContent = e
                    }.bind(this))
                },
                close: function() {
                    r.close(this.overlayName).then(function() {
                        this.input.value = "",
                        this.input.type = ""
                    }.bind(this))
                },
                verify: function() {
                    var e = this.input.value;
                    if (e && e.length > 0) return this.close(),
                    this.updateCallback(e)
                },
                setUpdateCallback: function(e, t) {
                    this.updateCallback = e,
                    this.reason = t
                }
            },
            e
        } ();
        e.PasswordPrompt = o
    }),
    function(e, t) {
        t(e.pdfjsWebPDFDocumentProperties = {},
        e.pdfjsWebUIUtils, e.pdfjsWebOverlayManager)
    } (this,
    function(e, t, i) {
        var n = t.getPDFFileNameFromURL,
        s = t.mozL10n,
        r = i.OverlayManager,
        o = function() {
            function e(e) {
                this.fields = e.fields,
                this.overlayName = e.overlayName,
                this.container = e.container,
                this.rawFileSize = 0,
                this.url = null,
                this.pdfDocument = null,
                e.closeButton && e.closeButton.addEventListener("click", this.close.bind(this)),
                this.dataAvailablePromise = new Promise(function(e) {
                    this.resolveDataAvailable = e
                }.bind(this)),
                r.register(this.overlayName, this.container, this.close.bind(this))
            }
            return e.prototype = {
                open: function() {
                    Promise.all([r.open(this.overlayName), this.dataAvailablePromise]).then(function() {
                        this._getProperties()
                    }.bind(this))
                },
                close: function() {
                    r.close(this.overlayName)
                },
                setFileSize: function(e) {
                    e > 0 && (this.rawFileSize = e)
                },
                setDocumentAndUrl: function(e, t) {
                    this.pdfDocument = e,
                    this.url = t,
                    this.resolveDataAvailable()
                },
                _getProperties: function() {
                    r.active && (this.pdfDocument.getDownloadInfo().then(function(e) {
                        e.length !== this.rawFileSize && (this.setFileSize(e.length), this._updateUI(this.fields.fileSize, this._parseFileSize()))
                    }.bind(this)), this.pdfDocument.getMetadata().then(function(e) {
                        var t = {
                            fileName: n(this.url),
                            fileSize: this._parseFileSize(),
                            title: e.info.Title,
                            author: e.info.Author,
                            subject: e.info.Subject,
                            keywords: e.info.Keywords,
                            creationDate: this._parseDate(e.info.CreationDate),
                            modificationDate: this._parseDate(e.info.ModDate),
                            creator: e.info.Creator,
                            producer: e.info.Producer,
                            version: e.info.PDFFormatVersion,
                            pageCount: this.pdfDocument.numPages
                        };
                        for (var i in t) this._updateUI(this.fields[i], t[i])
                    }.bind(this)))
                },
                _updateUI: function(e, t) {
                    e && void 0 !== t && "" !== t && (e.textContent = t)
                },
                _parseFileSize: function() {
                    var e = this.rawFileSize,
                    t = e / 1024;
                    return t ? t < 1024 ? s.get("document_properties_kb", {
                        size_kb: ( + t.toPrecision(3)).toLocaleString(),
                        size_b: e.toLocaleString()
                    },
                    "{{size_kb}} KB ({{size_b}} bytes)") : s.get("document_properties_mb", {
                        size_mb: ( + (t / 1024).toPrecision(3)).toLocaleString(),
                        size_b: e.toLocaleString()
                    },
                    "{{size_mb}} MB ({{size_b}} bytes)") : void 0
                },
                _parseDate: function(e) {
                    var t = e;
                    if (void 0 === t) return "";
                    "D:" === t.substring(0, 2) && (t = t.substring(2));
                    var i = parseInt(t.substring(0, 4), 10),
                    n = parseInt(t.substring(4, 6), 10) - 1,
                    r = parseInt(t.substring(6, 8), 10),
                    o = parseInt(t.substring(8, 10), 10),
                    a = parseInt(t.substring(10, 12), 10),
                    d = parseInt(t.substring(12, 14), 10),
                    l = t.substring(14, 15),
                    h = parseInt(t.substring(15, 17), 10),
                    c = parseInt(t.substring(18, 20), 10);
                    "-" === l ? (o += h, a += c) : "+" === l && (o -= h, a -= c);
                    var u = new Date(Date.UTC(i, n, r, o, a, d)),
                    f = u.toLocaleDateString(),
                    g = u.toLocaleTimeString();
                    return s.get("document_properties_date_string", {
                        date: f,
                        time: g
                    },
                    "{{date}}, {{time}}")
                }
            },
            e
        } ();
        e.PDFDocumentProperties = o
    }),
    function(e, t) {
        t(e.pdfjsWebPDFFindController = {},
        e.pdfjsWebUIUtils, e.pdfjsWebFirefoxCom)
    } (this,
    function(e, t, i) {
        var n = t.scrollIntoView,
        s = i.FirefoxCom,
        r = {
            FIND_FOUND: 0,
            FIND_NOTFOUND: 1,
            FIND_WRAPPED: 2,
            FIND_PENDING: 3
        },
        o = -50,
        a = -400,
        d = {
            "‘": "'",
            "’": "'",
            "‚": "'",
            "‛": "'",
            "“": '"',
            "”": '"',
            "„": '"',
            "‟": '"',
            "¼": "1/4",
            "½": "1/2",
            "¾": "3/4"
        },
        l = function() {
            function e(e) {
                this.pdfViewer = e.pdfViewer || null,
                this.integratedFind = e.integratedFind || !1,
                this.findBar = e.findBar || null,
                this.reset();
                var t = Object.keys(d).join("");
                this.normalizationRegex = new RegExp("[" + t + "]", "g");
                var i = ["find", "findagain", "findhighlightallchange", "findcasesensitivitychange"];
                this.handleEvent = this.handleEvent.bind(this);
                for (var n = 0,
                s = i.length; n < s; n++) window.addEventListener(i[n], this.handleEvent)
            }
            return e.prototype = {
                setFindBar: function(e) {
                    this.findBar = e
                },
                reset: function() {
                    this.startedTextExtraction = !1,
                    this.extractTextPromises = [],
                    this.pendingFindMatches = Object.create(null),
                    this.active = !1,
                    this.pageContents = [],
                    this.pageMatches = [],
                    this.matchCount = 0,
                    this.selected = {
                        pageIdx: -1,
                        matchIdx: -1
                    },
                    this.offset = {
                        pageIdx: null,
                        matchIdx: null
                    },
                    this.pagesToSearch = null,
                    this.resumePageIdx = null,
                    this.state = null,
                    this.dirtyMatch = !1,
                    this.findTimeout = null,
                    this.firstPagePromise = new Promise(function(e) {
                        this.resolveFirstPage = e
                    }.bind(this))
                },
                normalize: function(e) {
                    return e.replace(this.normalizationRegex,
                    function(e) {
                        return d[e]
                    })
                },
                calcFindMatch: function(e) {
                    var t = this.normalize(this.pageContents[e]),
                    i = this.normalize(this.state.query),
                    n = this.state.caseSensitive,
                    s = i.length;
                    if (0 !== s) {
                        n || (t = t.toLowerCase(), i = i.toLowerCase());
                        for (var r = [], o = -s;;) {
                            if (o = t.indexOf(i, o + s), o === -1) break;
                            r.push(o)
                        }
                        this.pageMatches[e] = r,
                        this.updatePage(e),
                        this.resumePageIdx === e && (this.resumePageIdx = null, this.nextPageMatch()),
                        r.length > 0 && (this.matchCount += r.length, this.updateUIResultsCount())
                    }
                },
                extractText: function() {
                    function e(i) {
                        s.pdfViewer.getPageTextContent(i).then(function(n) {
                            for (var r = n.items,
                            o = [], a = 0, d = r.length; a < d; a++) o.push(r[a].str);
                            s.pageContents.push(o.join("")),
                            t[i](i),
                            i + 1 < s.pdfViewer.pagesCount && e(i + 1)
                        })
                    }
                    if (!this.startedTextExtraction) {
                        this.startedTextExtraction = !0,
                        this.pageContents = [];
                        for (var t = [], i = this.pdfViewer.pagesCount, n = 0; n < i; n++) this.extractTextPromises.push(new Promise(function(e) {
                            t.push(e)
                        }));
                        var s = this;
                        e(0)
                    }
                },
                handleEvent: function(e) {
                    null !== this.state && "findagain" === e.type || (this.dirtyMatch = !0),
                    this.state = e.detail,
                    this.updateUIState(r.FIND_PENDING),
                    this.firstPagePromise.then(function() {
                        this.extractText(),
                        clearTimeout(this.findTimeout),
                        "find" === e.type ? this.findTimeout = setTimeout(this.nextMatch.bind(this), 250) : this.nextMatch()
                    }.bind(this))
                },
                updatePage: function(e) {
                    this.selected.pageIdx === e && this.pdfViewer.scrollPageIntoView(e + 1);
                    var t = this.pdfViewer.getPageView(e);
                    t.textLayer && t.textLayer.updateMatches()
                },
                nextMatch: function() {
                    var e = this.state.findPrevious,
                    t = this.pdfViewer.currentPageNumber - 1,
                    i = this.pdfViewer.pagesCount;
                    if (this.active = !0, this.dirtyMatch) {
                        this.dirtyMatch = !1,
                        this.selected.pageIdx = this.selected.matchIdx = -1,
                        this.offset.pageIdx = t,
                        this.offset.matchIdx = null,
                        this.hadMatch = !1,
                        this.resumePageIdx = null,
                        this.pageMatches = [],
                        this.matchCount = 0;
                        for (var n = this,
                        s = 0; s < i; s++) this.updatePage(s),
                        s in this.pendingFindMatches || (this.pendingFindMatches[s] = !0, this.extractTextPromises[s].then(function(e) {
                            delete n.pendingFindMatches[e],
                            n.calcFindMatch(e)
                        }))
                    }
                    if ("" === this.state.query) return void this.updateUIState(r.FIND_FOUND);
                    if (!this.resumePageIdx) {
                        var o = this.offset;
                        if (this.pagesToSearch = i, null !== o.matchIdx) {
                            var a = this.pageMatches[o.pageIdx].length;
                            if (!e && o.matchIdx + 1 < a || e && o.matchIdx > 0) return this.hadMatch = !0,
                            o.matchIdx = e ? o.matchIdx - 1 : o.matchIdx + 1,
                            void this.updateMatch(!0);
                            this.advanceOffsetPage(e)
                        }
                        this.nextPageMatch()
                    }
                },
                matchesReady: function(e) {
                    var t = this.offset,
                    i = e.length,
                    n = this.state.findPrevious;
                    return i ? (this.hadMatch = !0, t.matchIdx = n ? i - 1 : 0, this.updateMatch(!0), !0) : (this.advanceOffsetPage(n), !!(t.wrapped && (t.matchIdx = null, this.pagesToSearch < 0)) && (this.updateMatch(!1), !0))
                },
                updateMatchPosition: function(e, t, i, s, r) {
                    if (this.selected.matchIdx === t && this.selected.pageIdx === e) {
                        var d = {
                            top: o,
                            left: a
                        };
                        n(i[s], d, !0)
                    }
                },
                nextPageMatch: function() {
                    null !== this.resumePageIdx && console.error("There can only be one pending page.");
                    do {
                        var e = this.offset.pageIdx,
                        t = this.pageMatches[e];
                        if (!t) {
                            this.resumePageIdx = e;
                            break
                        }
                    } while (! this . matchesReady ( t ))
                },
                advanceOffsetPage: function(e) {
                    var t = this.offset,
                    i = this.extractTextPromises.length;
                    t.pageIdx = e ? t.pageIdx - 1 : t.pageIdx + 1,
                    t.matchIdx = null,
                    this.pagesToSearch--,
                    (t.pageIdx >= i || t.pageIdx < 0) && (t.pageIdx = e ? i - 1 : 0, t.wrapped = !0)
                },
                updateMatch: function(e) {
                    var t = r.FIND_NOTFOUND,
                    i = this.offset.wrapped;
                    if (this.offset.wrapped = !1, e) {
                        var n = this.selected.pageIdx;
                        this.selected.pageIdx = this.offset.pageIdx,
                        this.selected.matchIdx = this.offset.matchIdx,
                        t = i ? r.FIND_WRAPPED: r.FIND_FOUND,
                        n !== -1 && n !== this.selected.pageIdx && this.updatePage(n)
                    }
                    this.updateUIState(t, this.state.findPrevious),
                    this.selected.pageIdx !== -1 && this.updatePage(this.selected.pageIdx)
                },
                updateUIResultsCount: function() {
                    if (null === this.findBar) throw new Error("PDFFindController is not initialized with a PDFFindBar instance.");
                    this.findBar.updateResultsCount(this.matchCount)
                },
                updateUIState: function(e, t) {
                    if (this.integratedFind) return void s.request("updateFindControlState", {
                        result: e,
                        findPrevious: t
                    });
                    if (null === this.findBar) throw new Error("PDFFindController is not initialized with a PDFFindBar instance.");
                    this.findBar.updateUIState(e, t, this.matchCount)
                }
            },
            e
        } ();
        e.FindStates = r,
        e.PDFFindController = l
    }),
    function(e, t) {
        t(e.pdfjsWebPDFLinkService = {},
        e.pdfjsWebUIUtils)
    } (this,
    function(e, t) {
        var i = t.parseQueryString,
        n = function() {
            function e() {
                this.baseUrl = null,
                this.pdfDocument = null,
                this.pdfViewer = null,
                this.pdfHistory = null,
                this._pagesRefCache = null
            }
            return e.prototype = {
                setDocument: function(e, t) {
                    this.baseUrl = t,
                    this.pdfDocument = e,
                    this._pagesRefCache = Object.create(null)
                },
                setViewer: function(e) {
                    this.pdfViewer = e
                },
                setHistory: function(e) {
                    this.pdfHistory = e
                },
                get pagesCount() {
                    return this.pdfDocument.numPages
                },
                get page() {
                    return this.pdfViewer.currentPageNumber
                },
                set page(e) {
                    this.pdfViewer.currentPageNumber = e
                },
                navigateTo: function(e) {
                    var t, i = "",
                    n = this,
                    s = function(t) {
                        var r = t instanceof Object ? n._pagesRefCache[t.num + " " + t.gen + " R"] : t + 1;
                        r ? (r > n.pagesCount && (r = n.pagesCount), n.pdfViewer.scrollPageIntoView(r, e), n.pdfHistory && n.pdfHistory.push({
                            dest: e,
                            hash: i,
                            page: r
                        })) : n.pdfDocument.getPageIndex(t).then(function(e) {
                            var i = e + 1,
                            r = t.num + " " + t.gen + " R";
                            n._pagesRefCache[r] = i,
                            s(t)
                        })
                    };
                    "string" == typeof e ? (i = e, t = this.pdfDocument.getDestination(e)) : t = Promise.resolve(e),
                    t.then(function(t) {
                        e = t,
                        t instanceof Array && s(t[0])
                    })
                },
                getDestinationHash: function(e) {
                    if ("string" == typeof e) return this.getAnchorUrl("#" + escape(e));
                    if (e instanceof Array) {
                        var t = e[0],
                        i = t instanceof Object ? this._pagesRefCache[t.num + " " + t.gen + " R"] : t + 1;
                        if (i) {
                            var n = this.getAnchorUrl("#page=" + i),
                            s = e[1];
                            if ("object" == typeof s && "name" in s && "XYZ" === s.name) {
                                var r = e[4] || this.pdfViewer.currentScaleValue,
                                o = parseFloat(r);
                                o && (r = 100 * o),
                                n += "&zoom=" + r,
                                (e[2] || e[3]) && (n += "," + (e[2] || 0) + "," + (e[3] || 0))
                            }
                            return n
                        }
                    }
                    return this.getAnchorUrl("")
                },
                getAnchorUrl: function(e) {
                    return (this.baseUrl || "") + e
                },
                setHash: function(e) {
                    if (e.indexOf("=") >= 0) {
                        var t = i(e);
                        if ("nameddest" in t) return this.pdfHistory && this.pdfHistory.updateNextHashParam(t.nameddest),
                        void this.navigateTo(t.nameddest);
                        var n, s;
                        if ("page" in t && (n = 0 | t.page || 1), "zoom" in t) {
                            var r = t.zoom.split(","),
                            o = r[0],
                            a = parseFloat(o);
                            o.indexOf("Fit") === -1 ? s = [null, {
                                name: "XYZ"
                            },
                            r.length > 1 ? 0 | r[1] : null, r.length > 2 ? 0 | r[2] : null, a ? a / 100 : o] : "Fit" === o || "FitB" === o ? s = [null, {
                                name: o
                            }] : "FitH" === o || "FitBH" === o || "FitV" === o || "FitBV" === o ? s = [null, {
                                name: o
                            },
                            r.length > 1 ? 0 | r[1] : null] : "FitR" === o ? 5 !== r.length ? console.error("PDFLinkService_setHash: Not enough parameters for 'FitR'.") : s = [null, {
                                name: o
                            },
                            0 | r[1], 0 | r[2], 0 | r[3], 0 | r[4]] : console.error("PDFLinkService_setHash: '" + o + "' is not a valid zoom value.")
                        }
                        if (s ? this.pdfViewer.scrollPageIntoView(n || this.page, s) : n && (this.page = n), "pagemode" in t) {
                            var d = document.createEvent("CustomEvent");
                            d.initCustomEvent("pagemode", !0, !0, {
                                mode: t.pagemode
                            }),
                            this.pdfViewer.container.dispatchEvent(d)
                        }
                    } else / ^\d + $ / .test(e) ? this.page = e: (this.pdfHistory && this.pdfHistory.updateNextHashParam(unescape(e)), this.navigateTo(unescape(e)))
                },
                executeNamedAction: function(e) {
                    switch (e) {
                    case "GoBack":
                        this.pdfHistory && this.pdfHistory.back();
                        break;
                    case "GoForward":
                        this.pdfHistory && this.pdfHistory.forward();
                        break;
                    case "NextPage":
                        this.page++;
                        break;
                    case "PrevPage":
                        this.page--;
                        break;
                    case "LastPage":
                        this.page = this.pagesCount;
                        break;
                    case "FirstPage":
                        this.page = 1
                    }
                    var t = document.createEvent("CustomEvent");
                    t.initCustomEvent("namedaction", !0, !0, {
                        action: e
                    }),
                    this.pdfViewer.container.dispatchEvent(t)
                },
                cachePageRef: function(e, t) {
                    var i = t.num + " " + t.gen + " R";
                    this._pagesRefCache[i] = e
                }
            },
            e
        } (),
        s = function() {
            function e() {}
            return e.prototype = {
                get page() {
                    return 0
                },
                set page(e) {},
                navigateTo: function(e) {},
                getDestinationHash: function(e) {
                    return "#"
                },
                getAnchorUrl: function(e) {
                    return "#"
                },
                setHash: function(e) {},
                executeNamedAction: function(e) {},
                cachePageRef: function(e, t) {}
            },
            e
        } ();
        e.PDFLinkService = n,
        e.SimpleLinkService = s
    }),
    function(e, t) {
        t(e.pdfjsWebPDFPageView = {},
        e.pdfjsWebUIUtils, e.pdfjsWebPDFRenderingQueue, e.pdfjsWebPDFJS)
    } (this,
    function(e, t, i, n) {
        var s = t.CSS_UNITS,
        r = t.DEFAULT_SCALE,
        o = t.getOutputScale,
        a = t.approximateFraction,
        d = t.roundToDivide,
        l = i.RenderingStates,
        h = 200,
        c = function() {
            function e(e) {
                var t = e.container,
                i = e.id,
                n = e.scale,
                s = e.defaultViewport,
                o = e.renderingQueue,
                a = e.textLayerFactory,
                d = e.annotationLayerFactory;
                this.id = i,
                this.renderingId = "page" + i,
                this.rotation = 0,
                this.scale = n || r,
                this.viewport = s,
                this.pdfPageRotate = s.rotation,
                this.hasRestrictedScaling = !1,
                this.renderingQueue = o,
                this.textLayerFactory = a,
                this.annotationLayerFactory = d,
                this.renderingState = l.INITIAL,
                this.resume = null,
                this.onBeforeDraw = null,
                this.onAfterDraw = null,
                this.textLayer = null,
                this.zoomLayer = null,
                this.annotationLayer = null;
                var h = document.createElement("div");
                h.id = "pageContainer" + this.id,
                h.className = "page",
                h.style.width = Math.floor(this.viewport.width) + "px",
                h.style.height = Math.floor(this.viewport.height) + "px",
                h.setAttribute("data-page-number", this.id),
                this.div = h,
                t.appendChild(h)
            }
            return e.prototype = {
                setPdfPage: function(e) {
                    this.pdfPage = e,
                    this.pdfPageRotate = e.rotate;
                    var t = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = e.getViewport(this.scale * s, t),
                    this.stats = e.stats,
                    this.reset()
                },
                destroy: function() {
                    this.zoomLayer = null,
                    this.reset(),
                    this.pdfPage && this.pdfPage.cleanup()
                },
                reset: function(e, t) {
                    this.renderTask && this.renderTask.cancel(),
                    this.resume = null,
                    this.renderingState = l.INITIAL;
                    var i = this.div;
                    i.style.width = Math.floor(this.viewport.width) + "px",
                    i.style.height = Math.floor(this.viewport.height) + "px";
                    for (var n = i.childNodes,
                    s = e && this.zoomLayer || null,
                    r = t && this.annotationLayer && this.annotationLayer.div || null,
                    o = n.length - 1; o >= 0; o--) {
                        var a = n[o];
                        s !== a && r !== a && i.removeChild(a)
                    }
                    i.removeAttribute("data-loaded"),
                    r ? this.annotationLayer.hide() : this.annotationLayer = null,
                    this.canvas && !s && (this.canvas.width = 0, this.canvas.height = 0, delete this.canvas),
                    this.loadingIconDiv = document.createElement("div"),
                    this.loadingIconDiv2 = document.createElement("div"),
                    this.loadingIconDiv.className = "bak_contain",
                    this.loadingIconDiv2.className = "base",
                    this.loadingIconDiv.appendChild(this.loadingIconDiv2),
                    i.appendChild(this.loadingIconDiv)
                },
                update: function(e, t) {
                    this.scale = e || this.scale,
                    "undefined" != typeof t && (this.rotation = t);
                    var i = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = this.viewport.clone({
                        scale: this.scale * s,
                        rotation: i
                    });
                    var r = !1;
                    if (this.canvas && n.PDFJS.maxCanvasPixels > 0) {
                        var o = this.outputScale;
                        this.viewport.width * this.viewport.height; (Math.floor(this.viewport.width) * o.sx | 0) * (Math.floor(this.viewport.height) * o.sy | 0) > n.PDFJS.maxCanvasPixels && (r = !0)
                    }
                    if (this.canvas) {
                        if (n.PDFJS.useOnlyCssZoom || this.hasRestrictedScaling && r) {
                            this.cssTransform(this.canvas, !0);
                            var a = document.createEvent("CustomEvent");
                            return a.initCustomEvent("pagerendered", !0, !0, {
                                pageNumber: this.id,
                                cssTransform: !0
                            }),
                            void this.div.dispatchEvent(a)
                        }
                        this.zoomLayer || (this.zoomLayer = this.canvas.parentNode, this.zoomLayer.style.position = "absolute")
                    }
                    this.zoomLayer && this.cssTransform(this.zoomLayer.firstChild),
                    this.reset(!0, !0)
                },
                updatePosition: function() {
                    this.textLayer && this.textLayer.render(h)
                },
                cssTransform: function(e, t) {
                    var i = n.CustomStyle,
                    s = this.viewport.width,
                    r = this.viewport.height,
                    o = this.div;
                    e.style.width = e.parentNode.style.width = o.style.width = Math.floor(s) + "px",
                    e.style.height = e.parentNode.style.height = o.style.height = Math.floor(r) + "px";
                    var a = this.viewport.rotation - e._viewport.rotation,
                    d = Math.abs(a),
                    l = 1,
                    h = 1;
                    90 !== d && 270 !== d || (l = r / s, h = s / r);
                    var c = "rotate(" + a + "deg) scale(" + l + "," + h + ")";
                    if (i.setProp("transform", e, c), this.textLayer) {
                        var u = this.textLayer.viewport,
                        f = this.viewport.rotation - u.rotation,
                        g = Math.abs(f),
                        p = s / u.width;
                        90 !== g && 270 !== g || (p = s / u.height);
                        var m, v, w = this.textLayer.textLayerDiv;
                        switch (g) {
                        case 0:
                            m = v = 0;
                            break;
                        case 90:
                            m = 0,
                            v = "-" + w.style.height;
                            break;
                        case 180:
                            m = "-" + w.style.width,
                            v = "-" + w.style.height;
                            break;
                        case 270:
                            m = "-" + w.style.width,
                            v = 0;
                            break;
                        default:
                            console.error("Bad rotation value.")
                        }
                        i.setProp("transform", w, "rotate(" + g + "deg) scale(" + p + ", " + p + ") translate(" + m + ", " + v + ")"),
                        i.setProp("transformOrigin", w, "0% 0%")
                    }
                    t && this.annotationLayer && this.annotationLayer.render(this.viewport, "display")
                },
                get width() {
                    return this.viewport.width
                },
                get height() {
                    return this.viewport.height
                },
                getPagePoint: function(e, t) {
                    return this.viewport.convertToPdfPoint(e, t)
                },
                draw: function() {
                    function e(e) {
                        if (T === E.renderTask && (E.renderTask = null), "cancelled" === e) return void I(e);
                        if (E.renderingState = l.FINISHED, f && (E.canvas.removeAttribute("hidden"), f = !1), E.loadingIconDiv && (E.loadingIconDiv.removeChild(E.loadingIconDiv2), r.removeChild(E.loadingIconDiv), delete E.loadingIconDiv2, delete E.loadingIconDiv, cur_page_sign && (console.log("[" + getTimeNow() + "]----------->openFile success"), cur_page_sign = !1, PDFViewerApplication.page = cur_page_num, handleChlIO.init(1))), E.zoomLayer) {
                            var i = E.zoomLayer.firstChild;
                            i.width = 0,
                            i.height = 0,
                            r.removeChild(E.zoomLayer),
                            E.zoomLayer = null
                        }
                        E.error = e,
                        E.stats = t.stats,
                        E.onAfterDraw && E.onAfterDraw();
                        var n = document.createEvent("CustomEvent");
                        n.initCustomEvent("pagerendered", !0, !0, {
                            pageNumber: E.id,
                            cssTransform: !1
                        }),
                        r.dispatchEvent(n),
                        e ? I(e) : S(void 0)
                    }
                    this.renderingState !== l.INITIAL && console.error("Must be in new state before drawing"),
                    this.renderingState = l.RUNNING;
                    var t = this.pdfPage,
                    i = this.viewport,
                    r = this.div,
                    c = document.createElement("div");
                    c.style.width = r.style.width,
                    c.style.height = r.style.height,
                    c.classList.add("canvasWrapper"),
                    document.getElementById("viewerContainer").style.height = r.style.height,
                    handleChlIO.draw(r.style.width, r.style.height);
                    var u = document.createElement("canvas");
                    u.id = "page" + this.id,
                    u.setAttribute("hidden", "hidden");
                    var f = !0;
                    c.appendChild(u),
                    this.annotationLayer && this.annotationLayer.div ? r.insertBefore(c, this.annotationLayer.div) : r.appendChild(c),
                    this.canvas = u,
                    u.mozOpaque = !0;
                    var g = u.getContext("2d", {
                        alpha: !1
                    }),
                    p = o(g);
                    if (this.outputScale = p, n.PDFJS.useOnlyCssZoom) {
                        var m = i.clone({
                            scale: s
                        });
                        p.sx *= m.width / i.width,
                        p.sy *= m.height / i.height,
                        p.scaled = !0
                    }
                    if (n.PDFJS.maxCanvasPixels > 0) {
                        var v = i.width * i.height,
                        w = Math.sqrt(n.PDFJS.maxCanvasPixels / v);
                        p.sx > w || p.sy > w ? (p.sx = w, p.sy = w, p.scaled = !0, this.hasRestrictedScaling = !0) : this.hasRestrictedScaling = !1
                    }
                    var b = a(p.sx),
                    P = a(p.sy);
                    u.width = d(i.width * p.sx, b[0]),
                    u.height = d(i.height * p.sy, P[0]),
                    u.style.width = d(i.width, b[1]) + "px",
                    u.style.height = d(i.height, P[1]) + "px",
                    u._viewport = i;
                    var y = null,
                    C = null;
                    this.textLayerFactory && (y = document.createElement("div"), y.className = "textLayer", y.style.width = c.style.width, y.style.height = c.style.height, this.annotationLayer && this.annotationLayer.div ? r.insertBefore(y, this.annotationLayer.div) : r.appendChild(y), C = this.textLayerFactory.createTextLayerBuilder(y, this.id - 1, this.viewport)),
                    this.textLayer = C;
                    var S, I, L = new Promise(function(e, t) {
                        S = e,
                        I = t
                    }),
                    E = this,
                    _ = null;
                    this.renderingQueue && (_ = function(e) {
                        return E.renderingQueue.isHighestPriority(E) ? (f && (E.canvas.removeAttribute("hidden"), f = !1), void e()) : (E.renderingState = l.PAUSED, void(E.resume = function() {
                            E.renderingState = l.RUNNING,
                            e()
                        }))
                    });
                    var F = p.scaled ? [p.sx, 0, 0, p.sy, 0, 0] : null,
                    D = {
                        canvasContext: g,
                        transform: F,
                        viewport: this.viewport
                    },
                    T = this.renderTask = this.pdfPage.render(D);
                    return T.onContinue = _,
                    this.renderTask.promise.then(function() {
                        e(null),
                        C && E.pdfPage.getTextContent({
                            normalizeWhitespace: !0
                        }).then(function(e) {
                            C.setTextContent(e),
                            C.render(h)
                        })
                    },
                    function(t) {
                        e(t)
                    }),
                    this.annotationLayerFactory && (this.annotationLayer || (this.annotationLayer = this.annotationLayerFactory.createAnnotationLayerBuilder(r, this.pdfPage)), this.annotationLayer.render(this.viewport, "display")),
                    r.setAttribute("data-loaded", !0),
                    E.onBeforeDraw && E.onBeforeDraw(),
                    L
                },
                beforePrint: function(e) {
                    var t = n.CustomStyle,
                    i = this.pdfPage,
                    s = i.getViewport(1),
                    r = 2,
                    o = document.createElement("canvas");
                    o.width = Math.floor(s.width) * r,
                    o.height = Math.floor(s.height) * r,
                    o.style.width = 100 * r + "%";
                    var a = "scale(" + 1 / r + ", " + 1 / r + ")";
                    t.setProp("transform", o, a),
                    t.setProp("transformOrigin", o, "0% 0%");
                    var d = document.createElement("div");
                    d.appendChild(o),
                    e.appendChild(d),
                    o.mozPrintCallback = function(e) {
                        var t = e.context;
                        t.save(),
                        t.fillStyle = "rgb(255, 255, 255)",
                        t.fillRect(0, 0, o.width, o.height),
                        t.restore(),
                        t._transformMatrix = [r, 0, 0, r, 0, 0],
                        t.scale(r, r);
                        var n = {
                            canvasContext: t,
                            viewport: s,
                            intent: "print"
                        };
                        i.render(n).promise.then(function() {
                            e.done()
                        },
                        function(t) {
                            console.error(t),
                            "abort" in e ? e.abort() : e.done()
                        })
                    }
                }
            },
            e
        } ();
        e.PDFPageView = c
    }),
    function(e, t) {
        t(e.pdfjsWebPDFThumbnailView = {},
        e.pdfjsWebUIUtils, e.pdfjsWebPDFRenderingQueue)
    } (this,
    function(e, t, i) {
        var n = t.mozL10n,
        s = t.getOutputScale,
        r = i.RenderingStates,
        o = 98,
        a = 1,
        d = function() {
            function e(e, i) {
                var n = t.tempImageCache;
                n || (n = document.createElement("canvas"), t.tempImageCache = n),
                n.width = e,
                n.height = i,
                n.mozOpaque = !0;
                var s = n.getContext("2d", {
                    alpha: !1
                });
                return s.save(),
                s.fillStyle = "rgb(255, 255, 255)",
                s.fillRect(0, 0, e, i),
                s.restore(),
                n
            }
            function t(e) {
                var t = e.container,
                i = e.id,
                s = e.defaultViewport,
                d = e.linkService,
                l = e.renderingQueue,
                h = e.disableCanvasToImageConversion || !1;
                this.id = i,
                this.renderingId = "thumbnail" + i,
                this.pdfPage = null,
                this.rotation = 0,
                this.viewport = s,
                this.pdfPageRotate = s.rotation,
                this.linkService = d,
                this.renderingQueue = l,
                this.resume = null,
                this.renderingState = r.INITIAL,
                this.disableCanvasToImageConversion = h,
                this.pageWidth = this.viewport.width,
                this.pageHeight = this.viewport.height,
                this.pageRatio = this.pageWidth / this.pageHeight,
                this.canvasWidth = o,
                this.canvasHeight = this.canvasWidth / this.pageRatio | 0,
                this.scale = this.canvasWidth / this.pageWidth;
                var c = document.createElement("a");
                c.href = d.getAnchorUrl("#page=" + i),
                c.title = n.get("thumb_page_title", {
                    page: i
                },
                "Page {{page}}"),
                c.onclick = function() {
                    return d.page = i,
                    !1
                };
                var u = document.createElement("div");
                u.id = "thumbnailContainer" + i,
                u.className = "thumbnail",
                this.div = u,
                1 === i && u.classList.add("selected");
                var f = document.createElement("div");
                f.className = "thumbnailSelectionRing";
                var g = 2 * a;
                f.style.width = this.canvasWidth + g + "px",
                f.style.height = this.canvasHeight + g + "px",
                this.ring = f,
                u.appendChild(f),
                c.appendChild(u),
                t.appendChild(c)
            }
            return t.prototype = {
                setPdfPage: function(e) {
                    this.pdfPage = e,
                    this.pdfPageRotate = e.rotate;
                    var t = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = e.getViewport(1, t),
                    this.reset()
                },
                reset: function() {
                    this.renderTask && this.renderTask.cancel(),
                    this.resume = null,
                    this.renderingState = r.INITIAL,
                    this.pageWidth = this.viewport.width,
                    this.pageHeight = this.viewport.height,
                    this.pageRatio = this.pageWidth / this.pageHeight,
                    this.canvasHeight = this.canvasWidth / this.pageRatio | 0,
                    this.scale = this.canvasWidth / this.pageWidth,
                    this.div.removeAttribute("data-loaded");
                    for (var e = this.ring,
                    t = e.childNodes,
                    i = t.length - 1; i >= 0; i--) e.removeChild(t[i]);
                    var n = 2 * a;
                    e.style.width = this.canvasWidth + n + "px",
                    e.style.height = this.canvasHeight + n + "px",
                    this.canvas && (this.canvas.width = 0, this.canvas.height = 0, delete this.canvas),
                    this.image && (this.image.removeAttribute("src"), delete this.image)
                },
                update: function(e) {
                    "undefined" != typeof e && (this.rotation = e);
                    var t = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = this.viewport.clone({
                        scale: 1,
                        rotation: t
                    }),
                    this.reset()
                },
                _getPageDrawContext: function(e) {
                    var t = document.createElement("canvas");
                    this.canvas = t,
                    t.mozOpaque = !0;
                    var i = t.getContext("2d", {
                        alpha: !1
                    }),
                    n = s(i);
                    return t.width = this.canvasWidth * n.sx | 0,
                    t.height = this.canvasHeight * n.sy | 0,
                    t.style.width = this.canvasWidth + "px",
                    t.style.height = this.canvasHeight + "px",
                    !e && n.scaled && i.scale(n.sx, n.sy),
                    i
                },
                _convertCanvasToImage: function() {
                    if (this.canvas && this.renderingState === r.FINISHED) {
                        var e = this.renderingId,
                        t = "thumbnailImage",
                        i = n.get("thumb_page_canvas", {
                            page: this.id
                        },
                        "Thumbnail of Page {{page}}");
                        if (this.disableCanvasToImageConversion) return this.canvas.id = e,
                        this.canvas.className = t,
                        this.canvas.setAttribute("aria-label", i),
                        this.div.setAttribute("data-loaded", !0),
                        void this.ring.appendChild(this.canvas);
                        var s = document.createElement("img");
                        s.id = e,
                        s.className = t,
                        s.setAttribute("aria-label", i),
                        s.style.width = this.canvasWidth + "px",
                        s.style.height = this.canvasHeight + "px",
                        s.src = this.canvas.toDataURL(),
                        this.image = s,
                        this.div.setAttribute("data-loaded", !0),
                        this.ring.appendChild(s),
                        this.canvas.width = 0,
                        this.canvas.height = 0,
                        delete this.canvas
                    }
                },
                draw: function() {
                    function e(e) {
                        return h === s.renderTask && (s.renderTask = null),
                        "cancelled" === e ? void i(e) : (s.renderingState = r.FINISHED, s._convertCanvasToImage(), void(e ? i(e) : t(void 0)))
                    }
                    if (this.renderingState !== r.INITIAL) return console.error("Must be in new state before drawing"),
                    Promise.resolve(void 0);
                    this.renderingState = r.RUNNING;
                    var t, i, n = new Promise(function(e, n) {
                        t = e,
                        i = n
                    }),
                    s = this,
                    o = this._getPageDrawContext(),
                    a = this.viewport.clone({
                        scale: this.scale
                    }),
                    d = function(e) {
                        return s.renderingQueue.isHighestPriority(s) ? void e() : (s.renderingState = r.PAUSED, void(s.resume = function() {
                            s.renderingState = r.RUNNING,
                            e()
                        }))
                    },
                    l = {
                        canvasContext: o,
                        viewport: a
                    },
                    h = this.renderTask = this.pdfPage.render(l);
                    return h.onContinue = d,
                    h.promise.then(function() {
                        e(null)
                    },
                    function(t) {
                        e(t)
                    }),
                    n
                },
                setImage: function(t) {
                    if (this.renderingState === r.INITIAL) {
                        var i = t.canvas;
                        if (i) {
                            this.pdfPage || this.setPdfPage(t.pdfPage),
                            this.renderingState = r.FINISHED;
                            var n = this._getPageDrawContext(!0),
                            s = n.canvas;
                            if (i.width <= 2 * s.width) return n.drawImage(i, 0, 0, i.width, i.height, 0, 0, s.width, s.height),
                            void this._convertCanvasToImage();
                            for (var o = 3,
                            a = s.width << o,
                            d = s.height << o,
                            l = e(a, d), h = l.getContext("2d"); a > i.width || d > i.height;) a >>= 1,
                            d >>= 1;
                            for (h.drawImage(i, 0, 0, i.width, i.height, 0, 0, a, d); a > 2 * s.width;) h.drawImage(l, 0, 0, a, d, 0, 0, a >> 1, d >> 1),
                            a >>= 1,
                            d >>= 1;
                            n.drawImage(l, 0, 0, a, d, 0, 0, s.width, s.height),
                            this._convertCanvasToImage()
                        }
                    }
                }
            },
            t
        } ();
        d.tempImageCache = null,
        e.PDFThumbnailView = d
    }),
    function(e, t) {
        t(e.pdfjsWebSecondaryToolbar = {},
        e.pdfjsWebUIUtils)
    } (this,
    function(e, t) {
        function i(e) {
            n = e,
            r = n.PDFViewerApplication
        }
        var n, s = t.SCROLLBAR_PADDING,
        r = null,
        o = {
            opened: !1,
            previousContainerHeight: null,
            newContainerHeight: null,
            initialize: function(e) {
                this.toolbar = e.toolbar,
                this.buttonContainer = this.toolbar.firstElementChild,
                this.toggleButton = e.toggleButton,
                this.presentationModeButton = e.presentationModeButton,
                this.openFile = e.openFile,
                this.print = e.print,
                this.download = e.download,
                this.viewBookmark = e.viewBookmark,
                this.firstPage = e.firstPage,
                this.lastPage = e.lastPage,
                this.pageRotateCw = e.pageRotateCw,
                this.pageRotateCcw = e.pageRotateCcw,
                this.documentPropertiesButton = e.documentPropertiesButton;
                var t = [{
                    element: this.toggleButton,
                    handler: this.toggle
                },
                {
                    element: this.presentationModeButton,
                    handler: this.presentationModeClick
                },
                {
                    element: this.openFile,
                    handler: this.openFileClick
                },
                {
                    element: this.print,
                    handler: this.printClick
                },
                {
                    element: this.download,
                    handler: this.downloadClick
                },
                {
                    element: this.viewBookmark,
                    handler: this.viewBookmarkClick
                },
                {
                    element: this.firstPage,
                    handler: this.firstPageClick
                },
                {
                    element: this.lastPage,
                    handler: this.lastPageClick
                },
                {
                    element: this.pageRotateCw,
                    handler: this.pageRotateCwClick
                },
                {
                    element: this.pageRotateCcw,
                    handler: this.pageRotateCcwClick
                },
                {
                    element: this.documentPropertiesButton,
                    handler: this.documentPropertiesClick
                }];
                for (var i in t) {
                    var n = t[i].element;
                    n && n.addEventListener("click", t[i].handler.bind(this))
                }
            },
            presentationModeClick: function(e) {
                r.requestPresentationMode(),
                this.close()
            },
            openFileClick: function(e) {
                var t = r.appConfig.openFileInputName;
                document.getElementById(t).click(),
                this.close()
            },
            printClick: function(e) {
                window.print(),
                this.close()
            },
            downloadClick: function(e) {
                r.download(),
                this.close()
            },
            viewBookmarkClick: function(e) {
                this.close()
            },
            firstPageClick: function(e) {
                r.page = 1,
                this.close()
            },
            lastPageClick: function(e) {
                r.pdfDocument && (r.page = r.pagesCount),
                this.close()
            },
            pageRotateCwClick: function(e) {
                r.rotatePages(90)
            },
            pageRotateCcwClick: function(e) {
                r.rotatePages( - 90)
            },
            documentPropertiesClick: function(e) {
                r.pdfDocumentProperties.open(),
                this.close()
            },
            setMaxHeight: function(e) {
                e && this.buttonContainer && (this.newContainerHeight = e.clientHeight, this.previousContainerHeight !== this.newContainerHeight && (this.buttonContainer.setAttribute("style", "max-height: " + (this.newContainerHeight - s) + "px;"), this.previousContainerHeight = this.newContainerHeight))
            },
            open: function() {
                this.opened || (this.opened = !0, this.toggleButton.classList.add("toggled"), this.toolbar.classList.remove("hidden"))
            },
            close: function(e) {
                this.opened && (e && !this.toolbar.contains(e) || (this.opened = !1, this.toolbar.classList.add("hidden"), this.toggleButton.classList.remove("toggled")))
            },
            toggle: function() {
                this.opened ? this.close() : this.open()
            }
        };
        e.SecondaryToolbar = o,
        e._setApp = i
    }),
    function(e, t) {
        t(e.pdfjsWebAnnotationLayerBuilder = {},
        e.pdfjsWebUIUtils, e.pdfjsWebPDFLinkService, e.pdfjsWebPDFJS)
    } (this,
    function(e, t, i, n) {
        function s() {}
        var r = t.mozL10n,
        o = i.SimpleLinkService,
        a = function() {
            function e(e) {
                this.pageDiv = e.pageDiv,
                this.pdfPage = e.pdfPage,
                this.linkService = e.linkService,
                this.downloadManager = e.downloadManager,
                this.div = null
            }
            return e.prototype = {
                render: function(e, t) {
                    var i = this,
                    s = {
                        intent: void 0 === t ? "display": t
                    };
                    this.pdfPage.getAnnotations(s).then(function(t) {
                        if (e = e.clone({
                            dontFlip: !0
                        }), s = {
                            viewport: e,
                            div: i.div,
                            annotations: t,
                            page: i.pdfPage,
                            linkService: i.linkService,
                            downloadManager: i.downloadManager
                        },
                        i.div) n.AnnotationLayer.update(s);
                        else {
                            if (0 === t.length) return;
                            i.div = document.createElement("div"),
                            i.div.className = "annotationLayer",
                            i.pageDiv.appendChild(i.div),
                            s.div = i.div,
                            n.AnnotationLayer.render(s),
                            "undefined" != typeof r && r.translate(i.div)
                        }
                    })
                },
                hide: function() {
                    this.div && this.div.setAttribute("hidden", "true")
                }
            },
            e
        } ();
        s.prototype = {
            createAnnotationLayerBuilder: function(e, t) {
                return new a({
                    pageDiv: e,
                    pdfPage: t,
                    linkService: new o
                })
            }
        },
        e.AnnotationLayerBuilder = a,
        e.DefaultAnnotationLayerFactory = s
    }),
    function(e, t) {
        t(e.pdfjsWebHandTool = {},
        e.pdfjsWebUIUtils, e.pdfjsWebGrabToPan, e.pdfjsWebPreferences, e.pdfjsWebSecondaryToolbar)
    } (this,
    function(e, t, i, n, s) {
        var r = t.mozL10n,
        o = i.GrabToPan,
        a = n.Preferences,
        d = s.SecondaryToolbar,
        l = function() {
            function e(e) {
                this.container = e.container,
                this.toggleHandTool = e.toggleHandTool,
                this.wasActive = !1,
                this.handTool = new o({
                    element: this.container,
                    onActiveChanged: function(e) {
                        this.toggleHandTool && (e ? (this.toggleHandTool.title = r.get("hand_tool_disable.title", null, "Disable hand tool"), this.toggleHandTool.firstElementChild.textContent = r.get("hand_tool_disable_label", null, "Disable hand tool")) : (this.toggleHandTool.title = r.get("hand_tool_enable.title", null, "Enable hand tool"), this.toggleHandTool.firstElementChild.textContent = r.get("hand_tool_enable_label", null, "Enable hand tool")))
                    }.bind(this)
                }),
                this.toggleHandTool && (this.toggleHandTool.addEventListener("click", this.toggle.bind(this)), window.addEventListener("localized",
                function(e) {
                    a.get("enableHandToolOnLoad").then(function(e) {
                        e && this.handTool.activate()
                    }.bind(this),
                    function(e) {})
                }.bind(this)), window.addEventListener("presentationmodechanged",
                function(e) {
                    e.detail.switchInProgress || (e.detail.active ? this.enterPresentationMode() : this.exitPresentationMode())
                }.bind(this)))
            }
            return e.prototype = {
                get isActive() {
                    return !! this.handTool.active
                },
                toggle: function() {
                    this.handTool.toggle(),
                    d.close()
                },
                enterPresentationMode: function() {
                    this.isActive && (this.wasActive = !0, this.handTool.deactivate())
                },
                exitPresentationMode: function() {
                    this.wasActive && (this.wasActive = !1, this.handTool.activate())
                }
            },
            e
        } ();
        e.HandTool = l
    }),
    function(e, t) {
        t(e.pdfjsWebPDFFindBar = {},
        e.pdfjsWebUIUtils, e.pdfjsWebPDFFindController)
    } (this,
    function(e, t, i) {
        var n = t.mozL10n,
        s = i.FindStates,
        r = function() {
            function e(e) {
                if (this.opened = !1, this.bar = e.bar || null, this.toggleButton = e.toggleButton || null, this.findField = e.findField || null, this.highlightAll = e.highlightAllCheckbox || null, this.caseSensitive = e.caseSensitiveCheckbox || null, this.findMsg = e.findMsg || null, this.findResultsCount = e.findResultsCount || null, this.findStatusIcon = e.findStatusIcon || null, this.findPreviousButton = e.findPreviousButton || null, this.findNextButton = e.findNextButton || null, this.findController = e.findController || null, null === this.findController) throw new Error("PDFFindBar cannot be used without a PDFFindController instance.")
            }
            return e.prototype = {
                reset: function() {
                    this.updateUIState()
                },
                dispatchEvent: function(e, t) {
                    var i = document.createEvent("CustomEvent");
                    return i.initCustomEvent("find" + e, !0, !0, {
                        query: this.findField.value,
                        caseSensitive: this.caseSensitive.checked,
                        highlightAll: this.highlightAll.checked,
                        findPrevious: t
                    }),
                    window.dispatchEvent(i)
                },
                updateUIState: function(e, t, i) {
                    var r = !1,
                    o = "",
                    a = "";
                    switch (e) {
                    case s.FIND_FOUND:
                        break;
                    case s.FIND_PENDING:
                        a = "pending";
                        break;
                    case s.FIND_NOTFOUND:
                        o = n.get("find_not_found", null, "Phrase not found"),
                        r = !0;
                        break;
                    case s.FIND_WRAPPED:
                        o = t ? n.get("find_reached_top", null, "Reached top of document, continued from bottom") : n.get("find_reached_bottom", null, "Reached end of document, continued from top")
                    }
                    r ? this.findField.classList.add("notFound") : this.findField.classList.remove("notFound"),
                    this.findField.setAttribute("data-status", a),
                    this.findMsg.textContent = o,
                    this.updateResultsCount(i)
                },
                updateResultsCount: function(e) {
                    if (this.findResultsCount) {
                        if (!e) return void this.findResultsCount.classList.add("hidden");
                        this.findResultsCount.textContent = e.toLocaleString(),
                        this.findResultsCount.classList.remove("hidden")
                    }
                },
                open: function() {
                    this.opened || (this.opened = !0, this.toggleButton.classList.add("toggled"), this.bar.classList.remove("hidden")),
                    this.findField.select(),
                    this.findField.focus()
                },
                close: function() {
                    this.opened && (this.opened = !1, this.toggleButton.classList.remove("toggled"), this.bar.classList.add("hidden"), this.findController.active = !1)
                },
                toggle: function() {
                    this.opened ? this.close() : this.open()
                }
            },
            e
        } ();
        e.PDFFindBar = r
    }),
    function(e, t) {
        t(e.pdfjsWebPDFThumbnailViewer = {},
        e.pdfjsWebUIUtils, e.pdfjsWebPDFThumbnailView)
    } (this,
    function(e, t, i) {
        var n = t.watchScroll,
        s = t.getVisibleElements,
        r = t.scrollIntoView,
        o = i.PDFThumbnailView,
        a = -19,
        d = function() {
            function e(e) {
                this.container = e.container,
                this.renderingQueue = e.renderingQueue,
                this.linkService = e.linkService,
                this.scroll = n(this.container, this._scrollUpdated.bind(this)),
                this._resetView()
            }
            return e.prototype = {
                _scrollUpdated: function() {
                    this.renderingQueue.renderHighestPriority()
                },
                getThumbnail: function(e) {
                    return this.thumbnails[e]
                },
                _getVisibleThumbs: function() {
                    return s(this.container, this.thumbnails)
                },
                scrollThumbnailIntoView: function(e) {
                    var t = document.querySelector(".thumbnail.selected");
                    t && t.classList.remove("selected");
                    var i = document.getElementById("thumbnailContainer" + e);
                    i && i.classList.add("selected");
                    var n = this._getVisibleThumbs(),
                    s = n.views.length;
                    if (s > 0) {
                        var o = n.first.id,
                        d = s > 1 ? n.last.id: o; (e <= o || e >= d) && r(i, {
                            top: a
                        })
                    }
                },
                get pagesRotation() {
                    return this._pagesRotation
                },
                set pagesRotation(e) {
                    this._pagesRotation = e;
                    for (var t = 0,
                    i = this.thumbnails.length; t < i; t++) {
                        var n = this.thumbnails[t];
                        n.update(e)
                    }
                },
                cleanup: function() {
                    var e = o.tempImageCache;
                    e && (e.width = 0, e.height = 0),
                    o.tempImageCache = null
                },
                _resetView: function() {
                    this.thumbnails = [],
                    this._pagesRotation = 0,
                    this._pagesRequests = []
                },
                setDocument: function(e) {
                    if (this.pdfDocument) {
                        for (var t = this.container; t.hasChildNodes();) t.removeChild(t.lastChild);
                        this._resetView()
                    }
                    return this.pdfDocument = e,
                    e ? e.getPage(1).then(function(t) {
                        for (var i = e.numPages,
                        n = t.getViewport(1), s = 1; s <= i; ++s) {
                            var r = new o({
                                container: this.container,
                                id: s,
                                defaultViewport: n.clone(),
                                linkService: this.linkService,
                                renderingQueue: this.renderingQueue,
                                disableCanvasToImageConversion: !1
                            });
                            this.thumbnails.push(r)
                        }
                    }.bind(this)) : Promise.resolve()
                },
                _ensurePdfPageLoaded: function(e) {
                    if (e.pdfPage) return Promise.resolve(e.pdfPage);
                    var t = e.id;
                    if (this._pagesRequests[t]) return this._pagesRequests[t];
                    var i = this.pdfDocument.getPage(t).then(function(i) {
                        return e.setPdfPage(i),
                        this._pagesRequests[t] = null,
                        i
                    }.bind(this));
                    return this._pagesRequests[t] = i,
                    i
                },
                forceRendering: function() {
                    var e = this._getVisibleThumbs(),
                    t = this.renderingQueue.getHighestPriority(e, this.thumbnails, this.scroll.down);
                    return !! t && (this._ensurePdfPageLoaded(t).then(function() {
                        this.renderingQueue.renderView(t)
                    }.bind(this)), !0)
                }
            },
            e
        } ();
        e.PDFThumbnailViewer = d
    }),
    function(e, t) {
        t(e.pdfjsWebPDFViewer = {},
        e.pdfjsWebUIUtils, e.pdfjsWebPDFPageView, e.pdfjsWebPDFRenderingQueue, e.pdfjsWebTextLayerBuilder, e.pdfjsWebAnnotationLayerBuilder, e.pdfjsWebPDFLinkService, e.pdfjsWebPDFJS)
    } (this,
    function(e, t, i, n, s, r, o, a) {
        var d = t.UNKNOWN_SCALE,
        l = t.SCROLLBAR_PADDING,
        h = t.VERTICAL_PADDING,
        c = t.MAX_AUTO_SCALE,
        u = t.CSS_UNITS,
        f = t.DEFAULT_SCALE,
        g = t.DEFAULT_SCALE_VALUE,
        p = t.scrollIntoView,
        m = t.watchScroll,
        v = t.getVisibleElements,
        w = i.PDFPageView,
        b = n.RenderingStates,
        P = n.PDFRenderingQueue,
        y = s.TextLayerBuilder,
        C = r.AnnotationLayerBuilder,
        S = o.SimpleLinkService,
        I = {
            UNKNOWN: 0,
            NORMAL: 1,
            CHANGING: 2,
            FULLSCREEN: 3
        },
        L = 10,
        E = function() {
            function e(e) {
                var t = [];
                this.push = function(i) {
                    var n = t.indexOf(i);
                    n >= 0 && t.splice(n, 1),
                    t.push(i),
                    t.length > e && t.shift().destroy()
                },
                this.resize = function(i) {
                    for (e = i; t.length > e;) t.shift().destroy()
                }
            }
            function t(e, t) {
                return t === e || Math.abs(t - e) < 1e-15
            }
            function i(e) {
                this.container = e.container,
                this.viewer = e.viewer || e.container.firstElementChild,
                this.linkService = e.linkService || new S,
                this.downloadManager = e.downloadManager || null,
                this.removePageBorders = e.removePageBorders || !1,
                this.defaultRenderingQueue = !e.renderingQueue,
                this.defaultRenderingQueue ? (this.renderingQueue = new P, this.renderingQueue.setViewer(this)) : this.renderingQueue = e.renderingQueue,
                this.scroll = m(this.container, this._scrollUpdate.bind(this)),
                this.updateInProgress = !1,
                this.presentationModeState = I.UNKNOWN,
                this._resetView(),
                this.removePageBorders && this.viewer.classList.add("removePageBorders")
            }
            return i.prototype = {
                get pagesCount() {
                    return this._pages.length
                },
                getPageView: function(e) {
                    return this._pages[e]
                },
                get currentPageNumber() {
                    return this._currentPageNumber
                },
                set currentPageNumber(e) {
                    if (!this.pdfDocument) return void(this._currentPageNumber = e);
                    var t = document.createEvent("UIEvents");
                    return t.initUIEvent("pagechange", !0, !0, window, 0),
                    t.updateInProgress = this.updateInProgress,
                    0 < e && e <= this.pagesCount ? (t.previousPageNumber = this._currentPageNumber, this._currentPageNumber = e, t.pageNumber = e, this.container.dispatchEvent(t), void(this.updateInProgress || this.scrollPageIntoView(e))) : (t.pageNumber = this._currentPageNumber, t.previousPageNumber = e, void this.container.dispatchEvent(t))
                },
                get currentScale() {
                    return this._currentScale !== d ? this._currentScale: f
                },
                set currentScale(e) {
                    if (isNaN(e)) throw new Error("Invalid numeric scale");
                    return this.pdfDocument ? void this._setScale(e, !1) : (this._currentScale = e, void(this._currentScaleValue = e !== d ? e.toString() : null))
                },
                get currentScaleValue() {
                    return this._currentScaleValue
                },
                set currentScaleValue(e) {
                    return this.pdfDocument ? void this._setScale(e, !1) : (this._currentScale = isNaN(e) ? d: e, void(this._currentScaleValue = e))
                },
                get pagesRotation() {
                    return this._pagesRotation
                },
                set pagesRotation(e) {
                    this._pagesRotation = e;
                    for (var t = 0,
                    i = this._pages.length; t < i; t++) {
                        var n = this._pages[t];
                        n.update(n.scale, e)
                    }
                    this._setScale(this._currentScaleValue, !0),
                    this.defaultRenderingQueue && this.update()
                },
                setDocument: function(e) {
                    if (this.pdfDocument && this._resetView(), this.pdfDocument = e, e) {
                        var t, i = e.numPages,
                        n = this,
                        s = new Promise(function(e) {
                            t = e
                        });
                        this.pagesPromise = s,
                        s.then(function() {
                            var e = document.createEvent("CustomEvent");
                            e.initCustomEvent("pagesloaded", !0, !0, {
                                pagesCount: i
                            }),
                            n.container.dispatchEvent(e)
                        });
                        var r = !1,
                        o = null,
                        d = new Promise(function(e) {
                            o = e
                        });
                        this.onePageRendered = d;
                        var l = function(e) {
                            e.onBeforeDraw = function() {
                                n._buffer.push(this)
                            },
                            e.onAfterDraw = function() {
                                r || (r = !0, o())
                            }
                        },
                        h = e.getPage(1);
                        return this.firstPagePromise = h,
                        h.then(function(s) {
                            for (var r = this.currentScale,
                            o = s.getViewport(r * u), h = 1; h <= i; ++h) {
                                var c = null;
                                a.PDFJS.disableTextLayer || (c = this);
                                var f = new w({
                                    container: this.viewer,
                                    id: h,
                                    scale: r,
                                    defaultViewport: o.clone(),
                                    renderingQueue: this.renderingQueue,
                                    textLayerFactory: c,
                                    annotationLayerFactory: this
                                });
                                l(f),
                                this._pages.push(f)
                            }
                            var g = this.linkService;
                            d.then(function() {
                                if (a.PDFJS.disableAutoFetch) t();
                                else for (var s = i,
                                r = 1; r <= i; ++r) e.getPage(r).then(function(e, i) {
                                    var r = n._pages[e - 1];
                                    r.pdfPage || r.setPdfPage(i),
                                    g.cachePageRef(e, i.ref),
                                    s--,
                                    s || t()
                                }.bind(null, r))
                            });
                            var p = document.createEvent("CustomEvent");
                            p.initCustomEvent("pagesinit", !0, !0, null),
                            n.container.dispatchEvent(p),
                            this.defaultRenderingQueue && this.update(),
                            this.findController && this.findController.resolveFirstPage()
                        }.bind(this))
                    }
                },
                _resetView: function() {
                    this._pages = [],
                    this._currentPageNumber = 1,
                    this._currentScale = d,
                    this._currentScaleValue = null,
                    this._buffer = new e(L),
                    this._location = null,
                    this._pagesRotation = 0,
                    this._pagesRequests = [];
                    for (var t = this.viewer; t.hasChildNodes();) t.removeChild(t.lastChild)
                },
                _scrollUpdate: function() {
                    if (0 !== this.pagesCount) {
                        this.update();
                        for (var e = 0,
                        t = this._pages.length; e < t; e++) this._pages[e].updatePosition()
                    }
                },
                _setScaleDispatchEvent: function(e, t, i) {
                    var n = document.createEvent("UIEvents");
                    n.initUIEvent("scalechange", !0, !0, window, 0),
                    n.scale = e,
                    i && (n.presetValue = t),
                    this.container.dispatchEvent(n)
                },
                _setScaleUpdatePages: function(e, i, n, s) {
                    if (this._currentScaleValue = i, t(this._currentScale, e)) return void(s && this._setScaleDispatchEvent(e, i, !0));
                    for (var r = 0,
                    o = this._pages.length; r < o; r++) this._pages[r].update(e);
                    if (this._currentScale = e, !n) {
                        var d, l = this._currentPageNumber; ! this._location || a.PDFJS.ignoreCurrentPositionOnZoom || this.isInPresentationMode || this.isChangingPresentationMode || (l = this._location.pageNumber, d = [null, {
                            name: "XYZ"
                        },
                        this._location.left, this._location.top, null]),
                        this.scrollPageIntoView(l, d)
                    }
                    this._setScaleDispatchEvent(e, i, s),
                    this.defaultRenderingQueue && this.update()
                },
                _setScale: function(e, t) {
                    var i = parseFloat(e);
                    if (i > 0) this._setScaleUpdatePages(i, e, t, !1);
                    else {
                        var n = this._pages[this._currentPageNumber - 1];
                        if (!n) return;
                        var s = this.isInPresentationMode || this.removePageBorders ? 0 : l,
                        r = this.isInPresentationMode || this.removePageBorders ? 0 : h,
                        o = (this.container.clientWidth - s) / n.width * n.scale,
                        a = (this.container.clientHeight - r) / n.height * n.scale;
                        switch (e) {
                        case "page-actual":
                            i = 1;
                            break;
                        case "page-width":
                            i = o;
                            break;
                        case "page-height":
                            i = a;
                            break;
                        case "page-fit":
                            i = Math.min(o, a);
                            break;
                        case "auto":
                            var d = n.width > n.height,
                            u = d ? Math.min(a, o) : o;
                            i = Math.min(c, u);
                            break;
                        default:
                            return void console.error("pdfViewSetScale: '" + e + "' is an unknown zoom value.")
                        }
                        this._setScaleUpdatePages(i, e, t, !0)
                    }
                },
                scrollPageIntoView: function(e, t) {
                    if (this.pdfDocument) {
                        var i = this._pages[e - 1];
                        if (this.isInPresentationMode) {
                            if (this._currentPageNumber !== i.id) return void(this.currentPageNumber = i.id);
                            t = null,
                            this._setScale(this._currentScaleValue, !0)
                        }
                        if (!t) return void p(i.div);
                        var n, s, r = 0,
                        o = 0,
                        a = 0,
                        c = 0,
                        f = i.rotation % 180 !== 0,
                        m = (f ? i.height: i.width) / i.scale / u,
                        v = (f ? i.width: i.height) / i.scale / u,
                        w = 0;
                        switch (t[1].name) {
                        case "XYZ":
                            r = t[2],
                            o = t[3],
                            w = t[4],
                            r = null !== r ? r: 0,
                            o = null !== o ? o: v;
                            break;
                        case "Fit":
                        case "FitB":
                            w = "page-fit";
                            break;
                        case "FitH":
                        case "FitBH":
                            o = t[2],
                            w = "page-width",
                            null === o && this._location && (r = this._location.left, o = this._location.top);
                            break;
                        case "FitV":
                        case "FitBV":
                            r = t[2],
                            a = m,
                            c = v,
                            w = "page-height";
                            break;
                        case "FitR":
                            r = t[2],
                            o = t[3],
                            a = t[4] - r,
                            c = t[5] - o;
                            var b = this.removePageBorders ? 0 : l,
                            P = this.removePageBorders ? 0 : h;
                            n = (this.container.clientWidth - b) / a / u,
                            s = (this.container.clientHeight - P) / c / u,
                            w = Math.min(Math.abs(n), Math.abs(s));
                            break;
                        default:
                            return
                        }
                        if (w && w !== this._currentScale ? this.currentScaleValue = w: this._currentScale === d && (this.currentScaleValue = g), "page-fit" === w && !t[4]) return void p(i.div);
                        var y = [i.viewport.convertToViewportPoint(r, o), i.viewport.convertToViewportPoint(r + a, o + c)],
                        C = Math.min(y[0][0], y[1][0]),
                        S = Math.min(y[0][1], y[1][1]);
                        p(i.div, {
                            left: C,
                            top: S
                        })
                    }
                },
                _updateLocation: function(e) {
                    var t = this._currentScale,
                    i = this._currentScaleValue,
                    n = parseFloat(i) === t ? Math.round(1e4 * t) / 100 : i,
                    s = e.id,
                    r = "#page=" + s;
                    r += "&zoom=" + n;
                    var o = this._pages[s - 1],
                    a = this.container,
                    d = o.getPagePoint(a.scrollLeft - e.x, a.scrollTop - e.y),
                    l = Math.round(d[0]),
                    h = Math.round(d[1]);
                    r += "," + l + "," + h,
                    this._location = {
                        pageNumber: s,
                        scale: n,
                        top: h,
                        left: l,
                        pdfOpenParams: r
                    }
                },
                update: function() {
                    var e = this._getVisiblePages(),
                    t = e.views;
                    if (0 !== t.length) {
                        this.updateInProgress = !0;
                        var i = Math.max(L, 2 * t.length + 1);
                        this._buffer.resize(i),
                        this.renderingQueue.renderHighestPriority(e);
                        for (var n = this._currentPageNumber,
                        s = e.first,
                        r = 0,
                        o = t.length,
                        a = !1; r < o; ++r) {
                            var d = t[r];
                            if (d.percent < 100) break;
                            if (d.id === n) {
                                a = !0;
                                break
                            }
                        }
                        a || (n = t[0].id),
                        this.isInPresentationMode || (this.currentPageNumber = n),
                        this._updateLocation(s),
                        this.updateInProgress = !1;
                        var l = document.createEvent("UIEvents");
                        l.initUIEvent("updateviewarea", !0, !0, window, 0),
                        l.location = this._location,
                        this.container.dispatchEvent(l)
                    }
                },
                containsElement: function(e) {
                    return this.container.contains(e)
                },
                focus: function() {
                    this.container.focus()
                },
                get isInPresentationMode() {
                    return this.presentationModeState === I.FULLSCREEN
                },
                get isChangingPresentationMode() {
                    return this.presentationModeState === I.CHANGING
                },
                get isHorizontalScrollbarEnabled() {
                    return ! this.isInPresentationMode && this.container.scrollWidth > this.container.clientWidth
                },
                _getVisiblePages: function() {
                    if (this.isInPresentationMode) {
                        var e = [],
                        t = this._pages[this._currentPageNumber - 1];
                        return e.push({
                            id: t.id,
                            view: t
                        }),
                        {
                            first: t,
                            last: t,
                            views: e
                        }
                    }
                    return v(this.container, this._pages, !0)
                },
                cleanup: function() {
                    for (var e = 0,
                    t = this._pages.length; e < t; e++) this._pages[e] && this._pages[e].renderingState !== b.FINISHED && this._pages[e].reset()
                },
                _ensurePdfPageLoaded: function(e) {
                    if (e.pdfPage) return Promise.resolve(e.pdfPage);
                    var t = e.id;
                    if (this._pagesRequests[t]) return this._pagesRequests[t];
                    var i = this.pdfDocument.getPage(t).then(function(i) {
                        return e.setPdfPage(i),
                        this._pagesRequests[t] = null,
                        i
                    }.bind(this));
                    return this._pagesRequests[t] = i,
                    i
                },
                forceRendering: function(e) {
                    var t = e || this._getVisiblePages(),
                    i = this.renderingQueue.getHighestPriority(t, this._pages, this.scroll.down);
                    return !! i && (this._ensurePdfPageLoaded(i).then(function() {
                        this.renderingQueue.renderView(i)
                    }.bind(this)), !0)
                },
                getPageTextContent: function(e) {
                    return this.pdfDocument.getPage(e + 1).then(function(e) {
                        return e.getTextContent({
                            normalizeWhitespace: !0
                        })
                    })
                },
                createTextLayerBuilder: function(e, t, i) {
                    return new y({
                        textLayerDiv: e,
                        pageIndex: t,
                        viewport: i,
                        findController: this.isInPresentationMode ? null: this.findController
                    })
                },
                createAnnotationLayerBuilder: function(e, t) {
                    return new C({
                        pageDiv: e,
                        pdfPage: t,
                        linkService: this.linkService,
                        downloadManager: this.downloadManager
                    })
                },
                setFindController: function(e) {
                    this.findController = e
                }
            },
            i
        } ();
        e.PresentationModeState = I,
        e.PDFViewer = E
    }),
    function(e, t) {
        t(e.pdfjsWebApp = {},
        e.pdfjsWebUIUtils, e.pdfjsWebFirefoxCom, e.pdfjsWebDownloadManager, e.pdfjsWebPDFHistory, e.pdfjsWebPreferences, e.pdfjsWebPDFSidebar, e.pdfjsWebViewHistory, e.pdfjsWebPDFThumbnailViewer, e.pdfjsWebSecondaryToolbar, e.pdfjsWebPasswordPrompt, e.pdfjsWebPDFPresentationMode, e.pdfjsWebPDFDocumentProperties, e.pdfjsWebHandTool, e.pdfjsWebPDFViewer, e.pdfjsWebPDFRenderingQueue, e.pdfjsWebPDFLinkService, e.pdfjsWebPDFOutlineViewer, e.pdfjsWebOverlayManager, e.pdfjsWebPDFAttachmentViewer, e.pdfjsWebPDFFindController, e.pdfjsWebPDFFindBar, e.pdfjsWebMozPrintCallbackPolyfill, e.pdfjsWebPDFJS)
    } (this,
    function(e, t, i, n, s, r, o, a, d, l, h, c, u, f, g, p, m, v, w, b, P, y, C, S) {
        function I(e) {
            e.imageResourcesPath = "./web/images/",
            e.workerSrc = "./build/pdf.worker.min.js",
            e.cMapUrl = "./web/cmaps/",
            e.cMapPacked = !0
        }
        function L(e) {
            try {
                var t = new URL(window.location.href).origin || "null";
                if (ue.indexOf(t) >= 0) return;
                var i = new URL(e, window.location.href).origin;
                if (i !== t) throw new Error("file origin does not match viewer's")
            } catch(e) {
                var n = e && e.message,
                s = V.get("loading_error", null, "An error occurred while loading the PDF."),
                r = {
                    message: n
                };
                throw ce.error(s, r),
                e
            }
        }
        function E() {
            var e = document.location.search.substring(1),
            t = N(e),
            i = "file" in t ? t.file: DEFAULT_URL;
            L(i);
            var n = ce.appConfig,
            s = document.createElement("input");
            s.id = n.openFileInputName,
            s.className = "fileInput",
            s.setAttribute("type", "file"),
            s.oncontextmenu = B,
            document.body.appendChild(s),
            window.File && window.FileReader && window.FileList && window.Blob ? s.value = null: (n.toolbar.openFile.setAttribute("hidden", "true"), n.secondaryToolbar.openFile.setAttribute("hidden", "true"));
            var r = S.PDFJS;
            if (ce.preferencePdfBugEnabled) {
                var o = document.location.hash.substring(1),
                a = N(o);
                if ("disableworker" in a && (r.disableWorker = "true" === a.disableworker), "disablerange" in a && (r.disableRange = "true" === a.disablerange), "disablestream" in a && (r.disableStream = "true" === a.disablestream), "disableautofetch" in a && (r.disableAutoFetch = "true" === a.disableautofetch), "disablefontface" in a && (r.disableFontFace = "true" === a.disablefontface), "disablehistory" in a && (r.disableHistory = "true" === a.disablehistory), "webgl" in a && (r.disableWebGL = "true" !== a.webgl), "useonlycsszoom" in a && (r.useOnlyCssZoom = "true" === a.useonlycsszoom), "verbosity" in a && (r.verbosity = 0 | a.verbosity), "ignorecurrentpositiononzoom" in a && (r.ignoreCurrentPositionOnZoom = "true" === a.ignorecurrentpositiononzoom), "locale" in a && (r.locale = a.locale), "textlayer" in a) switch (a.textlayer) {
                case "off":
                    r.disableTextLayer = !0;
                    break;
                case "visible":
                case "shadow":
                case "hover":
                    var d = n.viewerContainer;
                    d.classList.add("textLayer-" + a.textlayer)
                }
                if ("pdfbug" in a) {
                    r.pdfBug = !0;
                    var l = a.pdfbug,
                    h = l.split(",");
                    PDFBug.enable(h),
                    PDFBug.init(S, n.mainContainer)
                }
            }
            if (V.setLanguage(r.locale), ce.supportsPrinting || (n.toolbar.print.classList.add("hidden"), n.secondaryToolbar.print.classList.add("hidden")), ce.supportsFullscreen || (n.toolbar.presentationModeButton.classList.add("hidden"), n.secondaryToolbar.presentationModeButton.classList.add("hidden")), ce.supportsIntegratedFind && n.toolbar.viewFind.classList.add("hidden"), i && 0 === i.lastIndexOf("file:", 0)) {
                ce.setTitleUsingUrl(i);
                var c = new XMLHttpRequest;
                c.onload = function() {
                    ce.open(new Uint8Array(c.response))
                };
                try {
                    c.open("GET", i),
                    c.responseType = "arraybuffer",
                    c.send()
                } catch(e) {
                    ce.error(V.get("loading_error", null, "An error occurred while loading the PDF."), e)
                }
            } else i && ce.open(i)
        }
        function _(e) {
            for (var t = ce.appConfig.toolbar.scaleSelect.options,
            i = !1,
            n = 0,
            s = t.length; n < s; n++) {
                var r = t[n];
                r.value === e ? (r.selected = !0, i = !0) : r.selected = !1
            }
            return i
        }
        function F(e) {}
        var D = (i.FirefoxCom, t.UNKNOWN_SCALE),
        T = t.DEFAULT_SCALE_VALUE,
        k = t.ProgressBar,
        x = t.getPDFFileNameFromURL,
        B = t.noContextMenuHandler,
        V = t.mozL10n,
        N = t.parseQueryString,
        M = n.DownloadManager || i.DownloadManager,
        R = s.PDFHistory,
        A = r.Preferences,
        O = o.SidebarView,
        j = o.PDFSidebar,
        U = a.ViewHistory,
        H = d.PDFThumbnailViewer,
        W = l.SecondaryToolbar,
        z = h.PasswordPrompt,
        q = c.PDFPresentationMode,
        Q = u.PDFDocumentProperties,
        G = f.HandTool,
        J = g.PresentationModeState,
        Z = g.PDFViewer,
        Y = p.RenderingStates,
        K = p.PDFRenderingQueue,
        X = m.PDFLinkService,
        $ = v.PDFOutlineViewer,
        ee = w.OverlayManager,
        te = b.PDFAttachmentViewer,
        ie = P.PDFFindController,
        ne = y.PDFFindBar,
        se = 1.1,
        re = .25,
        oe = 10,
        ae = 8,
        de = 22,
        le = "visiblePageIsLoading",
        he = 5e3,
        ce = {
            initialBookmark: document.location.hash.substring(1),
            initialDestination: null,
            initialized: !1,
            fellback: !1,
            appConfig: null,
            pdfDocument: null,
            pdfLoadingTask: null,
            printing: !1,
            pdfViewer: null,
            pdfThumbnailViewer: null,
            pdfRenderingQueue: null,
            pdfPresentationMode: null,
            pdfDocumentProperties: null,
            pdfLinkService: null,
            pdfHistory: null,
            pdfSidebar: null,
            pdfOutlineViewer: null,
            pdfAttachmentViewer: null,
            store: null,
            pageRotation: 0,
            isInitialViewSet: !1,
            animationStartedPromise: null,
            preferenceSidebarViewOnLoad: O.NONE,
            preferencePdfBugEnabled: !1,
            preferenceShowPreviousViewOnLoad: !0,
            preferenceDefaultZoomValue: "",
            isViewerEmbedded: window.parent !== window,
            url: "",
            initialize: function(e) {
                I(S.PDFJS),
                this.appConfig = e;
                var t = new K;
                t.onIdle = this.cleanup.bind(this),
                this.pdfRenderingQueue = t;
                var i = new X;
                this.pdfLinkService = i;
                var n = e.mainContainer,
                s = e.viewerContainer;
                this.pdfViewer = new Z({
                    container: n,
                    viewer: s,
                    renderingQueue: t,
                    linkService: i,
                    downloadManager: new M
                }),
                t.setViewer(this.pdfViewer),
                i.setViewer(this.pdfViewer);
                var r = e.sidebar.thumbnailView;
                this.pdfThumbnailViewer = new H({
                    container: r,
                    renderingQueue: t,
                    linkService: i
                }),
                t.setThumbnailViewer(this.pdfThumbnailViewer),
                A.initialize(),
                this.preferences = A,
                this.pdfHistory = new R({
                    linkService: i
                }),
                i.setHistory(this.pdfHistory),
                this.findController = new ie({
                    pdfViewer: this.pdfViewer,
                    integratedFind: this.supportsIntegratedFind
                }),
                this.pdfViewer.setFindController(this.findController);
                var o = Object.create(e.findBar);
                if (o.findController = this.findController, this.findBar = new ne(o), this.findController.setFindBar(this.findBar), this.overlayManager = ee, this.handTool = new G({
                    container: n,
                    toggleHandTool: e.secondaryToolbar.toggleHandTool
                }), this.pdfDocumentProperties = new Q(e.documentProperties), W.initialize(e.secondaryToolbar), this.secondaryToolbar = W, this.supportsFullscreen) {
                    var a = W;
                    this.pdfPresentationMode = new q({
                        container: n,
                        viewer: s,
                        pdfViewer: this.pdfViewer,
                        contextMenuItems: [{
                            element: e.fullscreen.contextFirstPage,
                            handler: a.firstPageClick.bind(a)
                        },
                        {
                            element: e.fullscreen.contextLastPage,
                            handler: a.lastPageClick.bind(a)
                        },
                        {
                            element: e.fullscreen.contextPageRotateCw,
                            handler: a.pageRotateCwClick.bind(a)
                        },
                        {
                            element: e.fullscreen.contextPageRotateCcw,
                            handler: a.pageRotateCcwClick.bind(a)
                        }]
                    })
                }
                this.passwordPrompt = new z(e.passwordOverlay),
                this.pdfOutlineViewer = new $({
                    container: e.sidebar.outlineView,
                    linkService: i
                }),
                this.pdfAttachmentViewer = new te({
                    container: e.sidebar.attachmentsView,
                    downloadManager: new M
                });
                var d = Object.create(e.sidebar);
                d.pdfViewer = this.pdfViewer,
                d.pdfThumbnailViewer = this.pdfThumbnailViewer,
                d.pdfOutlineViewer = this.pdfOutlineViewer,
                this.pdfSidebar = new j(d),
                this.pdfSidebar.onToggled = this.forceRendering.bind(this);
                var l = this,
                h = S.PDFJS,
                c = Promise.all([A.get("enableWebGL").then(function(e) {
                    h.disableWebGL = !e
                }), A.get("sidebarViewOnLoad").then(function(e) {
                    l.preferenceSidebarViewOnLoad = e
                }), A.get("pdfBugEnabled").then(function(e) {
                    l.preferencePdfBugEnabled = e
                }), A.get("showPreviousViewOnLoad").then(function(e) {
                    l.preferenceShowPreviousViewOnLoad = e
                }), A.get("defaultZoomValue").then(function(e) {
                    l.preferenceDefaultZoomValue = e
                }), A.get("disableTextLayer").then(function(e) {
                    h.disableTextLayer !== !0 && (h.disableTextLayer = e)
                }), A.get("disableRange").then(function(e) {
                    h.disableRange !== !0 && (h.disableRange = e)
                }), A.get("disableStream").then(function(e) {
                    h.disableStream !== !0 && (h.disableStream = e)
                }), A.get("disableAutoFetch").then(function(e) {
                    h.disableAutoFetch = e
                }), A.get("disableFontFace").then(function(e) {
                    h.disableFontFace !== !0 && (h.disableFontFace = e)
                }), A.get("useOnlyCssZoom").then(function(e) {
                    h.useOnlyCssZoom = e
                }), A.get("externalLinkTarget").then(function(e) {
                    h.isExternalLinkTargetSet() || (h.externalLinkTarget = e)
                })]).
                catch(function(e) {});
                return c.then(function() {
                    l.isViewerEmbedded && !h.isExternalLinkTargetSet() && (h.externalLinkTarget = h.LinkTarget.TOP),
                    l.initialized = !0
                })
            },
            run: function(e) {
                this.initialize(e).then(E)
            },
            zoomIn: function(e) {
                var t = this.pdfViewer.currentScale;
                do t = (t * se).toFixed(2),
                t = Math.ceil(10 * t) / 10,
                t = Math.min(oe, t);
                while (--e > 0 && t < oe);
                this.pdfViewer.currentScaleValue = t
            },
            zoomOut: function(e) {
                var t = this.pdfViewer.currentScale;
                do t = (t / se).toFixed(2),
                t = Math.floor(10 * t) / 10,
                t = Math.max(re, t);
                while (--e > 0 && t > re);
                this.pdfViewer.currentScaleValue = t
            },
            get pagesCount() {
                return this.pdfDocument.numPages
            },
            set page(e) {
                this.pdfLinkService.page = e
            },
            get page() {
                return this.pdfLinkService.page
            },
            get supportsPrinting() {
                var e = document.createElement("canvas"),
                t = "mozPrintCallback" in e;
                return S.shadow(this, "supportsPrinting", t)
            },
            get supportsFullscreen() {
                var e = document.documentElement,
                t = !!(e.requestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullScreen || e.msRequestFullscreen);
                return document.fullscreenEnabled !== !1 && document.mozFullScreenEnabled !== !1 && document.webkitFullscreenEnabled !== !1 && document.msFullscreenEnabled !== !1 || (t = !1),
                t && S.PDFJS.disableFullscreen === !0 && (t = !1),
                S.shadow(this, "supportsFullscreen", t)
            },
            get supportsIntegratedFind() {
                var e = !1;
                return S.shadow(this, "supportsIntegratedFind", e)
            },
            get supportsDocumentFonts() {
                var e = !0;
                return S.shadow(this, "supportsDocumentFonts", e)
            },
            get supportsDocumentColors() {
                var e = !0;
                return S.shadow(this, "supportsDocumentColors", e)
            },
            get loadingBar() {
                var e = new k("#loadingBar", {});
                return S.shadow(this, "loadingBar", e)
            },
            get supportedMouseWheelZoomModifierKeys() {
                var e = {
                    ctrlKey: !0,
                    metaKey: !0
                };
                return S.shadow(this, "supportedMouseWheelZoomModifierKeys", e)
            },
            setTitleUsingUrl: function(e) {
                this.url = e;
                try {
                    this.setTitle(decodeURIComponent(S.getFilenameFromUrl(e)) || e)
                } catch(t) {
                    this.setTitle(e)
                }
            },
            setTitle: function(e) {
                this.isViewerEmbedded || (document.title = e)
            },
            close: function() {
                var e = this.appConfig.errorWrapper.container;
                if (e.setAttribute("hidden", "true"), !this.pdfLoadingTask) return Promise.resolve();
                var t = this.pdfLoadingTask.destroy();
                return this.pdfLoadingTask = null,
                this.pdfDocument && (this.pdfDocument = null, this.pdfThumbnailViewer.setDocument(null), this.pdfViewer.setDocument(null), this.pdfLinkService.setDocument(null, null)),
                this.store = null,
                this.isInitialViewSet = !1,
                this.pdfSidebar.reset(),
                this.pdfOutlineViewer.reset(),
                this.pdfAttachmentViewer.reset(),
                this.findController.reset(),
                this.findBar.reset(),
                "undefined" != typeof PDFBug && PDFBug.cleanup(),
                t
            },
            open: function(e, t) {
                var i = 0;
                if ((arguments.length > 2 || "number" == typeof t) && (console.warn("Call of open() with obsolete signature."), "number" == typeof t && (i = t), t = arguments[4] || null, arguments[3] && "object" == typeof arguments[3] && (t = Object.create(t), t.range = arguments[3]), "string" == typeof arguments[2] && (t = Object.create(t), t.password = arguments[2])), this.pdfLoadingTask) return this.close().then(function() {
                    return A.reload(),
                    this.open(e, t)
                }.bind(this));
                var n = Object.create(null);
                if ("string" == typeof e ? (this.setTitleUsingUrl(e), n.url = e) : e && "byteLength" in e ? n.data = e: e.url && e.originalUrl && (this.setTitleUsingUrl(e.originalUrl), n.url = e.url), t) for (var s in t) n[s] = t[s];
                var r = this;
                r.downloadComplete = !1;
                var o = S.getDocument(n);
                this.pdfLoadingTask = o,
                o.onPassword = function(e, t) {
                    r.passwordPrompt.setUpdateCallback(e, t),
                    r.passwordPrompt.open()
                },
                o.onProgress = function(e) {
                    r.progress(e.loaded / e.total)
                },
                o.onUnsupportedFeature = this.fallback.bind(this);
                var a = o.promise.then(function(e) {
                    r.load(e, i)
                },
                function(e) {
                    var t = e && e.message,
                    i = V.get("loading_error", null, "An error occurred while loading the PDF.");
                    e instanceof S.InvalidPDFException ? i = V.get("invalid_file_error", null, "Invalid or corrupted PDF file.") : e instanceof S.MissingPDFException ? i = V.get("missing_file_error", null, "Missing PDF file.") : e instanceof S.UnexpectedResponseException && (i = V.get("unexpected_response_error", null, "Unexpected server response.")),
                    console.error("[" + getTimeNow() + "]----------->load pdf error :" + t),
                    1 === cur_page_num && handleChlIO.loadError("error");
                    var n = {
                        message: t
                    };
                    throw r.error(i, n),
                    new Error(i)
                });
                return t && t.length && ce.pdfDocumentProperties.setFileSize(t.length),
                a
            },
            download: function() {
                function e() {
                    n.downloadUrl(t, i)
                }
                var t = this.url.split("#")[0],
                i = x(t),
                n = new M;
                return n.onerror = function(e) {
                    ce.error("PDF failed to download.")
                },
                this.pdfDocument && this.downloadComplete ? void this.pdfDocument.getData().then(function(e) {
                    var s = S.createBlob(e, "application/pdf");
                    n.download(s, t, i)
                },
                e).then(null, e) : void e()
            },
            fallback: function(e) {},
            error: function(e, t) {
                var i = V.get("error_version_info", {
                    version: S.version || "?",
                    build: S.build || "?"
                },
                "PDF.js v{{version}} (build: {{build}})") + "\n";
                t && (i += V.get("error_message", {
                    message: t.message
                },
                "Message: {{message}}"), t.stack ? i += "\n" + V.get("error_stack", {
                    stack: t.stack
                },
                "Stack: {{stack}}") : (t.filename && (i += "\n" + V.get("error_file", {
                    file: t.filename
                },
                "File: {{file}}")), t.lineNumber && (i += "\n" + V.get("error_line", {
                    line: t.lineNumber
                },
                "Line: {{line}}"))));
                var n = this.appConfig.errorWrapper,
                s = n.container;
                s.removeAttribute("hidden");
                var r = n.errorMessage;
                r.textContent = e;
                var o = n.closeButton;
                o.onclick = function() {
                    s.setAttribute("hidden", "true")
                };
                var a = n.errorMoreInfo,
                d = n.moreInfoButton,
                l = n.lessInfoButton;
                d.onclick = function() {
                    a.removeAttribute("hidden"),
                    d.setAttribute("hidden", "true"),
                    l.removeAttribute("hidden"),
                    a.style.height = a.scrollHeight + "px"
                },
                l.onclick = function() {
                    a.setAttribute("hidden", "true"),
                    d.removeAttribute("hidden"),
                    l.setAttribute("hidden", "true")
                },
                d.oncontextmenu = B,
                l.oncontextmenu = B,
                o.oncontextmenu = B,
                d.removeAttribute("hidden"),
                l.setAttribute("hidden", "true"),
                a.value = i
            },
            progress: function(e) {
                var t = Math.round(100 * e); (t > this.loadingBar.percent || isNaN(t)) && (this.loadingBar.percent = t, S.PDFJS.disableAutoFetch && t && (this.disableAutoFetchLoadingBarTimeout && (clearTimeout(this.disableAutoFetchLoadingBarTimeout), this.disableAutoFetchLoadingBarTimeout = null), this.loadingBar.show(), this.disableAutoFetchLoadingBarTimeout = setTimeout(function() {
                    this.loadingBar.hide(),
                    this.disableAutoFetchLoadingBarTimeout = null
                }.bind(this), he)))
            },
            load: function(e, t) {
                var i = this;
                t = t || D,
                this.pdfDocument = e,
                this.pdfDocumentProperties.setDocumentAndUrl(e, this.url);
                var n = e.getDownloadInfo().then(function() {
                    i.downloadComplete = !0,
                    i.loadingBar.hide()
                }),
                s = e.numPages,
                r = this.appConfig.toolbar;
                r.numPages.textContent = V.get("page_of", {
                    pageCount: s
                },
                "of {{pageCount}}"),
                r.pageNumber.max = s;
                var o = this.documentFingerprint = e.fingerprint,
                a = this.store = new U(o),
                d = null;
                this.pdfLinkService.setDocument(e, d);
                var l = this.pdfViewer;
                l.currentScale = t,
                l.setDocument(e);
                var h = l.firstPagePromise,
                c = l.pagesPromise;
                l.onePageRendered;
                this.pageRotation = 0,
                this.pdfThumbnailViewer.setDocument(e),
                h.then(function(e) {
                    n.then(function() {
                        var e = document.createEvent("CustomEvent");
                        e.initCustomEvent("documentload", !0, !0, {}),
                        window.dispatchEvent(e)
                    }),
                    i.loadingBar.setWidth(i.appConfig.viewerContainer),
                    S.PDFJS.disableHistory || i.isViewerEmbedded || (i.preferenceShowPreviousViewOnLoad || i.pdfHistory.clearHistoryState(), i.pdfHistory.initialize(i.documentFingerprint), i.pdfHistory.initialDestination ? i.initialDestination = i.pdfHistory.initialDestination: i.pdfHistory.initialBookmark && (i.initialBookmark = i.pdfHistory.initialBookmark));
                    var s = {
                        destination: i.initialDestination,
                        bookmark: i.initialBookmark,
                        hash: null
                    };
                    a.initializedPromise.then(function() {
                        var e = null,
                        n = null;
                        if (i.preferenceShowPreviousViewOnLoad && a.get("exists", !1)) {
                            var r = a.get("page", "1"),
                            o = i.preferenceDefaultZoomValue || a.get("zoom", T),
                            d = a.get("scrollLeft", "0"),
                            l = a.get("scrollTop", "0");
                            e = "page=" + r + "&zoom=" + o + "," + d + "," + l,
                            n = a.get("sidebarView", O.NONE)
                        } else i.preferenceDefaultZoomValue && (e = "page=1&zoom=" + i.preferenceDefaultZoomValue);
                        i.setInitialView(e, {
                            scale: t,
                            sidebarView: n
                        }),
                        s.hash = e,
                        i.isViewerEmbedded || i.pdfViewer.focus()
                    },
                    function(e) {
                        console.error(e),
                        i.setInitialView(null, {
                            scale: t
                        })
                    }),
                    c.then(function() { (s.destination || s.bookmark || s.hash) && (i.hasEqualPageSizes || (i.initialDestination = s.destination, i.initialBookmark = s.bookmark, i.pdfViewer.currentScaleValue = i.pdfViewer.currentScaleValue, i.setInitialView(s.hash)))
                    })
                }),
                c.then(function() {
                    i.supportsPrinting && e.getJavaScript().then(function(e) {
                        e.length && (console.warn("Warning: JavaScript is not supported"), i.fallback(S.UNSUPPORTED_FEATURES.javaScript));
                        for (var t = /\bprint\s*\(/,
                        n = 0,
                        s = e.length; n < s; n++) {
                            var r = e[n];
                            if (r && t.test(r)) return void setTimeout(function() {
                                window.print()
                            })
                        }
                    })
                });
                var u = [c, this.animationStartedPromise];
                Promise.all(u).then(function() {
                    e.getOutline().then(function(e) {
                        i.pdfOutlineViewer.render({
                            outline: e
                        })
                    }),
                    e.getAttachments().then(function(e) {
                        i.pdfAttachmentViewer.render({
                            attachments: e
                        })
                    })
                }),
                e.getMetadata().then(function(t) {
                    var n = t.info,
                    s = t.metadata;
                    i.documentInfo = n,
                    i.metadata = s,
                    console.log("PDF " + e.fingerprint + " [" + n.PDFFormatVersion + " " + (n.Producer || "-").trim() + " / " + (n.Creator || "-").trim() + "] (PDF.js: " + (S.version || "-") + (S.PDFJS.disableWebGL ? "": " [WebGL]") + ")");
                    var r;
                    if (s && s.has("dc:title")) {
                        var o = s.get("dc:title");
                        "Untitled" !== o && (r = o)
                    } ! r && n && n.Title && (r = n.Title),
                    r && i.setTitle(r + " - " + document.title),
                    n.IsAcroFormPresent && (console.warn("Warning: AcroForm/XFA is not supported"), i.fallback(S.UNSUPPORTED_FEATURES.forms))
                })
            },
            setInitialView: function(e, t) {
                var i = t && t.scale,
                n = t && t.sidebarView;
                this.isInitialViewSet = !0,
                this.appConfig.toolbar.pageNumber.value = this.pdfViewer.currentPageNumber,
                this.pdfSidebar.setInitialView(this.preferenceSidebarViewOnLoad || 0 | n),
                this.initialDestination ? (this.pdfLinkService.navigateTo(this.initialDestination), this.initialDestination = null) : this.initialBookmark ? (this.pdfLinkService.setHash(this.initialBookmark), this.pdfHistory.push({
                    hash: this.initialBookmark
                },
                !0), this.initialBookmark = null) : e ? this.pdfLinkService.setHash(e) : i && (this.pdfViewer.currentScaleValue = i, this.page = 1),
                this.pdfViewer.currentScaleValue || (this.pdfViewer.currentScaleValue = T)
            },
            cleanup: function() {
                this.pdfDocument && (this.pdfViewer.cleanup(), this.pdfThumbnailViewer.cleanup(), this.pdfDocument.cleanup())
            },
            forceRendering: function() {
                this.pdfRenderingQueue.printing = this.printing,
                this.pdfRenderingQueue.isThumbnailViewEnabled = this.pdfSidebar.isThumbnailViewVisible,
                this.pdfRenderingQueue.renderHighestPriority()
            },
            beforePrint: function() {
                if (!this.supportsPrinting) {
                    var e = V.get("printing_not_supported", null, "Warning: Printing is not fully supported by this browser.");
                    return void this.error(e)
                }
                var t, i, n = !1;
                if (this.pdfDocument && this.pagesCount) {
                    for (t = 0, i = this.pagesCount; t < i; ++t) if (!this.pdfViewer.getPageView(t).pdfPage) {
                        n = !0;
                        break
                    }
                } else n = !0;
                if (n) {
                    var s = V.get("printing_not_ready", null, "Warning: The PDF is not fully loaded for printing.");
                    return void window.alert(s)
                }
                this.printing = !0,
                this.forceRendering();
                var r = this.appConfig.printContainer,
                o = document.querySelector("body");
                o.setAttribute("data-mozPrintCallback", !0),
                this.hasEqualPageSizes || console.warn("Not all pages have the same size. The printed result may be incorrect!"),
                this.pageStyleSheet = document.createElement("style");
                var a = this.pdfViewer.getPageView(0).pdfPage.getViewport(1);
                for (this.pageStyleSheet.textContent = "@supports ((size:A4) and (size:1pt 1pt)) {@page { size: " + a.width + "pt " + a.height + "pt;}}", o.appendChild(this.pageStyleSheet), t = 0, i = this.pagesCount; t < i; ++t) this.pdfViewer.getPageView(t).beforePrint(r)
            },
            get hasEqualPageSizes() {
                for (var e = this.pdfViewer.getPageView(0), t = 1, i = this.pagesCount; t < i; ++t) {
                    var n = this.pdfViewer.getPageView(t);
                    if (n.width !== e.width || n.height !== e.height) return ! 1
                }
                return ! 0
            },
            afterPrint: function() {
                for (var e = this.appConfig.printContainer; e.hasChildNodes();) e.removeChild(e.lastChild);
                this.pageStyleSheet && this.pageStyleSheet.parentNode && (this.pageStyleSheet.parentNode.removeChild(this.pageStyleSheet), this.pageStyleSheet = null),
                this.printing = !1,
                this.forceRendering()
            },
            rotatePages: function(e) {
                var t = this.page;
                this.pageRotation = (this.pageRotation + 360 + e) % 360,
                this.pdfViewer.pagesRotation = this.pageRotation,
                this.pdfThumbnailViewer.pagesRotation = this.pageRotation,
                this.forceRendering(),
                this.pdfViewer.scrollPageIntoView(t)
            },
            requestPresentationMode: function() {
                this.pdfPresentationMode && this.pdfPresentationMode.request()
            },
            scrollPresentationMode: function(e) {
                this.pdfPresentationMode && this.pdfPresentationMode.mouseScroll(e)
            }
        },
        ue = ["null", "http://mozilla.github.io", "https://mozilla.github.io"];
        document.addEventListener("pagerendered",
        function(e) {
            var t = e.detail.pageNumber,
            i = t - 1,
            n = ce.pdfViewer.getPageView(i);
            if (ce.pdfSidebar.isThumbnailViewVisible) {
                var s = ce.pdfThumbnailViewer.getThumbnail(i);
                s.setImage(n)
            }
            if (S.PDFJS.pdfBug && Stats.enabled && n.stats && Stats.add(t, n.stats), n.error && ce.error(V.get("rendering_error", null, "An error occurred while rendering the page."), n.error), t === ce.page) {
                var r = ce.appConfig.toolbar.pageNumber;
                r.classList.remove(le)
            }
        },
        !0),
        document.addEventListener("textlayerrendered",
        function(e) {
            var t = e.detail.pageNumber - 1;
            ce.pdfViewer.getPageView(t)
        },
        !0),
        document.addEventListener("pagemode",
        function(e) {
            if (ce.initialized) {
                var t, i = e.detail.mode;
                switch (i) {
                case "thumbs":
                    t = O.THUMBS;
                    break;
                case "bookmarks":
                case "outline":
                    t = O.OUTLINE;
                    break;
                case "attachments":
                    t = O.ATTACHMENTS;
                    break;
                case "none":
                    t = O.NONE;
                    break;
                default:
                    return void console.error('Invalid "pagemode" hash parameter: ' + i)
                }
                ce.pdfSidebar.switchView(t, !0)
            }
        },
        !0),
        document.addEventListener("namedaction",
        function(e) {
            if (ce.initialized) {
                var t = e.detail.action;
                switch (t) {
                case "GoToPage":
                    ce.appConfig.toolbar.pageNumber.focus();
                    break;
                case "Find":
                    ce.supportsIntegratedFind || ce.findBar.toggle()
                }
            }
        },
        !0),
        window.addEventListener("presentationmodechanged",
        function(e) {
            var t = e.detail.active,
            i = e.detail.switchInProgress;
            ce.pdfViewer.presentationModeState = i ? J.CHANGING: t ? J.FULLSCREEN: J.NORMAL
        }),
        window.addEventListener("sidebarviewchanged",
        function(e) {
            if (ce.initialized) {
                ce.pdfRenderingQueue.isThumbnailViewEnabled = ce.pdfSidebar.isThumbnailViewVisible;
                var t = ce.store;
                t && ce.isInitialViewSet && t.initializedPromise.then(function() {
                    t.set("sidebarView", e.detail.view).
                    catch(function() {})
                })
            }
        },
        !0),
        window.addEventListener("updateviewarea",
        function(e) {
            if (ce.initialized) {
                var t = e.location,
                i = ce.store;
                i && i.initializedPromise.then(function() {
                    i.setMultiple({
                        exists: !0,
                        page: t.pageNumber,
                        zoom: t.scale,
                        scrollLeft: t.left,
                        scrollTop: t.top
                    }).
                    catch(function() {})
                });
                var n = ce.pdfLinkService.getAnchorUrl(t.pdfOpenParams);
                ce.appConfig.toolbar.viewBookmark.href = n,
                ce.appConfig.secondaryToolbar.viewBookmark.href = n,
                ce.pdfHistory.updateCurrentBookmark(t.pdfOpenParams, t.pageNumber);
                var s = ce.appConfig.toolbar.pageNumber,
                r = ce.pdfViewer.getPageView(ce.page - 1);
                r.renderingState === Y.FINISHED ? s.classList.remove(le) : s.classList.add(le)
            }
        },
        !0),
        window.addEventListener("hashchange",
        function(e) {
            if (ce.pdfHistory.isHashChangeUnlocked) {
                var t = document.location.hash.substring(1);
                if (!t) return;
                ce.isInitialViewSet ? ce.pdfLinkService.setHash(t) : ce.initialBookmark = t
            }
        }),
        window.addEventListener("change",
        function(e) {
            var t = e.target.files;
            if (t && 0 !== t.length) {
                var i = t[0];
                if (!S.PDFJS.disableCreateObjectURL && "undefined" != typeof URL && URL.createObjectURL) ce.open(URL.createObjectURL(i));
                else {
                    var n = new FileReader;
                    n.onload = function(e) {
                        var t = e.target.result,
                        i = new Uint8Array(t);
                        ce.open(i)
                    },
                    n.readAsArrayBuffer(i)
                }
                ce.setTitleUsingUrl(i.name);
                var s = ce.appConfig;
                s.toolbar.viewBookmark.setAttribute("hidden", "true"),
                s.secondaryToolbar.viewBookmark.setAttribute("hidden", "true"),
                s.toolbar.download.setAttribute("hidden", "true"),
                s.secondaryToolbar.download.setAttribute("hidden", "true")
            }
        },
        !0),
        window.addEventListener("localized",
        function(e) {
            document.getElementsByTagName("html")[0].dir = V.getDirection(),
            ce.animationStartedPromise.then(function() {
                var e = ce.appConfig.toolbar.scaleSelectContainer;
                if (0 === e.clientWidth && e.setAttribute("style", "display: inherit;"), e.clientWidth > 0) {
                    var t = ce.appConfig.toolbar.scaleSelect;
                    t.setAttribute("style", "min-width: inherit;");
                    var i = t.clientWidth + ae;
                    t.setAttribute("style", "min-width: " + (i + de) + "px;"),
                    e.setAttribute("style", "min-width: " + i + "px; max-width: " + i + "px;")
                }
                W.setMaxHeight(ce.appConfig.mainContainer)
            })
        },
        !0),
        window.addEventListener("scalechange",
        function(e) {
            var t = ce.appConfig;
            t.toolbar.zoomOut.disabled = e.scale === re,
            t.toolbar.zoomIn.disabled = e.scale === oe;
            var i = _(e.presetValue || "" + e.scale);
            if (!i) {
                var n = t.toolbar.customScaleOption,
                s = Math.round(1e4 * e.scale) / 100;
                n.textContent = V.get("page_scale_percent", {
                    scale: s
                },
                "{{scale}}%"),
                n.selected = !0
            }
            ce.initialized && ce.pdfViewer.update()
        },
        !0),
        window.addEventListener("pagechange",
        function(e) {
            var t = e.pageNumber;
            e.previousPageNumber !== t && (ce.appConfig.toolbar.pageNumber.value = t, ce.pdfSidebar.isThumbnailViewVisible && ce.pdfThumbnailViewer.scrollThumbnailIntoView(t));
            var i = ce.pagesCount;
            if (ce.appConfig.toolbar.previous.disabled = t <= 1, ce.appConfig.toolbar.next.disabled = t >= i, ce.appConfig.toolbar.firstPage.disabled = t <= 1, ce.appConfig.toolbar.lastPage.disabled = t >= i, S.PDFJS.pdfBug && Stats.enabled) {
                var n = ce.pdfViewer.getPageView(t - 1);
                n.stats && Stats.add(t, n.stats)
            }
        },
        !0);
        window.addEventListener("DOMMouseScroll", F),
        window.addEventListener("mousewheel", F),
        window.addEventListener("click",
        function(e) {
            W.opened && ce.pdfViewer.containsElement(e.target) && W.close()
        },
        !1),
        window.addEventListener("keydown",
        function(e) {}),
        window.addEventListener("beforeprint",
        function(e) {}),
        window.addEventListener("afterprint",
        function(e) {
            ce.afterPrint()
        }),
        function() {
            ce.animationStartedPromise = new Promise(function(e) {
                window.requestAnimationFrame(e)
            })
        } (),
        e.PDFViewerApplication = ce,
        l._setApp(e)
    })
}).call(pdfjsWebLibs),
document.addEventListener("DOMContentLoaded", webViewerLoad, !0);