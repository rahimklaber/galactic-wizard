<script lang="ts">
import {Modal,Button,TimePickerSelect,SelectItem, Checkbox, ComboBox, DatePicker, DatePickerInput, FileUploaderButton, FileUploaderDropContainer, Form,StructuredList,StructuredListBody,StructuredListCell,StructuredListHead,StructuredListRow,TextArea,TextInput, TextInputSkeleton, Tile, TimePicker} from "carbon-components-svelte"
import Add16 from "carbon-icons-svelte/lib/Add16"
import Subtract16 from "carbon-icons-svelte/lib/Subtract16"
import {Asset, Keypair, Networks, TimeoutInfinite, Transaction, TransactionBuilder} from "stellar-sdk"
import albedo from "@albedo-link/intent"
import { evaluate,BigFloat } from "bigfloat.js";
import {client} from "./ipfs"
window.xd = client
import {addLockAccountToTxBuilder,addClaimableBalanceToTxBuilder,server,addEntriesToTxBuilder,addCreateAccountToTxBuilder,addCreateTokenToTxBuilder,addSellOrderToTxBuilder, usdAsset} from "./stellar"
let entryCount = 0

function addRow(){
    entryCount = entryCount + 1
}
function removeRow(){
    if(entryCount > 0){
        entryCount = entryCount - 1
    }
}
let modalOpen=false
let tokenType = ""
let distributionTypeNft =""
let distributionTypeNormal =""
let lockAccount = false
let exportKeys = false
function createNft(){}
async function handleSubmit(event: Event){
    window.yeet = event

    let issueKeypair = Keypair.random()
    let distributionKeypair = Keypair.random()
    let albedoAddress = (await albedo.publicKey()).pubkey
    console.log(albedoAddress)
    let account = await server.loadAccount(albedoAddress)
    let txBuilder = new TransactionBuilder(account,
    {
        fee : "500",
        networkPassphrase: Networks.TESTNET
    })
    let entries : Array<[string,string]> = []
    if(event.target["imageUpload"].files.length > 0){
        let image : File = event.target["imageUpload"].files[0]
       let ipfsHash = (await client.add(image.stream())).path
       entries.push(["image",ipfsHash])
    }
    if(event.target["dataUpload"].files.length > 0){
        let files = event.target["dataUpload"].files
        for(let i = 0 ; i < files.length ; i++){
            let file : File = files[i]
            let ipfsHash = (await client.add(file.stream())).path
            entries.push([file.name,ipfsHash])
        }
    }
    if(entryCount > 0){
        for(let i = 0; i < entryCount;i++){
            let currKey = event.target[`key-${i}`].value
            let currValue = event.target[`value-${i}`].value
            entries.push([currKey,currValue])
        }
    }

    addCreateAccountToTxBuilder(txBuilder,issueKeypair.publicKey(),albedoAddress)
    addCreateAccountToTxBuilder(txBuilder,distributionKeypair.publicKey(),albedoAddress)
    addEntriesToTxBuilder(txBuilder,entries,issueKeypair.publicKey(),albedoAddress)


    let tokenName = event.target["tokenName"].value
    let tokenDescription = event.target["tokenDescription"].value
    let asset = new Asset(tokenName,issueKeypair.publicKey())
    if(tokenType=="NFT"){

        addCreateTokenToTxBuilder(txBuilder,issueKeypair.publicKey(),distributionKeypair.publicKey(),asset,"0.0000001",albedoAddress)
        

        if(distributionTypeNft=="Auction"){
            let endDate = new Date(event.target["auctionEndDate"].value)
            let endTime = event.target["auctionEndTime"].value
            endDate.setHours(Number(endTime.split(":")[0]),Number(endTime.split(":")[1]))
            let price = event.target["auctionPriceNft"].value
            //Todo: send request ot server for auction
        }else if (distributionTypeNft == "Sale"){
            let price = new BigFloat(event.target["salePriceNft"].value).times("10000000").toString()
            addSellOrderToTxBuilder(txBuilder,asset,usdAsset,"0.0000001",price,albedoAddress,distributionKeypair.publicKey())
        }else if (distributionTypeNft == "reserve for Adress (claimable)"){
            let destAddress = event.target["destinationAddressNft"].value
            addClaimableBalanceToTxBuilder(txBuilder,asset,"0.0000001",destAddress,distributionKeypair.publicKey(),albedoAddress)
        }
    }else if(tokenType == "Normal tokens"){
        console.log("hi")
        let amountRaw = event.target["amount"].value
        let amount = (new BigFloat("0.0000001")).times(amountRaw).toString()
        console.log(amount)
        addCreateTokenToTxBuilder(txBuilder,issueKeypair.publicKey(),distributionKeypair.publicKey(),asset,amount,albedoAddress)
        if(distributionTypeNormal == "Sale"){
            let price = new BigFloat(event.target["salePriceNormal"].value).times("10000000").toString()
            addSellOrderToTxBuilder(txBuilder,asset,usdAsset,amount,price,albedoAddress,distributionKeypair.publicKey())
        }else if (distributionTypeNormal=="reserve for Adress (claimable)"){
            let destAddress = event.target["destinationAddressNormal"].value
            addClaimableBalanceToTxBuilder(txBuilder,asset,amount,destAddress,distributionKeypair.publicKey(),albedoAddress)
        }
    }
    if(lockAccount){
        addLockAccountToTxBuilder(txBuilder,issueKeypair.publicKey())
    }
    let tx = txBuilder.setTimeout(TimeoutInfinite).build()
    tx.sign(issueKeypair)
    tx.sign(distributionKeypair) // dont do if auction
    let signedAlbedoXdr = (await albedo.tx({
        xdr: tx.toXDR(),
        network : 'testnet'
    })).signed_envelope_xdr
    console.log(signedAlbedoXdr)

    await server.submitTransaction(TransactionBuilder.fromXDR(signedAlbedoXdr,Networks.TESTNET))
    console.log("gottem")
    if(exportKeys){
        alert(`issue secret key: ${issueKeypair.publicKey()}\n distribution secret key: ${distributionKeypair.publicKey()}`)
    }
}
</script>

<style>
    .galacticForm{
        width: 25%;
        max-width: 400px;
        min-width: 300px;
    }
    .margin10{
        margin-top: 10px;
    }
</style>

<div class="galacticForm">

<Form on:submit ={handleSubmit}>

    <TextInput labelText="Token Name"  id="tokenName" />
    <TextArea labelText="Token Description"  id="tokenDescription" />

    <ComboBox
    bind:value={tokenType}
    titleText = "Select token type"
    items = {[{id: "0",text: "NFT"},{id: "1",text: "Normal tokens"}]}
    />
    {#if tokenType=="NFT"}
        <div>
            <ComboBox
            bind:value={distributionTypeNft}
            titleText="Select distribution method"
            items="{[{id: "0",text: "Auction"},{id: "1",text: "Sale"},{id: "2",text: "reserve for Adress (claimable)"}]}"
            />
            {#if distributionTypeNft=="Auction"}
                <DatePicker datePickerType="single">
                    <DatePickerInput id="auctionEndDate" placeholder="dd/mm/yyyy" labelText="Auction end date"/>
                </DatePicker>
                <TimePicker pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" id="auctionEndTime" placeholder="hh:mm" labelText="End time in your local time)">

                </TimePicker>
                <TextInput id="auctionPriceNft" labelText="Initial price (USD)"/>

            {/if}
            {#if distributionTypeNft=="reserve for Adress (claimable)"}
                <TextInput id="destinationAddressNft" labelText="Destination Address"/>
            {/if}
            {#if distributionTypeNft=="Sale"}
            <TextInput id="salePriceNft" labelText="price (USD)"/>
            {/if}
        </div>
    {/if}
    {#if tokenType =="Normal tokens"}
        <div>
            <ComboBox
            bind:value={distributionTypeNormal}
            titleText="Select distribution method"
            items="{[{id: "0",text: "Sale"},{id: "1",text: "reserve for Adress (claimable)"}]}"
            />
            {#if distributionTypeNormal=="reserve for Adress (claimable)"}
            <TextInput id="destinationAddressNormal" labelText="Destination Address"/>
        {/if}
        {#if distributionTypeNormal=="Sale"}
        <TextInput id="salePriceNormal" labelText="price (USD)"/>
        {/if}
        <TextInput id="amount" labelText="Amount of tokens to create"/>
        </div>
    {/if}

    <label class= "bx--label margin10">Store data on stellar</label>
    {#if entryCount > 0}
    <div>
        <StructuredList>
            <StructuredListHead>
                <StructuredListRow head>
                    <StructuredListCell>Key</StructuredListCell>
                    <StructuredListCell>Value</StructuredListCell>
                </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
            {#each Array(entryCount) as _, i}
               <StructuredListRow>
                   <StructuredListCell>
                       <TextInput placeholder="key" id="key-{i}"></TextInput>
                   </StructuredListCell>
                   <StructuredListCell>
                    <TextInput placeholder="value" id="value-{i}"></TextInput>
                </StructuredListCell>
               </StructuredListRow>
            {/each}
            </StructuredListBody>
        </StructuredList>
    </div>
    {/if}
<div class="margin10">
    <Button
    hasIconOnly
    iconDescription="Add a new entry"
    tooltipPosition="bottom"
    tooltipAlignment="start"
    icon={Add16}
    on:click={addRow}
    />
    <Button
    hasIconOnly
    iconDescription="Remove last entry"
    tooltipPosition="bottom"
    tooltipAlignment="start"
    icon={Subtract16}
    on:click={removeRow}
    />
</div>

    <div class="margin10">
    <FileUploaderDropContainer multiple id="dataUpload" labelText="Upload all data files you wish to associate with this token. The file name has a max allowed length of 64" />
</div>
    <FileUploaderButton kind ="secondary" id="imageUpload" labelText="Upload Image" />
    <div class="margin10">
        <Checkbox 
        bind:checked={exportKeys}
        labelText="Export keys"
        id="exportKeys"
        />
    </div>
    <div class="margin10">
        <Checkbox 
        bind:checked={lockAccount}
        labelText="Lock issuing account"
        id="lockAccount"
        />
    </div>
    <div class="margin10">
    <Button type="submit">
        Create Token
    </Button>
</div>
</Form>
</div>
