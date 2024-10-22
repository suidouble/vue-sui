import { SuiInBrowser as S } from "suidouble";
import { openBlock as o, createElementBlock as a, createElementVNode as d, normalizeClass as m, Fragment as w, renderList as C, toDisplayString as f, createCommentVNode as c, resolveComponent as g, createVNode as p, createBlock as M } from "vue";
import './index.css';const l = (e, i) => {
  const r = e.__vccOpts || e;
  for (const [u, s] of i)
    r[u] = s;
  return r;
}, v = {
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
    }), this.rpcSettings && this.suiInBrowser.setRPC(this.rpcSettings), console.log("mounted", this.suiInBrowser._defaultChain), this.adapters = Object.values(this.suiInBrowser.adapters), this.suiInBrowser.addEventListener("adapter", (e) => {
      this.adapters.push(e.detail), console.log(e.detail), this.$emit("adapters", this.adapters);
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
function A(e, i, r, u, s, t) {
  return o(), a("div");
}
const y = /* @__PURE__ */ l(v, [["render", A]]), I = {
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
      this.hide();
    }
  },
  beforeMount: function() {
  },
  mounted: async function() {
  }
}, b = {
  key: 0,
  class: "signinwithsui_dialog"
}, P = { class: "signinwithsui_dialog_inner_card" }, k = { class: "signinwithsui_dialog_list" }, B = ["onClick"], L = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_icon" }, $ = ["src"], R = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_name" };
function D(e, i, r, u, s, t) {
  return s.isActive ? (o(), a("div", b, [
    d("div", {
      class: "signinwithsui_dialog_backdrop",
      onClick: i[0] || (i[0] = (...n) => t.onBackdrop && t.onBackdrop(...n))
    }),
    d("div", {
      class: m(["signinwithsui_dialog_inner", { signinwithsui_dialog_inner_active: s.isVisible }])
    }, [
      d("div", P, [
        d("div", k, [
          (o(!0), a(w, null, C(r.adapters, (n, h) => (o(), a(w, { key: h }, [
            n.isDefault || n.okForSui ? (o(), a("div", {
              key: 0,
              class: m(["signinwithsui_dialog_item", { signinwithsui_dialog_item_disabled: n.isDefault }]),
              onClick: (_) => t.onAdapterClick(n)
            }, [
              d("div", L, [
                d("img", {
                  loading: "lazy",
                  fetchpriority: "auto",
                  "aria-hidden": "true",
                  draggable: "false",
                  src: n.icon
                }, null, 8, $)
              ]),
              d("div", R, f(n.name), 1)
            ], 10, B)) : c("", !0)
          ], 64))), 128))
        ])
      ])
    ], 2)
  ])) : c("", !0);
}
const W = /* @__PURE__ */ l(I, [["render", D], ["__scopeId", "data-v-5933915b"]]), q = {
  name: "SignInWithSui",
  emits: ["suiMaster", "provider", "client", "adapter", "disconnected", "connected", "wrongchain"],
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
      connectedChain: null,
      forceChainCalculated: null,
      suiMaster: null,
      activeAdapter: null,
      showingDialog: !1
    };
  },
  watch: {
    defaultChain: async function() {
      this.connectedAddress = null, this.connectedChain = null, this.suiMaster = null, console.error("switched"), this.libsRequested = !1, await new Promise((e) => setTimeout(e, 50)), this.libsRequested = !0;
    }
  },
  computed: {
    displayAddress() {
      return ("" + this.connectedAddress).substr(0, 6) + "..." + ("" + this.connectedAddress).substr(-4);
    }
  },
  components: {
    SuidoubleSync: y,
    SignInWithSuiDialog: W
  },
  methods: {
    /**
     * SuiMaster instance updated
     * @param {SuiMaster} suiMaster 
     */
    onSuiMaster(e) {
      this.suiMaster = e, (!this.defaultChain || this.defaultChain == this.suiMaster.connectedChain) && (this.$emit("suiMaster", e), e.getClient().then((i) => {
        this.$emit("client", i), this.$emit("provider", i), e.signer && e.signer.activeAdapter && (this.$emit("adapter", e.signer.activeAdapter), this.activeAdapter = e.signer.activeAdapter);
      })), this.__suiMasterPromise && this.suiMaster && (this.__suiMasterPromiseResolver(), this.__suiMasterPromise = null), this.__connectedSuiMasterPromise && this.isSuiMasterConnected() && (this.__connectedSuiMasterPromiseResolver(), this.__connectedSuiMasterPromise = null);
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
          console.log(i.okForSui, i.name), i.name && i.okForSui && i.name == e && this.onAdapterClick(i);
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
      !this.defaultChain || this.defaultChain == e ? (this.connectedAddress = this.$refs.sui.suiInBrowser.connectedAddress, this.connectedChain = this.$refs.sui.suiInBrowser.connectedChain, this.$emit("connected", this.connectedAddress)) : (this.connectedAddress = null, this.$emit("wrongchain", e));
    },
    onDisconnected() {
      this.connectedAddress = null, this.$emit("disconnected");
    },
    async disconnect() {
      window.localStorage.setItem("vue-sui-preferred-adapter", null);
      try {
        await this.activeAdapter.disconnect();
      } catch (e) {
        return console.error(e), window.location.reload(), !1;
      }
      return !0;
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
}, E = { key: 0 }, T = { key: 1 };
function x(e, i, r, u, s, t) {
  const n = g("SignInWithSuiDialog"), h = g("SuidoubleSync");
  return o(), a("div", null, [
    r.visible ? (o(), a("div", {
      key: 0,
      onClick: i[0] || (i[0] = (..._) => t.onClick && t.onClick(..._))
    }, [
      s.connectedAddress ? c("", !0) : (o(), a("span", E, "Connect with Sui")),
      s.connectedAddress ? (o(), a("span", T, "Connected as " + f(t.displayAddress) + " (" + f(s.connectedChain) + ")", 1)) : c("", !0)
    ])) : c("", !0),
    p(n, {
      showing: s.showingDialog,
      onHidden: i[1] || (i[1] = (_) => {
        this.showingDialog = !1;
      }),
      adapters: s.adapters,
      onClick: t.onAdapterClick
    }, null, 8, ["showing", "adapters", "onClick"]),
    s.libsRequested ? (o(), M(h, {
      key: 1,
      ref: "sui",
      rpcSettings: r.rpcSettings,
      defaultChain: r.defaultChain,
      onAdapters: t.onSuiAdapters,
      onSuiMaster: t.onSuiMaster,
      onLoaded: t.onLibsLoaded,
      onConnected: t.onConnected,
      onDisconnected: t.onDisconnected
    }, null, 8, ["rpcSettings", "defaultChain", "onAdapters", "onSuiMaster", "onLoaded", "onConnected", "onDisconnected"])) : c("", !0)
  ]);
}
const V = /* @__PURE__ */ l(q, [["render", x]]), O = {
  name: "SignInWithSuiButton",
  emits: ["suiMaster", "provider", "client", "adapter", "disconnected", "connected", "wrongchain"],
  props: {
    defaultChain: {
      default: "sui:devnet",
      type: String
    }
  },
  components: {
    SignInWithSui: V
  },
  data() {
    return {
      connectedAddress: null,
      connectedChain: null
    };
  },
  methods: {
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
};
function z(e, i, r, u, s, t) {
  const n = g("SignInWithSui");
  return o(), a("div", {
    class: "signinwithsui_button",
    onClick: i[0] || (i[0] = (h) => {
      this.$refs.signin.onClick();
    })
  }, [
    p(n, {
      defaultChain: r.defaultChain,
      ref: "signin",
      onProvider: t.onProvider,
      onOnAdapter: t.onAdapter,
      onWrongchain: t.onWrongChain,
      onConnected: t.onConnected,
      onDisconnected: t.onDisconnected,
      onSuiMaster: t.onSuiMaster
    }, null, 8, ["defaultChain", "onProvider", "onOnAdapter", "onWrongchain", "onConnected", "onDisconnected", "onSuiMaster"])
  ]);
}
const H = /* @__PURE__ */ l(O, [["render", z], ["__scopeId", "data-v-9f95f778"]]);
export {
  V as SignInWithSui,
  H as SignInWithSuiButton
};
