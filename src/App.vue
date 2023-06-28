<template>
    <div style="float: left; width: 50%; overflow: hidden;">
		<h1>vue-sui</h1>

		<div>
		Connected as: 	<span v-if="!connectedAddress && connectedChain">read-only</span>
						<span v-if="connectedAddress && connectedChain">{{ connectedAddress }}</span>
						<br>
		Connected to: {{ connectedChain }}<br>
		
		<span v-if="tryingTo">Was trying to connect to {{ tryingTo }}, but expected to {{ defaultChain }} (ask user to switch chain in wallet extension settings or reinitialize/redirect to different chain dapp/sub-dapp)</span>
		</div>
  
		<p>With your own button. Note visible=false, you control button title yourself</p>
		<button @click="this.$refs.sui.onClick();" >
			Connect 
			<SignInWithSui ref="sui" :defaultChain="defaultChain" @connected="onConnected" @suiMaster="onSuiMaster" @provider="onProvider" @adapter="onAdapter" @disconnected="onDisconnected" :visible="false"/>
		</button>
  
		<p>&nbsp;</p>

		<p>Pre-defined styling:</p>

		<SignInWithSuiButton :defaultChain="defaultChain" @wrongchain="onWrongChain" />

		<p>switch `defaultChain` component prop to: <a href="#" @click="defaultChain = 'sui:mainnet';">sui:mainnet</a> <a href="#" @click="defaultChain = 'sui:devnet';">sui:devnet</a></p>

		<li v-for="item in extra" :key="item">
			<SignInWithSuiButton :defaultChain="defaultChain" />
		</li>

		<p v-if="adapter"><a href="#" @click="clickDisconnect">disconnect</a> (may not be available in some wallets)</p>

		<p><a href='#' @click="extra.push(Math.random());">add extra button</a></p>

		<p>Also try to disconnect or switch chain directly from browser extension</p>
	</div>
    <div style="float: right; width: 50%; overflow: hidden;">
		<h3>Events:</h3>

		<template v-for="(event, index) in events" v-bind:key="index">
			<div>
				<strong>name:</strong> {{ event.name }} <strong>details:</strong> {{ JSON.stringify(event.args) }}
			</div>
		</template>
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

			events: [],

			adapter: null,
		};
    },
    methods: {
		onWrongChain(tryingTo) {
			this.events.push({name: 'wrongchain', args: arguments});

			this.connectedAddress = null;
			this.connectedChain = null;

			this.tryingTo = tryingTo;
		},
        onSuiMaster(suiMaster) {
			this.events.push({name: 'suiMaster', args: [suiMaster ? 'instance_of_SuiMaster' : null]});

            this.connectedAddress = suiMaster.address;
            this.connectedChain = suiMaster.connectedChain;
			this.tryingTo = null;
        },
		onConnected() {
			this.events.push({name: 'connected', args: arguments});
		},
		onProvider(provider) {
			this.events.push({name: 'provider', args: [provider ? 'instance_of_JsonRpcProvider' : null]});
		},
		onAdapter(adapter) {
			console.error(adapter);
			this.events.push({name: 'adapter', args: [adapter ? 'instance_of_SuiInBrowserAdapter' : null]});

			this.adapter = adapter;
		},
        onDisconnected() {
			this.events.push({name: 'disconnected', args: arguments});

            this.connectedAddress = null;

            // this.connectedChain = null; // provider is still available, read-only mode
			this.tryingTo = null;
        },
		clickDisconnect() {
			this.adapter.disconnect();
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