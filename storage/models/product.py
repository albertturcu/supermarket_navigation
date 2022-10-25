import sqlite3, csv

conn = sqlite3.connect('super_market_database.db')

c = conn.cursor()

data = c.execute("SELECT node FROM layout WHERE category = 'milk\n' ")
print( "The node is:", data.fetchall())


# c.execute("""CREATE TABLE layout
#         (
#             node text,
#             category text
#             )""")




# f=open('data_groceries.csv')
# insert_sql = "insert into groceries45678878 values (?, ?, ?, ?)"
# for row in str(csv.reader(f)):
#     c.execute(insert_sql, row)



# with open('data\layout\layout.csv', 'r') as file:
#     no_records = 0
#     for row in file:
#         c.execute("INSERT INTO layout(node, category) VALUES (?,?)", row.split(';'))
#         conn.commit()
#         no_records += 1
# conn.close()
# print('\n{} Records transferred'.format(no_records))