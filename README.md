# vue-sui

Vue component to connect your dapp to Sui blockchain.

Includes [suidouble](https://github.com/suidouble/suidouble) library for easier interaction with Move smart contracts.

### Demo

[demo page](https://suidouble.github.io/vue-sui/)

### installation

```bash
npm install vue-sui --save
```

### usage

There're two components defined. Styled one:

```javascript
import { SignInWithSuiButton } from 'vue-sui';
```

and basic handler displaying just text in spans you can put into any button or call via method:

```javascript
import { SignInWithSui } from 'vue-sui';

<template>
    <button @click="this.$refs.sui.onClick();"><SignInWithSui ref="sui" /></button>
</temlate>
```

you can also hide displaying text at all, keeping methods functionality:

```javascript
import { SignInWithSui } from 'vue-sui';

<template>
    <button @click="this.$refs.sui.onClick();">Connect to Sui</button>
    <SignInWithSui ref="sui" :visible="false" />
</temlate>
```

### events

Both `SignInWithSui` and `SignInWithSuiButtons` emit very same set of events. Basically SignInWithSuiButtons is just a styled wrapper over SignInWithSui. So feel free to use any.

#### Client: `client`

Emits an instance of Sui's [SuiClient](https://github.com/MystenLabs/sui/tree/main/sdk/typescript/) class connected to the `defaultChain` blockchain. Usually it's emited very soon after SignInWithSui component is mounted (and doesn't require user to connect her/his wallet), and lets you interact with blockchain in read-only way right after the page load:

```javascript
<SignInWithSui @client="onClient" defaultChain="sui:mainnet" />

onClient = async (client) => {
    const data = await client.getObject({id: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231'});
}
```

#### Adapter: `adapter`

Emits an instance of SuiInBrowserAdapter, which follows the logic of StandartAdapter with functions of `signAndExecuteTransaction`,  `signTransaction`, `signAndExecuteTransactionBlock`, `signTransactionBlock`, `signMessage`, and `disconnect`. Note that disconnect is not always available (there's no in Sui Wallet) and you may have to ask users to sign off directly in wallet extension.

```javascript
<SignInWithSuiButton @adapter="onAdapter" defaultChain="sui:mainnet" />

onAdapter = async (adapter) => {
    const tx = new sui.Transaction();
    const data = await adapter.signAndExecuteTransaction({transaction: tx});
}
```

#### SuiMaster: `suiMaster`

Instance of high-level Sui smart contracts library - [suidouble](https://github.com/suidouble/suidouble) for interaction with smart contracts. Emited on initialization or when defaultChain parameter changed with instance of of suidouble SuiMaster, to let you interact with blockchain in read-only mode:

```javascript
<SignInWithSuiButton @suiMaster="onSuiMaster" defaultChain="sui:mainnet" />

async onSuiMaster(suiMaster) {
    const currentChain = suiMaster.connectedChain; // chain id, `sui:mainnet`  `sui:testnet` etc
    const instanceN = suiMaster.instanceN; // you may get few events when state changed, so you may check if it's same instance you had before

    // and interact with blockchain. Read more in suidouble documentation
    const pkg = suiMaster.package({
        id: packageId,
    });
    const module = await pkg.getModule('suidouble_color');

    const eventsResponse = await module.fetchEvents({eventTypeName: 'ColorCreated', order: 'descending'});
    // if you are connected, you can also execute contract methods:
    let result = await module.moveCall('mint', [...]);
    // etc
}
```

#### Connected: `connected`

Emited when use allows access to signing txs with her/hist wallet browser extension. Pass the instance of suidouble's SuiInBrowser class as a parameter:

```javascript
<SignInWithSuiButton @connected="onConnected" />

async onConnected(suiInBrowser) {
    const suiClient = await suiInBrowser.getClient(); // instance of SuiClient
    const suiMaster = await suiInBrowser.getSuiMaster(); // instance of suidouble SuiMaster instance
    const currentChain = suiInBrowser.getCurrentChain(); // chain id, `sui:mainnet`  `sui:testnet` etc
    const connectedAddress = suiInBrowser.getAddress(); // "0x42ff3..."
}
```

Note: it's emited when use switch chain in her/his wallet extension too. So you may get few events in the lifetime of application.

#### Disconnected: `disconnected`

```javascript
<SignInWithSuiButton @disconnected="onDisconnected" />

onDisconnected() {
    // connectedAddress is null now
}
```

### properties

#### defaultChain

chain to require connection too. Possible options are: `sui:mainnet` `sui:devnet` `sui:testnet` `sui:local`
```vue
<SignInWithSuiButton defaultChain="sui:mainnet" />
```


