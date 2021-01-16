import {Asset, Operation, Server, TransactionBuilder} from "stellar-sdk"

export const server = new Server("https://horizon-testnet.stellar.org")

export function addEntriesToTxBuilder(builder: TransactionBuilder, entries: Array<[string,string]>,issueAddress: string): TransactionBuilder{
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
    return builder
}

export function addCreateAccountToTxBuilder(builder: TransactionBuilder, accountToCreate: string, sourceAccount: string): TransactionBuilder{
    builder.addOperation(
        Operation.beginSponsoringFutureReserves({
            source : sourceAccount,
            sponsoredId : accountToCreate
        })
    ).addOperation(
        Operation.createAccount({
            source : sourceAccount,
            destination: accountToCreate,
            startingBalance : "0"
        })
    ).addOperation(
        Operation.endSponsoringFutureReserves({})
    )
    return builder
}

export function addCreateNftToTxBuilder(builder: TransactionBuilder, issueAddress: string, distributionAddress: string, nftName : string):TransactionBuilder{
    let asset = new Asset(nftName, issueAddress)
    builder.addOperation(
        Operation.changeTrust({
            source : distributionAddress,
            asset : asset
        })
    ).addOperation(
        Operation.payment({
            source : issueAddress,
            destination : distributionAddress,
            asset : asset,
            amount : "1"
        })
    )
    return builder
}