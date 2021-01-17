import Ipfsclient from "ipfs-http-client"
export const client = Ipfsclient({
     host: "ipfs.infura.io", port:5001, protocol:"https"
})
export let gatewayUrl = "https://ipfs.io/ipfs/"

export function getHashUrl(hash:string){
     return `${gatewayUrl}${hash}`
}