<template>
    <div class="signinwithsui_button" @click="this.$refs.signin.onClick();">
        <SignInWithSui ref="signin" @connected="this.$emit('connected')" @disconnected="this.$emit('disconnected')" @suiMaster="onSuiMaster" />
    </div>
</template>
<style scoped src="./style.css">
</style>  
<script>
import SignInWithSui from "./SignInWithSui.vue";

export default {
	name: 'SignInWithSuiButton',
    emits: ['suiMaster', 'disconnected', 'connected'],
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
        onSuiMaster(suiMaster) {
            this.$emit('suiMaster', suiMaster);
        }
    },
};
</script>