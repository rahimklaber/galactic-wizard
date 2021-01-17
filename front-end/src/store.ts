import {writable} from "svelte/store"
import createToken from "./CreateToken.svelte"
import albedo from "@albedo-link/intent"
let albedoAddress =""
export const store = writable(
    createToken
)

export async function publicKey(): Promise<string>{
    if(albedoAddress.length > 10){
        return albedoAddress
    }
    else {
        albedoAddress = (await albedo.publicKey()).pubkey
        return albedoAddress
    }

}