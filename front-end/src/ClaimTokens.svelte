<script lang="ts">
    import Axios from "axios";
    
    import {Modal,Button,TimePickerSelect,SelectItem, Checkbox, ComboBox, DatePicker, DatePickerInput, FileUploaderButton, FileUploaderDropContainer, Form,StructuredList,StructuredListBody,StructuredListCell,StructuredListHead,StructuredListRow,TextArea,TextInput, TextInputSkeleton, Tile, TimePicker} from "carbon-components-svelte"
    import Token from "./Token.svelte"
    import {serverUrl} from "./backend"
    import {publicKey} from "./store"
    import {server} from "./stellar"
    import {Asset} from "stellar-sdk"
    async function create() {
        let tokens = (await Axios.get(`${serverUrl}/tokens/${await publicKey()}`)).data
        return tokens
    }
    async function checkClaim(asset : Asset): Promise<boolean>{
        let claimable = await server.claimableBalances().asset(asset).claimant(await publicKey()).call()
        return claimable.records.length > 0
    }
    let count = 0
    function updateCount(){
        count = count + 1
    }
    </script>
    
    <style>
        .tokens{
            width: 33vw;
            max-width: 600px;
            margin-top: 60px;
        }
    </style>
    
    <div >
        <h1>Claim Tokens</h1>
        <div class="tokens">
    {#await create()}
        
    {:then tokens} 
        {#each tokens as token}
        {#await checkClaim(new Asset(token["name"],token["issueAccount"]))}
            
        {:then result} 
            {#if result}
            {#if updateCount()}
            {/if}
            <Token
            name={token["name"]}
            description={token["description"]}
            issueAddress={token["issueAccount"]}
            claim={true}
        /> 
            {/if}
        {/await}

        {/each}
        {#if count == 0 }
            <h4>No tokens to claim</h4>
        {/if}
    {/await}
    </div>
    </div>