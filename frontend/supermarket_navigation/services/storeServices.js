import {API_BASE_URL} from '@env'
import {BackendProduct, FrontendProduct} from '../Models/DataModels'

class Category {
    constructor(width, height, category) {
        this.position_x = width
        this.position_y = height
        this.category_name = category
    }
}
export default class StoreServices {
    // API product PATCH method
    editProduct(input) {
        return new Promise((resolve, reject) => {
            const payload = new BackendProduct(input.id, input.name, input.brand, input.price, input.category, input.xPosition, input.yPosition)
            fetch(`${API_BASE_URL}` + 'product', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then((response) => response.json())
                .then((json) => {
                    json.isError ? reject(json.message) : resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getAllCategories() {
        return new Promise((resolve, reject) => {
            fetch(`${API_BASE_URL}` + 'category')
                .then((response) => response.json())
                .then((json) => {
                    json.isError ? reject(json.message) : resolve(json.data)
                })
                .catch((error) => reject(error))
        })
    }
    getEmptySpacesForCategory(category, id) {
        return new Promise((resolve, reject) => {
            fetch(`${API_BASE_URL}` + 'category?name=' + category)
                .then((response) => response.json())
                .then((json) => {
                    if (json.isError) {
                        reject(json.message)
                    } else {
                        // filter out occupied spots on shelf but include own spot
                        const emptySpaces = json.data.empty_spots.filter((spot) => spot.uniq_id === null || spot.uniq_id === id)
                        resolve(emptySpaces)
                    }
                })
                .catch((error) => reject(error))
        })
    }
    getShelfDimensions(category) {
        return new Promise((resolve, reject) => {
            fetch(`${API_BASE_URL}` + 'category?name=' + category)
                .then((response) => response.json())
                .then((json) => {
                    if (json.isError) {
                        reject(json.message)
                    } else {
                        const width = json.data.category[0].width
                        const height = json.data.category[0].height
                        resolve({width, height})
                    }
                })
                .catch((error) => reject(error))
        })
    }
    extendShelfWidth(width, height, category) {
        const payload = new Category(width, height, category)
        console.log("payload" , payload)
        return new Promise((resolve, reject) => {
            fetch(`${API_BASE_URL}` + 'category', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then((response) => response.json())
            .then((json) => {
                json.isError ? reject(json.message) : resolve()
            })
            .catch((error) => {
                reject(error)
            })
        })
    }
    getProduct(id) {
        return new Promise((resolve, reject) => {
            fetch(`${API_BASE_URL}` + 'product?id=' + id)
            .then((response) => response.json())
            .then((json) => {
                if (json.isError) {
                    reject(json.message)
                } else {
                    const data = json.data
                    const product = new FrontendProduct(data.uniq_id, data.name, data.brand, data.list_price, data.category, data.position_x, data.position_y, data.path, data.shelf_width, data.shelf_height)
                    resolve(product)
                }
            })
            .catch((error) => reject(error))
        })   
    }
    addProduct(input) {
        return new Promise((resolve, reject) => {
            const payload = new BackendProduct(null, input.name, input.brand, input.price, input.category, input.xPosition, input.yPosition)
            console.log(payload)
            fetch(`${API_BASE_URL}` + 'product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then((response) => response.json())
            .then((data) => {
                data.isError ? reject(data.message) : resolve()
            })
            .catch((error) => reject(error))
        })
    }
    searchProducts(query, page, limit) {
        return new Promise((resolve, reject) => {
            fetch(`${API_BASE_URL}` + 'search_result?name=' + query + '&page=' + page + '&limit=' + limit)
                .then((response) => response.json())
                .then((json) => {
                    const data = json.data
                    if (json.isError) {
                        reject(json.message)
                    } else if (data.results.length != 0) {
                        resolve(data.results)
                    } else {
                        reject("No more results on this page!")
                    }
                })
                .catch((error) => reject(error))
        })
    }
}