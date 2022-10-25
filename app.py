from flask import Flask, request, url_for,render_template, redirect, jsonify
from dijkstra.main import Graph
from storage.db import Database
from storage.models.product import get_similar_products, get_product

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

# this method is used to provide the user with a list (max 10)
# of products based on a provided keyword.
@app.route('/search_result', methods=['GET'])
def search_result():
    if request.method == 'GET':
        args = request.args
        name = args.get('name')
        data = get_similar_products(name)

    return jsonify(isError= False,
                message= "Success",
                statusCode= 200,
                data= data), 200

@app.route('/product', methods=['GET'])
def product():
    if request.method == 'GET':
        args = request.args
        product_id = args.get('id')
        data = get_product(product_id)

        g = Graph()
        start_point = int(0)
        end_point = int(data['node'])
        path = g.dijkstra(start_point, end_point)

        data['path'] = path

    return jsonify(isError= False,
                message= "Success",
                statusCode= 200,
                data= data), 200


if __name__ == '__main__':
    conn = Database()
    app.run(debug=True, port=5000)