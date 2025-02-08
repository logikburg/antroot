// See https://developers.metaplex.com/token-metadata/collections
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
  } from "@metaplex-foundation/umi";
  import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
  
  // create a new connection to the cluster's API
  const connection = new Connection(clusterApiUrl("devnet"));
  
  // initialize a keypair for the user
  //const user = await getKeypairFromFile();
  const user = getKeypairFromEnvironment("SECRET_KEY");
  
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
    updateAuthority: umiUser.publicKey,
    name: "Pup Collection 1",
    symbol: "PUP",
    // https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard
    uri: "https://raw.githubusercontent.com/logikburg/nftdata/refs/heads/main/nft-collection-offchain-data.json",
    sellerFeeBasisPoints: percentAmount(6),
    isCollection: true,
  });
  
  await transaction.sendAndConfirm(umi);
  
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

  //Created collection 📦! Address is: https://explorer.solana.com/address/7PSysGf1inPeDNbgejnMjrK1VsHCgk2fYQJyuHKXtRSJ?cluster=devnet
  
  console.log("✅ Finished successfully!");