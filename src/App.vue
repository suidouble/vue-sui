<template>
    <div>
		<h1>Vue3</h1>

		<div>
		Connected as: {{ connectedAddress }}<br>
		Connected to: {{ connectedChain }}
		</div>
  
		<p>With your own button. Note visible=false, you control button title yourself</p>
		<button @click="this.$refs.sui.onClick();" >
			Connect 
			<SignInWithSui ref="sui" defaultChain="sui:mainnet" @suiMaster="onSuiMaster" @disconnected="onDisconnected" :visible="false"/>
		</button>
  
		<p>&nbsp;</p>

		<p>Pre-defined styling:</p>

		<SignInWithSuiButton />

		<p>Also try to disconnect or switch chain (from browser extension)</p>
      
	</div>
</template>
  
<script>
import SignInWithSui from "./vue-sui/SignInWithSui.vue";
import SignInWithSuiButton from './vue-sui/SignInWithSuiButton.vue';
  
export default {
    components: { 
		SignInWithSui,
		SignInWithSuiButton,
    },
    data() {
		return {
			connectedAddress: null,
			connectedChain: null,
		};
    },
    methods: {
        onSuiMaster(suiMaster) {
            this.connectedAddress = suiMaster.address;
            this.connectedChain = suiMaster.connectedChain;
        },
        onDisconnected() {
            this.connectedAddress = null;
            this.connectedChain = null;
        },
    },
};
</script>
<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>