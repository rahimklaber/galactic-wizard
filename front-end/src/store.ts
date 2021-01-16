import {writable} from "svelte/store"
import createToken from "./CreateToken.svelte"

export const store = writable(
    createToken
)