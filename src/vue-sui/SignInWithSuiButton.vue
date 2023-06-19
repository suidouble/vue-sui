<template>
    <div class="signinwithsui_button" @click="this.$refs.signin.onClick();">
        <SignInWithSui :defaultChain="defaultChain" ref="signin" @wrongchain="onWrongChain" @connected="this.$emit('connected')" @disconnected="this.$emit('disconnected')" @suiMaster="onSuiMaster" />
    </div>
</template>
<style scoped src="./style.css">
</style>  
<script>
import SignInWithSui from "./SignInWithSui.vue";

export default {
	name: 'SignInWithSuiButton',
    emits: ['suiMaster', 'disconnected', 'connected', 'wrongchain'],
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
        onWrongChain(tryingTo) {
            this.$emit('wrongchain', tryingTo);
        },
        onSuiMaster(suiMaster) {
            this.$emit('suiMaster', suiMaster);
        }
    },
};
</script>