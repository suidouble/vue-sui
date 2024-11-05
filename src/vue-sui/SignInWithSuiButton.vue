<template>
    <div class="signinwithsui_button"  @click="onClick">
        <div class="signinwithsui_button_inner">
            <SignInWithSui :defaultChain="defaultChain" :persist="persist" ref="signin" @provider="onProvider" @onAdapter="onAdapter" @wrongchain="onWrongChain" @connected="onConnected" @disconnected="onDisconnected" @suiMaster="onSuiMaster" @displayAddress="onDisplayAddress" />
        </div>
        <div class="signinwithsui_button_inner" v-if="connectedAddress">disconnect</div>
    </div>
</template>
<style scoped src="./style.css">
</style>  
<script>
import SignInWithSui from "./SignInWithSui.vue";

export default {
	name: 'SignInWithSuiButton',
    emits: ['suiMaster', 'provider', 'client', 'adapter', 'disconnected', 'connected', 'wrongchain', 'displayAddress'],
	props: {
        defaultChain: {
            default: 'sui:devnet',
            type: String,
        },
        persist: {
            default: false,
            type: Boolean,
        },
    },
    components: { 
        SignInWithSui 
    },
    data() {
        return {
            connectedAddress: null,
            connectedChain: null,

			displayAddress: null,
        };
    },
    methods: {
        onClick() {
            if (!this.connectedAddress) {
                this.$refs.signin.connect();
            } else {
                this.$refs.signin.disconnect();
            }
        },
		onDisplayAddress(displayAddress) {
			this.displayAddress = displayAddress;
            this.$emit('displayAddress', displayAddress);
		},
        onConnected(connectedAddress) {
            this.connectedAddress = connectedAddress;
            this.$emit('connected', connectedAddress);
        },
        onDisconnected() {
            this.connectedAddress = null;
            this.$emit('disconnected');
        },
        onWrongChain(tryingTo) {
            this.$emit('wrongchain', tryingTo);
        },
        onSuiMaster(suiMaster) {
            this.$emit('suiMaster', suiMaster);
        },
        onProvider(provider) {
            this.$emit('client', provider);
            this.$emit('provider', provider); // compatible with 0.x versions
        },
        onAdapter(adapter) {
            this.$emit('adapter', adapter);
        },
    },
};
</script>