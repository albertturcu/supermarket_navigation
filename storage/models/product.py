# import sqlite3

# c.execute("""CREATE TABLE groceries1
#     (
#         uniq_id text,
#         name text,
#         list_price text, 
#         brand tetx,
#         category text
#         position_x int,
#         position_y int,
#         )""")

# with open('data/products/data_groceries.csv', 'r') as file:
#     for index, row in file:

#         c.execute("INSERT INTO groceries1(uniq_id, name, brand, category, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)", row.split(';'))
#         conn.commit()

import sqlite3, csv

conn = sqlite3.connect('super_market_database.db')

c = conn.cursor()

# c.execute("""CREATE TABLE layout
#         (
#             node text,
#             category text
#             )""")




# f=open('data_groceries.csv')
# insert_sql = "insert into groceries45678878 values (?, ?, ?, ?)"
# for row in str(csv.reader(f)):
#     c.execute(insert_sql, row)



with open('data\layout\layout.csv', 'r') as file:
    no_records = 0
    for row in file:
        c.execute("INSERT INTO layout(node, category) VALUES (?,?)", row.split(';'))
        conn.commit()
        no_records += 1
conn.close()
print('\n{} Records transferred'.format(no_records))