/**
 * Copyright (C) 2012 by Justin Windle
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
! function (e) {
    for (var r, t, o = !1, a = document.createElement("div"), n = "moz ms o webkit".split(" "), s = function (e) {
            return e.toUpperCase()
        }, i = 0; i < n.length && (t = (r = n[i]) + "Perspective", !(t in a.style || t.replace(/^(\w)/, s) in a.style)); i++);
    var f, d, l, c, m, p, u, g, v, y, h, k = !!r,
        X = "-" + r + "-",
        x = {
            toggle: function () {
                f = e(this), f.makisu(f.hasClass("open") ? "close" : "open")
            },
            open: function (r, t, o) {
                f = e(this), d = f.find(".root"), c = f.find(".node").not(d), r = w.resolve(f, "speed", r), o = w.resolve(f, "easing", o), t = w.resolve(f, "overlap", t), c.each(function (a, n) {
                    y = "unfold" + (a ? "" : "-first"), h = a === c.length - 1, time = r * (1 - t), v = a * time, p = e(n), u = p.find(".over"), p.css(w.prefix({
                        transform: "rotateX(180deg)",
                        animation: y + " " + r + "s " + o + " " + v + "s 1 normal forwards"
                    })), h || (v = (a + 1) * time), u.css(w.prefix({
                        animation: "unfold-over " + .45 * r + "s " + o + " " + v + "s 1 normal forwards"
                    }))
                }), d.css(w.prefix({
                    animation: "swing-out " + 1.4 * c.length * time + "s ease-in-out 0s 1 normal forwards"
                })), f.addClass("open")
            },
            close: function (r, t, o) {
                f = e(this), d = f.find(".root"), c = f.find(".node").not(d), r = .66 * w.resolve(f, "speed", r), o = w.resolve(f, "easing", o), t = w.resolve(f, "overlap", t), c.each(function (a, n) {
                    y = "fold" + (a ? "" : "-first"), h = 0 === a, time = r * (1 - t), v = (c.length - a - 1) * time, p = e(n), u = p.find(".over"), p.css(w.prefix({
                        transform: "rotateX(0deg)",
                        animation: y + " " + r + "s " + o + " " + v + "s 1 normal forwards"
                    })), h || (v = (c.length - a - 2) * time + .35 * r), u.css(w.prefix({
                        animation: "fold-over " + .45 * r + "s " + o + " " + v + "s 1 normal forwards"
                    }))
                }), d.css(w.prefix({
                    animation: "swing-in " + 1 * c.length * time + "s ease-in-out 0s 1 normal forwards"
                })), f.removeClass("open")
            }
        },
        w = {
            resolve: function (e, r, t) {
                return "undefined" == typeof t ? e.data(r) : t
            },
            prefix: function (e) {
                for (var r in e) e[X + r] = e[r];
                return e
            },
            inject: function (e) {
                try {
                    var r = document.createElement("style");
                    r.innerHTML = e, document.getElementsByTagName("head")[0].appendChild(r)
                } catch (t) {}
            },
            keyframes: function (e, r) {
                var t = "@" + X + "keyframes " + e + "{";
                for (var o in r) t += o + "%" + "{" + X + r[o] + ";}";
                w.inject(t + "}")
            }
        },
        b = {
            node: '<span class="node"/>',
            back: '<span class="face back"/>',
            over: '<span class="face over"/>'
        };
    e.fn.makisu = function (r) {
        if (!k) {
            var t = "Failed to detect CSS 3D support";
            return console && console.warn && (console.warn(t), this.each(function () {
                e(this).trigger("error", t)
            })), void 0
        }
        o || (o = !0, w.keyframes("unfold", {
            0: "transform: rotateX(180deg)",
            50: "transform: rotateX(-30deg)",
            100: "transform: rotateX(0deg)"
        }), w.keyframes("unfold-first", {
            0: "transform: rotateX(-90deg)",
            50: "transform: rotateX(60deg)",
            100: "transform: rotateX(0deg)"
        }), w.keyframes("fold", {
            0: "transform: rotateX(0deg)",
            100: "transform: rotateX(180deg)"
        }), w.keyframes("fold-first", {
            0: "transform: rotateX(0deg)",
            100: "transform: rotateX(-180deg)"
        }), w.keyframes("swing-out", {
            0: "transform: rotateX(0deg)",
            30: "transform: rotateX(-30deg)",
            60: "transform: rotateX(15deg)",
            100: "transform: rotateX(0deg)"
        }), w.keyframes("swing-in", {
            0: "transform: rotateX(0deg)",
            50: "transform: rotateX(-10deg)",
            90: "transform: rotateX(15deg)",
            100: "transform: rotateX(0deg)"
        }), w.keyframes("unfold-over", {
            0: "opacity: 1.0",
            100: "opacity: 0.0"
        }), w.keyframes("fold-over", {
            0: "opacity: 0.0",
            100: "opacity: 1.0"
        }), w.inject(".node {position: relative;display: block;}"), w.inject(".face {pointer-events: none;position: absolute;display: block;height: 100%;width: 100%;left: 0;top: 0;}"));
        var a = e.extend({}, e.fn.makisu.defaults, r),
            n = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            return x[r] ? x[r].apply(this, n) : (f = e(this).data(a), f.data("initialized") || (f.data("initialized", !0), c = f.children(a.selector), d = e(b.node).addClass("root"), l = d, c.each(function (r, t) {
                p = e(t), y = "fold" + (r ? "" : "-first"), p.css("position", "relative"), p.css(w.prefix({
                    "transform-style": "preserve-3d",
                    transform: "translateZ(-0.1px)"
                })), g = e(b.back), g.css("background", p.css("background")), g.css(w.prefix({
                    transform: "translateZ(-0.1px)"
                })), u = e(b.over), u.css(w.prefix({
                    transform: "translateZ(0.1px)"
                })), u.css({
                    background: a.shading,
                    opacity: 0
                }), m = e(b.node).append(p), m.css(w.prefix({
                    "transform-origin": "50% 0%",
                    "transform-style": "preserve-3d",
                    animation: y + " 1ms linear 0s 1 normal forwards"
                })), p.append(u), p.append(g), l.append(m), l = m
            }), d.css(w.prefix({
                "transform-origin": "50% 0%",
                "transform-style": "preserve-3d"
            })), f.css(w.prefix({
                transform: "perspective(" + a.perspective + "px)"
            })), f.append(d)), void 0)
        })
    }, e.fn.makisu.defaults = {
        perspective: 1200,
        shading: "rgba(0,0,0,0.12)",
        selector: null,
        overlap: .6,
        speed: .8,
        easing: "ease-in-out"
    }, e.fn.makisu.enabled = k
}(Zepto);