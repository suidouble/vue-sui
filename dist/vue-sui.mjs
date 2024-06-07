import { SuiInBrowser as S } from "suidouble";
import { openBlock as o, createElementBlock as a, createElementVNode as d, normalizeClass as m, Fragment as w, renderList as C, toDisplayString as f, createCommentVNode as c, resolveComponent as g, createVNode as M, createBlock as p } from "vue";
import './index.css';const l = (e, i) => {
  const r = e.__vccOpts || e;
  for (const [u, t] of i)
    r[u] = t;
  return r;
}, v = {
  name: "SuiSync",
  props: {
    defaultChain: {
      default: "sui:devnet",
      type: String
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
    async reinitSueMaster() {
      this.suiMaster = await this.suiInBrowser.getSuiMaster(), (!this.lastSuiMasterInstanceN || this.lastSuiMasterInstanceN != this.suiMaster.instanceN) && this.$emit("suiMaster", this.suiMaster);
    }
  },
  mounted: function() {
    this.suiInBrowser = S.getSingleton({
      debug: !0,
      defaultChain: this.defaultChain
    }), console.log("mounted", this.suiInBrowser._defaultChain), this.adapters = Object.values(this.suiInBrowser.adapters), this.suiInBrowser.addEventListener("adapter", (e) => {
      this.adapters.push(e.detail), console.log(e.detail), this.$emit("adapters", this.adapters);
    }), this.suiInBrowser.addEventListener("connected", () => {
      this.connectedAddress = this.suiInBrowser.connectedAddress, this.connectedChain = this.suiInBrowser.connectedChain, this.reinitSueMaster(), this.$emit("connected", this.suiInBrowser);
    }), this.suiInBrowser.addEventListener("disconnected", () => {
      this.connectedAddress = null, this.connectedChain = null, this.$emit("disconnected");
    }), this.$nextTick(() => {
      this.$emit("loaded", this.suiInBrowser), this.$emit("adapters", this.adapters);
    }), this.suiInBrowser.isConnected && (this.connectedAddress = this.suiInBrowser.connectedAddress, this.connectedChain = this.suiInBrowser.connectedChain, this.reinitSueMaster(), this.$emit("connected", this.suiInBrowser)), this.reinitSueMaster();
  },
  computed: {}
};
function A(e, i, r, u, t, s) {
  return o(), a("div");
}
const b = /* @__PURE__ */ l(v, [["render", A]]), I = {
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
}, k = {
  key: 0,
  class: "signinwithsui_dialog"
}, y = { class: "signinwithsui_dialog_inner_card" }, P = { class: "signinwithsui_dialog_list" }, B = ["onClick"], $ = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_icon" }, L = ["src"], D = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_name" };
function R(e, i, r, u, t, s) {
  return t.isActive ? (o(), a("div", k, [
    d("div", {
      class: "signinwithsui_dialog_backdrop",
      onClick: i[0] || (i[0] = (...n) => s.onBackdrop && s.onBackdrop(...n))
    }),
    d("div", {
      class: m(["signinwithsui_dialog_inner", { signinwithsui_dialog_inner_active: t.isVisible }])
    }, [
      d("div", y, [
        d("div", P, [
          (o(!0), a(w, null, C(r.adapters, (n, h) => (o(), a(w, { key: h }, [
            n.isDefault || n.okForSui ? (o(), a("div", {
              key: 0,
              class: m(["signinwithsui_dialog_item", { signinwithsui_dialog_item_disabled: n.isDefault }]),
              onClick: (_) => s.onAdapterClick(n)
            }, [
              d("div", $, [
                d("img", {
                  loading: "lazy",
                  fetchpriority: "auto",
                  "aria-hidden": "true",
                  draggable: "false",
                  src: n.icon
                }, null, 8, L)
              ]),
              d("div", D, f(n.name), 1)
            ], 10, B)) : c("", !0)
          ], 64))), 128))
        ])
      ])
    ], 2)
  ])) : c("", !0);
}
const W = /* @__PURE__ */ l(I, [["render", R], ["__scopeId", "data-v-5933915b"]]), q = {
  name: "SignInWithSui",
  emits: ["suiMaster", "provider", "client", "adapter", "disconnected", "connected", "wrongchain"],
  props: {
    defaultChain: {
      default: "sui:devnet",
      type: String
    },
    auto: {
      default: !1,
      type: Boolean
    },
    visible: {
      default: !0,
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
    SuidoubleSync: b,
    SignInWithSuiDialog: W
  },
  methods: {
    /**
     * SuiMaster instance updated
     * @param {SuiMaster} suiMaster 
     */
    onSuiMaster(e) {
      this.suiMaster = e, (!this.defaultChain || this.defaultChain == this.suiMaster.connectedChain) && (this.$emit("suiMaster", e), e.getClient().then((i) => {
        this.$emit("client", i), this.$emit("provider", i), e.signer && e.signer.activeAdapter && this.$emit("adapter", e.signer.activeAdapter);
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
      this.isLoading = !0, await this.$refs.sui.suiInBrowser.connect(e), this.isLoading = !1;
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
      this.auto && (this.isLoading = !0, await this.requestLibs(), this.isLoading = !1);
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
}, E = { key: 0 }, x = { key: 1 };
function T(e, i, r, u, t, s) {
  const n = g("SignInWithSuiDialog"), h = g("SuidoubleSync");
  return o(), a("div", null, [
    r.visible ? (o(), a("div", {
      key: 0,
      onClick: i[0] || (i[0] = (..._) => s.onClick && s.onClick(..._))
    }, [
      t.connectedAddress ? c("", !0) : (o(), a("span", E, "Connect with Sui")),
      t.connectedAddress ? (o(), a("span", x, "Connected as " + f(s.displayAddress) + " (" + f(t.connectedChain) + ")", 1)) : c("", !0)
    ])) : c("", !0),
    M(n, {
      showing: t.showingDialog,
      onHidden: i[1] || (i[1] = (_) => {
        this.showingDialog = !1;
      }),
      adapters: t.adapters,
      onClick: s.onAdapterClick
    }, null, 8, ["showing", "adapters", "onClick"]),
    t.libsRequested ? (o(), p(h, {
      key: 1,
      ref: "sui",
      defaultChain: r.defaultChain,
      onAdapters: s.onSuiAdapters,
      onSuiMaster: s.onSuiMaster,
      onLoaded: s.onLibsLoaded,
      onConnected: s.onConnected,
      onDisconnected: s.onDisconnected
    }, null, 8, ["defaultChain", "onAdapters", "onSuiMaster", "onLoaded", "onConnected", "onDisconnected"])) : c("", !0)
  ]);
}
const V = /* @__PURE__ */ l(q, [["render", T]]), z = {
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
function O(e, i, r, u, t, s) {
  const n = g("SignInWithSui");
  return o(), a("div", {
    class: "signinwithsui_button",
    onClick: i[1] || (i[1] = (h) => {
      this.$refs.signin.onClick();
    })
  }, [
    M(n, {
      defaultChain: r.defaultChain,
      ref: "signin",
      onProvider: s.onProvider,
      onOnAdapter: s.onAdapter,
      onWrongchain: s.onWrongChain,
      onConnected: s.onConnected,
      onDisconnected: i[0] || (i[0] = (h) => this.$emit("disconnected")),
      onSuiMaster: s.onSuiMaster
    }, null, 8, ["defaultChain", "onProvider", "onOnAdapter", "onWrongchain", "onConnected", "onSuiMaster"])
  ]);
}
const H = /* @__PURE__ */ l(z, [["render", O], ["__scopeId", "data-v-b96de773"]]);
export {
  V as SignInWithSui,
  H as SignInWithSuiButton
};
