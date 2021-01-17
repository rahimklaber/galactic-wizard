<script lang="ts">
    import {Link ,ExpandableTile ,Modal,Button,TimePickerSelect,SelectItem, Checkbox, ComboBox, DatePicker, DatePickerInput, FileUploaderButton, FileUploaderDropContainer, Form,StructuredList,StructuredListBody,StructuredListCell,StructuredListHead,StructuredListRow,TextArea,TextInput, TextInputSkeleton, Tile, TimePicker} from "carbon-components-svelte"
    import {publicKey} from "./store"
    import {server} from "./stellar"
    import {getHashUrl} from "./ipfs"
import { AccountResponse, Asset } from "stellar-sdk"
import { div } from "bigfloat.js"
    export let name : string 
    export let description : string
    export let issueAddress : string
    let issueAccount : AccountResponse
    let data : Record<string,string>
    let imgUrl : string
    let creator : string
    let type : string
    async function create(){
        issueAccount = await server.loadAccount(issueAddress)
        data = issueAccount.data_attr
        console.log(data)
        if(data["image"]==undefined){
            imgUrl = "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
        }
        else if(data["image"].length > 10){
            imgUrl = getHashUrl(atob(data["image"]))
            console.log("yeet")
            console.log(imgUrl)
        }
        creator = issueAccount.sponsor
        let asset = new Asset(name,issueAccount.accountId())
        let result = await server.assets().forCode(asset.code).forIssuer(asset.issuer).call()
        if(result.records[0].amount=="0.0000001"){
            type = "NFT"
        }else{
            type = "Normal Token"
        }
    }

    
</script>
<style>
    .outer{
        margin-top: 20px;
    }

    .flex{
        display: flex;
    }
    .left {
        float: left;
    }
    .right {
        margin-left: 33px;
        float: right;
    }
    .bot{
        overflow-wrap: break-word;
    }
</style>

{#await create()}
    
{:then voidres} 
<div class="outer">
<ExpandableTile>
    <div slot="above" class="flex">
        <div class="left">
            <img height=100 src={imgUrl}>
        </div>
        <div class="right">
            <strong>name</strong> : {name}
            <strong>type</strong> : {type}
        </div>
    </div>
    <div slot="below" class="bot">
        <div>
            <strong>name</strong> : {name}
            <br>
            <strong>type</strong> : {type}
            <br>
            <strong>issueAddress</strong>: {issueAddress}
            <br>
            <strong>creator</strong> : {creator}
            <br>
            <br>
            <strong><h4>Description</h4></strong>
            <br>
            {description}
            <br>
            <br>
            <h5>data of token</h5>
            <br>
            <StructuredList>
                <StructuredListHead>
                    <StructuredListRow head>
                        <StructuredListCell>Key</StructuredListCell>
                        <StructuredListCell>Value</StructuredListCell>
                    </StructuredListRow>
                </StructuredListHead>
                <StructuredListBody>
                {#each Object.entries(data) as [key,value]}
                   <StructuredListRow>
                       <StructuredListCell>
                           {key}
                       </StructuredListCell>
                       <StructuredListCell>
                           {#if atob(value).startsWith("Qm")}
                               <Link href={getHashUrl(atob(value))}> Ipfs File</Link>
                           {:else}
                           {atob(value)}
                           {/if}
                    </StructuredListCell>
                   </StructuredListRow>
                {/each}
                </StructuredListBody>
            </StructuredList>
        </div>
    </div>
</ExpandableTile>
</div>
{/await}

