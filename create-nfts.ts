// See https://developers.metaplex.com/token-metadata
// and https://developers.metaplex.com/token-metadata/collections#associating-nfts-to-collection-nfts
import "dotenv/config";
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
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
  publicKey,
} from "@metaplex-foundation/umi";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

// create a new connection to the cluster's API
const connection = new Connection(clusterApiUrl("devnet"));

//const user = await getKeypairFromFile();
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log("Loaded user:", user.publicKey.toBase58());

// Create Umi Instance, using the same endpoint as our connection,
// and using our user to sign transactions
const umi = createUmi(connection.rpcEndpoint).use(mplTokenMetadata());
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiKeypair));

// We could do
//   const collectionAddress = new PublicKey();
// to make a web.js PublicKey, and then use
//   publicKey(collectionAddress)
// to convert it to a Umi PublicKey
// but we can also just make the a Umi publicKey directly
// using the Umi publicKey() function
const collectionAddress = publicKey("7PSysGf1inPeDNbgejnMjrK1VsHCgk2fYQJyuHKXtRSJ");

// Generate an NFT
console.log(`Creating NFT...`);
const mint = generateSigner(umi);
const transaction = await createNft(umi, {
  mint,
  name: "My Pup NFT #3",
  // See https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard
  uri: "https://raw.githubusercontent.com/logikburg/nftdata/refs/heads/main/nft-offchain-data.json",
  sellerFeeBasisPoints: percentAmount(6),
  collection: {
    // See https://developers.metaplex.com/umi/public-keys-and-signers
    key: collectionAddress,
    verified: false,
  },
});

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, mint.publicKey, { commitment: "confirmed" });

console.log(
  `✨🖼️ Created NFT! Address is: ${getExplorerLink(
    "address",
    createdNft.mint.publicKey,
    "devnet"
  )}`
);

//✨🖼️ Created NFT! Address is: https://explorer.solana.com/address/9czAAtQoXnHA9mcn14QEMNEtT4dSsiwwpK4eNWX9XQNG?cluster=devnet
//✨🖼️ Created NFT! Address is: https://explorer.solana.com/address/A7EGkuUr9p5o51jZL2z9TGWWPcn9XuUHBdgj3Vvimc9N?cluster=devnet
//✨🖼️ Created NFT! Address is: https://explorer.solana.com/address/C5eeGdJdoFSp5iXFtv3DitiUJ8WiRftRvbfkuK33RQYZ?cluster=devnet

console.log("✅ Finished successfully!");