from storage.db import with_connection

# this method returns similar products to a given key with a limit of 10 rows
@with_connection
def get_similar_products(word, page, limit, **kwargs):
    c = kwargs.pop("connection").cursor()

    offset = (page - 1) * limit
    query = "SELECT * FROM products WHERE category LIKE '%{}%' or name LIKE '%{}%' LIMIT {} OFFSET {}".format(word,word,limit,offset)
    c.execute(query)

    rows = c.fetchall()
    result = []
    for row in rows:
        cols = [desc[0] for desc in c.description]
        result.append(dict(zip(cols, rows[0])))

    return result

@with_connection
def count_similar_products(word, **kwargs):
    count = 0
    c = kwargs.pop("connection").cursor()

    query = "SELECT  count(*) FROM products WHERE category LIKE '%{}%' or name LIKE '%{}%'".format(word,word)
    c.execute(query)
    rows = c.fetchall()

    for row in rows:
        count = row[0]

    return count

## this method returns the path to the given id of a product
@with_connection
def get_product(id, **kwargs):
    c = kwargs.pop("connection").cursor()

    query = "SELECT * FROM products WHERE uniq_id = '{}'".format(id)
    c.execute(query)
    rows = c.fetchall()
    cols = [desc[0] for desc in c.description]
    prod = dict(zip(cols, rows[0]))

    query = "SELECT * FROM layout WHERE category LIKE '%{}%'".format(prod['category'])
    c.execute(query)
    rows = c.fetchall()
    cols = [desc[0] for desc in c.description]
    layout = dict(zip(cols, rows[0]))

    prod['node'] = layout['node']
    prod['shelf_width'] = layout['width']
    prod['shelf_height'] = layout['height']

    return prod

@with_connection
def update_product(uniq_id, name, list_price, brand, category, position_x, position_y, **kwargs):
    c = kwargs.pop("connection").cursor()

    query = "SELECT * FROM products WHERE uniq_id = '{}'".format(uniq_id)
    c.execute(query)
    rows = c.fetchall()

    if len(rows) > 0:
        cols = [desc[0] for desc in c.description]
        prod = dict(zip(cols, rows[0]))
        if prod['category'] == category:

            if prod["position_x"] != position_x or prod["position_y"] != position_y:
                query = "SELECT * FROM products WHERE category = '{}' and position_x = {} and position_y = {}".format(category, position_x, position_y)
                c.execute(query)
                rows = c.fetchall()

                if len(rows) > 0:
                    return "this position is taken"

            query = """
                UPDATE products
                SET name = '{}', list_price = {}, brand = '{}', position_x = {}, position_y = {}
                WHERE uniq_id = '{}'""".format( name, list_price, brand, position_x, position_y, uniq_id)
            c.execute(query)
        else:
            query = "DELETE FROM products WHERE uniq_id = '{}'".format(uniq_id)
            c.execute(query)

            # find max width
            query = "SELECT max(position_x) as max_position_x FROM products WHERE category='{}'".format(category)
            c.execute(query)
            rows = c.fetchall()
            cols = [desc[0] for desc in c.description]
            position_x = dict(zip(cols, rows[0]))

            # find max height
            query = "SELECT max(position_y) as max_position_y FROM products WHERE position_x = {} and category={}".format(position_x['max_position_x'], category)
            c.execute(query)
            rows = c.fetchall()
            cols = [desc[0] for desc in c.description]
            position_y = dict(zip(cols, rows[0]))

            # calculate next position on shelf
            if position_y['max_position_y'] >= 5:
                position_x = position_x['max_position_x'] + 1
                position_y = 0
            else:
                position_x = position_x['max_position_x']
                position_y = position_y['max_position_y'] + 1

            # insert new product
            try:
                query = "INSERT INTO products VALUES ({}, {}, {}, {}, {}, {}, {})".format(uniq_id, name, list_price, brand, category, position_x, position_y)
                c.execute(query)
            except Exception as er:
                return er

        # update layout max width and height
        query = "SELECT max(position_y) as max_position_y FROM products WHERE category='{}'".format(category)
        c.execute(query)
        rows = c.fetchall()
        cols = [desc[0] for desc in c.description]
        position_y = dict(zip(cols, rows[0]))

        query = "UPDATE layout SET width = {}, height = {} WHERE category = '{}'".format(position_x, position_y['max_position_y'], category)
        c.execute(query)

    return None

@with_connection
def add_product(uniq_id, name, list_price, brand, category, **kwargs):
    c = kwargs.pop("connection").cursor()

    query = "SELECT max(position_x) as max_position_x FROM products WHERE category='{}'".format(category)
    c.execute(query)
    rows = c.fetchall()
    cols = [desc[0] for desc in c.description]
    position_x = dict(zip(cols, rows[0]))

    query = "SELECT max(position_y) as max_position_y FROM products WHERE position_x = {} and category='{}'".format(position_x['max_position_x'], category)
    position_y = c.execute(query)
    rows = position_y.fetchall()
    cols = [desc[0] for desc in c.description]
    position_y = dict(zip(cols, rows[0]))

    if position_y['max_position_y'] >= 5:
        position_x = position_x['max_position_x'] + 1
        position_y = 0
    else:
        position_x = position_x['max_position_x']
        position_y = position_y['max_position_y'] + 1

    try:
        query = "INSERT INTO products VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(uniq_id, name, list_price, brand, category, position_x, position_y)
        c.execute(query)
    except Exception as er:
        return er

    # update layout max width and height
    query = "SELECT max(position_y) as max_position_y FROM products WHERE category='{}'".format(category)
    c.execute(query)
    rows = c.fetchall()
    cols = [desc[0] for desc in c.description]
    position_y = dict(zip(cols, rows[0]))

    query = "UPDATE layout SET width = {}, height = {} WHERE category = '{}'".format(position_x, position_y['max_position_y'], category)
    c.execute(query)

    return None

@with_connection
def get_categories(**kwargs):
    c = kwargs.pop("connection").cursor()

    c.execute("SELECT category FROM layout")
    rows = c.fetchall()

    categories = []
    for row in rows:
        categories.append(row[0])

    return categories

@with_connection
def empty_spots_in_category(category, **kwargs):
    c = kwargs.pop("connection").cursor()

    query = """
     with tmpVar as
	(
        select
            max(position_x) as max_x,
            max(position_y) as max_y
        from
            products
        where
            category = '{}')

        select shelf_position_x, shelf_position_y, uniq_id from (
	        select
	            *
	        from
	            (
	            select
	                    *
	            from
	                    (
	                select
	                        generate_series(0, (select max_x from tmpVar), 1) as shelf_position_x) t1
	            inner join (
	                select
	                        generate_series(0, 5, 1) as shelf_position_y) t2 on
	                    true
	        ) t3
	        left join (
	            select
	                *
	            from
	                products
	            where
	                category = '{}') t4 on
	            t3.shelf_position_x = t4.position_x
	            and t3.shelf_position_y = t4.position_y
	        order by
	            t3.shelf_position_x,
	            t3.shelf_position_y
        ) t5 """.format(category,category)
    c.execute(query)
    rows = c.fetchall()

    empty_spots_res = []
    for row in rows:
        cols = [desc[0] for desc in c.description]
        product = dict(zip(cols, row))

        empty_spots_res.append(product)

    return empty_spots_res