import java.sql.DriverManager

fun createSchema(jdbcUrl : String){
    val conn = DriverManager.getConnection(jdbcUrl)
    val stmt = conn.createStatement()
    val create = """
        CREATE TABLE IF NOT EXISTS tokens (
        	id integer PRIMARY KEY,
           	name text NOT NULL,
        	description text DEFAULT "",
        	issueAccount text DEFAULT "",
        	claimAddress text DEFAULT "",
        	sale integer DEFAULT 0,
        	auction integer DEFAULT 0,
        	claim integer DEFAULT 0

        );
    """.trimIndent()
    stmt.execute(create)
    stmt.close()
    conn.close()

}