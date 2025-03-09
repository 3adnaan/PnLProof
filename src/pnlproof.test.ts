import { NumberProof } from './pnlproof';
import {
  Field,
  PrivateKey,
  PublicKey,
  Mina,
  AccountUpdate,
  Signature,
} from 'o1js';

describe('numberProof', () => {
  let prover: Mina.TestPublicKey,
    proverKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey;

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled: false });
    Mina.setActiveInstance(Local);

    [prover] = Local.testAccounts;
    proverKey = prover.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
  });

  it('generates and deploys NumberProof contract', async () => {
    const zkApp = new NumberProof(zkAppAddress);
    const txn = await Mina.transaction(prover, async () => {
      AccountUpdate.fundNewAccount(prover);
      await zkApp.deploy();
    });
    await txn.prove();
    await txn.sign([zkAppPrivateKey, proverKey]).send();
    const storedNumber = zkApp.number.get();
    expect(storedNumber).toEqual(Field(0));
  });

  it('deploys NumberProof & verifies correct proof based on input', async () => {
    const zkApp = new NumberProof(zkAppAddress);

    // deploy
    let txn = await Mina.transaction(prover, async () => {
      AccountUpdate.fundNewAccount(prover);
      await zkApp.deploy();
    });
    await txn.prove();
    console.log(await txn.prove());
    await txn.sign([zkAppPrivateKey, proverKey]).send();

    // Get user input for x
    const userInput = 50; // Change this to test different values
    const x = Field(userInput);
    const timestamp = Field(20240309); // Example date (YYYYMMDD)
    const signature = Signature.create(proverKey, [x, timestamp]);
    txn = await Mina.transaction(prover, async () => {
      zkApp.generateProof(prover, x, timestamp, signature);
    });
    await txn.prove();
    await txn.sign([proverKey]).send();

    // verify proof
    txn = await Mina.transaction(prover, async () => {
      zkApp.verifyProof(x, timestamp);
    });
    await txn.prove();
    await txn.sign([proverKey]).send();

    const storedNumber = zkApp.number.get();
    const storedTimestamp = zkApp.timestamp.get();
    expect(storedNumber).toEqual(x);
    expect(storedTimestamp).toEqual(timestamp);
  
  });
});
