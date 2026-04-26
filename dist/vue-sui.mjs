import { SuiInBrowser as C } from "suidouble";
import { openBlock as a, createElementBlock as d, createElementVNode as c, normalizeClass as f, Fragment as _, renderList as v, toDisplayString as p, createCommentVNode as h, resolveComponent as m, createBlock as w, Teleport as A, createVNode as S } from "vue";
import './index.css';const l = (e, i) => {
  const s = e.__vccOpts || e;
  for (const [r, n] of i)
    s[r] = n;
  return s;
}, y = {
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
    var e, i, s;
    this._onAdapter && ((e = this.suiInBrowser) == null || e.removeEventListener("adapter", this._onAdapter)), this._onConnected && ((i = this.suiInBrowser) == null || i.removeEventListener("connected", this._onConnected)), this._onDisconnected && ((s = this.suiInBrowser) == null || s.removeEventListener("disconnected", this._onDisconnected));
  },
  mounted: function() {
    this.suiInBrowser = C.getSingleton({
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
function M(e, i, s, r, n, t) {
  return a(), d("div");
}
const I = /* @__PURE__ */ l(y, [["render", M]]), k = {
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
}, b = {
  key: 0,
  class: "signinwithsui_dialog"
}, D = { class: "signinwithsui_dialog_inner_card" }, P = { class: "signinwithsui_dialog_list" }, B = ["onClick"], L = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_icon" }, R = ["src"], $ = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_name" };
function W(e, i, s, r, n, t) {
  return n.isActive ? (a(), d("div", b, [
    c("div", {
      class: "signinwithsui_dialog_backdrop",
      onClick: i[0] || (i[0] = (...o) => t.onBackdrop && t.onBackdrop(...o))
    }),
    c("div", {
      class: f(["signinwithsui_dialog_inner", { signinwithsui_dialog_inner_active: n.isVisible }])
    }, [
      c("div", D, [
        c("div", P, [
          (a(!0), d(_, null, v(s.adapters, (o, u) => (a(), d(_, { key: u }, [
            o && o.name && (o.isDefault || o.okForSui) ? (a(), d("div", {
              key: 0,
              class: f(["signinwithsui_dialog_item", { signinwithsui_dialog_item_disabled: o.isDefault }]),
              onClick: (g) => t.onAdapterClick(o)
            }, [
              c("div", L, [
                c("img", {
                  loading: "lazy",
                  fetchpriority: "auto",
                  "aria-hidden": "true",
                  draggable: "false",
                  src: o.icon
                }, null, 8, R)
              ]),
              c("div", $, p(o.name), 1)
            ], 10, B)) : h("", !0)
          ], 64))), 128))
        ])
      ])
    ], 2)
  ])) : h("", !0);
}
const N = /* @__PURE__ */ l(k, [["render", W], ["__scopeId", "data-v-7fbb2031"]]), T = {
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
    defaultChain: async function() {
      this.connectedAddress = null, this.connectedChain = null, this.suiMaster = null, this.libsRequested = !1, await new Promise((e) => setTimeout(e, 50)), this.libsRequested = !0;
    }
  },
  computed: {},
  components: {
    SuidoubleSync: I,
    SignInWithSuiDialog: N
  },
  methods: {
    checkDisplayAddress() {
      let e = this.displayAddress;
      this.connectedAddress ? this.connectedAddress && (this.resolvedNameServiceName ? e = this.resolvedNameServiceName : e = ("" + this.connectedAddress).substr(0, 6) + "..." + ("" + this.connectedAddress).substr(-4)) : e = null, this.displayAddress != e && (this.displayAddress = e, this.$emit("displayAddress", this.displayAddress));
    },
    async getNameServiceName() {
      if (this.suiMaster && this.suiMaster.address) {
        const e = "resolvedNameServiceName_" + this.suiMaster.connectedChain + ":" + this.suiMaster.address, i = 10 * 60 * 1e3, s = this.getCache(e);
        if (s !== void 0)
          this.resolvedNameServiceName = s;
        else {
          const r = await this.suiMaster.defaultNameServiceName();
          this.resolvedNameServiceName = r, this.setCache(e, r, i);
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
      console.log("[SignInWithSui] onSuiMaster, instanceN:", e == null ? void 0 : e.instanceN, "address:", e == null ? void 0 : e.address, "connectedChain:", e == null ? void 0 : e.connectedChain, "defaultChain:", this.defaultChain), this.suiMaster = e;
      const i = (s) => s && s.replace(/^sui:/, "");
      !this.defaultChain || i(this.defaultChain) == i(this.suiMaster.connectedChain) ? (console.log("[SignInWithSui] chain matches, emitting suiMaster to parent"), this.$emit("suiMaster", e), e.getClient().then((s) => {
        console.log("[SignInWithSui] got client:", s == null ? void 0 : s.network), this.$emit("client", s), this.$emit("provider", s), e.signer && e.signer.activeAdapter && (this.$emit("adapter", e.signer.activeAdapter), this.activeAdapter = e.signer.activeAdapter);
      }), this.getNameServiceName()) : console.log("[SignInWithSui] chain MISMATCH — defaultChain:", this.defaultChain, "suiMaster.connectedChain:", this.suiMaster.connectedChain), this.__suiMasterPromise && this.suiMaster && (this.__suiMasterPromiseResolver(), this.__suiMasterPromise = null), this.__connectedSuiMasterPromise && this.isSuiMasterConnected() && (this.__connectedSuiMasterPromiseResolver(), this.__connectedSuiMasterPromise = null);
    },
    onSuiAdapters(e) {
      this.adapters = e;
    },
    isSuiMasterConnected(e = null) {
      return this.suiMaster && this.suiMaster.address ? !(e && this.suiMaster.connectedChain != e) : this.suiMaster && this.suiMaster.signer && this.suiMaster.signer.connectedAddress ? !(e && this.suiMaster.signer.connectedChain != e) : !1;
    },
    async onAdapterClick(e) {
      if (this.showingDialog = !1, e.isDefault && !e.isInstalled)
        return window.open(e.getDownloadURL(), "_blank"), !1;
      this.isLoading = !0, await this.$refs.sui.suiInBrowser.connect(e), this.persist && window.localStorage.setItem("vue-sui-preferred-adapter", e.name), this.isLoading = !1;
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
        const e = window.localStorage.getItem("vue-sui-preferred-adapter");
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
      var s, r, n, t;
      const e = (r = (s = this.$refs.sui) == null ? void 0 : s.suiInBrowser) == null ? void 0 : r.connectedChain, i = (t = (n = this.$refs.sui) == null ? void 0 : n.suiInBrowser) == null ? void 0 : t.connectedAddress;
      console.log("[SignInWithSui] onConnected, address:", i, "chain:", e, "defaultChain:", this.defaultChain), this.showingDialog = !1, !this.defaultChain || this.defaultChain == e ? (this.connectedAddress = i, this.connectedChain = e, console.log('[SignInWithSui] emitting "connected" to parent, address:', this.connectedAddress), this.$emit("connected", this.connectedAddress), this.checkDisplayAddress()) : (this.connectedAddress = null, console.log('[SignInWithSui] wrong chain, emitting "wrongchain":', e), this.$emit("wrongchain", e), this.checkDisplayAddress());
    },
    onDisconnected() {
      console.log("[SignInWithSui] onDisconnected"), this.connectedAddress = null, this.$emit("disconnected"), this.checkDisplayAddress();
    },
    async disconnect() {
      window.localStorage.setItem("vue-sui-preferred-adapter", null);
      try {
        await this.activeAdapter.disconnect();
      } catch (e) {
        return console.error(e), window.location.reload(), !1;
      }
      return !0;
    },
    setCache(e, i, s) {
      const n = {
        value: i,
        expiry: (/* @__PURE__ */ new Date()).getTime() + s
      };
      window.localStorage.setItem(e, JSON.stringify(n));
    },
    getCache(e) {
      try {
        const i = window.localStorage.getItem(e);
        if (!i)
          return;
        const s = JSON.parse(i);
        if ((/* @__PURE__ */ new Date()).getTime() > s.expiry) {
          window.localStorage.removeItem(e);
          return;
        }
        return s.value;
      } catch {
        return;
      }
    }
  },
  beforeMount: function() {
    this.__libsRequestedPromiseResolver = null, this.__libsRequestedPromise = new Promise((e) => {
      this.__libsRequestedPromiseResolver = e;
    });
  },
  mounted: async function() {
    this.initialize();
  }
}, E = { key: 0 }, q = { key: 1 };
function x(e, i, s, r, n, t) {
  const o = m("SignInWithSuiDialog"), u = m("SuidoubleSync");
  return a(), d("div", null, [
    s.visible ? (a(), d("div", {
      key: 0,
      onClick: i[0] || (i[0] = (...g) => t.onClick && t.onClick(...g))
    }, [
      n.connectedAddress ? h("", !0) : (a(), d("span", E, "Connect with Sui")),
      n.connectedAddress ? (a(), d("span", q, p(n.displayAddress), 1)) : h("", !0)
    ])) : h("", !0),
    (a(), w(A, { to: "body" }, [
      S(o, {
        showing: n.showingDialog,
        onHidden: i[1] || (i[1] = (g) => {
          this.showingDialog = !1;
        }),
        adapters: n.adapters,
        onClick: t.onAdapterClick
      }, null, 8, ["showing", "adapters", "onClick"])
    ])),
    n.libsRequested ? (a(), w(u, {
      key: 1,
      ref: "sui",
      rpcSettings: s.rpcSettings,
      defaultChain: s.defaultChain,
      onAdapters: t.onSuiAdapters,
      onSuiMaster: t.onSuiMaster,
      onLoaded: t.onLibsLoaded,
      onConnected: t.onConnected,
      onDisconnected: t.onDisconnected
    }, null, 8, ["rpcSettings", "defaultChain", "onAdapters", "onSuiMaster", "onLoaded", "onConnected", "onDisconnected"])) : h("", !0)
  ]);
}
const O = /* @__PURE__ */ l(T, [["render", x]]), V = {
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
    SignInWithSui: O
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
}, z = { class: "signinwithsui_button_inner" }, j = {
  key: 0,
  class: "signinwithsui_button_inner"
};
function F(e, i, s, r, n, t) {
  const o = m("SignInWithSui");
  return a(), d("div", {
    class: "signinwithsui_button",
    onClick: i[0] || (i[0] = (...u) => t.onClick && t.onClick(...u))
  }, [
    c("div", z, [
      S(o, {
        visible: !0,
        defaultChain: s.defaultChain,
        persist: s.persist,
        ref: "signin",
        onProvider: t.onProvider,
        onOnAdapter: t.onAdapter,
        onWrongchain: t.onWrongChain,
        onConnected: t.onConnected,
        onDisconnected: t.onDisconnected,
        onSuiMaster: t.onSuiMaster,
        onDisplayAddress: t.onDisplayAddress
      }, null, 8, ["defaultChain", "persist", "onProvider", "onOnAdapter", "onWrongchain", "onConnected", "onDisconnected", "onSuiMaster", "onDisplayAddress"])
    ]),
    n.connectedAddress ? (a(), d("div", j, "disconnect")) : h("", !0)
  ]);
}
const U = /* @__PURE__ */ l(V, [["render", F], ["__scopeId", "data-v-c2cacafa"]]);
export {
  O as SignInWithSui,
  U as SignInWithSuiButton
};
