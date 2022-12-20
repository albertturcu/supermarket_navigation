from flask import Flask, request, url_for,render_template, redirect, jsonify
from dijkstra.main import Graph
from storage.models.product import get_similar_products, get_product, add_product, get_categories, update_product, count_similar_products, empty_spots_in_category, update_category, get_category
from storage.models.paging import get_paginated_list
import uuid

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
        page = int(args.get('page', 1))
        limit = int(args.get('limit', 5))

        result = get_similar_products(name, page, limit)
        count = count_similar_products(name)
        url = '/search_result?name=' + name
        data = get_paginated_list(result, count, url, page, limit)

    return jsonify(isError= False,
                message= "Success",
                statusCode= 200,
                data= data), 200

@app.route('/product', methods=['GET', 'POST', 'PATCH'])
def product():
    data = None
    isError = False
    message = "Success"
    statusCode = 200

    if request.method == 'GET':
        print("GET")
        args = request.args
        product_id = args.get('id')
        data = get_product(product_id)

        g = Graph()
        start_point = int(0)
        end_point = int(data['node'])
        path = g.dijkstra(start_point, end_point)

        data['path'] = path

    if request.method == 'POST':
        print("POST")
        json_data = request.get_json()

        uniq_id = uuid.uuid4().hex
        name = json_data['name']
        list_price = json_data['list_price']
        brand = json_data['brand']
        category = json_data['category']
        position_x = json_data['position_x']
        position_y = json_data['position_y']

        err = add_product(uniq_id, name, list_price, brand, category, position_x, position_y)
        if err is not None:
            statusCode = 400
            message = err
            isError = True

    if request.method == 'PATCH':
        print("PATCH")
        json_data = request.get_json()

        try:
            uniq_id = json_data['uniq_id']
            name = json_data['name']
            list_price = json_data['list_price']
            brand = json_data['brand']
            category = json_data['category']
            position_x = json_data['position_x']
            position_y = json_data['position_y']
        except KeyError as key_error:
            statusCode = 400
            message =   f"Missing required key {key_error}."
            isError = True

        if isError is False:
            err = update_product(uniq_id, name, list_price, brand, category, position_x, position_y)

            if err is not None:
                statusCode = 400
                message = err
                isError = True

    return jsonify(isError= isError,
                message= message,
                statusCode= statusCode,
                data= data), statusCode

@app.route('/category', methods=['GET','PATCH'])
def category():
    data = {}
    isError = False
    message = "Success"
    statusCode = 200

    if request.method == 'GET':
        args = request.args
        category_name = args.get('name')

        print(category_name)
        if category_name:
            print("get emtpy spots for category " + category_name)
            empty_spots = empty_spots_in_category(category_name)

            category = get_category(category_name)
            data['category'] = category
            data['empty_spots'] = empty_spots
        else:
            print("get all categories")
            data = get_categories()

    if request.method == 'PATCH':
        json_data = request.get_json()

        try:
            name = json_data['category_name']
            position_x = json_data['position_x']
            position_y = json_data['position_y']
        except KeyError as key_error:
            statusCode = 400
            message =   f"Missing required key {key_error}."
            isError = True

        if isError is False:
            err = update_category(position_x, position_y, name)

            if err is not None:
                statusCode = 400
                message = err
                isError = True

    return jsonify(isError= isError,
                message= message,
                statusCode= statusCode,
                data= data), statusCode

@app.route('/', methods=['GET'])
def health():
    print("start algorithm")
    if request.method == 'GET':
        message="Success."

    return jsonify(isError= False,
                message=message,
                statusCode= 200,
                data=None), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)