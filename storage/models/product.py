import sqlite3, csv

# this method returns similar products to a given key with a limit of 10 rows
def get_similar_products(word):
    conn = sqlite3.connect('super_market_database.db')
    conn.row_factory = sqlite3.Row

    c = conn.cursor()

    data = c.execute("SELECT * FROM products WHERE category LIKE '%'||?||'%' or name LIKE '%'||?||'%' LIMIT 10",(word,word,) )

    rows = data.fetchall()
    result = [] 
    for row in rows:
        result.append(dict(zip(row.keys(), row)))

    return result


## this method returns the path to the given id of a product
def get_product(id):
    conn = sqlite3.connect('super_market_database.db')
    conn.row_factory = sqlite3.Row

    c = conn.cursor()

    product_raw = c.execute("SELECT * FROM products WHERE uniq_id = ?",(id,) )
    rows = product_raw.fetchall()
    prod = dict(zip(rows[0].keys(), rows[0]))
    print(prod['category'])

    layout_raw = c.execute("SELECT * FROM layout WHERE category LIKE '%'||?||'%'",(prod['category'],) )
    rows = layout_raw.fetchall()
    layout = dict(zip(rows[0].keys(), rows[0]))
    print(layout['node'])

    prod['node'] = layout['node']
    prod['shelf_width'] = layout['width']
    prod['shelf_height'] = layout['height']

    return prod