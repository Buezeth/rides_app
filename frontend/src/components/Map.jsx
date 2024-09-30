import React from 'react'
import { obstacles } from '../Utils/Obstacles'
import ObstacleDraw from './ObstacleDraw'





export default function Map({gridSize, squareSize}) {
  return (
    <>
            <ObstacleDraw obstacles={obstacles} squareSize={squareSize} />
    </>
  )
}
