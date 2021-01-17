import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import io.javalin.Javalin
import org.ktorm.database.Database
import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.entity.add
import org.ktorm.entity.filter

fun main(args: Array<String>) {
    createSchema("jdbc:sqlite:tokens.db")
    val database = Database.connect("jdbc:sqlite:tokens.db")

    val app = Javalin.create {
        it.enableCorsForAllOrigins()
    }
    val moshi = Moshi.Builder()
        .addLast(KotlinJsonAdapterFactory()).build()
    val tokenAdapter = moshi.adapter(TokenImpl::class.java)
    val type = Types.newParameterizedType(List::class.java, TokenImpl::class.java)
    val tokenListAdapter = moshi.adapter<List<TokenImpl>>(type)

    app.post("/tokens") {
        println(it.body())
        val tokenImpl = tokenAdapter.fromJson(it.body())!!
        database.tokens.add(tokenImpl.toDbToken())
    }

    app.get("/tokens") {
        val tokens = database.tokens.asKotlinSequence().map {
            TokenImpl.fromDbToken(it)
        }.toList()
        val tokensJson = tokenListAdapter.toJson(tokens)
        it.result(tokensJson)
    }

    app.get("/tokens/:claimAddress") {
        val claimAddr = it.pathParam("claimAddress")
        val tokens = database.tokens
            .filter {
            (it.claim eq true) and (it.claimAddress eq claimAddr)
            }
            .asKotlinSequence()

            .map {
                TokenImpl.fromDbToken(it)
            }.toList()
        val tokensJson = tokenListAdapter.toJson(tokens)
        it.result(tokensJson)
    }


    app.start(3000)
}