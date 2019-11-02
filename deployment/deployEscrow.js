/*
 * Deploy Escrow Contract.
 */

// Set key / addresses.
var deployerPrivateKey = ''
var deployerAddress = '';
var ellipticAddress = '0xf471789937856D80e589F5996cf8b0511DDD9de4';
var kongERC20Address = '0x177F2aCE25f81fc50F9F6e9193aDF5ac758e8098';

// Load modules.
crypto           = require('crypto');
ethereumJSutil   = require('ethereumjs-util');
ethereumJSTx     = require('ethereumjs-tx');
fs               = require('fs');
web3             = require('web3');

//
// ARGUMENTS
//
// --deployerPrivateKey=
// Usage: The deployer private key, required
//
// --deployerAddress=
// Usage: The deployer address, required
//
// --gasPrice=
// Usage: Optional, set a gas price. 2000000000 is default if not set.

// Get arguments.
const args = require('yargs').argv;

// Load.
if (!args.deployerPrivateKey || !args.deployerAddress) {console.log(`--deployerPrivateKey and --deployerAddress missing, using default ${deployerAddress}`)};

// Set private key and deployer address.
if (args.deployerPrivateKey) {
    deployerPrivateKey = args.deployerPrivateKey;    
}

if (args.deployerAddress) {
    deployerAddress = args.deployerAddress;    
}

// Load.
if (!args.primaryHash) {console.log('Please provide file of the parameters you wish to deploy.'); process.exit()};
jsonData = JSON.parse(fs.readFileSync(`./deployment/json/${args.primaryHash}.json`));

// Set up gas price.
var deploymentGasPrice = 2000000000;

if (args.gasPrice) {
    deploymentGasPrice = parseInt(args.gasPrice);
}

// Verify key / hash integrity.
var expectedPrimaryHash = ethereumJSutil.bufferToHex(ethereumJSutil.sha256('0x' + jsonData.primaryPublicKey[0] + jsonData.primaryPublicKey[1].slice(2)));
if (!jsonData.primaryPublicKeyHash == expectedPrimaryHash) { console.log('Primary key hash invalid.'); process.exit()};

// Verify that no file exists.
if (fs.existsSync(`./deployment/json/${args.primaryHash}.json`)) { console.log('Found existing escrow contract.'); process.exit()};

// Initiate web3.
var provider   = new web3.providers.HttpProvider('https://eth.cryptocash.pub');
web3           = new web3(provider);

// Get (truffle-)compiled contract object.
var compiledEscrowContract = JSON.parse(fs.readFileSync('./build/contracts/Escrow.json'));
var compiledEscrowContractVersion = '0x' + crypto.createHash('sha256').update(compiledEscrowContract.deployedBytecode.slice(2), 'hex').digest('hex');;
var Escrow = new web3.eth.Contract(compiledEscrowContract['abi']);

        // Deploy.
        web3.eth.getTransactionCount(deployerAddress).then(function(txCount) {

            var transaction = new ethereumJSTx({
                nonce:      web3.utils.toHex(txCount),
                gasLimit:   800000,
                gasPrice:   deploymentGasPrice,
                from:       deployerAddress,
                data:       compiledEscrowContract.bytecode + web3.eth.abi.encodeParameters(
                    [
                        'uint256',
                        'uint256',
                        'address',
                        'address',
                        'uint256'
                    ],
                    [
                        jsonData.primaryPublicKey[0],
                        jsonData.primaryPublicKey[1],
                        ellipticAddress,
                        kongERC20Address,
                        jsonData.claimDate
                    ]
                ).slice(2)
            });

            transaction.sign(Buffer.from(deployerPrivateKey.slice(2), 'hex'));
            var serializedTx = transaction.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                .on('confirmation', function (confirmationNumber, receipt) {

                    jsonData['contractAddress'] = receipt.contractAddress;
                    jsonData['contractName'] = compiledEscrowContract.contractName;
                    jsonData['contractVersion'] = compiledEscrowContractVersion;
                    jsonData['contractCompiler'] = compiledEscrowContract.compiler;
                    jsonData['contractSource'] = compiledEscrowContract.source;
                    jsonData['contractDeployedByteCode'] = compiledEscrowContract.deployedBytecode;
                    jsonData['contractTransaction'] = receipt.transactionHash;

                    // State / Parameters.
                    jsonData['contractParameterEllipticCurveContractAddress'] = ellipticAddress;
                    jsonData['contractParameterKongERC20ContractAddress'] = kongERC20Address;

                    // Store.
                    fs.writeFile(`./deployment/json/${args.primaryHash}.json`, JSON.stringify(jsonData), 'utf8', (err, res) => {

                        if (!err) {

                            console.log(`Successfully Deployed Escrow Contract (Contract Address ${receipt.contractAddress})`);
                            process.exit();

                        } else if (err) {

                            console.log(err);

                        }

                    })

                })

        });

