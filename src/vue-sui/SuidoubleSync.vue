<template>

	<div></div>

</template>


<script>
import {  SuiInBrowser } from "suidouble";

export default {
	name: 'SuiSync',
	props: {
        defaultChain: {
            default: 'sui:devnet',
            type: String,
        },
        rpcSettings: {
            type: Object,
        },
	},
	data() {
		return {
			connectedAddress: null,
            connectedChain: null,

            adapters: [],
            suiInBrowser: null,
            suiMaster: null,
            // lastSuiMasterInstanceN: null,
		}
	},
	emits: ['connect', 'connected', 'loaded', 'disconnected', 'error', 'suiMaster', 'adapters'],
	components: {
	},
	watch: {
	},
	methods: {
        async reinitSuiMaster() {
            this.suiMaster = await this.suiInBrowser.getSuiMaster();
            // console.log('[SuidoubleSync] reinitSuiMaster uid:', this.$.uid, '_isPrimary:', this._isPrimary, 'instanceN:', this.suiMaster?.instanceN, 'address:', this.suiMaster?.address);
            // if (this._isPrimary && (!this.lastSuiMasterInstanceN || this.lastSuiMasterInstanceN != this.suiMaster.instanceN)) {
            //     this.lastSuiMasterInstanceN = this.suiMaster.instanceN;
                this.$emit('suiMaster', this.suiMaster);
            // }
        },
        async setRPC(params = {}) {
            await this.suiInBrowser.setRPC(params);
            await this.reinitSuiMaster();
        },
	},
    beforeUnmount() {
        if (this._onAdapter)     this.suiInBrowser?.removeEventListener('adapter',     this._onAdapter);
        if (this._onConnected)   this.suiInBrowser?.removeEventListener('connected',   this._onConnected);
        if (this._onDisconnected) this.suiInBrowser?.removeEventListener('disconnected', this._onDisconnected);
    },
	mounted: function() {
        // const existedBefore = !!SuiInBrowser._singleInstances[this.defaultChain || 'sui:devnet'];
        this.suiInBrowser = SuiInBrowser.getSingleton({
            debug: true,
            defaultChain: this.defaultChain,
        });

        if (this.rpcSettings) {
            this.suiInBrowser.setRPC(this.rpcSettings);
        }

        this.adapters = Object.values(this.suiInBrowser.adapters);

        this._onAdapter = (e) => {
            this.adapters.push(e.detail);
            this.$emit('adapters', this.adapters);
        };
        this._onConnected = () => {
            this.connectedAddress = this.suiInBrowser.connectedAddress;
            this.connectedChain = this.suiInBrowser.connectedChain;
            this.reinitSuiMaster().then(() => {
                this.$emit('connected', this.suiInBrowser);
            });
        };
        this._onDisconnected = () => {
            this.connectedAddress = null;
            this.connectedChain = null;
            this.$emit('disconnected');
        };

        this.suiInBrowser.addEventListener('adapter',     this._onAdapter);
        this.suiInBrowser.addEventListener('connected',   this._onConnected);
        this.suiInBrowser.addEventListener('disconnected', this._onDisconnected);

        this.$nextTick(()=>{
            this.$emit('loaded', this.suiInBrowser);
            this.$emit('adapters', this.adapters);
        });

        if (this.suiInBrowser.isConnected) {
            this.connectedAddress = this.suiInBrowser.connectedAddress;
            this.connectedChain = this.suiInBrowser.connectedChain;
            this.reinitSuiMaster().then(() => {
                this.$emit('connected', this.suiInBrowser);
            });
        }

        // console.log('[SuidoubleSync] mounted, calling reinitSuiMaster, $el parent:', this.$el?.parentElement?.tagName, this.$el?.parentElement?.className, '— uid:', this.$.uid);
        this.reinitSuiMaster();
	},
	computed: {
	}
}
</script>


<style>


</style>