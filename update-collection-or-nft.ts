import "dotenv/config";
import {
  fetchDigitalAsset,
  fetchMetadataFromSeeds,
  mplTokenMetadata,
  updateV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromEnvironment,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

// The NFT Asset Mint ID
const mintId = publicKey("EM6kudaYgpLbdPRqqW5z3WA92LuYXq24qBYjWvsz2WcX");

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

// Our NFT we made earlier
const nftAddress = publicKey("EM6kudaYgpLbdPRqqW5z3WA92LuYXq24qBYjWvsz2WcX");

// Update the NFT metadata
const initialMetadata = await fetchMetadataFromSeeds(umi, {
  mint: nftAddress,
});
const transaction = await updateV1(umi, {
  mint: nftAddress,
  authority: umi.identity,
  newUpdateAuthority: umiKeypair.publicKey,
  data: {
    ...initialMetadata,
    uri: "https://raw.githubusercontent.com/logikburg/nftdata/refs/heads/main/nft-collection-offchain-data.json",
    name: "Updated Pup Collection",
    symbol: "Pup",
  },
});

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, nftAddress);

console.log(
  `🆕 NFT updated with new metadata: ${getExplorerLink(
    "address",
    createdNft.mint.publicKey,
    "devnet"
  )}`
);

console.log("✅ Finished successfully!");