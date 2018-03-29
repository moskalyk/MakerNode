/**
 * The TxManager contract does this and that...
 */
pragma solidity ^0.4.18;

import { WETH9_ as Weth } from "./Weth.sol";
import { DSToken as Peth } from "./Peth.sol";
import { SaiTub as Tub } from "./SaiTub.sol";
import { DSToken as Dai } from "./Dai.sol";
 
contract TxManager {

	Tub public tub;
	Weth public weth;
	Peth public peth;
	Dai public dai;

	address public _tubAddress;
	address public _wethAddress;
	address public _pethAddress;

	event LogTest(address log);
	event LogTestNum(uint log);

	function TxManager (address tubAddress, address wethAddress, address pethAddress, address daiAddress) {

		tub = Tub(tubAddress);
		weth = Weth(wethAddress);
		peth = Peth(pethAddress);
		dai = Dai(daiAddress);

	}

	// function approve() payable {

	// }

	// function transferFrom() {

	// }

	function openCdp(uint allowance, uint dai, address tubAddress) returns (bool) {
		LogTestNum(allowance);

		_approveAllowance(allowance, tubAddress);

		// Convert ETH to WETH
		weth.deposit.value(allowance)();

		// // Join WETH to PETH
		// tub.join(allowance);

		// // Open CDP, returns cup ID
		// bytes32 cupId = tub.open();

		// // Lock Peth in the Cup
		// tub.lock(cupId, allowance);

		// // Draw Dai from the cup
		// tub.draw(cupId, dai);

		return true;
	}

	function _approveAllowance(uint allowance, address tubAddress) private {

		LogTest(tubAddress); 

		// Give this contract access to act on the behalf
		weth.approve(this, allowance);

		weth.approve(tubAddress, allowance);
		peth.approve(tubAddress, allowance);
		dai.approve(tubAddress, allowance);
		// mkr.approve(tub, allowance);
	}
}
