<template>

    <div @click="onClick" v-if="visible">
		<span v-if="!connectedAddress">Connect with Sui</span>
		<span v-if="connectedAddress">Connected as {{ displayAddress }} ({{ connectedChain }})</span>
    </div>

    <SignInWithSuiDialog :showing="showingDialog" @hidden="this.showingDialog = false;" :adapters="adapters" @click="onAdapterClick" />
    <SuidoubleSync ref="sui" :defaultChain="defaultChain" @adapters="onSuiAdapters" @suiMaster="onSuiMaster" @loaded="onLibsLoaded" @connected="onConnected" @disconnected="onDisconnected"  />

</template>

<script>
import SuidoubleSync from './SuidoubleSync.vue';
import SignInWithSuiDialog from './SignInWithSuiDialog.vue';

export default {
	name: 'SignInWithSui',
    emits: ['suiMaster', 'disconnected', 'connected'],
	props: {
        defaultChain: {
            default: 'sui:devnet',
            type: String,
        },
        auto: {
            default: false,
            type: Boolean,
        },
        visible: {
            default: true,
            type: Boolean,
        },
	},
	data() {
		return {
			isLoading: false,
            libsRequested: false,

            adapters: [],
            connectedAddress: null,
            connectedChain: null,

            suiMaster: null,

            showingDialog: false,
		}
	},
	watch: {
	},
	computed: {
		displayAddress() {
			return (''+this.connectedAddress).substr(0,6)+'...'+(''+this.connectedAddress).substr(-4);
		},
	},
	components: {
        SuidoubleSync,
        SignInWithSuiDialog,
	},
	methods: {
        /**
         * SuiMaster instance updated
         * @param {SuiMaster} suiMaster 
         */
        onSuiMaster(suiMaster) {
            this.suiMaster = suiMaster;
            this.$emit('suiMaster', suiMaster);

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
        isSuiMasterConnected() {
            if (this.suiMaster && this.suiMaster.address) {
                return true;
            } else if (this.suiMaster && this.suiMaster.signer && this.suiMaster.signer.connectedAddress) {
                // backward compatible
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
            this.isLoading = false;
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
        async requestConnectedSuiMaster() {
            if (this.isSuiMasterConnected()) {
                return this.suiMaster;
            }

            await this.requestLibs();
            await new Promise((res)=>{ setTimeout(res, 200); }); // let providers check if we are already connected

            if (this.isSuiMasterConnected()) {
                return this.suiMaster;
            }

            this.isLoading = true;
            if (this.__connectedSuiMasterPromise) {
                await this.__connectedSuiMasterPromise;
                this.isLoading = false;
                
                if (this.isSuiMasterConnected()) {
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

            if (this.isSuiMasterConnected()) {
                return this.suiMaster;
            } else {
                throw new Error('can not get connection');
            }
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

            this.connectedAddress = this.$refs.sui.suiInBrowser.connectedAddress;
            this.connectedChain = this.$refs.sui.suiInBrowser.connectedChain;

            this.$emit('connected');
        },
        onDisconnected() {
            this.connectedAddress = null;

            this.$emit('disconnected');
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
