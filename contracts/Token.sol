pragma solidity 0.4.18;
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Token {
	using SafeMath for uint256;

	// Contract balance
	mapping (address => uint256) public balanceOf;
	// Token name
	string public name;
	// Token symbol
	string public symbol;
	// Decimals to use
	uint8 public decimal; 
	// Total initial suppy
	uint256 public totalSupply;
	// Transfer function interface
	event Transfer(address indexed from, address indexed to, uint256 value);

	// Token creation function
	function Token(uint256 initialSupply, string tokenName, string tokenSymbol, uint8 decimalUnits){
		// set the balance of the creator to the initial supply
		balanceOf[msg.sender] = initialSupply;
		totalSupply = initialSupply;
		decimal = decimalUnits;
		symbol = tokenSymbol;
		name = tokenName;
	}

	// Transfer function used to send tokens to an address
	function transfer(address _to, uint256 _value){
		// Check if the creator actually has the required balance
		require(balanceOf[msg.sender] >= _value);
		// Check if the amount sent will not overflow
		require(balanceOf[_to].add(_value) >= balanceOf[_to]);
		// Substract tokens from the creator
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		// Add tokens to the transfer address
		balanceOf[_to] = balanceOf[_to].add(_value);
		// Execute the transfer
		Transfer(msg.sender, _to, _value);
	}
}