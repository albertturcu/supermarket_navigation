import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, {Rect, Path} from 'react-native-svg';

const GRAPH_NODES =  {
    0: {
        x: 20,
        y: 101
    },
    1: {
        x: 35,
        y: 90
    },
    2: {
        x: 20,
        y: 55
    },
    3: {
        x: 34,
        y:35
    },
    4: {
        x: 39,
        y: 20
    },
    5: {
        x: 70,
        y: 50
    },
    6: {
        x: 84,
        y: 20
    },
    7: {
        x: 90,
        y: 35
    },
    8: {
        x: 110,
        y: 50
    },
    9: {
        x: 125,
        y: 20
    },
    10: {
        x: 145,
        y: 35
    },
    11: {
        x: 150,
        y: 20
    },
    12: {
        x: 160,
        y: 43
    },
    13: {
        x: 160,
        y: 90
    },
    14: {
        x: 145,
        y: 70
    },
    15: {
        x: 130,
        y: 105
    },
    16: {
        x: 160,
        y: 129
    },
    17: {
        x: 160,
        y: 159
    },
    18: {
        x: 120,
        y: 120
    },
    19: {
        x: 100,
        y: 90
    },
    20: {
        x: 100,
        y: 120
    },
    21: {
        x: 145,
        y: 210
    },
    22: {
        x: 80,
        y: 120
    },
    23: {
        x: 60,
        y: 90
    },
    24: {
        x: 60,
        y: 120
    },
    25: {
        x: 50,
        y: 105
    },
    26: {
        x: 35,
        y: 140
    },
    27: {
        x: 50,
        y: 175
    },
    28: {
        x: 70,
        y: 160
    },
    30: {
        x: 90,
        y: 190
    },
    31: {
        x: 110,
        y: 160
    },
    32: {
        x: 130,
        y: 175
    },
    33: {
        x: 145,
        y: 140
    },
    34: {
        x: 160,
        y: 189
    },
    35: {
        x: 160,
        y: 226
    },
    36: {
        x: 160,
        y: 264
    },
    37: {
        x: 130,
        y: 245
    },
    38: {
        x: 145,
        y: 280
    },
    39: {
        x: 160,
        y: 315
    },
    40: {
        x: 145,
        y: 350
    },
    41: {
        x: 130,
        y: 332
    },
    42: {
        x: 130,
        y: 297
    },
    43: {
        x: 110,
        y: 260
    },
    45: {
        x: 90,
        y: 230
    },
    46: {
        x: 70,
        y: 260
    },
    47: {
        x: 50,
        y: 245
    },
    48: {
        x: 35,
        y: 210
    },
    49: {
        x: 35,
        y: 280
    },
    50: {
        x: 50,
        y: 315
    },
    51: {
        x: 35,
        y: 350
    },
    52: {
        x: 20,
        y: 315
    },
    53: {
        x: 20,
        y: 255
    }
}

export default function Item({navigation, route}) {
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
            console.log(json.data.path)
            const pathForSVG = json.data.path.map((point) => {
                if (point != 0) {
                    return `L${GRAPH_NODES[point].x} ${GRAPH_NODES[point].y}`
                } else {
                    return `M${GRAPH_NODES[point].x} ${GRAPH_NODES[point].y}`
                }
            })
            console.log(pathForSVG.join(' '))
            setPath(pathForSVG.toString())
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <View>
            <Text>Item ID: {route.params.id}</Text>
            { item != null ?
            <View>
                <Text>Name: {item.name}</Text>
                <Text>Path: {item.path.join(" -> ")}</Text> 
                <Svg height='90%' width='100%' viewBox='0 0 180 380'>
                    <Rect
                        id='checkout'
                        x="0"
                        y="112"
                        width="20"
                        height="97"
                        fill="grey"
                    />
                    <Rect
                        id='0'
                        x="0"
                        y="90"
                        width="20"
                        height="22"
                        fill="white"
                    />
                    <Rect
                        id='exit'
                        x="0"
                        y="209"
                        width="20"
                        height="21"
                        fill="white"
                    />
                    <Rect
                        id='2'
                        x="0"
                        y="20"
                        width="20"
                        height="70"
                        fill="green"
                    />
                    <Rect
                        id='4'
                        x="20"
                        y="0"
                        width="38"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='5'
                        x="50"
                        y="50"
                        width="40"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='6'
                        x="58"
                        y="0"
                        width="52"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='8'
                        x="90"
                        y="50"
                        width="40"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='9'
                        x="110"
                        y="0"
                        width="30"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='11'
                        x="140"
                        y="0"
                        width="20"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='12'
                        x="160"
                        y="20"
                        width="20"
                        height="47"
                        fill="green"
                    />
                    <Rect
                        id='13'
                        x="160"
                        y="67"
                        width="20"
                        height="47"
                        fill="green"
                    />
                    <Rect
                        id='16'
                        x="160"
                        y="114"
                        width="20"
                        height="30"
                        fill="green"
                    />
                    <Rect
                        id='17'
                        x="160"
                        y="144"
                        width="20"
                        height="30"
                        fill="green"
                    />
                    <Rect
                        id='18'
                        x="110"
                        y="120"
                        width="20"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='19'
                        x="70"
                        y="70"
                        width="60"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='20'
                        x="90"
                        y="120"
                        width="20"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='22'
                        x="70"
                        y="120"
                        width="20"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='23'
                        x="50"
                        y="70"
                        width="20"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='24'
                        x="50"
                        y="120"
                        width="20"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='28'
                        x="50"
                        y="140"
                        width="40"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='30'
                        x="50"
                        y="190"
                        width="80"
                        height="20"
                        fill="yellow"
                    />
                    <Rect
                        id='31'
                        x="90"
                        y="140"
                        width="40"
                        height="20"
                        fill="green"
                    />
                    <Rect
                        id='34'
                        x="160"
                        y="174"
                        width="20"
                        height="30"
                        fill="green"
                    />
                    <Rect
                        id='35'
                        x="160"
                        y="204"
                        width="20"
                        height="44"
                        fill="pink"
                    />
                    <Rect
                        id='36'
                        x="160"
                        y="248"
                        width="20"
                        height="32"
                        fill="lightblue"
                    />
                    <Rect
                        id='39'
                        x="160"
                        y="280"
                        width="20"
                        height="70"
                        fill="red"
                    />
                    <Rect
                        id='40'
                        x="130"
                        y="350"
                        width="30"
                        height="20"
                        fill="red"
                    />
                    <Rect
                        id='41'
                        x="110"
                        y="315"
                        width="20"
                        height="35"
                        fill="red"
                    />
                    <Rect
                        id='42'
                        x="110"
                        y="280"
                        width="20"
                        height="35"
                        fill="red"
                    />
                    <Rect
                        id='43'
                        x="90"
                        y="260"
                        width="40"
                        height="20"
                        fill="blue"
                    />
                    <Rect
                        id='45'
                        x="50"
                        y="210"
                        width="80"
                        height="20"
                        fill="yellow"
                    />
                    <Rect
                        id='46'
                        x="50"
                        y="260"
                        width="40"
                        height="20"
                        fill="grey"
                    />
                    <Rect
                        id='50'
                        x="50"
                        y="280"
                        width="20"
                        height="70"
                        fill="orange"
                    />
                    <Rect
                        id='51'
                        x="20"
                        y="350"
                        width="30"
                        height="20"
                        fill="orange"
                    />
                    <Rect
                        id='52'
                        x="0"
                        y="280"
                        width="20"
                        height="70"
                        fill="orange"
                    />
                    <Rect
                        id='53'
                        x="0"
                        y="230"
                        width="20"
                        height="50"
                        fill="orange"
                    />
                    {
                        path != null ?
                            <Path 
                                d={path}
                                fill='none'
                                stroke="red"
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