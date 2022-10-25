import sqlite3, csv
def search_function(word):

    w = word
    conn = sqlite3.connect('super_market_database.db')
    c = conn.cursor()
    data = c.execute("SELECT node FROM layout WHERE category LIKE '%'||?||'%'",(w,) )
    #print( "The node is:", data.fetchall())

    result = data.fetchall()
    tuple = result[0]
    return tuple[0]

print(search_function('milk')) 