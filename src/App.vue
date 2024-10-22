<template>
	<div>
		<div style="display: block; padding: 12px; background: #abc4ff;; color: #2A66F3; text-align: right;">
			<button @click="this.$refs.sui.onClick();" style="background-color: #2A66F3; color: #edf2fb; border: 0; padding: 8px;">
				<span v-if="!connectedAddress">Connect</span> 
				<span v-if="connectedAddress">{{ displayAddress }}</span> 
				<SignInWithSui ref="sui" :defaultChain="defaultChain" :persist="true" @connected="onConnected" @client="onClient" @suiMaster="onSuiMaster" @provider="onProvider" @adapter="onAdapter" @disconnected="onDisconnected" :visible="false"/>
			</button>
			<button v-if="connectedAddress" @click="this.$refs.sui.disconnect();" style="background-color: #2A66F3; color: #edf2fb; border: 0; padding: 8px;">
				Disconnect
			</button>
		</div>
	</div>
	<div style="padding: 12px;">

		<div style="float: left; width: 50%; overflow: hidden;">
		<h1>vue-sui</h1>


		<div>
			<p>Demo of the <a href="https://github.com/suidouble/vue-sui">vue-sui</a> component. Vue component to connect your dapp to Sui blockchain.</p>
		</div>

		<p>All styles are managed by you, the SignInWithSui component itself is invisible.</p>

		<p><code>
			&lt;SignInWithSui ref="sui" :defaultChain="defaultChain" :persist="true" @connected="onConnected" @client="onClient" @suiMaster="onSuiMaster" :visible="false" &gt;
		</code></p>
  
		<p>Request the component to display a wallet extension selection popup and prompt the user to connect their wallet:</p>

		<p><code>
			this.$refs.sui.onClick();
		</code></p>

		<p>Listen to component events of:</p>

		<p><b>@client</b> to get an instance of sui sdk's <a href="https://github.com/MystenLabs/sui/blob/main/sdk/typescript/src/client/client.ts" target="_blank">SuiClient</a></p>
		<p><b>@suiMaster</b> to get an instance of suidouble <a href="https://github.com/suidouble/suidouble" target="_blank">SuiMaster</a></p>
		<p><b>@connected</b> when user wallet is connected, you also get additional suiMaster event with connected SuiMaster</p>
		<p><b>@adapter</b> to get an instance of <a href="https://github.com/suidouble/suidouble/blob/main/lib/SuiInBrowserAdapter.js">SuiInBrowserAdapter</a> in case you want to sign txs without SuiMaster</p>
		<p><b>@wrongchain</b> to catch the case when you expect user to be connected to specific chain, like 'mainnet', but she has different one selected in the wallet</p>

  
		<p>&nbsp;</p>

		<p>Or use SignInWithSuiButton with pre-defined styling:</p>

		<p><code>
			&lt;SignInWithSuiButton :defaultChain="defaultChain" @wrongchain="onWrongChain" /&gt;
		</code></p>

		<SignInWithSuiButton :defaultChain="defaultChain" @wrongchain="onWrongChain" />

		<li v-for="item in extra" :key="item">
			<SignInWithSuiButton :defaultChain="defaultChain" />
		</li>

		<p v-if="adapter"><a href="#" @click="$refs.sui.disconnect();">disconnect</a> ( with some wallets (Suiet) it's instant, with some (Sui Wallet) - it clears connection and refreshes the page)</p>


		<p>Also try to disconnect or switch chain directly from browser extension</p>

		<p>&nbsp;</p>

	</div>
    <div style="float: right; width: 50%; overflow: hidden; padding-top: 12px;">
		<div>
			<p>switch `defaultChain` component prop to: <a href="#" @click="defaultChain = 'sui:mainnet';">sui:mainnet</a> <a href="#" @click="defaultChain = 'sui:devnet';">sui:devnet</a> <a href="#" @click="defaultChain = 'sui:testnet';">sui:testnet</a></p>

			<table>
				<tr><td>Connected as</td><td>
					<span v-if="!connectedAddress && connectedChain">read-only</span>
					<span v-if="connectedAddress && connectedChain">{{ connectedAddress }} <button @click="onTx" >Do Sample TX</button></span>
				</td></tr>
				<tr><td>Connected to</td><td>
					{{ connectedChain }}
				</td></tr>
				<tr><td>defaultChain</td><td>
					{{ defaultChain }}
				</td></tr>
			</table>
		
		<span v-if="tryingTo">Was trying to connect to {{ tryingTo }}, but expected to {{ defaultChain }} (ask user to switch chain in wallet extension settings or reinitialize/redirect to different chain dapp/sub-dapp)</span>
		</div>

		<h3>Events</h3>

		<p>List of events from SignInWithSui `.$refs.sui` component</p>

		<table>
		<template v-for="(event, index) in events" v-bind:key="index">
			<tr>
				<td><b>{{ event.name }}</b></td><td>{{ JSON.stringify(event.args) }}</td>
			</tr>
		</template>
		</table>
	</div>

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
			displayAddress: null,
			connectedChain: null,

			defaultChain: 'sui:mainnet',
			extra: [],

			tryingTo: null,

			events: [],

			adapter: null,

			suiMaster: null,
		};
    },
    methods: {
		onRPCClick() {
			this.$refs.sui.setRPC({
					url: 'https://sui-mainnet-endpoint.blockvision.org',
					rpc: {
						// headers: {"x-allthatnode-api-key": "xxxxxxxxxx"},
					},
				});
		},
		onWrongChain(tryingTo) {
			this.events.push({name: 'wrongchain', args: arguments});

			this.connectedAddress = null;
			this.connectedChain = null;

			this.tryingTo = tryingTo;
		},
        onSuiMaster(suiMaster) {
			this.events.push({name: 'suiMaster', args: [suiMaster ? 'instance_of_SuiMaster' : null]});

            this.connectedAddress = suiMaster.address;
			this.displayAddress = this.$refs.sui.displayAddress;
            this.connectedChain = suiMaster.connectedChain;

			this.suiMaster = suiMaster;


			this.tryingTo = null;
        },
		onConnected() {
			this.events.push({name: 'connected', args: arguments});
		},
		onProvider(provider) {
			this.events.push({name: 'provider', args: [provider ? 'instance_of_SuiClient' : null]});
		},
		onClient(client) {
			this.events.push({name: 'client', args: [client ? 'instance_of_SuiClient' : null]});
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
		// clickDisconnect() {
		// 	this.adapter.disconnect();
		// },
		async onTx() {
			try {
			const suiCoin = this.suiMaster.suiCoins.get('sui');
			const tx = new (this.suiMaster.Transaction)();
			const coinInput = await suiCoin.coinOfAmountToTxCoin(tx, this.suiMaster.address, '0.01'); // pick 0.01 SUI

			tx.transferObjects([coinInput], this.suiMaster.address); // send it to yourself

				const result = await this.suiMaster.signAndExecuteTransaction({
					transaction: tx,
					requestType: 'WaitForLocalExecution',
					options: {
					},
				});

				if (result && result.digest) {
					alert('tx sent, digest: '+result.digest);
					// this.events.push({name: 'tx sent', args: [result.digest]});
				} else {
					// this.events.push({name: 'tx not sent', args: []});
				}
			} catch (e) {
				alert(e);
			}
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
		margin-top: 0px;
	}

	code {
		background: white;
		display: block;
		padding: 8px;
		margin-right: 12px;
	}
</style>