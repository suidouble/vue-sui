<template>

	<div></div>

</template>


<script>
const { SuiInBrowser } = require('suidouble');

export default {
	name: 'SuiSync',
	props: {
        defaultChain: {
            default: 'sui:devnet',
            type: String,
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
        async reinitSueMaster() {
            this.suiMaster = await this.suiInBrowser.getSuiMaster();
            if (!this.lastSuiMasterInstanceN || this.lastSuiMasterInstanceN != this.suiMaster.instanceN) {
                this.$emit('suiMaster', this.suiMaster);
            }
        }
	},
	mounted: function() {
        this.suiInBrowser = SuiInBrowser.getSingleton({
            debug: true,
            defaultChain: this.defaultChain,
        });
        console.log('mounted', this.suiInBrowser._defaultChain);

        this.adapters = Object.values(this.suiInBrowser.adapters);
        this.suiInBrowser.addEventListener('adapter', (e)=>{
            this.adapters.push(e.detail);

            this.$emit('adapters', this.adapters);
        });
        this.suiInBrowser.addEventListener('connected', ()=>{
            this.connectedAddress = this.suiInBrowser.connectedAddress;
            this.connectedChain = this.suiInBrowser.connectedChain;
            this.reinitSueMaster();

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
            this.reinitSueMaster();

            this.$emit('connected', this.suiInBrowser);
        }

        this.reinitSueMaster();
	},
	computed: {
	}
}
</script>


<style>


</style>