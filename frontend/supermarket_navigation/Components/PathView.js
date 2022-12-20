import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Rect, Path, Text as TextSVG } from 'react-native-svg';
import { Node, Shelf, Product } from '../Models/LayoutModel'
import StoreServices from '../services/storeServices';

const api = new StoreServices

export default function PathView({route}) {
    const [item, setItem] = useState({name: null, brand: null, price: null, category: null})
    const [path, setPath] = useState(null)
    const [shelfLayout, setShelfLayout] = useState(null)

    useEffect(() => {
        api.getProduct(route.params.id)
            .then((response) => {
                setItem({
                    name: response.name,
                    brand: response.brand,
                    price: response.price,
                    category: response.category
                })
                const pathForSVG = response.path.map((point) => {
                    if (point != 0) {
                        // add coordinates for SVG path, L stands for LineTo in SVG path
                        return `L${GRAPH_NODES[point].x} ${GRAPH_NODES[point].y}`
                    } else {
                        // for the node 0, from which we start for now, add coordinates with M that stands for MoveTo since the path needs to start from here
                        return `M${GRAPH_NODES[point].x} ${GRAPH_NODES[point].y}`
                    }
                })
                setPath(pathForSVG.toString())
                setShelfLayout(calculateSelectedShelfLayout(response.shelfHeight, response.shelfWidth, response.xPosition, response.yPosition))
                console.log(response.id)
            })
            .catch((error) => console.error(error))
    }, [])

    return (
        <View>
            { item.name != null ?
            <View>
                <Text>Name: {item.name}</Text>
                <Svg height='70%' width='100%' viewBox='0 0 180 380'>
                    {
                        shelves.map((shelve, key) => {
                            return (
                                <Rect
                                    key={key}
                                    x={shelve.x}
                                    y={shelve.y}
                                    height={shelve.height}
                                    width={shelve.width}
                                    fill={shelve.color}
                                />
                            )
                        })
                    }
                    {/* {
                        shelves.map((shelve, key) => {
                            return (// TODO FIGURE OUT THE TEXT...
                                <TextSVG
                                    key={key}
                                    x={shelve.x}
                                    y={shelve.y + 10}
                                    textAnchor='baseline'
                                    fontSize='7'
                                    fontWeight={25}
                                >
                                    {shelve.name}
                                </TextSVG>
                            )
                        })
                    } */}
                    {
                        path != null ?
                            <Path 
                                d={path}
                                fill='none'
                                stroke="red"
                                strokeWidth={3}
                            />
                        :
                            null
                    }
                </Svg>
                <Svg height='20%' width='100%' viewBox='0 0 300 100'>
                    <Rect 
                        x='0'
                        y='0'
                        height='100'
                        width='300'
                        stroke='black'
                        fill='red'
                        strokeWidth='2'
                    />
                    {
                        shelfLayout != null ?
                            shelfLayout.map((product) => {
                                return (
                                    <Rect
                                        key={product.id}
                                        x={product.x}
                                        y={product.y}
                                        height={product.height}
                                        width={product.width}
                                        stroke='pink'
                                        fill={product.isSelected ? 'red' : 'orange'}
                                    />
                                )
                            })
                        :
                        null
                    }
                </Svg>
            </View>
            : null}
        </View>
    )
}

const calculateSelectedShelfLayout = (shelfHeight, shelfWidth, selectedColumn, selectedRow) => {
    // set total height and width from SVG
    // TODO figure out a way to remove this hardcoded value and connect it with the svg viewbox values
    let totalWidth = 300
    let totalHeight = 100

    // start x,y coordinates from 0(top left corner)
    let x = 0
    let y = 0

    //calculate width and height of each product in the shelf
    let width = totalWidth / (shelfWidth + 1)
    let height = totalHeight / (shelfHeight + 1)

    let productsArray = []

    let selectedId = `${selectedRow}-${selectedColumn}`

    // loop through the shelf width and height, which corresponds to how many rows and columns with items does the shelf have
    for (let i=0; i<shelfHeight + 1; i++) {
        for (let j=0; j<shelfWidth + 1; j++) {
            // need a unique id to assign as an element key when drawing svg
            let id = `${i}-${j}`
            let isSelected = id == selectedId ? true : false
            let tempProduct = new Product(id, x, y, height, width, isSelected)
            console.log(tempProduct)
            productsArray.push(tempProduct)
            // increase the x for the next product in the same row
            x += width
        }
        // increase height to move into the next row
        y += height
        // reset the x coordinate to start at the begining of the next row
        x = 0
    }
    return productsArray
}

const shelves = [
    new Shelf(0, 112, 97, 20, 'grey', 'Checkout'),
    new Shelf(0, 20, 70, 20, 'green', 'Seafood'),
    new Shelf(20, 0, 20, 38, 'green', 'Milk'),
    new Shelf(50, 50, 20, 40, 'green', 'Chocolate'),
    new Shelf(58, 0, 20, 52, 'green', 'Fresh Meat'),
    new Shelf(90, 50, 20, 40, 'green', 'Snacks'),
    new Shelf(110, 0, 20, 30, 'green', 'Frozen Food'),
    new Shelf(140, 0, 20, 20, 'green', 'Eggs & Cheese'),
    new Shelf(160, 20, 47, 20, 'green', 'Fruits'),
    new Shelf(160, 67, 47, 20, 'green', 'Vegetables'),
    new Shelf(160, 114, 30, 20, 'green', 'Gluten-free'),
    new Shelf(160, 144, 30, 20, 'green', 'Pasta'),
    new Shelf(110, 120, 20, 20, 'green', 'Coffee'),
    new Shelf(70, 70, 20, 60, 'green', 'Beverages'),
    new Shelf(90, 120, 20, 20, 'green', 'Tea'),
    new Shelf(70, 120, 20, 20, 'green', 'Spices'),
    new Shelf(50, 70, 20, 20, 'green', 'Nuts'),
    new Shelf(50, 120, 20, 20, 'green', 'Baking'),
    new Shelf(50, 140, 20, 40, 'green', 'Canned Food'),
    new Shelf(50, 190, 20, 80, 'yellow', 'Womens Wear'),
    new Shelf(90, 140, 20, 40, 'green', 'Bakery & Bread'),
    new Shelf(160, 174, 30, 20, 'green', 'Grains'),
    new Shelf(160, 204, 44, 20, 'pink', 'Health & Beauty'),
    new Shelf(160, 248, 32, 20, 'lightblue', 'Pet Care'),
    new Shelf(160, 280, 70, 20, 'red', 'Automotive Replacement Parts'),
    new Shelf(130, 350, 20, 30, 'red', 'Tires'),
    new Shelf(110, 315, 35, 20, 'red', 'Motorcycle'),
    new Shelf(110, 280, 35, 20, 'red', 'Automotive Interior Accessories'),
    new Shelf(90, 260, 20, 40, 'blue', 'Toys'),
    new Shelf(50, 210, 20, 80, 'yellow', 'Mens wear'),
    new Shelf(50, 260, 20, 40, 'grey', 'Electronics'),
    new Shelf(50, 280, 70, 20, 'orange', 'Insect & Pest Control'),
    new Shelf(20, 350, 20, 30, 'orange', 'Outdoor decor'),
    new Shelf(0, 280, 70, 20, 'orange', 'Garden Furniture'),
    new Shelf(0, 230, 50, 20, 'orange', 'Household')
]

const GRAPH_NODES =  {
    0: new Node(20, 101),
    1: new Node(35, 90),
    2: new Node(20, 55),
    3: new Node(34, 35),
    4: new Node(39, 20),
    5: new Node(70, 50),
    6: new Node(84, 20),
    7: new Node(90, 35),
    8: new Node(110, 50),
    9: new Node(125, 20),
    10: new Node(145, 35),
    11: new Node(150, 20),
    12: new Node(160, 43),
    13: new Node(160, 90),
    14: new Node(145, 70),
    15: new Node(130, 105),
    16: new Node(160, 129),
    17: new Node(160, 159),
    18: new Node(120, 120),
    19: new Node(100, 90),
    20: new Node(100, 120),
    21: new Node(145, 210),
    22: new Node(80, 120),
    23: new Node(60, 90),
    24: new Node(60, 120),
    25: new Node(50, 105),
    26: new Node(35, 140), 
    27: new Node(50, 175),
    28: new Node(70, 160),
    30: new Node(90, 190),
    31: new Node(110, 160),
    32: new Node(130, 175),
    33: new Node(145, 140),
    34: new Node(160, 189),
    35: new Node(160, 226),
    36: new Node(160, 264),
    37: new Node(130, 245),
    38: new Node(145, 280),
    39: new Node(160, 315),
    40: new Node(145, 350),
    41: new Node(130, 332),
    42: new Node(130, 297),
    43: new Node(110, 260),
    45: new Node(90, 230),
    46: new Node(70, 260),
    47: new Node(50, 245),
    48: new Node(35, 210),
    49: new Node(35, 280),
    50: new Node(50, 315),
    51: new Node(35, 350),
    52: new Node(20, 315),
    53: new Node(20, 255)
}