import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Messengerapp } from '../target/types/messengerapp';
import { assert } from 'chai';

describe('messengerapp', () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Messengerapp as Program<Messengerapp>;

  let _baseAccount;

  it("An account is initialized", async () => {
    const baseAccount  = anchor.web3.Keypair.generate();

    await program.rpc.initialize("My first message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [baseAccount]
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.data === "My first message");
    _baseAccount = baseAccount;
  });

  it("Update the account previously created: ", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.update("My second message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.data === "My second message");
    assert.ok(account.dataList.length === 2);
  });
});
