# KONG DeFi Hackathon

## Intro.

This repository contain the standard escrow contract used to hold assets for a Kong note. It can be modified to store the Ethereum asset of your choice for the period of time that you desire. After that period of time you can use the function `transferTokens` to withdraw the tokens from the escrow contract so long as you provide a valid signature of a recent blockhash as verified against the stored public key coordinates.

## Installation.

Install the required node packages by running

    npm install

from the root folder. You'll want to make sure that Truffle is installed globally. To achieve this, run

    npm install -g truffle

## Compilation.

Compile (`truffle compile`) the current version of the contracts so the folder `build` is present in the root directory.

## Kong ID Information.

The `deployment/json` directory contains JSON files for all of the KONG IDs provided at the DeFi hackathon. These files include the public key coorindates as well as the printed ID number and can be used in conjunction with the `deployEscrow.js` script. Find your Kong ID by searching for the corresponding `count`.

These JSON blobs contain the default claim date for Kong notes manufactured in October 2019 as an UNIX epoch timestamp. Depending on your application you may or may not want a claim date. If you are parsing the JSON file in a similar way for the asset that you plan to escrow, you may wish to alter this claim date.

Make sure to keep the primary public key (it's hash and x, y coordinates) as it's required for validating signatures. The other keys are Kong cash specific and may not be relevant for your application.

## Deploy.

Use the `deployEscrow.js` file present in `deployment` to deploy your escrow contract. Depending on additional parameters required for your asset you may need to modify this script.

## Notes.

This repository is intended as a stub and does not contain testing scripts for the Kong escrow contract.