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
            lastSuiMasterInstanceN: null,
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
            if (!this.lastSuiMasterInstanceN || this.lastSuiMasterInstanceN != this.suiMaster.instanceN) {
                this.$emit('suiMaster', this.suiMaster);
            }
        },
        async setRPC(params = {}) {
            await this.suiInBrowser.setRPC(params);
            await this.reinitSuiMaster();
        },
	},
	mounted: function() {
        this.suiInBrowser = SuiInBrowser.getSingleton({
            debug: true,
            defaultChain: this.defaultChain,
        });
        if (this.rpcSettings) {
            this.suiInBrowser.setRPC(this.rpcSettings);
        }

        this.adapters = Object.values(this.suiInBrowser.adapters);
        this.suiInBrowser.addEventListener('adapter', (e)=>{
            console.log('New adapter', e.detail);
            this.adapters.push(e.detail);

            this.$emit('adapters', this.adapters);
        });
        this.suiInBrowser.addEventListener('connected', ()=>{
            this.connectedAddress = this.suiInBrowser.connectedAddress;
            this.connectedChain = this.suiInBrowser.connectedChain;
            this.reinitSuiMaster();

            this.$emit('connected', this.suiInBrowser);
        });
        this.suiInBrowser.addEventListener('disconnected', ()=>{
            this.connectedAddress = null;
            this.connectedChain = null;

            this.$emit('disconnected');
        });

        this.$nextTick(()=>{
            this.$emit('loaded',this.suiInBrowser);
            this.$emit('adapters', this.adapters);
        });

        if (this.suiInBrowser.isConnected) {
            this.connectedAddress = this.suiInBrowser.connectedAddress;
            this.connectedChain = this.suiInBrowser.connectedChain;
            this.reinitSuiMaster();

            this.$emit('connected', this.suiInBrowser);
        }

        this.reinitSuiMaster();
	},
	computed: {
	}
}
</script>


<style>


</style>