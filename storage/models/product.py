import sqlite3, csv

# this method returns similar products to a given key with a limit of 10 rows
def get_similar_products(word, page, limit):
    conn = sqlite3.connect('super_market_database.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    offset = (page - 1) * limit
    data = c.execute("SELECT * FROM products WHERE category LIKE '%'||?||'%' or name LIKE '%'||?||'%' LIMIT ? OFFSET ?",(word,word,limit,offset,) )

    rows = data.fetchall()
    result = []
    for row in rows:
        result.append(dict(zip(row.keys(), row)))

    return result

def count_similar_products(word):
    conn = sqlite3.connect('super_market_database.db')
    conn.row_factory = sqlite3.Row
    count = 0

    c = conn.cursor()

    data = c.execute("SELECT count(*) FROM products WHERE category LIKE '%'||?||'%' or name LIKE '%'||?||'%'",(word,word,) )

    rows = data.fetchall()

    for row in rows:
        count = row[0]

    return count

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

def update_product(uniq_id, name, list_price, brand, category, position_x, position_y):
    conn = sqlite3.connect('super_market_database.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    print("update product")


    product = c.execute("SELECT * FROM products WHERE uniq_id = ?", (uniq_id, ))
    rows = product.fetchall()
    print("find product")
    print(rows)
    if len(rows) > 0:
        print("product found")
        prod = dict(zip(rows[0].keys(), rows[0]))
        if prod['category'] == category:
            print("same category")

            if prod["position_x"] != position_x or prod["position_y"] != position_y:
                print("different position")
                position_taken = c.execute("SELECT * FROM products WHERE category = ? and position_x = ? and position_y = ?", (category, position_x, position_y, ))
                rows = position_taken.fetchall()
                print("position_taken")
                print(rows)
                if len(rows) > 0:
                    return "this position is taken"

            product = c.execute("""
                UPDATE products
                SET name = ?, list_price = ?, brand = ?, position_x = ?, position_y = ?
                WHERE uniq_id = ?""",
                ( name, list_price, brand, position_x, position_y, uniq_id, ))
        else:
            print("different category")
            product = c.execute("DELETE FROM products WHERE uniq_id = ?", (uniq_id, ))

        # find max width
        position_x = c.execute(
            "SELECT max(position_x) as max_position_x FROM products WHERE category=?", (category,)
        )
        rows = position_x.fetchall()
        position_x = dict(zip(rows[0].keys(), rows[0]))

        # find max height
        position_y = c.execute(
            "SELECT max(position_y) as max_position_y FROM products WHERE position_x = ? and category=?", (position_x['max_position_x'], category,)
        )
        rows = position_y.fetchall()
        position_y = dict(zip(rows[0].keys(), rows[0]))

        # calculate next position on shelf
        if position_y['max_position_y'] >= 5:
            position_x = position_x['max_position_x'] + 1
            position_y = 0
        else:
            position_x = position_x['max_position_x']
            position_y = position_y['max_position_y'] + 1

        # insert new product
        try:
            c.execute(
                "INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?)",
                (uniq_id, name, list_price, brand, category, position_x, position_y,)
            )
        except sqlite3.Error as er:
            return er

        # update layout max width and height
        position_y = c.execute(
            "SELECT max(position_y) as max_position_y FROM products WHERE category=?", (category,)
        )
        rows = position_y.fetchall()
        position_y = dict(zip(rows[0].keys(), rows[0]))

        c.execute(
                "UPDATE layout SET width = ?, height = ? WHERE category = ?",
                (position_x, position_y['max_position_y'], category, )
            )

    conn.commit()
    conn.close()

    return None

def add_product(uniq_id, name, list_price, brand, category):
    conn = sqlite3.connect('super_market_database.db')
    conn.row_factory = sqlite3.Row
    print("add product")
    c = conn.cursor()

    position_x = c.execute(
        "SELECT max(position_x) as max_position_x FROM products WHERE category=?", (category,)
    )
    rows = position_x.fetchall()
    position_x = dict(zip(rows[0].keys(), rows[0]))

    position_y = c.execute(
        "SELECT max(position_y) as max_position_y FROM products WHERE position_x = ? and category=?", (position_x['max_position_x'], category,)
    )
    rows = position_y.fetchall()
    position_y = dict(zip(rows[0].keys(), rows[0]))

    if position_y['max_position_y'] >= 5:
        position_x = position_x['max_position_x'] + 1
        position_y = 0
    else:
        position_x = position_x['max_position_x']
        position_y = position_y['max_position_y'] + 1

    try:
        c.execute(
            "INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?)",
            (uniq_id, name, list_price, brand, category, position_x, position_y,)
        )
    except sqlite3.Error as er:
        return er

    # update layout max width and height
    position_y = c.execute(
        "SELECT max(position_y) as max_position_y FROM products WHERE category=?", (category,)
    )
    rows = position_y.fetchall()
    position_y = dict(zip(rows[0].keys(), rows[0]))

    c.execute(
            "UPDATE layout SET width = ?, height = ? WHERE category = ?",
            (position_x, position_y['max_position_y'], category, )
        )

    conn.commit()
    conn.close()

    return None

def get_categories():
    conn = sqlite3.connect('super_market_database.db')
    conn.row_factory = sqlite3.Row

    c = conn.cursor()

    product_raw = c.execute("SELECT category FROM layout")
    rows = product_raw.fetchall()

    categories = []
    for row in rows:
        categories.append(row[0])

    return categories
