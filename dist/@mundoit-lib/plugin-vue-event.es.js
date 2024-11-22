function c(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(o, i) {
    var t = n.get(o);
    t ? t.push(i) : n.set(o, [i]);
  }, off: function(o, i) {
    var t = n.get(o);
    t && (i ? t.splice(t.indexOf(i) >>> 0, 1) : n.set(o, []));
  }, emit: function(o, i) {
    var t = n.get(o);
    t && t.slice().map(function(e) {
      e(i);
    }), (t = n.get("*")) && t.slice().map(function(e) {
      e(o, i);
    });
  } };
}
function v(n) {
  let o = !1;
  typeof n.version == "string" && n.version.startsWith("3.") && (o = !0);
  const i = c(), t = {
    emit(e, ...s) {
      i.emit(e, s);
    },
    on(e, s) {
      const r = (f) => s(...f);
      return i.on(e, r), r;
    },
    fire(e, ...s) {
      i.emit(e, s);
    },
    off(e, s) {
      i.off(e, s);
    }
  };
  o ? (n.config.globalProperties.$events = t, n.mixin({
    beforeCreate() {
      if (typeof this.$options.events == "object") {
        this._eventListeners = [];
        for (const [e, s] of Object.entries(this.$options.events)) {
          const r = s.bind(this), f = t.on(e, r);
          this._eventListeners.push({ event: e, listener: f });
        }
      }
    },
    beforeUnmount() {
      if (this._eventListeners)
        for (const { event: e, listener: s } of this._eventListeners)
          t.off(e, s);
    }
  })) : (Object.defineProperty(n.prototype, "$events", {
    get() {
      return t;
    }
  }), n.mixin({
    beforeCreate() {
      if (typeof this.$options.events == "object") {
        this._eventListeners = [];
        for (const [e, s] of Object.entries(this.$options.events)) {
          const r = s.bind(this), f = t.on(e, r);
          this._eventListeners.push({ event: e, listener: f });
        }
      }
    },
    beforeDestroy() {
      if (this._eventListeners)
        for (const { event: e, listener: s } of this._eventListeners)
          t.off(e, s);
    }
  }));
}
export {
  v as default
};
