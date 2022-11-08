/**
 * @param {number} x Coordinate for x position of a node
 * @param {number} y Coordinate for y position of a node
 */
export class Node {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

/**
 * @param {number} x Coordinate for x position of a shelf(top left corner - start point)
 * @param {number} y Coordinate for y position of a shelf(top left corner - start point)
 * @param {number} height Height of a shelf
 * @param {number} width Width of a shelf
 * @param {string} color Color of a shelf
 */
export class Shelf {
    constructor(x, y, height, width, color) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
    }
}

/**
 * @param {string} id Unique id
 * @param {number} x Coordinate for x position on a shelf(top left corner - start point)
 * @param {number} y Coordinate for y position on a shelf(top left corner - start point)
 * @param {number} height Height of the product
 * @param {number} width Width of the product
 * @param {boolean} isSelected True if the instance is of the product that we are looking for
 */
export class Product {
    constructor(id, x, y, height, width, selected) {
        this.id = id
        this.x = x
        this.y = y
        this.height = height,
        this.width = width
        this.isSelected = selected
    }
}