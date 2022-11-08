import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Rect, Path } from 'react-native-svg';
import { Node, Shelf } from '../Models/LayoutModel'

export default function PathView({navigation, route}) {
    const [item, setItem] = useState(null)
    const [path, setPath] = useState(null)

    useEffect(() => {
        fetchProduct()
    }, [])


    const fetchProduct = async () => {
        try {
            const response = await fetch('https://supermarket-navigation.herokuapp.com/product?id=' + route.params.id);
            const json = await response.json();
            setItem(json.data)
            const pathForSVG = json.data.path.map((point) => {
                if (point != 0) {
                    // add coordinates for SVG path, L stands for LineTo in SVG path
                    return `L${GRAPH_NODES[point].x} ${GRAPH_NODES[point].y}`
                } else {
                    // for the node 0, from which we start for now, add coordinates with M that stands for MoveTo since the path needs to start from here
                    return `M${GRAPH_NODES[point].x} ${GRAPH_NODES[point].y}`
                }
            })
            setPath(pathForSVG.toString())
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <View>
            { item != null ?
            <View>
                <Text>Name: {item.name}</Text>
                <Svg height='80%' width='100%' viewBox='0 0 180 380'>
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
                                />)
                        })
                    }
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

            </View>
            : null}
        </View>
    )
}

const shelves = [
    new Shelf(0, 112, 97, 20, 'grey'),
    new Shelf(0, 20, 70, 20, 'green'),
    new Shelf(20, 0, 20, 38, 'green'),
    new Shelf(50, 50, 20, 40, 'green'),
    new Shelf(58, 0, 20, 52, 'green'),
    new Shelf(90, 50, 20, 40, 'green'),
    new Shelf(110, 0, 20, 30, 'green'),
    new Shelf(140, 0, 20, 20, 'green'),
    new Shelf(160, 20, 47, 20, 'green'),
    new Shelf(160, 67, 47, 20, 'green'),
    new Shelf(160, 114, 30, 20, 'green'),
    new Shelf(160, 144, 30, 20, 'green'),
    new Shelf(110, 120, 20, 20, 'green'),
    new Shelf(70, 70, 20, 60, 'green'),
    new Shelf(90, 120, 20, 20, 'green'),
    new Shelf(70, 120, 20, 20, 'green'),
    new Shelf(50, 70, 20, 20, 'green'),
    new Shelf(50, 120, 20, 20, 'green'),
    new Shelf(50, 140, 20, 40, 'green'),
    new Shelf(50, 190, 20, 80, 'yellow'),
    new Shelf(90, 140, 20, 40, 'green'),
    new Shelf(160, 174, 30, 20, 'green'),
    new Shelf(160, 204, 44, 20, 'pink'),
    new Shelf(160, 248, 32, 20, 'lightblue'),
    new Shelf(160, 280, 70, 20, 'red'),
    new Shelf(130, 350, 20, 30, 'red'),
    new Shelf(110, 315, 35, 20, 'red'),
    new Shelf(110, 280, 35, 20, 'red'),
    new Shelf(90, 260, 20, 40, 'blue'),
    new Shelf(50, 210, 20, 80, 'yellow'),
    new Shelf(50, 260, 20, 40, 'grey'),
    new Shelf(50, 280, 70, 20, 'orange'),
    new Shelf(20, 350, 20, 30, 'orange'),
    new Shelf(0, 280, 70, 20, 'orange'),
    new Shelf(0, 230, 50, 20, 'orange')
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