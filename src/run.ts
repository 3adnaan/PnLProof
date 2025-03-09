

import {
  Field,
  PrivateKey,
  PublicKey,
  Mina,
  AccountUpdate,
  Signature,
} from 'o1js';
import { NumberProof} from './pnlproof.js';
import * as fs from 'fs';


// Read input from JSON file
const rawData = fs.readFileSync('input.json', 'utf8');
const inputData = JSON.parse(rawData);
const x = Field(inputData.number);
const timestamp = Field(inputData.timestamp);

const Local = await Mina.LocalBlockchain({ proofsEnabled: false });
Mina.setActiveInstance(Local);
const zkAppPrivateKey = PrivateKey.random();
const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
const zkApp = new NumberProof(zkAppPublicKey);

// // Create a new instance of the contract
// console.log('\n\n====== DEPLOYING ======\n\n');
// const txn = await Mina.transaction(number, async () => {
//   AccountUpdate.fundNewAccount();
//   await zkApp.deploy();
//   await zkApp.generateProof(zkAppPublicKey,);
// });
// await txn.prove();
