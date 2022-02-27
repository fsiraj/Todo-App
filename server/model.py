import pymysql

def get_db():
    "Returns a connection object to the database."
    conn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='',
        db='todoapp'
    )
    return conn

def row_factory(db_row):
    id, task, done, added, edited = db_row
    task_dict = {
        'id'    : id,
        'task'  : task,
        'done'  : bool(done),
        'added' : added.strftime("%d-%b-%Y"),
        'edited': edited.strftime("%d-%b-%Y")
    }
    return task_dict