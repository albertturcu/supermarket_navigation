import psycopg2

def with_connection(f):
    def with_connection_(*args, **kwargs):
        connection_string='postgresql://SUEPRMARKET_telephone:2fd423a1c6d6075602a04eb87251b35db80ddc49@tce.h.filess.io:5432/SUEPRMARKET_telephone'
        conn = psycopg2.connect(connection_string)
        try:
            result = f(*args, connection=conn, **kwargs)
        except:
            conn.rollback()
            print("SQL failed")
            raise
        else:
            conn.commit()
        finally:
            conn.close()
        return result
    return with_connection_