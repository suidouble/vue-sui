<template>
	<div>
		<div style="display: block; padding: 12px; background: #abc4ff; color: #2A66F3; text-align: right;">
			<button @click="this.$refs.sui.onClick();">
				<span v-if="!connectedAddress">Connect</span> 
				<span v-if="connectedAddress" :title="connectedAddress">{{ displayAddress }}</span> 
				<SignInWithSui ref="sui" 
					:defaultChain="defaultChain" 
					:persist="true" 
					@connected="onConnected" 
					@client="onClient" 
					@suiMaster="onSuiMaster" 
					@provider="onProvider" 
					@adapter="onAdapter" 
					@disconnected="onDisconnected"
					@displayAddress="onDisplayAddress"
					:visible="false"
					/>
			</button>
			<button v-if="connectedAddress" @click="this.$refs.sui.disconnect();">
				Disconnect
			</button>
		</div>
	</div>

	<div style="padding: 12px;">
		<div class="docs_column">
			
			<h1>vue-sui</h1>

		</div>
		<div class="docs_column">

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

		</div>
	</div>


	<div style="padding: 12px;">

		<div class="docs_column">


		<div>
			<p>Demo of the <a href="https://github.com/suidouble/vue-sui">vue-sui</a> component. Vue component to connect your dapp to Sui blockchain.</p>
		</div>

		<p>All styles on pages are managed by you, the SignInWithSui component itself is invisible until popup is requested.</p>

		<pre><code class="language-javascript">
import { SignInWithSui } from 'vue-sui';

&lt;SignInWithSui 
	ref="sui"
	:defaultChain="defaultChain" 
	:persist="true" 
	@connected="onConnected" 
	@client="onClient" 
	@suiMaster="onSuiMaster" 
	@wrongchain="onWrongChain"
	@displayAddress="onDisplayAddress"
	:visible="false" 
	:persist="true" 
	&gt;
		</code></pre>
  
		<p>Listen to component events of:</p>

		<p><b>@client</b> to get an instance of sui sdk's <a href="https://github.com/MystenLabs/sui/blob/main/sdk/typescript/src/client/client.ts" target="_blank">SuiClient</a></p>
		<p><b>@suiMaster</b> to get an instance of suidouble <a href="https://github.com/suidouble/suidouble" target="_blank">SuiMaster</a></p>
		<p><b>@connected</b> when user wallet is connected, you also get additional suiMaster event with connected SuiMaster</p>
		<p><b>@adapter</b> to get an instance of <a href="https://github.com/suidouble/suidouble/blob/main/lib/SuiInBrowserAdapter.js">SuiInBrowserAdapter</a> connected with user's wallet in case you want to sign txs without SuiMaster</p>
		<p><b>@displayAddress</b> when displayAddress is updated. May be a short wallet address, like "0x2636...9f78" or SuiNS name, if resolved for the connected wallet</p>
		<p><b>@wrongchain</b> to catch the case when you expect user to be connected to specific chain, like 'mainnet'(defaultChain == 'sui:mainnet'), but user has different one selected in the wallet</p>

  
		<p>&nbsp;</p>

		<p>Or use SignInWithSuiButton with pre-defined styling:</p>

		<pre><code class="language-javascript">
import { SignInWithSuiButton } from 'vue-sui';

&lt;SignInWithSuiButton :defaultChain="defaultChain" :persist="true" /&gt;
		</code></pre>

		<SignInWithSuiButton :defaultChain="defaultChain" @wrongchain="onWrongChain" />

		<p>SignInWithSuiButton emits the same set of events as underlying SignInWithSui component</p>

		<li v-for="item in extra" :key="item">
			<SignInWithSuiButton :defaultChain="defaultChain" />
		</li>

		<p v-if="adapter"><a href="#" @click="$refs.sui.disconnect();">disconnect</a> ( with some wallets (Suiet) it's instant, with some (Sui Wallet) - it clears connection and refreshes the page)</p>


		<p>Also try to disconnect or switch chain directly from browser extension, vue-sui will cover this events and update component state on the fly.</p>

		<p>&nbsp;</p>

	</div>
    <div class="docs_column">

		<p>Request the component to display a wallet extension selection popup and prompt the user to connect their wallet:</p>

		<pre><code  class="language-javascript">
this.$refs.sui.connect();
		</code></pre>

		<p>
			<button @click="this.$refs.sui.connect();">Run this.$refs.sui.connect()</button></p>

		<p>To disconnect from the wallet:</p>

<pre><code  class="language-javascript">
this.$refs.sui.disconnect();
	</code></pre>

<p>
	<button @click="this.$refs.sui.disconnect();">Run this.$refs.sui.disconnect()</button></p>

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
	mounted() {
		setTimeout(()=>{
			hljs.highlightAll();
		}, 50);
	},
    methods: {
		onDisplayAddress(displayAddress) {
			this.events.unshift({name: 'displayAddress', args: [displayAddress]});

			this.displayAddress = displayAddress;
		},
		onRPCClick() {
			this.$refs.sui.setRPC({
					url: 'https://sui-mainnet-endpoint.blockvision.org',
					rpc: {
						// headers: {"x-allthatnode-api-key": "xxxxxxxxxx"},
					},
				});
		},
		onWrongChain(tryingTo) {
			this.events.unshift({name: 'wrongchain', args: arguments});

			this.connectedAddress = null;
			this.connectedChain = null;

			this.tryingTo = tryingTo;
		},
        onSuiMaster(suiMaster) {
			this.events.unshift({name: 'suiMaster', args: [suiMaster ? 'instance_of_SuiMaster ('+(suiMaster.address ? ('wallet='+suiMaster.address) : 'readonly')+')' : null]});

            this.connectedAddress = suiMaster.address;
            this.connectedChain = suiMaster.connectedChain;

			this.suiMaster = suiMaster;

			this.tryingTo = null;
        },
		onConnected() {
			this.events.unshift({name: 'connected', args: arguments});
		},
		onProvider(provider) {
			this.events.unshift({name: 'provider', args: [provider ? 'instance_of_SuiClient' : null]});
		},
		onClient(client) {
			this.events.unshift({name: 'client', args: [client ? 'instance_of_SuiClient' : null]});
		},
		onAdapter(adapter) {
			this.events.unshift({name: 'adapter', args: [adapter ? 'instance_of_SuiInBrowserAdapter (name='+adapter.name+')' : null]});

			this.adapter = adapter;
		},
        onDisconnected() {
			this.events.unshift({name: 'disconnected', args: arguments});

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

	#app a {
		color: rgb(42, 102, 243);
	}

	#app button {
		background-color: #2A66F3; 
		color: #edf2fb; 
		border: 0; 
		padding: 8px;
	}

	#app .docs_column {
		float: left;
		width: 50%;
		overflow: hidden;
	}

	@media (max-width: 1250px) {
		#app .docs_column {
			float: none;
			width: 100%;
			overflow: hidden;
		}

	}

	code {
		background: white;
		display: block;
		padding: 8px;
		margin-right: 12px;
	}
</style>