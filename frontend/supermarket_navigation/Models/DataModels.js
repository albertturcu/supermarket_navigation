export class DropdownElement {
    constructor(label, value) {
        this.label = label
        this.value = value
    }
}

export class Product {
    constructor(name, brand, category) {
        this.name = name
        this.brand = brand
        this.category = category
    }
}

export class FrontendProduct extends Product {
    constructor(id, name, brand, price, category, xPosition, yPosition, path, shelfWidth, shelfHeight) {
        super(name, brand, category)
        this.id = id
        this.price = price
        this.xPosition = xPosition
        this.yPosition = yPosition
        this.path = path
        this.shelfWidth = shelfWidth
        this.shelfHeight = shelfHeight
    }
}

export class BackendProduct extends Product {
    constructor(id, name, brand, price, category, xPosition, yPosition) {
        super(name, brand, category)
        this.uniq_id = id
        this.list_price = price
        this.position_x = xPosition
        this.position_y = yPosition
    }
}