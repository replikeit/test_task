# Test hiring task
Test NFT token [test task](https://docs.google.com/document/d/1t1NSG-0hV0-2dmKFI7seMmmqxu5i6-TtiIk95PlN5nA/edit)
## Requirements
- npm
- Ganache-CLI
- hardhat
## Testing
In current directory 
```
$ npx hardhat test
```
## Deploy
In current directory open file hardhat.config.json.
Then replace `@PRIVATE_KEY` on your ethereum mainnet private key
and replace `@INFURA_KEY` on your rpc-infura key
Then input command in terminal: 
```
$npx hardhat run scripts/deploy.ts
```
