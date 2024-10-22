<template>
    <div class="signinwithsui_button" @click="this.$refs.signin.onClick();">
        <SignInWithSui :defaultChain="defaultChain" ref="signin" @provider="onProvider" @onAdapter="onAdapter" @wrongchain="onWrongChain" @connected="onConnected" @disconnected="onDisconnected" @suiMaster="onSuiMaster" />
    </div>
</template>
<style scoped src="./style.css">
</style>  
<script>
import SignInWithSui from "./SignInWithSui.vue";

export default {
	name: 'SignInWithSuiButton',
    emits: ['suiMaster', 'provider', 'client', 'adapter', 'disconnected', 'connected', 'wrongchain'],
	props: {
        defaultChain: {
            default: 'sui:devnet',
            type: String,
        },
    },
    components: { 
        SignInWithSui 
    },
    data() {
        return {
            connectedAddress: null,
            connectedChain: null,
        };
    },
    methods: {
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