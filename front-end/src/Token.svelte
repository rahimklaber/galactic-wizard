<script lang="ts">
    import {Link ,ExpandableTile ,Modal,Button,TimePickerSelect,SelectItem, Checkbox, ComboBox, DatePicker, DatePickerInput, FileUploaderButton, FileUploaderDropContainer, Form,StructuredList,StructuredListBody,StructuredListCell,StructuredListHead,StructuredListRow,TextArea,TextInput, TextInputSkeleton, Tile, TimePicker} from "carbon-components-svelte"
    import {publicKey} from "./store"
    import {server,usdAsset} from "./stellar"
    import {getHashUrl} from "./ipfs"
    import albedo from "@albedo-link/intent"
    import { Operation,AccountResponse, Asset, Networks, TransactionBuilder } from "stellar-sdk"
    import { BigFloat, div, set_precision } from "bigfloat.js"
    export let name : string 
    export let description : string
    export let issueAddress : string
    export let claim = false
    export let sale = false
    export let auction = false
    let amount : string
    let issueAccount : AccountResponse
    let data : Record<string,string>
    let imgUrl : string
    let creator : string
    let type : string
    let albedoAccound : AccountResponse
    let claimId : string
    let buttonText = "Claim"
    let viewType = "default"
    let salePrice : string
    let amoutnAvailable : string
    let amountTobuy : string
    set_precision(-7)
    async function create(){
        let asset = new Asset(name,issueAddress)
        if(claim){
            let claimable = await server.claimableBalances().asset(asset).claimant(await publicKey()).call()
            if(claimable.records.length > 0){
                viewType = "claim"
                claimId =  claimable.records[0].id
            }else{
                claim = false
            }

    }
        if(sale){
            let order = await server.orderbook(asset,usdAsset).call()
            salePrice = (new BigFloat(order.asks[0].price)).div(10000000).toString()
            amoutnAvailable = (new BigFloat(order.asks[0].amount)).times(10000000).toString()
            viewType = "sale"
        }
        albedoAccound = await server.loadAccount(await publicKey())
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

        let result = await server.assets().forCode(asset.code).forIssuer(asset.issuer).call()
        amount = (new BigFloat(result.records[0].amount)).times(10000000).toString()
        console.log(amount)
        if(result.records[0].amount=="0.0000001"){
            type = "NFT"
        }else{
            type = "Normal Token"
        }
    }
    let expanded = false
    async function claimAsset(){
        let asset = new Asset(name,issueAddress)

        expanded = !expanded
        let tx = new TransactionBuilder(albedoAccound,{
            fee: "500",
            networkPassphrase : Networks.TESTNET
        }).addOperation(
            Operation.changeTrust({
                asset:asset
            })
        )
        .addOperation(
            Operation.claimClaimableBalance({
                balanceId : claimId
            })
        ).setTimeout(50).build()

        let signedAlbedoXdr = (await albedo.tx({
        xdr: tx.toXDR(),
        network : 'testnet'
            })).signed_envelope_xdr
        await server.submitTransaction(TransactionBuilder.fromXDR(signedAlbedoXdr,Networks.TESTNET)).then((res)=>viewType = "claimed").catch((reason)=>alert("something went wrong"))

    }
    async function buyAsset(){
        let asset = new Asset(name,issueAddress)
        console.log((new BigFloat(amountTobuy)).dividedBy(10000000).toString())
        expanded = !expanded
        let tx = new TransactionBuilder(albedoAccound,{
            fee: "500",
            networkPassphrase : Networks.TESTNET
        }).addOperation(
            Operation.changeTrust({
                asset:asset
            })
        )
        .addOperation(
            Operation.pathPaymentStrictReceive({
                sendAsset: Asset.native(),
                destination : albedoAccound.accountId(),
                destAsset : asset,
                destAmount : (new BigFloat(amountTobuy)).dividedBy(10000000).toString(),
                sendMax : "5000",
                path : [usdAsset]
            })
        ).setTimeout(50).build()

        let signedAlbedoXdr = (await albedo.tx({
        xdr: tx.toXDR(),
        network : 'testnet'
            })).signed_envelope_xdr
        console.log(signedAlbedoXdr)
        await server.submitTransaction(TransactionBuilder.fromXDR(signedAlbedoXdr,Networks.TESTNET)).then((res)=>alert("you bought tokens")).catch((reason)=>{alert("something went wrong");console.log(reason)})
        let order = await server.orderbook(asset,usdAsset).call()
        try{
            salePrice = (new BigFloat(order.asks[0].price)).dividedBy(10000000).toString()
            amoutnAvailable = (new BigFloat(order.asks[0].amount)).times(10000000).toString()
        }catch(e){
            salePrice = "unavailable"
            amoutnAvailable ="0"
            viewType="sold"
        }

    }

    function onclickText(){
        expanded = !expanded
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
<ExpandableTile bind:expanded>
    <div slot="above" class="flex">
        <div class="left">
            <img height=100 src={imgUrl}>
        </div>
        <div class="right">
            <strong>Name</strong> : {name}
            <br>
            <strong>Type</strong> : {type}
            <br>
            {#if viewType=="sale"}
            <strong>Amount available</strong> : {amoutnAvailable}
            <br>
            <strong>Sale price</strong> : {salePrice}
            <br>
            {/if}
            <strong>Supply</strong> : {amount}
            <br>
        </div>
        <div class="right">
            {#if viewType=="default"}
                
            {:else if viewType =="claim"}
            <Button kind="primary" on:click={claimAsset}>Claim</Button>

            {:else if viewType =="claimed"}

            <Button kind="danger">Claimed</Button>

            {:else if viewType =="sale"}

            <Button on:click={buyAsset} kind="primary">Buy</Button>
            <TextInput on:click={onclickText} size="sm" placeholder ="amount to buy" bind:value={amountTobuy}/>
            {:else if viewType =="sold"}

            <Button kind="danger">Sold out</Button>

            {/if}
        </div>
    </div>
    <div slot="below" class="bot">
        <div>
            <strong>Name</strong> : {name}
            <br>
            <strong>Type</strong> : {type}
            <br>
            <strong>Supply</strong> : {amount}
            <br>
            <strong>IssueAddress</strong>: {issueAddress}
            <br>
            <strong>Creator</strong> : {creator}
            <br>
            <br>
            <strong><h4>Description</h4></strong>
            <br>
            {description}
            <br>
            <br>
            <h5>Data of token</h5>
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
                               <Link href={getHashUrl(atob(value))}>Go to Ipfs File</Link>
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

