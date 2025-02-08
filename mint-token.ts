import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"));
 
// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
 
const user = getKeypairFromEnvironment("SECRET_KEY");
 
// Substitute in your token mint account from create-token-mint.ts
const tokenMintAccount = new PublicKey("D22UCf6mu8BCgBCbRbsEEYgSxMEbvSKw3vcdDWvcJ72Z");
 
// Substitute in your own, or a friend's token account address, based on the previous step.
const recipientAssociatedTokenAccount = new PublicKey(
  "4vq9USZSCEGjrjMr8nbqMLw9qzB4ShVFahJUYqvL7aY",
);
 
const transactionSignature = await mintTo(
  connection,
  user,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  user,
  10 * MINOR_UNITS_PER_MAJOR_UNITS,
);
 
const link = getExplorerLink("transaction", transactionSignature, "devnet");
 
console.log(`✅ Success! Mint Token Transaction: ${link}`);