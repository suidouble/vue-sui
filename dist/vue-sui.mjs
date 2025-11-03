import { SuiInBrowser as S } from "suidouble";
import { createElementBlock as a, openBlock as o, createCommentVNode as u, createElementVNode as c, normalizeClass as _, Fragment as g, renderList as v, toDisplayString as w, resolveComponent as f, createVNode as p, createBlock as C } from "vue";
import './index.css';const l = (e, s) => {
  const t = e.__vccOpts || e;
  for (const [d, n] of s)
    t[d] = n;
  return t;
}, M = {
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
      suiMaster: null,
      lastSuiMasterInstanceN: null
    };
  },
  emits: ["connect", "connected", "loaded", "disconnected", "error", "suiMaster", "adapters"],
  components: {},
  watch: {},
  methods: {
    async reinitSuiMaster() {
      this.suiMaster = await this.suiInBrowser.getSuiMaster(), (!this.lastSuiMasterInstanceN || this.lastSuiMasterInstanceN != this.suiMaster.instanceN) && this.$emit("suiMaster", this.suiMaster);
    },
    async setRPC(e = {}) {
      await this.suiInBrowser.setRPC(e), await this.reinitSuiMaster();
    }
  },
  mounted: function() {
    this.suiInBrowser = S.getSingleton({
      debug: !0,
      defaultChain: this.defaultChain
    }), this.rpcSettings && this.suiInBrowser.setRPC(this.rpcSettings), this.adapters = Object.values(this.suiInBrowser.adapters), this.suiInBrowser.addEventListener("adapter", (e) => {
      this.adapters.push(e.detail), this.$emit("adapters", this.adapters);
    }), this.suiInBrowser.addEventListener("connected", () => {
      this.connectedAddress = this.suiInBrowser.connectedAddress, this.connectedChain = this.suiInBrowser.connectedChain, this.reinitSuiMaster(), this.$emit("connected", this.suiInBrowser);
    }), this.suiInBrowser.addEventListener("disconnected", () => {
      this.connectedAddress = null, this.connectedChain = null, this.$emit("disconnected");
    }), this.$nextTick(() => {
      this.$emit("loaded", this.suiInBrowser), this.$emit("adapters", this.adapters);
    }), this.suiInBrowser.isConnected && (this.connectedAddress = this.suiInBrowser.connectedAddress, this.connectedChain = this.suiInBrowser.connectedChain, this.reinitSuiMaster(), this.$emit("connected", this.suiInBrowser)), this.reinitSuiMaster();
  },
  computed: {}
};
function A(e, s, t, d, n, i) {
  return o(), a("div");
}
const y = /* @__PURE__ */ l(M, [["render", A]]), k = {
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
}, I = { class: "signinwithsui_dialog_inner_card" }, P = { class: "signinwithsui_dialog_list" }, D = ["onClick"], B = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_icon" }, L = ["src"], $ = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_name" };
function R(e, s, t, d, n, i) {
  return n.isActive ? (o(), a("div", b, [
    c("div", {
      class: "signinwithsui_dialog_backdrop",
      onClick: s[0] || (s[0] = (...r) => i.onBackdrop && i.onBackdrop(...r))
    }),
    c("div", {
      class: _(["signinwithsui_dialog_inner", { signinwithsui_dialog_inner_active: n.isVisible }])
    }, [
      c("div", I, [
        c("div", P, [
          (o(!0), a(g, null, v(t.adapters, (r, h) => (o(), a(g, { key: h }, [
            r && r.name && (r.isDefault || r.okForSui) ? (o(), a("div", {
              key: 0,
              class: _(["signinwithsui_dialog_item", { signinwithsui_dialog_item_disabled: r.isDefault }]),
              onClick: (m) => i.onAdapterClick(r)
            }, [
              c("div", B, [
                c("img", {
                  loading: "lazy",
                  fetchpriority: "auto",
                  "aria-hidden": "true",
                  draggable: "false",
                  src: r.icon
                }, null, 8, L)
              ]),
              c("div", $, w(r.name), 1)
            ], 10, D)) : u("", !0)
          ], 64))), 128))
        ])
      ])
    ], 2)
  ])) : u("", !0);
}
const N = /* @__PURE__ */ l(k, [["render", R], ["__scopeId", "data-v-7fbb2031"]]), W = {
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
    SuidoubleSync: y,
    SignInWithSuiDialog: N
  },
  methods: {
    checkDisplayAddress() {
      let e = this.displayAddress;
      this.connectedAddress ? this.connectedAddress && (this.resolvedNameServiceName ? e = this.resolvedNameServiceName : e = ("" + this.connectedAddress).substr(0, 6) + "..." + ("" + this.connectedAddress).substr(-4)) : e = null, this.displayAddress != e && (this.displayAddress = e, this.$emit("displayAddress", this.displayAddress));
    },
    async getNameServiceName() {
      if (this.suiMaster && this.suiMaster.address) {
        const e = "resolvedNameServiceName_" + this.suiMaster.connectedChain + ":" + this.suiMaster.address, s = 10 * 60 * 1e3, t = this.getCache(e);
        if (t !== void 0)
          this.resolvedNameServiceName = t;
        else {
          const d = await this.suiMaster.resolveNameServiceName();
          this.resolvedNameServiceName = d, this.setCache(e, d, s);
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
      this.suiMaster = e, (!this.defaultChain || this.defaultChain == this.suiMaster.connectedChain) && (this.$emit("suiMaster", e), e.getClient().then((s) => {
        this.$emit("client", s), this.$emit("provider", s), e.signer && e.signer.activeAdapter && (this.$emit("adapter", e.signer.activeAdapter), this.activeAdapter = e.signer.activeAdapter);
      }), this.getNameServiceName()), this.__suiMasterPromise && this.suiMaster && (this.__suiMasterPromiseResolver(), this.__suiMasterPromise = null), this.__connectedSuiMasterPromise && this.isSuiMasterConnected() && (this.__connectedSuiMasterPromiseResolver(), this.__connectedSuiMasterPromise = null);
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
      if (await this.requestLibs(), await new Promise((s) => {
        setTimeout(s, 200);
      }), this.isSuiMasterConnected(e))
        return this.suiMaster;
      if (this.isLoading = !0, this.__connectedSuiMasterPromise) {
        if (await this.__connectedSuiMasterPromise, this.isLoading = !1, this.isSuiMasterConnected(e))
          return this.suiMaster;
        throw new Error("can not get connection");
      }
      if (this.__connectedSuiMasterPromiseResolver = null, this.__connectedSuiMasterPromise = new Promise((s) => {
        this.__connectedSuiMasterPromiseResolver = s;
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
        e && this.adapters.forEach((s) => {
          s.name && s.okForSui && s.name == e && this.onAdapterClick(s);
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
      this.showingDialog = !1;
      const e = this.$refs.sui.suiInBrowser.connectedChain;
      !this.defaultChain || this.defaultChain == e ? (this.connectedAddress = this.$refs.sui.suiInBrowser.connectedAddress, this.connectedChain = this.$refs.sui.suiInBrowser.connectedChain, this.$emit("connected", this.connectedAddress), this.checkDisplayAddress()) : (this.connectedAddress = null, this.$emit("wrongchain", e), this.checkDisplayAddress());
    },
    onDisconnected() {
      this.connectedAddress = null, this.$emit("disconnected"), this.checkDisplayAddress();
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
    setCache(e, s, t) {
      const n = {
        value: s,
        expiry: (/* @__PURE__ */ new Date()).getTime() + t
      };
      window.localStorage.setItem(e, JSON.stringify(n));
    },
    getCache(e) {
      try {
        const s = window.localStorage.getItem(e);
        if (!s)
          return;
        const t = JSON.parse(s);
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
    this.__libsRequestedPromiseResolver = null, this.__libsRequestedPromise = new Promise((e) => {
      this.__libsRequestedPromiseResolver = e;
    });
  },
  mounted: async function() {
    this.initialize();
  }
}, T = { key: 0 }, q = { key: 1 };
function E(e, s, t, d, n, i) {
  const r = f("SignInWithSuiDialog"), h = f("SuidoubleSync");
  return o(), a("div", null, [
    t.visible ? (o(), a("div", {
      key: 0,
      onClick: s[0] || (s[0] = (...m) => i.onClick && i.onClick(...m))
    }, [
      n.connectedAddress ? u("", !0) : (o(), a("span", T, "Connect with Sui")),
      n.connectedAddress ? (o(), a("span", q, w(n.displayAddress), 1)) : u("", !0)
    ])) : u("", !0),
    p(r, {
      showing: n.showingDialog,
      onHidden: s[1] || (s[1] = (m) => {
        this.showingDialog = !1;
      }),
      adapters: n.adapters,
      onClick: i.onAdapterClick
    }, null, 8, ["showing", "adapters", "onClick"]),
    n.libsRequested ? (o(), C(h, {
      key: 1,
      ref: "sui",
      rpcSettings: t.rpcSettings,
      defaultChain: t.defaultChain,
      onAdapters: i.onSuiAdapters,
      onSuiMaster: i.onSuiMaster,
      onLoaded: i.onLibsLoaded,
      onConnected: i.onConnected,
      onDisconnected: i.onDisconnected
    }, null, 8, ["rpcSettings", "defaultChain", "onAdapters", "onSuiMaster", "onLoaded", "onConnected", "onDisconnected"])) : u("", !0)
  ]);
}
const x = /* @__PURE__ */ l(W, [["render", E]]), O = {
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
    SignInWithSui: x
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
}, V = { class: "signinwithsui_button_inner" }, z = {
  key: 0,
  class: "signinwithsui_button_inner"
};
function j(e, s, t, d, n, i) {
  const r = f("SignInWithSui");
  return o(), a("div", {
    class: "signinwithsui_button",
    onClick: s[0] || (s[0] = (...h) => i.onClick && i.onClick(...h))
  }, [
    c("div", V, [
      p(r, {
        defaultChain: t.defaultChain,
        persist: t.persist,
        ref: "signin",
        onProvider: i.onProvider,
        onOnAdapter: i.onAdapter,
        onWrongchain: i.onWrongChain,
        onConnected: i.onConnected,
        onDisconnected: i.onDisconnected,
        onSuiMaster: i.onSuiMaster,
        onDisplayAddress: i.onDisplayAddress
      }, null, 8, ["defaultChain", "persist", "onProvider", "onOnAdapter", "onWrongchain", "onConnected", "onDisconnected", "onSuiMaster", "onDisplayAddress"])
    ]),
    n.connectedAddress ? (o(), a("div", z, "disconnect")) : u("", !0)
  ]);
}
const H = /* @__PURE__ */ l(O, [["render", j], ["__scopeId", "data-v-9be482c4"]]);
export {
  x as SignInWithSui,
  H as SignInWithSuiButton
};
