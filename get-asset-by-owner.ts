import "dotenv/config";
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { clusterApiUrl } from "@solana/web3.js";

import {
    getKeypairFromFile,
    getKeypairFromEnvironment,
  } from "@solana-developers/helpers";

const umi = createUmi(clusterApiUrl("devnet")).use(dasApi());
//const localKeypair = await getKeypairFromFile();
const user = getKeypairFromEnvironment("SECRET_KEY");
const owner = publicKey(user.publicKey);

// const assets = await umi.rpc.getAssetsByOwner({
//     owner,
//     limit: 10
// });
const publicAddress = publicKey("D22UCf6mu8BCgBCbRbsEEYgSxMEbvSKw3vcdDWvcJ72Z");
const assets = await umi.rpc.getAsset(publicAddress);

console.log(assets);