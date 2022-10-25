import sqlite3, csv
def search_function(word):

    w = word
    conn = sqlite3.connect('super_market_database.db')
    c = conn.cursor()
    data = c.execute("SELECT * FROM products WHERE category LIKE '%'||?||'%' or name LIKE '%'||?||'%'",(w,w,) )

    result = data.fetchall()
    tuple = result
    return tuple