import { Fragment as e, Teleport as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, normalizeClass as s, openBlock as c, renderList as l, resolveComponent as u, toDisplayString as d } from "vue";
import { SuiInBrowser as f } from "suidouble";
import './index.css';//#region \0plugin-vue:export-helper
var p = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, m = {
	name: "SuiSync",
	props: {
		defaultChain: {
			default: "sui:devnet",
			type: String
		},
		rpcSettings: { type: Object }
	},
	data() {
		return {
			connectedAddress: null,
			connectedChain: null,
			adapters: [],
			suiInBrowser: null,
			suiMaster: null
		};
	},
	emits: [
		"connect",
		"connected",
		"loaded",
		"disconnected",
		"error",
		"suiMaster",
		"adapters"
	],
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
		this._onAdapter && this.suiInBrowser?.removeEventListener("adapter", this._onAdapter), this._onConnected && this.suiInBrowser?.removeEventListener("connected", this._onConnected), this._onDisconnected && this.suiInBrowser?.removeEventListener("disconnected", this._onDisconnected);
	},
	mounted: function() {
		this.suiInBrowser = f.getSingleton({
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
function h(e, t, n, r, a, o) {
	return c(), i("div");
}
var g = /*#__PURE__*/ p(m, [["render", h]]), _ = {
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
	watch: { showing: function() {
		this.showing ? this.show() : this.hide();
	} },
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
	beforeMount: function() {},
	mounted: async function() {}
}, v = {
	key: 0,
	class: "signinwithsui_dialog"
}, y = { class: "signinwithsui_dialog_inner_card" }, b = { class: "signinwithsui_dialog_list" }, x = ["onClick"], S = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_icon" }, C = ["src"], w = { class: "signinwithsui_dialog_item_column signinwithsui_dialog_item_name" };
function T(t, n, o, u, f, p) {
	return f.isActive ? (c(), i("div", v, [a("div", {
		class: "signinwithsui_dialog_backdrop",
		onClick: n[0] ||= (...e) => p.onBackdrop && p.onBackdrop(...e)
	}), a("div", { class: s(["signinwithsui_dialog_inner", { signinwithsui_dialog_inner_active: f.isVisible }]) }, [a("div", y, [a("div", b, [(c(!0), i(e, null, l(o.adapters, (t, n) => (c(), i(e, { key: n }, [t && t.name && (t.isDefault || t.okForSui) ? (c(), i("div", {
		key: 0,
		class: s(["signinwithsui_dialog_item", { signinwithsui_dialog_item_disabled: t.isDefault }]),
		onClick: (e) => p.onAdapterClick(t)
	}, [a("div", S, [a("img", {
		loading: "lazy",
		fetchpriority: "auto",
		"aria-hidden": "true",
		draggable: "false",
		src: t.icon
	}, null, 8, C)]), a("div", w, d(t.name), 1)], 10, x)) : r("", !0)], 64))), 128))])])], 2)])) : r("", !0);
}
var E = /*#__PURE__*/ p(_, [["render", T], ["__scopeId", "data-v-7fbb2031"]]), D = null, O = new EventTarget(), k = {
	name: "SignInWithSui",
	emits: [
		"suiMaster",
		"provider",
		"client",
		"adapter",
		"disconnected",
		"connected",
		"wrongchain",
		"displayAddress"
	],
	props: {
		defaultChain: {
			default: "sui:devnet",
			type: String
		},
		rpcSettings: { type: Object },
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
	watch: { defaultChain: async function(e) {
		console.log("[SignInWithSui] defaultChain changed to", e, "— acceptedAdapter:", window.localStorage.getItem("vue-sui-accepted-adapter"));
		let t = this.$refs.sui?.suiInBrowser;
		if (t?.activeAdapter?.name === "Phantom" && t.activeAdapter.isConnected) {
			console.log("[SignInWithSui] disconnecting Phantom before chain switch");
			try {
				await t.activeAdapter.disconnect();
			} catch {}
		}
		this.connectedAddress = null, this.connectedChain = null, this.activeAdapter = null, this.suiMaster = null, this.libsRequested = !1, await new Promise((e) => setTimeout(e, 50)), this.libsRequested = !0;
	} },
	computed: {},
	components: {
		SuidoubleSync: g,
		SignInWithSuiDialog: E
	},
	methods: {
		_emit(e, t) {
			this.$emit(e, t), this._isPrimary && O.dispatchEvent(new CustomEvent(e, { detail: t }));
		},
		checkDisplayAddress() {
			let e = this.displayAddress;
			this.connectedAddress ? this.connectedAddress && (e = this.resolvedNameServiceName ? this.resolvedNameServiceName : ("" + this.connectedAddress).substr(0, 6) + "..." + ("" + this.connectedAddress).substr(-4)) : e = null, this.displayAddress != e && (this.displayAddress = e, this._emit("displayAddress", this.displayAddress));
		},
		async getNameServiceName() {
			if (this.suiMaster && this.suiMaster.address) {
				let e = "resolvedNameServiceName_" + this.suiMaster.connectedChain + ":" + this.suiMaster.address, t = this.getCache(e);
				if (t !== void 0) this.resolvedNameServiceName = t;
				else {
					let t = await this.suiMaster.defaultNameServiceName();
					this.resolvedNameServiceName = t, this.setCache(e, t, 6e5);
				}
				this.checkDisplayAddress();
			} else this.resolvedNameServiceName = null, this.checkDisplayAddress();
		},
		onSuiMaster(e) {
			if (!this._isPrimary) return;
			let t = this.$refs.sui?.suiInBrowser?.activeAdapter?.name || null, n = window.localStorage.getItem("vue-sui-accepted-adapter"), r = (e?.connectedChain || "unknown") + "|" + (e?.address || "readonly") + "|" + (t || "none");
			this._suiMasterCache[r] && console.log("[SignInWithSui] suiMaster overwrite:", r, this._suiMasterCache), this._suiMasterCache[r] = {
				adapter: t,
				accepted: n,
				ts: Date.now()
			}, console.log("[SignInWithSui] suiMaster cache:", this._suiMasterCache);
			let i = (e) => e && e.replace(/^sui:/, "");
			if (this.defaultChain && i(this.defaultChain) != i(e?.connectedChain)) {
				this._emit("wrongchain", i(e?.connectedChain)), this.scheduleReadonlyFallback(e);
				return;
			}
			if (e?.address) {
				if (!n || t !== n) {
					if (console.log("[SignInWithSui] ignoring suiMaster from", t, "— we was connected with:", n), n && !this._reconnectingAdapter) {
						let e = this.$refs.sui?.suiInBrowser;
						e?._adapters?.[n]?.isConnected && (console.log("[SignInWithSui] trying to reconnect", n), this._reconnectingAdapter = !0, e.connect(n).finally(() => {
							this._reconnectingAdapter = !1;
						}));
					}
					this.scheduleReadonlyFallback(e);
					return;
				}
				this._readonlyTimeout &&= (clearTimeout(this._readonlyTimeout), null), this.applySuiMaster(e);
			} else n ? (console.log("[SignInWithSui] got readonly suiMaster, waiting 200ms for", n, "to connect"), this.scheduleReadonlyFallback(e)) : this.applySuiMaster(e);
		},
		scheduleReadonlyFallback(e) {
			let t = this.defaultChain.startsWith("sui:") ? this.defaultChain : "sui:" + this.defaultChain, n = e.constructor, r = n.SuiUtils.suiClientFor(t);
			this._pendingReadonlySuiMaster = new n({ client: r }), this._readonlyTimeout && clearTimeout(this._readonlyTimeout), this._readonlyTimeout = setTimeout(() => {
				this._readonlyTimeout = null, this._pendingReadonlySuiMaster && !this.connectedAddress && (this.applySuiMaster(this._pendingReadonlySuiMaster), this._pendingReadonlySuiMaster = null);
			}, 200);
		},
		applySuiMaster(e) {
			console.log("[SignInWithSui] applySuiMaster:", e?.connectedChain, e?.address ? "connected as " + e.address : "readonly"), this.suiMaster = e, this._emit("suiMaster", e), e.getClient().then((e) => {
				this._emit("client", e), this._emit("provider", e);
			}), e.address ? (this.connectedAddress = e.address, this.connectedChain = e.connectedChain, this.showingDialog = !1, this._emit("connected", this.connectedAddress), e.signer && e.signer.activeAdapter && (this._emit("adapter", e.signer.activeAdapter), this.activeAdapter = e.signer.activeAdapter)) : (this.activeAdapter = null, this._emit("adapter", null), this.connectedAddress = null), this.checkDisplayAddress(), this.getNameServiceName(), this.__suiMasterPromise && this.suiMaster && (this.__suiMasterPromiseResolver(), this.__suiMasterPromise = null), this.__connectedSuiMasterPromise && this.isSuiMasterConnected() && (this.__connectedSuiMasterPromiseResolver(), this.__connectedSuiMasterPromise = null);
		},
		onSuiAdapters(e) {
			this.adapters = e;
		},
		isSuiMasterConnected(e = null) {
			return this.suiMaster && this.suiMaster.address ? !(e && this.suiMaster.connectedChain != e) : this.suiMaster && this.suiMaster.signer && this.suiMaster.signer.connectedAddress ? !(e && this.suiMaster.signer.connectedChain != e) : !1;
		},
		async onAdapterClick(e) {
			if (this.showingDialog = !1, e.isDefault && !e.isInstalled) return window.open(e.getDownloadURL(), "_blank"), !1;
			console.log("[SignInWithSui] adapter clicked:", e.name, "— connecting");
			let t = (e) => e && e.replace(/^sui:/, ""), n = t(this.defaultChain);
			for (let r of Object.keys(this._suiMasterCache)) {
				let [i, a, o] = r.split("|");
				if (o === e.name && a !== "readonly" && t(i) !== n) {
					(e._standardAdapter?.chains || []).map(t), console.log("[SignInWithSui] adapter", e.name, "is connected to", i, "but we need", this.defaultChain), this.$emit("wrongchain", t(i));
					return;
				}
			}
			window.localStorage.setItem("vue-sui-accepted-adapter", e.name), this.isLoading = !0;
			let r = this._isPrimary ? this.$refs.sui : D?.$refs?.sui, i = r?.suiInBrowser || this.$refs.sui?.suiInBrowser;
			i.activeAdapter?.name === e.name && i.isConnected ? (console.log("[SignInWithSui] adapter", e.name, "already connected, re-requesting suiMaster"), await r.reinitSuiMaster()) : await i.connect(e), this.isLoading = !1;
		},
		async setRPC(e = {}) {
			this.$refs.sui.setRPC(e);
		},
		async requestSuiMaster() {
			if (this.suiMaster || (await this.requestLibs(), await new Promise((e) => {
				setTimeout(e, 200);
			}), this.suiMaster)) return this.suiMaster;
			if (this.__suiMasterPromise) {
				if (await this.__suiMasterPromise, this.suiMaster) return this.suiMaster;
				throw Error("can not get suiMaster");
			}
			if (this.__suiMasterPromiseResolver = null, this.__suiMasterPromise = new Promise((e) => {
				this.__suiMasterPromiseResolver = e;
			}), await this.__suiMasterPromise, this.suiMaster) return this.suiMaster;
			throw Error("can not get suiMaster");
		},
		async requestConnectedSuiMaster(e = null) {
			if (this.isSuiMasterConnected(e) || (await this.requestLibs(), await new Promise((e) => {
				setTimeout(e, 200);
			}), this.isSuiMasterConnected(e))) return this.suiMaster;
			if (this.isLoading = !0, this.__connectedSuiMasterPromise) {
				if (await this.__connectedSuiMasterPromise, this.isLoading = !1, this.isSuiMasterConnected(e)) return this.suiMaster;
				throw Error("can not get connection");
			}
			if (this.__connectedSuiMasterPromiseResolver = null, this.__connectedSuiMasterPromise = new Promise((e) => {
				this.__connectedSuiMasterPromiseResolver = e;
			}), this.showingDialog = !0, await this.__connectedSuiMasterPromise, this.isLoading = !1, this.isSuiMasterConnected(e)) return this.suiMaster;
			throw Error("can not get connection");
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
				let e = window.localStorage.getItem("vue-sui-accepted-adapter");
				e && this.adapters.forEach((t) => {
					t.name && t.okForSui && t.name == e && this.onAdapterClick(t);
				});
			}
		},
		async requestLibs() {
			this.libsRequested = !0, await this.__libsRequestedPromise;
		},
		onLibsLoaded() {
			this.__libsRequestedPromiseResolver();
		},
		onConnected() {},
		onDisconnected() {
			this._isPrimary && (this.connectedAddress = null, this.connectedChain = null, this.activeAdapter = null, this._emit("disconnected"), this.checkDisplayAddress());
		},
		async disconnect() {
			window.localStorage.removeItem("vue-sui-accepted-adapter");
			let e = this.$refs.sui?.suiInBrowser;
			e && e.activeAdapter && await e.activeAdapter.disconnect(), this.connectedAddress = null, this.connectedChain = null, this.activeAdapter = null, this.suiMaster = null, this.checkDisplayAddress();
		},
		setCache(e, t, n) {
			let r = {
				value: t,
				expiry: (/* @__PURE__ */ new Date()).getTime() + n
			};
			window.localStorage.setItem(e, JSON.stringify(r));
		},
		getCache(e) {
			try {
				let t = window.localStorage.getItem(e);
				if (!t) return;
				let n = JSON.parse(t);
				if ((/* @__PURE__ */ new Date()).getTime() > n.expiry) {
					window.localStorage.removeItem(e);
					return;
				}
				return n.value;
			} catch {
				return;
			}
		}
	},
	beforeMount: function() {
		if (this.__libsRequestedPromiseResolver = null, this.__libsRequestedPromise = new Promise((e) => {
			this.__libsRequestedPromiseResolver = e;
		}), this._readonlyTimeout = null, this._pendingReadonlySuiMaster = null, this._suiMasterCache = {}, this._isPrimary = !D, this._isPrimary && (D = this), !this._isPrimary) {
			this._busListeners = {};
			let e = (e, t) => {
				this._busListeners[e] = t, O.addEventListener(e, t);
			};
			e("suiMaster", (e) => {
				this.suiMaster = e.detail, this.connectedChain = e.detail?.connectedChain, this.$emit("suiMaster", e.detail);
			}), e("client", (e) => {
				this.$emit("client", e.detail);
			}), e("provider", (e) => {
				this.$emit("provider", e.detail);
			}), e("connected", (e) => {
				this.connectedAddress = e.detail, this.showingDialog = !1, this.$emit("connected", e.detail);
			}), e("disconnected", () => {
				this.connectedAddress = null, this.connectedChain = null, this.activeAdapter = null, this.suiMaster = null, this.$emit("disconnected"), this.checkDisplayAddress();
			}), e("adapter", (e) => {
				this.activeAdapter = e.detail, this.$emit("adapter", e.detail);
			}), e("wrongchain", (e) => {
				this.$emit("wrongchain", e.detail);
			}), e("displayAddress", (e) => {
				this.displayAddress = e.detail, this.$emit("displayAddress", e.detail);
			});
		}
	},
	beforeUnmount: function() {
		if (D === this && (D = null), this._busListeners) for (let [e, t] of Object.entries(this._busListeners)) O.removeEventListener(e, t);
	},
	mounted: async function() {
		this.initialize();
	}
}, A = { key: 0 }, j = { key: 1 };
function M(e, a, s, l, f, p) {
	let m = u("SignInWithSuiDialog"), h = u("SuidoubleSync");
	return c(), i("div", null, [
		s.visible ? (c(), i("div", {
			key: 0,
			onClick: a[0] ||= (...e) => p.onClick && p.onClick(...e)
		}, [f.connectedAddress ? r("", !0) : (c(), i("span", A, "Connect with Sui")), f.connectedAddress ? (c(), i("span", j, d(f.displayAddress), 1)) : r("", !0)])) : r("", !0),
		(c(), n(t, { to: "body" }, [o(m, {
			showing: f.showingDialog,
			onHidden: a[1] ||= (e) => {
				this.showingDialog = !1;
			},
			adapters: f.adapters,
			onClick: p.onAdapterClick
		}, null, 8, [
			"showing",
			"adapters",
			"onClick"
		])])),
		f.libsRequested ? (c(), n(h, {
			key: 1,
			ref: "sui",
			rpcSettings: s.rpcSettings,
			defaultChain: s.defaultChain,
			onAdapters: p.onSuiAdapters,
			onSuiMaster: p.onSuiMaster,
			onLoaded: p.onLibsLoaded,
			onConnected: p.onConnected,
			onDisconnected: p.onDisconnected
		}, null, 8, [
			"rpcSettings",
			"defaultChain",
			"onAdapters",
			"onSuiMaster",
			"onLoaded",
			"onConnected",
			"onDisconnected"
		])) : r("", !0)
	]);
}
var N = /*#__PURE__*/ p(k, [["render", M]]), P = {
	name: "SignInWithSuiButton",
	emits: [
		"suiMaster",
		"provider",
		"client",
		"adapter",
		"disconnected",
		"connected",
		"wrongchain",
		"displayAddress"
	],
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
	components: { SignInWithSui: N },
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
}, F = { class: "signinwithsui_button_inner" }, I = {
	key: 0,
	class: "signinwithsui_button_inner"
};
function L(e, t, n, s, l, d) {
	let f = u("SignInWithSui");
	return c(), i("div", {
		class: "signinwithsui_button",
		onClick: t[0] ||= (...e) => d.onClick && d.onClick(...e)
	}, [a("div", F, [o(f, {
		visible: !0,
		defaultChain: n.defaultChain,
		persist: n.persist,
		ref: "signin",
		onProvider: d.onProvider,
		onOnAdapter: d.onAdapter,
		onWrongchain: d.onWrongChain,
		onConnected: d.onConnected,
		onDisconnected: d.onDisconnected,
		onSuiMaster: d.onSuiMaster,
		onDisplayAddress: d.onDisplayAddress
	}, null, 8, [
		"defaultChain",
		"persist",
		"onProvider",
		"onOnAdapter",
		"onWrongchain",
		"onConnected",
		"onDisconnected",
		"onSuiMaster",
		"onDisplayAddress"
	])]), l.connectedAddress ? (c(), i("div", I, "disconnect")) : r("", !0)]);
}
var R = /*#__PURE__*/ p(P, [["render", L], ["__scopeId", "data-v-c2cacafa"]]);
//#endregion
export { N as SignInWithSui, R as SignInWithSuiButton };
