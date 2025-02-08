import "dotenv/config";
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { clusterApiUrl } from "@solana/web3.js";

import {
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";

const umi = createUmi(clusterApiUrl("devnet")).use(dasApi());
const user = getKeypairFromEnvironment("SECRET_KEY");
const owner = publicKey(user.publicKey);

//const assets = await umi.rpc.getAssets([owner, publicKey("D22UCf6mu8BCgBCbRbsEEYgSxMEbvSKw3vcdDWvcJ72Z")]);

const assetss = await umi.rpc.getAssetsByOwner({owner: publicKey("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF")})

console.log(assetss);