// See https://developers.metaplex.com/token-metadata
// and https://developers.metaplex.com/token-metadata/collections#associating-nfts-to-collection-nfts
import "dotenv/config";
import {
    mplTokenMetadata,
    verifyCollectionV1,
    findMetadataPda,
  } from "@metaplex-foundation/mpl-token-metadata";
  import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
    getKeypairFromEnvironment,
  } from "@solana-developers/helpers";
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
  import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
  
  // create a new connection to the cluster's API
  const connection = new Connection(clusterApiUrl("devnet"));
  
  //const user = await getKeypairFromFile();
  const user = getKeypairFromEnvironment("SECRET_KEY");
  
  // We could do
  //   const nftAddress = new PublicKey();
  // to make a web.js PublicKey, and then use
  //   publicKey(nftAddress)
  // to convert it to a Umi PublicKey
  // but we can also just make the a Umi publicKey directly
  // using the Umi publicKey() function
  const collectionAddress = publicKey("7PSysGf1inPeDNbgejnMjrK1VsHCgk2fYQJyuHKXtRSJ");
  
  const nftAddress = publicKey("C5eeGdJdoFSp5iXFtv3DitiUJ8WiRftRvbfkuK33RQYZ");
  
  console.log("Loaded user:", user.publicKey.toBase58());
  
  // Create Umi Instance, using the same endpoint as our connection,
  // and using our user to sign transactions
  const umi = createUmi(connection.rpcEndpoint).use(mplTokenMetadata());
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
  umi.use(keypairIdentity(umiKeypair));
  
  // See https://developers.metaplex.com/token-metadata/collections
  const transaction = await verifyCollectionV1(umi, {
    // The metadata PDA for the NFT we want to verify inside the collection.
    metadata: findMetadataPda(umi, { mint: nftAddress }),
    // The Collection NFT that is already set on the Metadata account of the NFT but not yet verified.
    collectionMint: collectionAddress,
    // The Update Authority of the Collection NFT as a signer, in this case the umiKeypair
    authority: umi.identity,
  });
  
  transaction.sendAndConfirm(umi);
  
  console.log(
    `✅ NFT ${nftAddress} verified as member of collection ${collectionAddress}! See Explorer at ${getExplorerLink(
      "address",
      nftAddress,
      "devnet"
    )}`
  );

// ✅ NFT 9czAAtQoXnHA9mcn14QEMNEtT4dSsiwwpK4eNWX9XQNG verified as member of collection 7PSysGf1inPeDNbgejnMjrK1VsHCgk2fYQJyuHKXtRSJ! See Explorer at https://explorer.solana.com/address/9czAAtQoXnHA9mcn14QEMNEtT4dSsiwwpK4eNWX9XQNG?cluster=devnet
// ✅ NFT 8pgtyLWYWc4Kmzy7NyoTPAmBQp4VMrQ45TgwUh9ddJhq verified as member of collection 7PSysGf1inPeDNbgejnMjrK1VsHCgk2fYQJyuHKXtRSJ! See Explorer at https://explorer.solana.com/address/8pgtyLWYWc4Kmzy7NyoTPAmBQp4VMrQ45TgwUh9ddJhq?cluster=devnet
// ✅ NFT A7EGkuUr9p5o51jZL2z9TGWWPcn9XuUHBdgj3Vvimc9N verified as member of collection 7PSysGf1inPeDNbgejnMjrK1VsHCgk2fYQJyuHKXtRSJ! See Explorer at https://explorer.solana.com/address/A7EGkuUr9p5o51jZL2z9TGWWPcn9XuUHBdgj3Vvimc9N?cluster=devnet
// ✅ NFT C5eeGdJdoFSp5iXFtv3DitiUJ8WiRftRvbfkuK33RQYZ verified as member of collection 7PSysGf1inPeDNbgejnMjrK1VsHCgk2fYQJyuHKXtRSJ! See Explorer at https://explorer.solana.com/address/C5eeGdJdoFSp5iXFtv3DitiUJ8WiRftRvbfkuK33RQYZ?cluster=devnet
  console.log("✅ Finished successfully!");