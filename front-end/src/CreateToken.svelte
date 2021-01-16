<script lang="ts">
import {Button, ComboBox, DatePicker, DatePickerInput, FileUploaderButton, FileUploaderDropContainer, Form,StructuredList,StructuredListBody,StructuredListCell,StructuredListHead,StructuredListRow,TextArea,TextInput, TextInputSkeleton, Tile, TimePicker} from "carbon-components-svelte"
import Add16 from "carbon-icons-svelte/lib/Add16"
import Subtract16 from "carbon-icons-svelte/lib/Subtract16"
function handleSubmit(event: Event){

}


function addRow(){

}
function removeRow(){

}

let tokenType = ""
let distributionTypeNft =""
let distributionTypeNormal =""
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
                <DatePicker>
                    <DatePickerInput id="auctionEndDate" placeholder="dd/mm/yyyy" labelText="Auction end date"/>
                </DatePicker>
                <TimePicker id="auctionEndTime" placeholder="hh:mm"/>
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
        </div>
    {/if}


    <div>
        <StructuredList>
            <StructuredListHead>
                <StructuredListRow head>
                    <StructuredListCell>Key</StructuredListCell>
                    <StructuredListCell>Value</StructuredListCell>
                </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
                <StructuredListRow>
                    <StructuredListCell>
                        <TextInput placeholder="key"/>
                    </StructuredListCell>
                    <StructuredListCell>
                        <TextInput placeholder="value"/>
                    </StructuredListCell>
                </StructuredListRow>
            </StructuredListBody>
        </StructuredList>
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
    <Button type="submit">
        Create Token
    </Button>
</div>
</Form>

</div>
