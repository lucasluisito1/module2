# Assessment Smart Contract

This Solidity smart contract implements a basic fund management system, allowing users to deposit and withdraw funds. It also includes custom error handling for insufficient balance during withdrawal.

## Features

- Deposit funds into the contract.
- Withdraw funds from the contract (only available to the contract owner).
- Custom error handling for insufficient balance during withdrawal.

## Usage

### Contract Deployment

The contract can be deployed to a supported Ethereum network using tools like Hardhat or Remix IDE. Make sure to provide an initial balance during deployment.

### Interacting with the Contract

#### Deposit

To deposit funds into the contract, call the `deposit` function and provide the amount to deposit as a parameter. Only the contract owner can deposit funds.

#### Withdraw

To withdraw funds from the contract, call the `withdraw` function and provide the amount to withdraw as a parameter. Only the contract owner can withdraw funds. If the contract does not have sufficient balance, a custom error will be thrown.

#### Get Balance

To retrieve the current balance of the contract, call the `getBalance` function.

## Testing

Comprehensive testing of the contract's functionalities is recommended to ensure its correctness and robustness. Tests can be written using tools like Hardhat's testing framework.

## Security Considerations

- Ensure that only authorized users can withdraw funds from the contract.
- Implement proper error handling to prevent unexpected behavior and vulnerabilities.

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for details.

# Author
Luisito Lucas 
