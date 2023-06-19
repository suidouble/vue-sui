<template>
    <div>
		<h1>Vue3</h1>

		<div>
		Connected as: {{ connectedAddress }}<br>
		Connected to: {{ connectedChain }}<br>
		
		<span v-if="tryingTo">Was trying to connect to {{ tryingTo }}, but expected to {{ defaultChain }}</span>
		</div>
  
		<p>With your own button. Note visible=false, you control button title yourself</p>
		<button @click="this.$refs.sui.onClick();" >
			Connect 
			<SignInWithSui ref="sui" :defaultChain="defaultChain" @suiMaster="onSuiMaster" @disconnected="onDisconnected" :visible="false"/>
		</button>
  
		<p>&nbsp;</p>

		<p>Pre-defined styling:</p>

		<SignInWithSuiButton :defaultChain="defaultChain" @wrongchain="onWrongChain" />

		<p>switch chain to: <a href="#" @click="defaultChain = 'sui:mainnet';">sui:mainnet</a> <a href="#" @click="defaultChain = 'sui:devnet';">sui:devnet</a></p>

		<li v-for="item in extra" :key="item">
			<SignInWithSuiButton :defaultChain="defaultChain" />
		</li>

		<p><a href='#' @click="extra.push(Math.random());">add extra button</a></p>

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

			defaultChain: 'sui:mainnet',
			extra: [],

			tryingTo: null,
		};
    },
    methods: {
		onWrongChain(tryingTo) {
			this.connectedAddress = null;
			this.connectedChain = null;

			this.tryingTo = tryingTo;
		},
        onSuiMaster(suiMaster) {
            this.connectedAddress = suiMaster.address;
            this.connectedChain = suiMaster.connectedChain;
			this.tryingTo = null;
        },
        onDisconnected() {
            this.connectedAddress = null;
            this.connectedChain = null;
			this.tryingTo = null;
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