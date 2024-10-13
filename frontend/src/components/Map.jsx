import React from 'react'
import obstacles from '../../../shared/Obstacles.js'
// import { obstacles } from '../Utils/Obstacles.js'
import ObstacleDraw from './ObstacleDraw'





export default function Map({gridSize, squareSize}) {
  return (
    <>
            <ObstacleDraw obstacles={obstacles} squareSize={squareSize} />
    </>
  )
}
