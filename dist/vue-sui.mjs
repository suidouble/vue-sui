import { openBlock as r, createElementBlock as c, createElementVNode as m, normalizeClass as y, Fragment as C, renderList as I, toDisplayString as M, createCommentVNode as f, resolveComponent as v, createBlock as A, Teleport as k, createVNode as b } from "vue";
import { SuiInBrowser as P } from "suidouble";
import './index.css';const w = (e, i) => {
  const t = e.__vccOpts || e;
  for (const [o, s] of i)
    t[o] = s;
  return t;
}, D = {
  name: "SuiSync",
  props: {
    defaultChain: {
      default: "sui:devnet",
      type: String
    },
    rpcSettings: {
      type: Object
    }
  },
  data() {
    return {
      connectedAddress: null,
      connectedChain: null,
      adapters: [],
      suiInBrowser: null,
      suiMaster: null
      // lastSuiMasterInstanceN: null,
    };
  },
  emits: ["connect", "connected", "loaded", "disconnected", "error", "suiMaster", "adapters"],
  components: {},
  watch: {},
  methods: {
    async reinitSuiMaster() {
      this.suiMaster = await this.suiInBrowser.getSuiMaster(), this.$emit("suiMaster", this.suiMaster);
    },
    async setRPC(e = {}) {
      await this.suiInBrowser.setRPC(e), await this.reinitSuiMaster();
    }
  },
  beforeUnmount() {
    var e, i, t;
    this._onAdapter && ((e = this.suiInBrowser) == null || e.removeEventListener("adapter", this._onAdapter)), this._onConnected && ((i = this.suiInBrowser) == null || i.removeEventListener("connected", this._onConnected)), this._onDisconnected && ((t = this.suiInBrowser) == null || t.removeEventListener("disconnected", this._onDisconnected));
  },
  mounted: function() {
    this.suiInBrowser = P.getSingleton({
      debug: !0,
      defaultChain: this.defaultChain
    }), this.rpcSettings && this.suiInBrowser.setRPC(this.rpcSettings), this.adapters = Object.values(this.suiInBrowser.adapters), this._onAdapter = (e) => {
      this.adapters.push(e.detail), this.$emit("adapters", this.adapters);
    }, this._onConnected = () => {
      this.connectedAddress = this.suiInBrowser.connectedAddress, this.connectedChain = this.suiInBrowser.connectedChain, this.reinitSuiMaster().then(() => {
        this.$emit("connected", this.suiInBrowser);
      });
    }, this._onDisconnected = () => {
      this.connectedAddress = null, this.connectedChain = null, this.$emit("disconnected");
    }, this.suiInBrowser.addEventListener("adapter", this._onAdapter), this.suiInBrowser.addEventListener("connected", this._onConnected), this.suiInBrowser.addEventListener("disconnected", this._onDisconnected), this.$nextTick(() => {
      this.$emit("loaded", this.suiInBrowser), this.$emit("adapters", this.adapters);
    }), this.suiInBrowser.isConnected && (this.connectedAddress = this.suiInBrowser.connectedAddress, this.connectedChain = this.suiInBrowser.connectedChain, this.reinitSuiMaster().then(() => {
      this.$emit("connected", this.suiInBrowser);
    })), this.reinitSuiMaster();
  },
  computed: {}
};
function B(e, i, t, o, s, n) {
  return r(), c("div");
}
const L = /* @__PURE__ */ w(D, [["render", B]]), R = {
  name: "SignInWithSuiDialog",
  emits: ["click", "hidden"],
  props: {
    adapters: {
      type: Array,
      default() {
        return [];
      }
    },
    showing: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      isActive: !1,
      isVisible: !1
    };
  },
  watch: {
    showing: function() {
      this.showing ? this.show() : this.hide();
    }
  },
  computed: {},
  components: {},
  methods: {
    onAdapterClick(e) {
      this.$emit("click", e);
    },
    show() {
      this.isActive = !0, setTimeout(() => {
        this.isVisible = !0;
      }, 10);
    },
    hide() {
      this.isVisible = !1, setTimeout(() => {
        this.isActive = !1, this.$emit("hidden");
      }, 300);
    },
    onBackdrop() {
      this.hide(), console.log(this.adapters);
    }
  },
  beforeMount: function() {
  },
  mounted: async function() {
  }
}, $ = {
  key: 0,
  class: "signinwithsui_dialog"
}, W = { class: "signinwithsui_dialog_inner_card" }, T = { class: "signinwithsui_dialog_list" }, N = ["onClick"], E = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_icon" }, q = ["src"], x = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_name" };
function O(e, i, t, o, s, n) {
  return s.isActive ? (r(), c("div", $, [
    m("div", {
      class: "signinwithsui_dialog_backdrop",
      onClick: i[0] || (i[0] = (...a) => n.onBackdrop && n.onBackdrop(...a))
    }),
    m("div", {
      class: y(["signinwithsui_dialog_inner", { signinwithsui_dialog_inner_active: s.isVisible }])
    }, [
      m("div", W, [
        m("div", T, [
          (r(!0), c(C, null, I(t.adapters, (a, d) => (r(), c(C, { key: d }, [
            a && a.name && (a.isDefault || a.okForSui) ? (r(), c("div", {
              key: 0,
              class: y(["signinwithsui_dialog_item", { signinwithsui_dialog_item_disabled: a.isDefault }]),
              onClick: (l) => n.onAdapterClick(a)
            }, [
              m("div", E, [
                m("img", {
                  loading: "lazy",
                  fetchpriority: "auto",
                  "aria-hidden": "true",
                  draggable: "false",
                  src: a.icon
                }, null, 8, q)
              ]),
              m("div", x, M(a.name), 1)
            ], 10, N)) : f("", !0)
          ], 64))), 128))
        ])
      ])
    ], 2)
  ])) : f("", !0);
}
const F = /* @__PURE__ */ w(R, [["render", O], ["__scopeId", "data-v-7fbb2031"]]);
let _ = null;
const S = new EventTarget(), V = {
  name: "SignInWithSui",
  emits: ["suiMaster", "provider", "client", "adapter", "disconnected", "connected", "wrongchain", "displayAddress"],
  props: {
    defaultChain: {
      default: "sui:devnet",
      type: String
    },
    rpcSettings: {
      type: Object
    },
    auto: {
      default: !0,
      type: Boolean
    },
    visible: {
      default: !0,
      type: Boolean
    },
    persist: {
      default: !1,
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: !1,
      libsRequested: !0,
      adapters: [],
      connectedAddress: null,
      displayAddress: null,
      resolvedNameServiceName: null,
      connectedChain: null,
      forceChainCalculated: null,
      suiMaster: null,
      activeAdapter: null,
      showingDialog: !1
    };
  },
  watch: {
    defaultChain: async function(e) {
      var t, o;
      console.log("[SignInWithSui] defaultChain changed to", e, "— acceptedAdapter:", window.localStorage.getItem("vue-sui-accepted-adapter"));
      const i = (t = this.$refs.sui) == null ? void 0 : t.suiInBrowser;
      if (((o = i == null ? void 0 : i.activeAdapter) == null ? void 0 : o.name) === "Phantom" && i.activeAdapter.isConnected) {
        console.log("[SignInWithSui] disconnecting Phantom before chain switch");
        try {
          await i.activeAdapter.disconnect();
        } catch {
        }
      }
      this.connectedAddress = null, this.connectedChain = null, this.activeAdapter = null, this.suiMaster = null, this.libsRequested = !1, await new Promise((s) => setTimeout(s, 50)), this.libsRequested = !0;
    }
  },
  computed: {},
  components: {
    SuidoubleSync: L,
    SignInWithSuiDialog: F
  },
  methods: {
    _emit(e, i) {
      this.$emit(e, i), this._isPrimary && S.dispatchEvent(new CustomEvent(e, { detail: i }));
    },
    checkDisplayAddress() {
      let e = this.displayAddress;
      this.connectedAddress ? this.connectedAddress && (this.resolvedNameServiceName ? e = this.resolvedNameServiceName : e = ("" + this.connectedAddress).substr(0, 6) + "..." + ("" + this.connectedAddress).substr(-4)) : e = null, this.displayAddress != e && (this.displayAddress = e, this._emit("displayAddress", this.displayAddress));
    },
    async getNameServiceName() {
      if (this.suiMaster && this.suiMaster.address) {
        const e = "resolvedNameServiceName_" + this.suiMaster.connectedChain + ":" + this.suiMaster.address, i = 10 * 60 * 1e3, t = this.getCache(e);
        if (t !== void 0)
          this.resolvedNameServiceName = t;
        else {
          const o = await this.suiMaster.defaultNameServiceName();
          this.resolvedNameServiceName = o, this.setCache(e, o, i);
        }
        this.checkDisplayAddress();
      } else
        this.resolvedNameServiceName = null, this.checkDisplayAddress();
    },
    /**
     * SuiMaster instance updated
     * @param {SuiMaster} suiMaster
     */
    onSuiMaster(e) {
      var a, d, l, u, g, p;
      if (!this._isPrimary) return;
      const i = ((l = (d = (a = this.$refs.sui) == null ? void 0 : a.suiInBrowser) == null ? void 0 : d.activeAdapter) == null ? void 0 : l.name) || null, t = window.localStorage.getItem("vue-sui-accepted-adapter"), o = ((e == null ? void 0 : e.connectedChain) || "unknown") + "|" + ((e == null ? void 0 : e.address) || "readonly") + "|" + (i || "none");
      this._suiMasterCache[o] && console.log("[SignInWithSui] suiMaster overwrite:", o, this._suiMasterCache), this._suiMasterCache[o] = { adapter: i, accepted: t, ts: Date.now() }, console.log("[SignInWithSui] suiMaster cache:", this._suiMasterCache);
      const s = (h) => h && h.replace(/^sui:/, "");
      if (!(!this.defaultChain || s(this.defaultChain) == s(e == null ? void 0 : e.connectedChain))) {
        this._emit("wrongchain", s(e == null ? void 0 : e.connectedChain)), this.scheduleReadonlyFallback(e);
        return;
      }
      if (e != null && e.address) {
        if (!t || i !== t) {
          if (console.log("[SignInWithSui] ignoring suiMaster from", i, "— we was connected with:", t), t && !this._reconnectingAdapter) {
            const h = (u = this.$refs.sui) == null ? void 0 : u.suiInBrowser;
            (p = (g = h == null ? void 0 : h._adapters) == null ? void 0 : g[t]) != null && p.isConnected && (console.log("[SignInWithSui] trying to reconnect", t), this._reconnectingAdapter = !0, h.connect(t).finally(() => {
              this._reconnectingAdapter = !1;
            }));
          }
          this.scheduleReadonlyFallback(e);
          return;
        }
        this._readonlyTimeout && (clearTimeout(this._readonlyTimeout), this._readonlyTimeout = null), this.applySuiMaster(e);
      } else
        t ? (console.log("[SignInWithSui] got readonly suiMaster, waiting 200ms for", t, "to connect"), this.scheduleReadonlyFallback(e)) : this.applySuiMaster(e);
    },
    scheduleReadonlyFallback(e) {
      const i = this.defaultChain.startsWith("sui:") ? this.defaultChain : "sui:" + this.defaultChain, t = e.constructor, o = t.SuiUtils.suiClientFor(i);
      this._pendingReadonlySuiMaster = new t({ client: o }), this._readonlyTimeout && clearTimeout(this._readonlyTimeout), this._readonlyTimeout = setTimeout(() => {
        this._readonlyTimeout = null, this._pendingReadonlySuiMaster && !this.connectedAddress && (this.applySuiMaster(this._pendingReadonlySuiMaster), this._pendingReadonlySuiMaster = null);
      }, 200);
    },
    applySuiMaster(e) {
      console.log("[SignInWithSui] applySuiMaster:", e == null ? void 0 : e.connectedChain, e != null && e.address ? "connected as " + e.address : "readonly"), this.suiMaster = e, this._emit("suiMaster", e), e.getClient().then((i) => {
        this._emit("client", i), this._emit("provider", i);
      }), e.address ? (this.connectedAddress = e.address, this.connectedChain = e.connectedChain, this.showingDialog = !1, this._emit("connected", this.connectedAddress), e.signer && e.signer.activeAdapter && (this._emit("adapter", e.signer.activeAdapter), this.activeAdapter = e.signer.activeAdapter)) : (this.activeAdapter = null, this._emit("adapter", null), this.connectedAddress = null), this.checkDisplayAddress(), this.getNameServiceName(), this.__suiMasterPromise && this.suiMaster && (this.__suiMasterPromiseResolver(), this.__suiMasterPromise = null), this.__connectedSuiMasterPromise && this.isSuiMasterConnected() && (this.__connectedSuiMasterPromiseResolver(), this.__connectedSuiMasterPromise = null);
    },
    onSuiAdapters(e) {
      this.adapters = e;
    },
    isSuiMasterConnected(e = null) {
      return this.suiMaster && this.suiMaster.address ? !(e && this.suiMaster.connectedChain != e) : this.suiMaster && this.suiMaster.signer && this.suiMaster.signer.connectedAddress ? !(e && this.suiMaster.signer.connectedChain != e) : !1;
    },
    async onAdapterClick(e) {
      var n, a, d, l;
      if (this.showingDialog = !1, e.isDefault && !e.isInstalled)
        return window.open(e.getDownloadURL(), "_blank"), !1;
      console.log("[SignInWithSui] adapter clicked:", e.name, "— connecting");
      const i = (u) => u && u.replace(/^sui:/, ""), t = i(this.defaultChain);
      for (const u of Object.keys(this._suiMasterCache)) {
        const [g, p, h] = u.split("|");
        if (!(h !== e.name || p === "readonly") && i(g) !== t) {
          (((n = e._standardAdapter) == null ? void 0 : n.chains) || []).map(i), console.log("[SignInWithSui] adapter", e.name, "is connected to", g, "but we need", this.defaultChain), this.$emit("wrongchain", i(g));
          return;
        }
      }
      window.localStorage.setItem("vue-sui-accepted-adapter", e.name), this.isLoading = !0;
      const o = this._isPrimary ? this.$refs.sui : (a = _ == null ? void 0 : _.$refs) == null ? void 0 : a.sui, s = (o == null ? void 0 : o.suiInBrowser) || ((d = this.$refs.sui) == null ? void 0 : d.suiInBrowser);
      ((l = s.activeAdapter) == null ? void 0 : l.name) === e.name && s.isConnected ? (console.log("[SignInWithSui] adapter", e.name, "already connected, re-requesting suiMaster"), await o.reinitSuiMaster()) : await s.connect(e), this.isLoading = !1;
    },
    async setRPC(e = {}) {
      this.$refs.sui.setRPC(e);
    },
    async requestSuiMaster() {
      if (this.suiMaster)
        return this.suiMaster;
      if (await this.requestLibs(), await new Promise((e) => {
        setTimeout(e, 200);
      }), this.suiMaster)
        return this.suiMaster;
      if (this.__suiMasterPromise) {
        if (await this.__suiMasterPromise, this.suiMaster)
          return this.suiMaster;
        throw new Error("can not get suiMaster");
      }
      if (this.__suiMasterPromiseResolver = null, this.__suiMasterPromise = new Promise((e) => {
        this.__suiMasterPromiseResolver = e;
      }), await this.__suiMasterPromise, this.suiMaster)
        return this.suiMaster;
      throw new Error("can not get suiMaster");
    },
    async requestConnectedSuiMaster(e = null) {
      if (this.isSuiMasterConnected(e))
        return this.suiMaster;
      if (await this.requestLibs(), await new Promise((i) => {
        setTimeout(i, 200);
      }), this.isSuiMasterConnected(e))
        return this.suiMaster;
      if (this.isLoading = !0, this.__connectedSuiMasterPromise) {
        if (await this.__connectedSuiMasterPromise, this.isLoading = !1, this.isSuiMasterConnected(e))
          return this.suiMaster;
        throw new Error("can not get connection");
      }
      if (this.__connectedSuiMasterPromiseResolver = null, this.__connectedSuiMasterPromise = new Promise((i) => {
        this.__connectedSuiMasterPromiseResolver = i;
      }), this.showingDialog = !0, await this.__connectedSuiMasterPromise, this.isLoading = !1, this.isSuiMasterConnected(e))
        return this.suiMaster;
      throw new Error("can not get connection");
    },
    async connect() {
      return await this.onClick();
    },
    async onClick() {
      this.isLoading = !0, await this.requestLibs(), await new Promise((e) => {
        setTimeout(e, 200);
      }), this.connectedAddress || (this.showingDialog = !0), this.isLoading = !1;
    },
    async initialize() {
      if (this.auto && (this.isLoading = !0, await this.requestLibs(), this.isLoading = !1), await new Promise((e) => {
        setTimeout(e, 200);
      }), this.persist) {
        const e = window.localStorage.getItem("vue-sui-accepted-adapter");
        e && this.adapters.forEach((i) => {
          i.name && i.okForSui && i.name == e && this.onAdapterClick(i);
        });
      }
    },
    async requestLibs() {
      this.libsRequested = !0, await this.__libsRequestedPromise;
    },
    onLibsLoaded() {
      this.__libsRequestedPromiseResolver();
    },
    onConnected() {
    },
    onDisconnected() {
      this._isPrimary && (this.connectedAddress = null, this.connectedChain = null, this.activeAdapter = null, this._emit("disconnected"), this.checkDisplayAddress());
    },
    async disconnect() {
      var i;
      window.localStorage.removeItem("vue-sui-accepted-adapter");
      const e = (i = this.$refs.sui) == null ? void 0 : i.suiInBrowser;
      e && e.activeAdapter && await e.activeAdapter.disconnect(), this.connectedAddress = null, this.connectedChain = null, this.activeAdapter = null, this.suiMaster = null, this.checkDisplayAddress();
    },
    setCache(e, i, t) {
      const s = {
        value: i,
        expiry: (/* @__PURE__ */ new Date()).getTime() + t
      };
      window.localStorage.setItem(e, JSON.stringify(s));
    },
    getCache(e) {
      try {
        const i = window.localStorage.getItem(e);
        if (!i)
          return;
        const t = JSON.parse(i);
        if ((/* @__PURE__ */ new Date()).getTime() > t.expiry) {
          window.localStorage.removeItem(e);
          return;
        }
        return t.value;
      } catch {
        return;
      }
    }
  },
  beforeMount: function() {
    if (this.__libsRequestedPromiseResolver = null, this.__libsRequestedPromise = new Promise((e) => {
      this.__libsRequestedPromiseResolver = e;
    }), this._readonlyTimeout = null, this._pendingReadonlySuiMaster = null, this._suiMasterCache = {}, this._isPrimary = !_, this._isPrimary && (_ = this), !this._isPrimary) {
      this._busListeners = {};
      const e = (i, t) => {
        this._busListeners[i] = t, S.addEventListener(i, t);
      };
      e("suiMaster", (i) => {
        var t;
        this.suiMaster = i.detail, this.connectedChain = (t = i.detail) == null ? void 0 : t.connectedChain, this.$emit("suiMaster", i.detail);
      }), e("client", (i) => {
        this.$emit("client", i.detail);
      }), e("provider", (i) => {
        this.$emit("provider", i.detail);
      }), e("connected", (i) => {
        this.connectedAddress = i.detail, this.showingDialog = !1, this.$emit("connected", i.detail);
      }), e("disconnected", () => {
        this.connectedAddress = null, this.connectedChain = null, this.activeAdapter = null, this.suiMaster = null, this.$emit("disconnected"), this.checkDisplayAddress();
      }), e("adapter", (i) => {
        this.activeAdapter = i.detail, this.$emit("adapter", i.detail);
      }), e("wrongchain", (i) => {
        this.$emit("wrongchain", i.detail);
      }), e("displayAddress", (i) => {
        this.displayAddress = i.detail, this.$emit("displayAddress", i.detail);
      });
    }
  },
  beforeUnmount: function() {
    if (_ === this && (_ = null), this._busListeners)
      for (const [e, i] of Object.entries(this._busListeners))
        S.removeEventListener(e, i);
  },
  mounted: async function() {
    this.initialize();
  }
}, z = { key: 0 }, j = { key: 1 };
function U(e, i, t, o, s, n) {
  const a = v("SignInWithSuiDialog"), d = v("SuidoubleSync");
  return r(), c("div", null, [
    t.visible ? (r(), c("div", {
      key: 0,
      onClick: i[0] || (i[0] = (...l) => n.onClick && n.onClick(...l))
    }, [
      s.connectedAddress ? f("", !0) : (r(), c("span", z, "Connect with Sui")),
      s.connectedAddress ? (r(), c("span", j, M(s.displayAddress), 1)) : f("", !0)
    ])) : f("", !0),
    (r(), A(k, { to: "body" }, [
      b(a, {
        showing: s.showingDialog,
        onHidden: i[1] || (i[1] = (l) => {
          this.showingDialog = !1;
        }),
        adapters: s.adapters,
        onClick: n.onAdapterClick
      }, null, 8, ["showing", "adapters", "onClick"])
    ])),
    s.libsRequested ? (r(), A(d, {
      key: 1,
      ref: "sui",
      rpcSettings: t.rpcSettings,
      defaultChain: t.defaultChain,
      onAdapters: n.onSuiAdapters,
      onSuiMaster: n.onSuiMaster,
      onLoaded: n.onLibsLoaded,
      onConnected: n.onConnected,
      onDisconnected: n.onDisconnected
    }, null, 8, ["rpcSettings", "defaultChain", "onAdapters", "onSuiMaster", "onLoaded", "onConnected", "onDisconnected"])) : f("", !0)
  ]);
}
const J = /* @__PURE__ */ w(V, [["render", U]]), H = {
  name: "SignInWithSuiButton",
  emits: ["suiMaster", "provider", "client", "adapter", "disconnected", "connected", "wrongchain", "displayAddress"],
  props: {
    defaultChain: {
      default: "sui:devnet",
      type: String
    },
    persist: {
      default: !1,
      type: Boolean
    }
  },
  components: {
    SignInWithSui: J
  },
  data() {
    return {
      connectedAddress: null,
      connectedChain: null,
      displayAddress: null
    };
  },
  methods: {
    onClick() {
      this.connectedAddress ? this.$refs.signin.disconnect() : this.$refs.signin.connect();
    },
    onDisplayAddress(e) {
      this.displayAddress = e, this.$emit("displayAddress", e);
    },
    onConnected(e) {
      this.connectedAddress = e, this.$emit("connected", e);
    },
    onDisconnected() {
      this.connectedAddress = null, this.$emit("disconnected");
    },
    onWrongChain(e) {
      this.$emit("wrongchain", e);
    },
    onSuiMaster(e) {
      this.$emit("suiMaster", e);
    },
    onProvider(e) {
      this.$emit("client", e), this.$emit("provider", e);
    },
    onAdapter(e) {
      this.$emit("adapter", e);
    }
  }
}, K = { class: "signinwithsui_button_inner" }, G = {
  key: 0,
  class: "signinwithsui_button_inner"
};
function Q(e, i, t, o, s, n) {
  const a = v("SignInWithSui");
  return r(), c("div", {
    class: "signinwithsui_button",
    onClick: i[0] || (i[0] = (...d) => n.onClick && n.onClick(...d))
  }, [
    m("div", K, [
      b(a, {
        visible: !0,
        defaultChain: t.defaultChain,
        persist: t.persist,
        ref: "signin",
        onProvider: n.onProvider,
        onOnAdapter: n.onAdapter,
        onWrongchain: n.onWrongChain,
        onConnected: n.onConnected,
        onDisconnected: n.onDisconnected,
        onSuiMaster: n.onSuiMaster,
        onDisplayAddress: n.onDisplayAddress
      }, null, 8, ["defaultChain", "persist", "onProvider", "onOnAdapter", "onWrongchain", "onConnected", "onDisconnected", "onSuiMaster", "onDisplayAddress"])
    ]),
    s.connectedAddress ? (r(), c("div", G, "disconnect")) : f("", !0)
  ]);
}
const Z = /* @__PURE__ */ w(H, [["render", Q], ["__scopeId", "data-v-c2cacafa"]]);
export {
  J as SignInWithSui,
  Z as SignInWithSuiButton
};
