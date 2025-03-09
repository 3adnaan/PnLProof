import {
  Field,
  State,
  SmartContract,
  state,
  method,
  PublicKey,
  Signature,
} from 'o1js';

export class NumberProof extends SmartContract {
  // Store the claimed number
  @state(Field) number = State<Field>();
  // Store the timestamp
  @state(Field) timestamp = State<Field>();
  // Store the owner
  @state(PublicKey) owner = State<PublicKey>();
  @state(Field) pnl = 22;

  init() {
    super.init();
    this.number.set(Field(0));
    this.timestamp.set(Field(0));
    this.owner.set(PublicKey.empty());
  }

  @method async generateProof(owner: PublicKey, x: Field, yyyymmdd: Field, signature: Signature) {
    // Verify the owner of the proof
    signature.verify(owner, [x, yyyymmdd]).assertTrue();

    // Check that x is exactly 50
    x.assertEquals(Field(50));

    // Store the number and timestamp
    this.number.set(x);
    this.timestamp.set(yyyymmdd);
    this.owner.set(owner);
  }

  @method async verifyProof(x: Field, yyyymmdd: Field) {
    // Ensure stored values match the requested proof
    this.number.requireEquals(x);
    this.timestamp.requireEquals(yyyymmdd);
  }
}
