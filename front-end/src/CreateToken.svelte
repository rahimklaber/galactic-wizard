<script lang="ts">
import {Button,TimePickerSelect,SelectItem, Checkbox, ComboBox, DatePicker, DatePickerInput, FileUploaderButton, FileUploaderDropContainer, Form,StructuredList,StructuredListBody,StructuredListCell,StructuredListHead,StructuredListRow,TextArea,TextInput, TextInputSkeleton, Tile, TimePicker} from "carbon-components-svelte"
import Add16 from "carbon-icons-svelte/lib/Add16"
import Subtract16 from "carbon-icons-svelte/lib/Subtract16"
import {Keypair, Networks, TransactionBuilder} from "stellar-sdk"
import albedo from "@albedo-link/intent"
import {server,addEntriesToTxBuilder,addCreateAccountToTxBuilder} from "./stellar"
let entryCount = 0

function addRow(){
    entryCount = entryCount + 1
}
function removeRow(){
    if(entryCount > 0){
        entryCount = entryCount - 1
    }
}

let tokenType = ""
let distributionTypeNft =""
let distributionTypeNormal =""
function createNft(){}
async function handleSubmit(event: Event){
    window.yeet = event

    let issueKeypair = Keypair.random()
    let distributionKeypair = Keypair.random()
    let albedoAddress = albedo.publicKey()
    let account = await server.loadAccount(albedoAddress)
    let txBuilder = new TransactionBuilder(account,
    {
        fee : String(await server.fetchBaseFee()),
        networkPassphrase: Networks.TESTNET
    })
    let entries : Array<[string,string]> = []
    if(entryCount > 0){
        for(let i = 0; i < entryCount;i++){
            let currKey = event.target[`key-${i}`].value
            let currValue = event.target[`value-${i}`].value
            entries.push([currKey,currValue])
        }
    }
    addEntriesToTxBuilder(txBuilder,entries,issueKeypair.publicKey())
    addCreateAccountToTxBuilder(txBuilder,issueKeypair.publicKey(),albedoAddress)
    addCreateAccountToTxBuilder(txBuilder,distributionKeypair.publicKey(),albedoAddress)

    let tokenName = event.target["tokenName"].value
    let tokenDescription = event.target["tokenDescription"].value
    if(tokenType=="NFT"){

        

        if(distributionTypeNft=="Auction"){
            let endDate = new Date(event.target["auctionEndDate"].value)
            let endTime = event.target["auctionEndTime"].value
            endDate.setHours(Number(endTime.split(":")[0]),Number(endTime.split(":")[1]))
            let price = event.target["auctionPriceNft"].value
        }else if (distributionTypeNft == "Sale"){
            let price = event.target["salePriceNft"].value
        }else if (distributionTypeNft == "reserve for Adress (claimable)"){
            let destAddress = event.target["destinationAddressNft"].value
        }
    }else if(tokenType == "Normal tokens"){
        if(distributionTypeNormal == "Sale"){
            let price = event.target["salePriceNormal"].value
            let amountToCreate = event.target["amount"].value

        }
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


    <div class="margin10">
    <FileUploaderDropContainer multiple id="dataUpload" labelText="Upload all data files you wish to associate with this token. The file name has a max allowed length of 64" />
</div>
    <FileUploaderButton kind ="secondary" id="imageUpload" labelText="Upload Image" />
    <div class="margin10">
        <Checkbox 
        labelText="Export keys"
        id="exportKeys"
        />
    </div>
    <div class="margin10">
        <Checkbox 
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
