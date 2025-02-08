// See https://developers.metaplex.com/token-metadata/collections
import "dotenv/config";
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";
import {
  fromWeb3JsTransaction,
  toWeb3JsInstruction,
  toWeb3JsTransaction,
} from "@metaplex-foundation/umi-web3js-adapters";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  signTransaction,
} from "@metaplex-foundation/umi";

import {
  Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey, TransactionMessage,
  VersionedTransaction,
}
  from "@solana/web3.js";

// create a new connection to the cluster's API
const connection = new Connection(clusterApiUrl("devnet"));

// initialize a keypair for the user
//const user = await getKeypairFromFile();
const user = getKeypairFromEnvironment("SECRET_KEY");

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.1 * LAMPORTS_PER_SOL
);

console.log("Loaded user:", user.publicKey.toBase58());

// Create Umi Instance, using the same endpoint as our connection,
// and using our user to sign transactions
const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());
const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log(`Creating collection...`);
// This mint is like a factory for creating NFTs
// Except it only makes one NFT, and it's a collection!
const collectionMint = generateSigner(umi);

const transaction = await createNft(umi, {
  mint: collectionMint,
  name: "Pup Collection 1",
  symbol: "PUP",
  // https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard
  uri: "https://raw.githubusercontent.com/logikburg/nftdata/refs/heads/main/nft-collection-offchain-data.json",
  sellerFeeBasisPoints: percentAmount(6),
  isCollection: true,
}).getInstructions()[0];

// revoke freeze auth
// let freezeAuthIx = createSetAuthorityInstruction(
//   new PublicKey(collectionMint.publicKey),
//   new PublicKey(umi.identity.publicKey),
//   AuthorityType.FreezeAccount,
//   user.publicKey
// );

// revoke mint auth
// let mintAuthIx = createSetAuthorityInstruction(
//   new PublicKey(collectionMint.publicKey),
//   new PublicKey(umi.identity.publicKey),
//   AuthorityType.MintTokens,
//   user.publicKey
// );

// construct versioned tx msg
const messageV0 = new TransactionMessage({
  payerKey: new PublicKey(umi.identity.publicKey),
  recentBlockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
  instructions: [
    toWeb3JsInstruction(transaction), // convert from umi ix
    // freezeAuthIx,
    // mintAuthIx,
  ],
}).compileToV0Message();

const tx = new VersionedTransaction(messageV0);

// sign with mint and auth
let signedTx = await signTransaction(fromWeb3JsTransaction(tx), [
  collectionMint,
  umi.identity,
]);

// //convert to web3 js TX
const web3JSTx = toWeb3JsTransaction(signedTx);

let sig = await connection.sendTransaction(web3JSTx);
console.log(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);

const createdCollectionNft = await fetchDigitalAsset(
    umi,
    collectionMint.publicKey
  );
  
  console.log(
    `Created collection 📦! Address is: ${getExplorerLink(
      "address",
      createdCollectionNft.mint.publicKey,
      "devnet"
    )}`
  );

console.log("✅ Finished successfully!");