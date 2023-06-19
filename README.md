# vue-sui

Vue component to connect your dapp to Sui blockchain.

Includes [suidouble](https://github.com/suidouble/suidouble) library for easier interaction with Move smart contracts.

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

#### SuiMaster: `suiMaster`

Emited on initialization or when defaultChain parameter changed with instance of of suidouble SuiMaster, to let you interact with blockchain in read-only mode:

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
    let result = await module.moveCall('mint', ['test', 23]);
    // etc
}
```

#### Connected: `connected`

Emited when use allows access to signing txs with her/hist wallet browser extension. Pass the instance of suidouble's SuiInBrowser class as a parameter:

```javascript
<SignInWithSuiButton @connected="onConnected" />

async onConnected(suiInBrowser) {
    const provider = await suiInBrowser.getProvider(); // instance of JsonRpcProvider
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


