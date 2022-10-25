from flask import Flask, request, url_for,render_template, redirect, jsonify
from dijkstra.main import Graph
from storage.db import Database
from storage.models.product import search_function

app = Flask(__name__)

# @db_connector
@app.route('/path', methods=['POST'])
def index():
    print("start algorithm")
    if request.method == 'POST':
        g = Graph()
        end_point = int(request.json['end_point'])
        start_point = int(request.json['start_point'])

        paths = g.dijkstra(start_point, end_point)

        print(paths)

    return jsonify(isError= False,
                message= "Success",
                statusCode= 200,
                data= paths), 200

# @db_connector
@app.route('/product', methods=['get'])
def search_product():
    if request.method == 'GET':
        args = request.args
        name = args.get('name')
        data = search_function(name)
        # g = Graph()
        # end_point = int(request.json['end_point'])
        # start_point = int(request.json['start_point'])

        # paths = g.dijkstra(start_point, end_point)

        # print(paths)

    return jsonify(isError= False,
                message= "Success",
                statusCode= 200,
                data= data), 200


if __name__ == '__main__':
    conn = Database()
    app.run(debug=True, port=5000)