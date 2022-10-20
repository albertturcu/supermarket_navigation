import sqlite3

class Database():
    def __init__(self, connection_string='supermarket.db'):
        self.connection_string = connection_string
        self.connector = None

    def __enter__(self):
        self.connector = sqlite3.connect(self.connection_string)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_tb is None:
            self.connector.commit()
        else:
            self.connector.rollback()
        self.connector.close()
