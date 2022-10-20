import sqlite3

c.execute("""CREATE TABLE groceries1
    (
        uniq_id text,
        name text,
        brand tetx,
        category text
        position_x int,
        position_y int,
        )""")

with open('data/products/data_groceries.csv', 'r') as file:
    for index, row in file:

        c.execute("INSERT INTO groceries1(uniq_id, name, brand, category, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)", row.split(';'))
        conn.commit()