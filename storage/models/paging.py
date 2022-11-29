from flask import Flask, request, jsonify, abort 

def get_paginated_list(results, count, url, page, limit):
    page = int(page)
    limit = int(limit)

    if count < page or limit < 0:
        abort(404)

    # make response
    obj = {}
    obj['page'] = page
    obj['limit'] = limit
    obj['count'] = count
    obj['results'] = results

    # make URLs
    # make previous url
    if page == 1:
        obj['previous'] = ''
    else:
        start_copy = page - 1
        obj['previous'] = url + '&page=%d&limit=%d' % (start_copy, limit)

    # make next url
    if page * limit >= count:
        obj['next'] = ''
    else:
        start_copy = page + 1
        obj['next'] = url + '&page=%d&limit=%d' % (start_copy, limit)

    return obj

