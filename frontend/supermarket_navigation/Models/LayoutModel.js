/**
 * @param {number} x Coordinate for x position of a node
 * @param {number} y Coordinate for y position of a node
 */
export class Node {
    x;
    y;

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
    x;
    y;
    height;
    width;
    color;

    constructor(x, y, height, width, color) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
    }
}