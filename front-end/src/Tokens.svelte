<script lang="ts">
import Axios from "axios";

import {Modal,Button,TimePickerSelect,SelectItem, Checkbox, ComboBox, DatePicker, DatePickerInput, FileUploaderButton, FileUploaderDropContainer, Form,StructuredList,StructuredListBody,StructuredListCell,StructuredListHead,StructuredListRow,TextArea,TextInput, TextInputSkeleton, Tile, TimePicker} from "carbon-components-svelte"
import Token from "./Token.svelte"
import {serverUrl} from "./backend"
async function create() {
    let tokens = (await Axios.get(`${serverUrl}/tokens`)).data
    console.log(tokens)
    return tokens
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
    <h1>View Created Tokens</h1>
    <div class="tokens">
{#await create()}
    
{:then tokens} 
    {#each tokens as token}
    <Token
        name={token["name"]}
        description={token["description"]}
        issueAddress={token["issueAccount"]}
    /> 
    {/each}
{/await}
</div>
</div>