// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event DepositWithMessage(uint256 amount, string message);
    event Withdraw(uint256 amount);
    event WithdrawToAddress(uint256 amount, address to);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @notice Constructor to initialize the contract with an initial balance.
    /// @param initBalance Initial balance to set for the contract.
    constructor(uint256 initBalance) {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    /// @notice Returns the current balance of the contract.
    /// @return The current balance.
    function getBalance() public view returns (uint256) {
        return balance;
    }

    /// @notice Deposits a specified amount into the contract.
    /// @param amount The amount to deposit.
    function deposit(uint256 amount) public {
        uint256 previousBalance = balance;

        // Ensure the caller is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // Perform the transaction
        balance += amount;

        // Assert the transaction completed successfully
        assert(balance == previousBalance + amount);

        // Emit the event
        emit Deposit(amount);
    }

    /// @notice Deposits a specified amount into the contract with a message.
    /// @param amount The amount to deposit.
    /// @param message The message to include with the deposit.
    function depositWithMessage(uint256 amount, string memory message) public {
        uint256 previousBalance = balance;

        // Ensure the caller is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // Perform the transaction
        balance += amount;

        // Assert the transaction completed successfully
        assert(balance == previousBalance + amount);

        // Emit the event
        emit DepositWithMessage(amount, message);
    }

    // Custom error for insufficient balance
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    /// @notice Withdraws a specified amount from the contract.
    /// @param withdrawAmount The amount to withdraw.
    function withdraw(uint256 withdrawAmount) public {
        uint256 previousBalance = balance;

        // Ensure the caller is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // Check for sufficient balance
        if (balance < withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: withdrawAmount
            });
        }

        // Perform the withdrawal
        balance -= withdrawAmount;

        // Assert the balance is correct
        assert(balance == previousBalance - withdrawAmount);

        // Emit the event
        emit Withdraw(withdrawAmount);
    }

    /// @notice Withdraws a specified amount from the contract to a specified address.
    /// @param withdrawAmount The amount to withdraw.
    /// @param to The address to send the withdrawn amount.
    function withdrawToAddress(uint256 withdrawAmount, address payable to) public {
        uint256 previousBalance = balance;

        // Ensure the caller is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // Check for sufficient balance
        if (balance < withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: withdrawAmount
            });
        }

        // Perform the withdrawal
        balance -= withdrawAmount;
        to.transfer(withdrawAmount);

        // Assert the balance is correct
        assert(balance == previousBalance - withdrawAmount);

        // Emit the event
        emit WithdrawToAddress(withdrawAmount, to);
    }

    /// @notice Transfers ownership of the contract to a new address.
    /// @param newOwner The address of the new owner.
    function transferOwnership(address payable newOwner) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(newOwner != address(0), "New owner is the zero address");

        address previousOwner = owner;
        owner = newOwner;

        // Emit the event
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /// @notice Returns the current owner of the contract.
    /// @return The address of the current owner.
    function getOwner() public view returns (address) {
        return owner;
    }
}
