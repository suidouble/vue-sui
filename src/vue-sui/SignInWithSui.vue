<template>

    <div>
        <div @click="onClick" v-if="visible">
            <span v-if="!connectedAddress">Connect with Sui</span>
            <span v-if="connectedAddress">{{ displayAddress }}</span>
        </div>

        <SignInWithSuiDialog :showing="showingDialog" @hidden="this.showingDialog = false;" :adapters="adapters" @click="onAdapterClick" />
        <SuidoubleSync ref="sui" v-if="libsRequested" :rpcSettings="rpcSettings" :defaultChain="defaultChain" @adapters="onSuiAdapters" @suiMaster="onSuiMaster" @loaded="onLibsLoaded" @connected="onConnected" @disconnected="onDisconnected"  />
    </div>

</template>

<script>
import SuidoubleSync from './SuidoubleSync.vue';
import SignInWithSuiDialog from './SignInWithSuiDialog.vue';

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
        defaultChain: async function() {
            // reinit child component
            this.connectedAddress = null;
            this.connectedChain = null;
            this.suiMaster = null;
            // console.error('switched');
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
                this.$emit('displayAddress', this.displayAddress);
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
                    const name = await this.suiMaster.resolveNameServiceName();
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
            this.suiMaster = suiMaster;

            if (!this.defaultChain || this.defaultChain == this.suiMaster.connectedChain) {
                this.$emit('suiMaster', suiMaster);

                suiMaster.getClient()
                    .then((client)=>{
                        this.$emit('client', client);
                        this.$emit('provider', client); // compatibility with 0.x versions

                        if (suiMaster.signer && suiMaster.signer.activeAdapter) {
                            this.$emit('adapter', suiMaster.signer.activeAdapter);
                            this.activeAdapter = suiMaster.signer.activeAdapter;
                        }
                    });

                this.getNameServiceName(); // also check the NS
            }

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

            this.isLoading = true;
            await this.$refs.sui.suiInBrowser.connect(adapter);

            if (this.persist) {
                window.localStorage.setItem('vue-sui-preferred-adapter', adapter.name);
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
                const preferredAdapter = window.localStorage.getItem('vue-sui-preferred-adapter');
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
            this.showingDialog = false;

            const connectedChain = this.$refs.sui.suiInBrowser.connectedChain;

            if (!this.defaultChain || this.defaultChain == connectedChain) {
                this.connectedAddress = this.$refs.sui.suiInBrowser.connectedAddress;
                this.connectedChain = this.$refs.sui.suiInBrowser.connectedChain;

                this.$emit('connected', this.connectedAddress);
                this.checkDisplayAddress();
            } else {
                this.connectedAddress = null;

                this.$emit('wrongchain', connectedChain);
                this.checkDisplayAddress();
            }
        },
        onDisconnected() {
            this.connectedAddress = null;

            this.$emit('disconnected');

            this.checkDisplayAddress();
        },
        async disconnect() {
            window.localStorage.setItem('vue-sui-preferred-adapter', null);
            try { 
                await this.activeAdapter.disconnect(); // (may not be available in some wallets)
            } catch (e) {
                console.error(e);
                window.location.reload();
                return false;
            }
            return true;
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
	},
	mounted: async function() {
		this.initialize();

	},
}
</script>
