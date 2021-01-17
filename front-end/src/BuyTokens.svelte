<script lang="ts">
    import Axios from "axios";
    
    import {Modal,Button,TimePickerSelect,SelectItem, Checkbox, ComboBox, DatePicker, DatePickerInput, FileUploaderButton, FileUploaderDropContainer, Form,StructuredList,StructuredListBody,StructuredListCell,StructuredListHead,StructuredListRow,TextArea,TextInput, TextInputSkeleton, Tile, TimePicker} from "carbon-components-svelte"
    import Token from "./Token.svelte"
    import {serverUrl} from "./backend"
    import {publicKey} from "./store"
    import {server,usdAsset} from "./stellar"
    import {Asset} from "stellar-sdk"
    async function create() {
        let tokens = (await Axios.get(`${serverUrl}/forsale`)).data
        return tokens
    }
    async function checkSale(asset : Asset): Promise<boolean>{
        let order = await server.orderbook(asset,usdAsset).call()
        console.log(`;en oirder ${order.asks.length}`)
        if (order.asks.length == 1){
            return true
        }else{
            return false
        }
    }
    let count = 0
    function updateCount(){
        count = count + 1
    }
    </script>
    
    <style>
        .tokens{
            width: 40vw;
            max-width: 600px;
            margin-top: 60px;
        }
    </style>
    
    <div >
        <h1>Buy Tokens</h1>
        <div class="tokens">
    {#await create()}
        
    {:then tokens} 
        {#each tokens as token}
        {#await checkSale(new Asset(token["name"],token["issueAccount"]))}
            
        {:then result} 
            {#if result}
            {#if updateCount()}
            {/if}
            <Token
            name={token["name"]}
            description={token["description"]}
            issueAddress={token["issueAccount"]}
            sale={true}
        /> 
            {/if}
        {/await}

        {/each}
        {#if count == 0 }
            <h4>No tokens to buy</h4>
        {/if}
    {/await}
    </div>
    </div>