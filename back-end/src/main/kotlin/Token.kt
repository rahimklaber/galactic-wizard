import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.boolean
import org.ktorm.schema.int
import org.ktorm.schema.varchar

interface Token : Entity<Token> {
    companion object : Entity.Factory<Token>()

    var id: Int
    var name: String
    var description: String
    var issueAccount: String
    var claimAddress: String
    var sale: Boolean
    var auction: Boolean
    var claim: Boolean
}

class TokenImpl(
    val name: String,
    val description: String,
    val issueAccount: String,
    val claimAddress: String,
    val sale: Boolean,
    val auction: Boolean,
    val claim: Boolean
) {


    fun toDbToken(): Token {
        return Token {
            name = this@TokenImpl.name
            description = this@TokenImpl.description
            issueAccount = this@TokenImpl.issueAccount
            claimAddress = this@TokenImpl.claimAddress
            sale = this@TokenImpl.sale
            auction = this@TokenImpl.auction
            claim = this@TokenImpl.claim
        }
    }

    companion object{
        fun fromDbToken(dbToken : Token): TokenImpl {
            return TokenImpl(
                dbToken.name,
                dbToken.description,
                dbToken.issueAccount,
                dbToken.claimAddress,
                dbToken.sale,
                dbToken.auction,
                dbToken.claim
            )
        }

    }
}


object Tokens : Table<Token>("tokens") {
    val id = int("id").primaryKey().bindTo { it.id }
    val name = varchar("name").bindTo { it.name }
    val description = varchar("description").bindTo { it.description }
    val issueAccount = varchar("issueAccount").bindTo { it.issueAccount }
    val claimAddress = varchar("claimAddress").bindTo { it.claimAddress }
    val sale = boolean("sale").bindTo { it.sale }
    val auction = boolean("auction").bindTo { it.auction }
    val claim = boolean("claim").bindTo { it.claim }

}

val Database.tokens get() = this.sequenceOf(Tokens)

//data class Token(
//    val name: String,
//    val description: String,
//    val issueAccount: String,
//    val claimAddress: String,
//    val sale: Boolean
//)