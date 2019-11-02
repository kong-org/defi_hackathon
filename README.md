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

## Deploy.

Use the scripts present in `deployment` to deploy your escrow contract.

## JSON.

The JSON directory contains blobs for all of the KONG IDs provided at the DeFi hackathon. These JSON blobs include the public key coorindates as well as the printed ID number and can be used in conjunction with the `deployEscrow.js` script.