import tornado.web

from model import get_db, row_factory

class BaseHandler(tornado.web.RequestHandler):
    """Base class with correct options set which other Handlers inherit from."""
    
    def options(self, *args, **kwargs):
        """
        Default OPTIONS request response for all handlers
        This overrides CORS so that the UI is test-able
        NOTE: ONLY USE LOCALLY!
        """
        # if running locally, disable CORS protections
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.set_header('Access-Control-Allow-Credentials', 'true')
        self.set_header('Access-Control-Allow-Headers', 'Content-Type')
        self.add_header('Vary', 'Origin')
    
    def set_default_headers(self):
        """
        Default OPTIONS request response for all handlers
        This overrides CORS so that the UI is test-able
        NOTE: ONLY USE LOCALLY!
        """
        # if running locally, disable CORS protections
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.set_header('Access-Control-Allow-Credentials', 'true')
        self.add_header('Vary', 'Origin')
        

class MainHandler(BaseHandler):
    """Returns a full list of all tasks."""

    def get(self):
        print("Sending all tasks")
        with get_db() as conn:
            with conn.cursor() as cur:
                # Get list of tasks
                q = "SELECT * FROM tasks"
                cur.execute(q)
                results = cur.fetchall()
                # Convert tasks to dictionaries
                tasks = {}
                for row in results:
                    task_dict = row_factory(row)
                    id = task_dict.pop('id')
                    tasks[id] = task_dict
                # Send the JSON
                self.write({"tasks": tasks})
            
            conn.commit()

class AddHandler(BaseHandler):
    """Adds task to database and returns it."""
    def post(self):
        print("Adding task")
        data = tornado.escape.json_decode(self.request.body)["taskText"]
        with get_db() as conn:
            with conn.cursor() as cur:
                q = "INSERT INTO tasks (task) VALUES (%s)"
                cur.execute(q, (data,))
            conn.commit()

            with conn.cursor() as cur:
                q = "SELECT * FROM tasks WHERE id = (SELECT MAX(id) FROM tasks)"
                cur.execute(q)
                result = cur.fetchone()
                task = row_factory(result)
                self.write(task)
            conn.commit()

class DeleteHandler(BaseHandler):
    """Deletes task from database, returns nothing."""
    def delete(self):
        id = self.get_argument("id")
        print("Deleting", id)
        with get_db() as conn:
            with conn.cursor() as cur:
                q = "DELETE FROM tasks WHERE id=%s"
                cur.execute(q, (id,))
                self.write({"status": f"deleted task {id}"})
            conn.commit()

class EditHandler(BaseHandler):
    """Edit task description or status from database, returns updated info."""
    def post(self):
        id = self.get_argument("id")
        print("Editing task", id)
        data = tornado.escape.json_decode(self.request.body)
        newDesc, newStatus = data["desc"], data["status"]
        with get_db() as conn:
            with conn.cursor() as cur:
                q = "UPDATE tasks SET task=%s, done=%s WHERE id=%s"
                cur.execute(q, (newDesc, newStatus, id))
            conn.commit()
            with conn.cursor() as cur:
                q = "SELECT * FROM tasks WHERE id=%s"
                cur.execute(q, (id,))
                result = cur.fetchone()
                task = row_factory(result)
                self.write(task)
            conn.commit()