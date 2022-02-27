import tornado.ioloop
import tornado.web

from views import MainHandler, AddHandler, DeleteHandler, EditHandler

def make_app():
    "Creates the app instance."
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/add", AddHandler),
        (r"/delete", DeleteHandler),
        (r"/edit", EditHandler)
    ])

if __name__ == "__main__":
    port = 8888
    app = make_app()
    app.listen(port)
    print(f"App running on localhost:{port}")
    tornado.ioloop.IOLoop.current().start()