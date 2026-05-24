<template>

    <div>
        <div @click="onClick" v-if="visible">
            <span v-if="!connectedAddress">Connect with Sui</span>
            <span v-if="connectedAddress">{{ displayAddress }}</span>
        </div>

        <Teleport to="body">
            <SignInWithSuiDialog :showing="showingDialog" @hidden="this.showingDialog = false;" :adapters="adapters" @click="onAdapterClick" />
        </Teleport>
        <SuidoubleSync ref="sui" v-if="libsRequested" :rpcSettings="rpcSettings" :defaultChain="defaultChain" @adapters="onSuiAdapters" @suiMaster="onSuiMaster" @loaded="onLibsLoaded" @connected="onConnected" @disconnected="onDisconnected"  />
    </div>

</template>

<script>
import { toRaw } from 'vue';
import SuidoubleSync from './SuidoubleSync.vue';
import SignInWithSuiDialog from './SignInWithSuiDialog.vue';

let _primaryInstance = null;
const _eventBus = new EventTarget();

export default {
	name: 'SignInWithSui',
    emits: ['suiMaster', 'provider', 'client', 'adapter', 'disconnected', 'connected', 'wrongchain', 'displayAddress'],
	props: {
        defaultChain: {
            default: 'sui:devnet',
            type: String,
        },
        rpcSettings: {
            type: Object,
        },
        auto: {
            default: true,
            type: Boolean,
        },
        visible: {
            default: true,
            type: Boolean,
        },
        persist: {
            default: false,
            type: Boolean,
        },
	},
	data() {
		return {
			isLoading: false,
            libsRequested: true,

            adapters: [],
            
            connectedAddress: null,
            displayAddress: null,
            resolvedNameServiceName: null,

            connectedChain: null,

            forceChainCalculated: null,
            suiMaster: null,
            activeAdapter: null,

            showingDialog: false,
		}
	},
	watch: {
        defaultChain: async function(newChain) {
            console.log('[SignInWithSui] defaultChain changed to', newChain, '— acceptedAdapter:', window.localStorage.getItem('vue-sui-accepted-adapter'));
            const suiInBrowser = this.$refs.sui?.suiInBrowser;
            if (suiInBrowser?.activeAdapter?.name === 'Phantom' && suiInBrowser.activeAdapter.isConnected) {
                console.log('[SignInWithSui] disconnecting Phantom before chain switch');
                try { await suiInBrowser.activeAdapter.disconnect(); } catch(e) {}
            }
            this.connectedAddress = null;
            this.connectedChain = null;
            this.activeAdapter = null;
            this.suiMaster = null;
            this.libsRequested = false;
            await new Promise((res)=>setTimeout(res, 50));
            this.libsRequested = true;
        },
	},
	computed: {
	},
	components: {
        SuidoubleSync,
        SignInWithSuiDialog,
	},
	methods: {
        _emit(name, data) {
            this.$emit(name, data);
            if (this._isPrimary) {
                _eventBus.dispatchEvent(new CustomEvent(name, { detail: data }));
            }
        },
        checkDisplayAddress() {
            let updated = this.displayAddress;
            if (!this.connectedAddress) {
                updated = null;
            } else if (this.connectedAddress) {
                if (this.resolvedNameServiceName) {
                    updated = this.resolvedNameServiceName;
                } else {
                    updated = (''+this.connectedAddress).substr(0,6)+'...'+(''+this.connectedAddress).substr(-4);
                }
            }

            if (this.displayAddress != updated) {
                this.displayAddress = updated;
                this._emit('displayAddress', this.displayAddress);
            }
        },
        async getNameServiceName() {
            // alert('getNameServiceName'+this.suiMaster.address);
            if (this.suiMaster && this.suiMaster.address) {
                const cacheKey = 'resolvedNameServiceName_'+this.suiMaster.connectedChain+':'+this.suiMaster.address;
                const cacheTTL = 10 * 60 * 1000; // 10 minutes
                const cached = this.getCache(cacheKey);

                if (cached !== undefined) {
                    this.resolvedNameServiceName = cached;
                } else {
                    const name = await this.suiMaster.defaultNameServiceName();
                    this.resolvedNameServiceName = name;
                    this.setCache(cacheKey, name, cacheTTL);
                }

                this.checkDisplayAddress();
            } else {
                this.resolvedNameServiceName = null;
                this.checkDisplayAddress();
            }
        },
        /**
         * SuiMaster instance updated
         * @param {SuiMaster} suiMaster
         */
        onSuiMaster(suiMaster) {
            if (!this._isPrimary) return;

            const adapterName = this.$refs.sui?.suiInBrowser?.activeAdapter?.name || null;
            const acceptedAdapter = window.localStorage.getItem('vue-sui-accepted-adapter');
            const key = (suiMaster?.connectedChain || 'unknown') + '|' + (suiMaster?.address || 'readonly') + '|' + (adapterName || 'none');


            if (this._suiMasterCache[key]) {
                console.log('[SignInWithSui] suiMaster overwrite:', key, this._suiMasterCache);
            }
            this._suiMasterCache[key] = { adapter: adapterName, accepted: acceptedAdapter, ts: Date.now() };
            console.log('[SignInWithSui] suiMaster cache:', this._suiMasterCache);

            const normalizeChain = (c) => c ? c.replace(/^sui:/, '') : c;
            const chainMatch = !this.defaultChain || normalizeChain(this.defaultChain) == normalizeChain(suiMaster?.connectedChain);
            if (!chainMatch) {
                this._emit('wrongchain', normalizeChain(suiMaster?.connectedChain));
                this.scheduleReadonlyFallback(suiMaster);
                return;
            }

            if (suiMaster?.address) {
                if (!acceptedAdapter || adapterName !== acceptedAdapter) {
                    console.log('[SignInWithSui] ignoring suiMaster from', adapterName, '— we was connected with:', acceptedAdapter);
                    if (acceptedAdapter && !this._reconnectingAdapter) {
                        const suiInBrowser = this.$refs.sui?.suiInBrowser;
                        if (suiInBrowser?._adapters?.[acceptedAdapter]?.isConnected) {
                            console.log('[SignInWithSui] trying to reconnect', acceptedAdapter);
                            this._reconnectingAdapter = true;
                            suiInBrowser.connect(acceptedAdapter).finally(() => { this._reconnectingAdapter = false; });
                        }
                    }
                    this.scheduleReadonlyFallback(suiMaster);
                    return;
                }
                if (this._readonlyTimeout) {
                    clearTimeout(this._readonlyTimeout);
                    this._readonlyTimeout = null;
                }
                this.applySuiMaster(suiMaster);
            } else {
                if (acceptedAdapter) {
                    console.log('[SignInWithSui] got readonly suiMaster, waiting 200ms for', acceptedAdapter, 'to connect');
                    this.scheduleReadonlyFallback(suiMaster);
                } else {
                    this.applySuiMaster(suiMaster);
                }
            }
        },
        scheduleReadonlyFallback(suiMaster) {
            const defaultChainFull = this.defaultChain.startsWith('sui:') ? this.defaultChain : 'sui:' + this.defaultChain;
            const SuiMasterClass = suiMaster.constructor;
            const client = SuiMasterClass.SuiUtils.suiClientFor(defaultChainFull);
            this._pendingReadonlySuiMaster = new SuiMasterClass({ client: client });
            if (this._readonlyTimeout) clearTimeout(this._readonlyTimeout);
            this._readonlyTimeout = setTimeout(() => {
                this._readonlyTimeout = null;
                if (this._pendingReadonlySuiMaster && !this.connectedAddress) {
                    this.applySuiMaster(this._pendingReadonlySuiMaster);
                    this._pendingReadonlySuiMaster = null;
                }
            }, 200);
        },
        applySuiMaster(suiMaster) {
            console.log('[SignInWithSui] applySuiMaster:', suiMaster?.connectedChain, suiMaster?.address ? 'connected as ' + suiMaster.address : 'readonly');

            this.suiMaster = suiMaster;
            this._emit('suiMaster', suiMaster);

            suiMaster.getClient()
                .then((client)=>{
                    this._emit('client', client);
                    this._emit('provider', client);
                });

            if (suiMaster.address) {
                this.connectedAddress = suiMaster.address;
                this.connectedChain = suiMaster.connectedChain;
                this.showingDialog = false;
                this._emit('connected', this.connectedAddress);

                if (suiMaster.signer && suiMaster.signer.activeAdapter) {
                    this._emit('adapter', suiMaster.signer.activeAdapter);
                    this.activeAdapter = suiMaster.signer.activeAdapter;
                }
            } else {
                this.activeAdapter = null;
                this._emit('adapter', null);
                this.connectedAddress = null;
            }

            this.checkDisplayAddress();
            this.getNameServiceName();

            if (this.__suiMasterPromise) {
                if (this.suiMaster) {
                    this.__suiMasterPromiseResolver();
                    this.__suiMasterPromise = null;
                }
            }
            if (this.__connectedSuiMasterPromise) {
                if (this.isSuiMasterConnected()) {
                    this.__connectedSuiMasterPromiseResolver();
                    this.__connectedSuiMasterPromise = null;
                }
            }
        },
        onSuiAdapters(adapters) {
            this.adapters = adapters;
        },
        isSuiMasterConnected(requireChainName = null) {
            if (this.suiMaster && this.suiMaster.address) {
                if (requireChainName && this.suiMaster.connectedChain != requireChainName) {
                    return false;
                }
                return true;
            } else if (this.suiMaster && this.suiMaster.signer && this.suiMaster.signer.connectedAddress) {
                // backward compatible
                if (requireChainName && this.suiMaster.signer.connectedChain != requireChainName) {
                    return false;
                }
                return true;
            }

            return false;
        },
        async onAdapterClick(adapter) {
            this.showingDialog = false;

            if (adapter.isDefault && !adapter.isInstalled) {
                window.open(adapter.getDownloadURL(), '_blank');
                return false;
            }

            console.log('[SignInWithSui] adapter clicked:', adapter.name, '— connecting');

            const normalizeChain = (c) => c ? c.replace(/^sui:/, '') : c;
            const expectedChain = normalizeChain(this.defaultChain);
            for (const key of Object.keys(this._suiMasterCache)) {
                const [chain, addr, cachedAdapter] = key.split('|');
                if (cachedAdapter !== adapter.name || addr === 'readonly') continue;
                if (normalizeChain(chain) !== expectedChain) {
                    const adapterChains = (adapter._standardAdapter?.chains || []).map(normalizeChain);
                    console.log('[SignInWithSui] adapter', adapter.name, 'is connected to', chain, 'but we need', this.defaultChain);
                    this.$emit('wrongchain', normalizeChain(chain));
                    return;
                }
            }

            window.localStorage.setItem('vue-sui-accepted-adapter', adapter.name);
            this.isLoading = true;

            const primarySui = this._isPrimary ? this.$refs.sui : _primaryInstance?.$refs?.sui;
            const suiInBrowser = primarySui?.suiInBrowser || this.$refs.sui?.suiInBrowser;
            if (suiInBrowser.activeAdapter?.name === adapter.name && suiInBrowser.isConnected) {
                console.log('[SignInWithSui] adapter', adapter.name, 'already connected, re-requesting suiMaster');
                await primarySui.reinitSuiMaster();
            } else {
                await suiInBrowser.connect(adapter);
            }

            this.isLoading = false;
        },
        async setRPC(params = {}) {
            this.$refs.sui.setRPC(params);
        },
        async requestSuiMaster() {
            if (this.suiMaster) {
                return this.suiMaster;
            }

            await this.requestLibs();
            await new Promise((res)=>{ setTimeout(res, 200); }); // let providers check if we are already connected

            if (this.suiMaster) {
                return this.suiMaster;
            }

            if (this.__suiMasterPromise) {
                await this.__suiMasterPromise;
                
                if (this.suiMaster) {
                    return this.suiMaster;
                } else {
                    throw new Error('can not get suiMaster');
                }
            }

            this.__suiMasterPromiseResolver = null;
            this.__suiMasterPromise = new Promise((res)=>{
                this.__suiMasterPromiseResolver = res;
            });

            await this.__suiMasterPromise;

            if (this.suiMaster) {
                return this.suiMaster;
            } else {
                throw new Error('can not get suiMaster');
            }
        },
        async requestConnectedSuiMaster(requireChainName = null) {
            if (this.isSuiMasterConnected(requireChainName)) {
                return this.suiMaster;
            }

            await this.requestLibs();
            await new Promise((res)=>{ setTimeout(res, 200); }); // let providers check if we are already connected

            if (this.isSuiMasterConnected(requireChainName)) {
                return this.suiMaster;
            }

            this.isLoading = true;
            if (this.__connectedSuiMasterPromise) {
                await this.__connectedSuiMasterPromise;
                this.isLoading = false;
                
                if (this.isSuiMasterConnected(requireChainName)) {
                    return this.suiMaster;
                } else {
                    throw new Error('can not get connection');
                }
            }

            this.__connectedSuiMasterPromiseResolver = null;
            this.__connectedSuiMasterPromise = new Promise((res)=>{
                this.__connectedSuiMasterPromiseResolver = res;
            });

            this.showingDialog = true;

            await this.__connectedSuiMasterPromise;

            this.isLoading = false;

            if (this.isSuiMasterConnected(requireChainName)) {
                return this.suiMaster;
            } else {
                throw new Error('can not get connection');
            }
        },
        async connect() {
            return await this.onClick();
        },
        async onClick() {
            this.isLoading = true;
            await this.requestLibs();
            await new Promise((res)=>{ setTimeout(res, 200); }); // let providers check if we are already connected

            if (!this.connectedAddress) {
                this.showingDialog = true;
            }

            this.isLoading = false;
        },
		async initialize() {
            if (this.auto) {
                this.isLoading = true;
                await this.requestLibs();
                this.isLoading = false;
            }

            await new Promise((res)=>{ setTimeout(res, 200); }); // let providers check if we are already connected

            if (this.persist) {
                const preferredAdapter = window.localStorage.getItem('vue-sui-accepted-adapter');
                if (preferredAdapter) {
                    this.adapters.forEach(element => {
                        // console.log(element.okForSui, element.name);
                        if (element.name && element.okForSui && element.name == preferredAdapter) {
                            this.onAdapterClick(element);
                        }
                    });
                }
            }
		},
        async requestLibs() {
            this.libsRequested = true;
            await this.__libsRequestedPromise;
        },
        onLibsLoaded() {
            this.__libsRequestedPromiseResolver();
        },
        onConnected() {
            // handled via onSuiMaster
        },
        onDisconnected() {
            if (!this._isPrimary) return;
            this.connectedAddress = null;
            this.connectedChain = null;
            this.activeAdapter = null;
            this._emit('disconnected');
            this.checkDisplayAddress();
        },
        async disconnect() {
            window.localStorage.removeItem('vue-sui-accepted-adapter');

            const suiInBrowser = this.$refs.sui?.suiInBrowser;
            if (suiInBrowser && suiInBrowser.activeAdapter) {
                await suiInBrowser.activeAdapter.disconnect();
            }

            this.connectedAddress = null;
            this.connectedChain = null;
            this.activeAdapter = null;
            this.suiMaster = null;
            this.checkDisplayAddress();
        },
        setCache(key, value, ttl) {
            const now = new Date();
            const item = {
                value: value,
                expiry: now.getTime() + ttl,
            };
            window.localStorage.setItem(key, JSON.stringify(item));
        },
        getCache(key) {
            try {
                const itemStr = window.localStorage.getItem(key);
                if (!itemStr) {
                    return undefined;
                }
                const item = JSON.parse(itemStr);
                const now = new Date();
                if (now.getTime() > item.expiry) {
                    window.localStorage.removeItem(key);
                    return undefined;
                }
                return item.value;
            } catch (e) {
                return undefined;
            }
        },
	},
	beforeMount: function() {
        this.__libsRequestedPromiseResolver = null;
        this.__libsRequestedPromise = new Promise((res)=>{
            this.__libsRequestedPromiseResolver = res;
        });
        this._readonlyTimeout = null;
        this._pendingReadonlySuiMaster = null;
        this._suiMasterCache = {};

        this._isPrimary = !_primaryInstance;
        if (this._isPrimary) {
            _primaryInstance = this;
        }

        if (!this._isPrimary) {
            this._busListeners = {};
            const listen = (name, handler) => {
                this._busListeners[name] = handler;
                _eventBus.addEventListener(name, handler);
            };
            listen('suiMaster', (e) => {
                this.suiMaster = e.detail;
                this.connectedChain = e.detail?.connectedChain;
                this.$emit('suiMaster', e.detail);
            });
            listen('client', (e) => { this.$emit('client', e.detail); });
            listen('provider', (e) => { this.$emit('provider', e.detail); });
            listen('connected', (e) => {
                this.connectedAddress = e.detail;
                this.showingDialog = false;
                this.$emit('connected', e.detail);
            });
            listen('disconnected', () => {
                this.connectedAddress = null;
                this.connectedChain = null;
                this.activeAdapter = null;
                this.suiMaster = null;
                this.$emit('disconnected');
                this.checkDisplayAddress();
            });
            listen('adapter', (e) => {
                this.activeAdapter = e.detail;
                this.$emit('adapter', e.detail);
            });
            listen('wrongchain', (e) => { this.$emit('wrongchain', e.detail); });
            listen('displayAddress', (e) => {
                this.displayAddress = e.detail;
                this.$emit('displayAddress', e.detail);
            });
        }
	},
	beforeUnmount: function() {
        if (_primaryInstance === this) {
            _primaryInstance = null;
        }
        if (this._busListeners) {
            for (const [name, handler] of Object.entries(this._busListeners)) {
                _eventBus.removeEventListener(name, handler);
            }
        }
	},
	mounted: async function() {
		this.initialize();

	},
}
</script>
