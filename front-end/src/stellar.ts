import {Operation, Server, TransactionBuilder} from "stellar-sdk"

export const server = new Server("https://horizon-testnet.stellar.org")

export function addEntriesToTxBuilder(builder: TransactionBuilder, entries: Array<[string,string]>,issueAddress: string){
    for(let [key,value] of entries){
        builder.addOperation(
            Operation.manageData(
                {
                   name : key,
                   value : value 
                }
            )
        )
    }
}
