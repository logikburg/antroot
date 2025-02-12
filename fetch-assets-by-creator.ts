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

const assets = await umi.rpc.getAssetsByOwner({owner: publicKey("2SNBdEXUv3uuHyxgUtmbwFci2oWc4SxfUfmKkMVtTECh")})

console.log(assets.items.filter((e) => {
    let creator:boolean = false;
    e.creators.forEach((c) => {
        if(c.address === "4iFaA43w9bJjMfS4Cenh7mfDn8uwDBtLaPem2V9gJdmH"){
            creator = true;
        }
        else
            creator = false;;
    })
    return creator;
}));