import React, { useEffect, useState } from 'react'
import ObstacleElements from './ObstacleElements';


export default function ObstacleDraw({obstacles, squareSize}) {

    const coordsToObstacles = []
    const [cords, setCords] = useState({})

    obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
        let x = xStart;
        while (x <= xEnd) {
          let y = yStart;
            while (y <= yEnd) {
                coordsToObstacles[`${x}:${y}`] = color || '#c1c3c7';
                y++;
            }
            x++;
        }
    });

    const obstacleElemt = []
    for(let color in  coordsToObstacles) {
        const [x, y] = color.split(':')
        obstacleElemt.push(
            <ObstacleElements
                key={`${x}:${y}`}
                x={x * squareSize}
                y={y * squareSize}
                size={squareSize}
                color={coordsToObstacles[color]}
            />
        )
    }
    
      

  return (
    <>
        {obstacleElemt}
    </>

  )
}
