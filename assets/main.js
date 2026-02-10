/**
 * King Kong Theme JavaScript
 * Funcionalidades: Instant Page Preloading, Form Validation, Countdown Timer
 */

/* ========== INSTANT PAGE PRELOADING ========== */
let mouseoverTimer, lastTouchTimestamp;
const prefetches = new Set;
const prefetchElement = document.createElement("link");
const isSupported = prefetchElement.relList && prefetchElement.relList.supports && prefetchElement.relList.supports("prefetch") && window.IntersectionObserver && "isIntersecting" in IntersectionObserverEntry.prototype;
const allowQueryString = "instantAllowQueryString" in document.body.dataset;
const allowExternalLinks = "instantAllowExternalLinks" in document.body.dataset;
const useWhitelist = "instantWhitelist" in document.body.dataset;
const mousedownShortcut = "instantMousedownShortcut" in document.body.dataset;
const DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION = 1111;

let delayOnHover = 65;
let useMousedown = !1;
let useMousedownOnly = !1;
let useViewport = !1;

if ("instantIntensity" in document.body.dataset) {
    const e = document.body.dataset.instantIntensity;
    if ("mousedown" == e.substr(0, "mousedown".length)) {
        useMousedown = !0;
        "mousedown-only" == e && (useMousedownOnly = !0);
    } else if ("viewport" == e.substr(0, "viewport".length)) {
        navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType && navigator.connection.effectiveType.includes("2g")) || ("viewport" == e ? document.documentElement.clientWidth * document.documentElement.clientHeight < 45e4 && (useViewport = !0) : "viewport-all" == e && (useViewport = !0));
    } else {
        const t = parseInt(e);
        !isNaN(t) && (delayOnHover = t);
    }
}

if (isSupported) {
    const e = { capture: !0, passive: !0 };
    useMousedownOnly || document.addEventListener("touchstart", touchstartListener, e);
    useMousedown ? mousedownShortcut || document.addEventListener("mousedown", mousedownListener, e) : document.addEventListener("mouseover", mouseoverListener, e);
    mousedownShortcut && document.addEventListener("mousedown", mousedownShortcutListener, e);
    
    if (useViewport) {
        let e;
        (e = window.requestIdleCallback ? e => { requestIdleCallback(e, { timeout: 1500 }); } : e => { e(); })(() => {
            const e = new IntersectionObserver(t => {
                t.forEach(t => {
                    if (t.isIntersecting) {
                        const i = t.target;
                        e.unobserve(i);
                        preload(i.href);
                    }
                });
            });
            document.querySelectorAll("a").forEach(t => {
                isPreloadable(t) && e.observe(t);
            });
        });
    }
}

function touchstartListener(e) {
    lastTouchTimestamp = performance.now();
    const t = e.target.closest("a");
    isPreloadable(t) && preload(t.href);
}

function mouseoverListener(e) {
    if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) return;
    const t = e.target.closest("a");
    isPreloadable(t) && (t.addEventListener("mouseout", mouseoutListener, { passive: !0 }), mouseoverTimer = setTimeout(() => { preload(t.href); mouseoverTimer = void 0; }, delayOnHover));
}

function mousedownListener(e) {
    const t = e.target.closest("a");
    isPreloadable(t) && preload(t.href);
}

function mouseoutListener(e) {
    e.relatedTarget && e.target.closest("a") == e.relatedTarget.closest("a") || mouseoverTimer && (clearTimeout(mouseoverTimer), mouseoverTimer = void 0);
}

function mousedownShortcutListener(e) {
    if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) return;
    const t = e.target.closest("a");
    if (e.which > 1 || e.metaKey || e.ctrlKey) return;
    if (!t) return;
    t.addEventListener("click", function(e) { 1337 != e.detail && e.preventDefault(); }, { capture: !0, passive: !1, once: !0 });
    const i = new MouseEvent("click", { view: window, bubbles: !0, cancelable: !1, detail: 1337 });
    t.dispatchEvent(i);
}

function isPreloadable(e) {
    if (e && e.href && (!useWhitelist || "instant" in e.dataset) && (allowExternalLinks || e.origin == location.origin || "instant" in e.dataset) && ["http:", "https:"].includes(e.protocol) && ("http:" != e.protocol || "https:" != location.protocol) && (allowQueryString || !e.search || "instant" in e.dataset) && !(e.hash && e.pathname + e.search == location.pathname + location.search || "noInstant" in e.dataset)) return !0;
}

function preload(e) {
    if (prefetches.has(e)) return;
    const t = document.createElement("link");
    t.rel = "prefetch";
    t.href = e;
    document.head.appendChild(t);
    prefetches.add(e);
}

/* ========== FORM MULTI-STEP VALIDATION ========== */
function initModalFormMultiStep() {
    document.querySelectorAll("form.kk-modal-validation").forEach(function(e) {
        var t = e.querySelector("#your-name"),
            i = e.querySelector("#your-email"),
            a = e.querySelector("div.iti");
        t || (t = e.querySelector("#inf_field_FirstName"));
        i || (i = e.querySelector("#inf_field_Email"));
        t && i && a && setupMultiStepForm(e, t, i, a);
    });
}

function setupMultiStepForm(e, t, i, a) {
    var n = 1,
        s = e.querySelector('input[type="submit"], button[type="submit"]'),
        r = "",
        o = !1;
    if (s) {
        a.style.display = "none";
        var l = a.querySelector('input[type="tel"]'),
            d = e.querySelector('input[name="inf_field_Phone1"]');
        s.addEventListener("click", function(c) {
            if (1 === n) {
                c.preventDefault();
                c.stopPropagation();
                c.stopImmediatePropagation();
                removeFieldErrors(e);
                if (!t.value.trim()) {
                    addFieldError(t, "This field is required");
                    return !1;
                }
                if (!i.value.trim()) {
                    addFieldError(i, "This field is required");
                    return !1;
                }
                t.style.display = "none";
                i.style.display = "none";
                a.style.display = "inline-block";
                n = 2;
                setTimeout(function() { l && l.focus(); }, 100);
                return !1;
            }
            if (2 === n) {
                c.preventDefault();
                c.stopPropagation();
                c.stopImmediatePropagation();
                if (o) return !0;
                removeFieldErrors(e);
                if (!l || !l.value.trim()) {
                    addFieldError(l, "This field is required");
                    return !1;
                }
                var u = "";
                if (window.intlTelInputGlobals && window.intlTelInputGlobals.getInstance) {
                    var p = window.intlTelInputGlobals.getInstance(l);
                    p && (u = p.getNumber());
                }
                u || (u = l.value);
                r = "INPUT" === s.nodeName ? s.value : s.innerHTML;
                setButtonText(s, "Validating...");
                s.disabled = !0;
                
                if (window._kk_email_validation_api) {
                    window._kk_email_validation_api(i.value, function() {
                        if (window._kk_phone_validation_api) {
                            window._kk_phone_validation_api(u, function(t) {
                                o = !0;
                                d && (d.value = t);
                                setButtonText(s, "Submitting...");
                                "function" == typeof e.submit && e.submit();
                            }, function() {
                                setButtonText(s, r);
                                s.disabled = !1;
                                addFieldError(l, "Unable to verify phone number, please double check the number and country code.");
                            }, function() {});
                        }
                    }, function() {
                        setButtonText(s, r);
                        s.disabled = !1;
                        t.style.display = "block";
                        i.style.display = "block";
                        a.style.display = "none";
                        n = 1;
                        addFieldError(i, "Unable to verify email, please double check the spelling or try a different address.");
                    }, function() {});
                }
                return !1;
            }
        }, !0);
    }
}

function setButtonText(e, t) {
    "INPUT" === e.nodeName ? e.value = t : e.innerHTML = t;
}

function addFieldError(e, t) {
    var i = document.createElement("div");
    i.className = "field-error";
    i.textContent = t;
    e.insertAdjacentElement("afterend", i);
    e.classList.add("errored-field");
}

function removeFieldErrors(e) {
    e.querySelectorAll(".field-error").forEach(function(e) { e.remove(); });
    e.querySelectorAll(".errored-field").forEach(function(e) { e.classList.remove("errored-field"); });
}

/* ========== COUNTDOWN TIMER ========== */
function countdownTimer(e) {
    var t = new Date,
        i = t.getMinutes(),
        a = 60 * (i < 15 ? 15 - i - 1 : i < 30 ? 30 - i - 1 : i < 45 ? 45 - i - 1 : 60 - i - 1) + (60 - t.getSeconds()),
        n = setInterval(function() {
            if (-1 == (a -= 1)) return void clearInterval(n);
            var e = a % 60,
                t = Math.floor(a / 60),
                i = " minutes and ";
            1 == (t %= 60) && (i = " minute and ");
            var s = " seconds";
            1 == e && (s = " second");
            document.querySelectorAll(".countdown__time-15.countdown__type-words").forEach(function(a, n) {
                a.innerHTML = t < 1 ? e + s : t + i + e + s;
            });
        }, 1e3);
}

function nowTimer() {
    var e = document.querySelector(".countdown__type-time .hours"),
        t = document.querySelector(".countdown__type-time .minutes"),
        i = document.querySelector(".countdown__type-time .seconds");
    setInterval(function() {
        var a = new Date,
            n = a.getHours(),
            s = a.getMinutes(),
            r = a.getSeconds();
        n > 12 && (n -= 12);
        n < 10 && (n = "0" + n);
        s < 10 && (s = "0" + s);
        r < 10 && (r = "0" + r);
        e.textContent = n;
        t.textContent = s;
        i.textContent = r;
    }, 1e3);
}

function getTimeRemaining(e) {
    const t = Date.parse(e) - Date.parse(new Date),
        i = Math.floor(t / 1e3 % 60),
        a = Math.floor(t / 1e3 / 60 % 60),
        n = Math.floor(t / 36e5 % 24);
    return {
        total: t,
        days: Math.floor(t / 864e5),
        hours: n,
        minutes: a,
        seconds: i
    };
}

function initializeClock(e, t) {
    const i = document.querySelector(e),
        a = i.querySelector(".hours"),
        n = i.querySelector(".minutes"),
        s = i.querySelector(".seconds");

    function r() {
        const e = getTimeRemaining(t);
        a.innerHTML = ("0" + e.hours).slice(-2);
        n.innerHTML = ("0" + e.minutes).slice(-2);
        s.innerHTML = ("0" + e.seconds).slice(-2);
        e.total <= 0 && clearInterval(o);
    }
    r();
    const o = setInterval(r, 1e3);
}

/* ========== INITIALIZATION ========== */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initModalFormMultiStep();
    
    // Initialize countdown timers if present
    if (document.querySelector('.countdown__time-15')) {
        countdownTimer();
    }
    if (document.querySelector('.countdown__type-time')) {
        nowTimer();
    }
});
