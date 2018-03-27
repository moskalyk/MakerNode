
# MakerNode

Interact with MakerDao, simply, and programmatically.

A node module that abstracts terminology within the MakerDao ecosystem, to more seamlessly interact with the smart contracts. This module can be thought of as a wrapper module to this existing work that has been done by the Maker team.

## High Level Objectives:
* Simplify intution for new users to use MakerDao
* Remove the need of interacting with Web3 integrations
* Flexibility and clarity in execution
* 


Note: This module is not meant to be a fully extensive way to interact with the MakerDao system.

Collaborators encouraged


## Example Usage



```javascript

const NodeMaker = require('node-maker');

const nodeMaker = NodeMaker({
	chain: "kovan",
	address: "0x..."
	pkey: "..."
	});

await nodeMaker.approveAll();

const ethToCollateralize = new BN(1);

const wethWrapped = await nodeMaker.wrapEthToWeth(ethToCollateralize);

await nodeMaker.joinWethToPeth(ethToCollateralize);

await nodeMake.openCDP();

const pethLocked = await nodeMake.lockPeth();

const dai = await nodeMake.drawDai();


```

Alternatively, one can open a CDP via this following API call by removing many of the steps of abstraction.

The following call will make a call to 


```javascript
const NodeMaker = require('node-maker');

const nodeMaker = NodeMaker({
	chain: "kovan",
	address: "0x...",
	pkey: "..."
	});

const ethToCollateralize = new BN(1);
const targetCollateralRatio = 2.50; // 250%

const drawnDai = await nodeMaker.collateralize(
	ethToCollateralize, 
	targetCollateralRatio
	);

```

## API Functions

### approveAll(...);
### wrapEthToWeth(...);
### joinWethToPeth(...);
### openCDP(...);
### getCDP(...);
### lockPeth(...);
### drawDai(...);
### collateralize(...);

## Helper Functions
### transferWeth(...);
### transferPeth(...);
### getEthPrice(...);
### cupIsSafe


TODOs:
 [x] Add Docs
 [ ] Review Docs
 [ ] Create Tests
 [ ] Add to Travis build
 [ ] Convert to Typescript