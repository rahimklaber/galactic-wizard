import {Asset, Claimant, Operation, Server, TransactionBuilder} from "stellar-sdk"

export const server = new Server("https://horizon-testnet.stellar.org")
export const usdAsset = new Asset("USD","GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTGG")
export function addEntriesToTxBuilder(builder: TransactionBuilder, entries: Array<[string,string]>,issueAddress: string, sponsorAddress: string): TransactionBuilder{
    if(entries.length > 0){
    builder.addOperation(
        Operation.beginSponsoringFutureReserves({
            source: sponsorAddress,
            sponsoredId: issueAddress
        })
    )
    for(let [key,value] of entries){
        builder.addOperation(
            Operation.manageData(
                {
                   name : key,
                   value : value,
                   source : issueAddress
                }
            )
        )
    }
    builder.addOperation(
        Operation.endSponsoringFutureReserves({
            source : issueAddress
        })
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
        Operation.endSponsoringFutureReserves({
            source : accountToCreate
        })
    )
    return builder
}

export function addCreateTokenToTxBuilder(builder: TransactionBuilder, issueAddress: string, distributionAddress: string, asset : Asset,amount : string,sponsorAddress):TransactionBuilder{
    builder.addOperation(
        Operation.beginSponsoringFutureReserves({
            source : sponsorAddress,
            sponsoredId : distributionAddress
        })
    )
    builder.addOperation(
        Operation.changeTrust({
            source : distributionAddress,
            asset : asset
        })
    )

    builder.addOperation(
        Operation.endSponsoringFutureReserves({
            source : distributionAddress
        })
    )
    
    builder.addOperation(
        Operation.payment({
            source : issueAddress,
            destination : distributionAddress,
            asset : asset,
            amount : amount
        })
    )
    return builder
}

export function addSellOrderToTxBuilder(builder:TransactionBuilder,sellAsset: Asset,buyAsset: Asset,amount: string,price : string, sourceAddress : string, distributionAddress : string):TransactionBuilder{


    builder.addOperation(
        Operation.changeTrust({
            asset : buyAsset,
            source: sourceAddress
        })
    )

    builder.addOperation(
        Operation.changeTrust({
            asset : sellAsset,
            source: sourceAddress
        })
    )

    builder.addOperation(
        Operation.payment(
            {
                source : distributionAddress,
                amount : amount,
                asset : sellAsset,
                destination : sourceAddress
            }
        )
    )
    builder.addOperation(
        Operation.manageSellOffer({
            selling : sellAsset,
            buying : buyAsset,
            amount : amount,
            price : price,
            source : sourceAddress
        })
    )

    return builder
}

export function addClaimableBalanceToTxBuilder(builder: TransactionBuilder,asset: Asset, amount : string, claimAddress: string,sourceAddress: string,sponsorAddress:string): TransactionBuilder{
    console.log(claimAddress)
    console.log(new Claimant(claimAddress,Claimant.predicateUnconditional()).destination)
    builder.addOperation(
        Operation.beginSponsoringFutureReserves({
            source : sponsorAddress,
            sponsoredId : sourceAddress
        })
    ) 

    builder.addOperation(
        Operation.createClaimableBalance({
            asset : asset,
            source : sourceAddress,
            amount : amount,
            claimants : Array(new Claimant(claimAddress,Claimant.predicateUnconditional()))
        })
    )

    builder.addOperation(
        Operation.endSponsoringFutureReserves({
            source : sourceAddress
        })
    )

    return builder
}
