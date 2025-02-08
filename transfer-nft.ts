import "dotenv/config";
import {
    fetchDigitalAssetWithAssociatedToken,
    findTokenRecordPda,
    TokenStandard,
    transferV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey, keypairIdentity, generateSigner, } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import {
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

// The NFT Asset Mint ID
const mintId = publicKey("8pgtyLWYWc4Kmzy7NyoTPAmBQp4VMrQ45TgwUh9ddJhq");

// create a new connection to the cluster's API
const connection = new Connection(clusterApiUrl("devnet"));

//const user = await getKeypairFromFile();
const user = getKeypairFromEnvironment("SECRET_KEY");

// Create Umi Instance, using the same endpoint as our connection,
// and using our user to sign transactions
const umi = createUmi(connection.rpcEndpoint).use(mplTokenMetadata());
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiKeypair));

// Fetch the pNFT Asset with the Token Account
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
    umi,
    mintId,
    umi.identity.publicKey
);

// The destination wallet
const destinationAddress = publicKey("2SNBdEXUv3uuHyxgUtmbwFci2oWc4SxfUfmKkMVtTECh");

// Calculates the destination wallet's Token Account
const destinationTokenAccount = findAssociatedTokenPda(umi, {
    mint: mintId,
    owner: destinationAddress,
});

// Calculates the destinations wallet's Token Record Account
const destinationTokenRecord = findTokenRecordPda(umi, {
    mint: mintId,
    token: destinationTokenAccount[0],
});

// Transfer the pNFT
const { signature } = await transferV1(umi, {
    mint: mintId,
    destinationOwner: destinationAddress,
    destinationTokenRecord: destinationTokenRecord,
    tokenRecord: assetWithToken.tokenRecord?.publicKey,
    tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);

console.log("Signature: ", base58.deserialize(signature));