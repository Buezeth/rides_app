import React from 'react'

export default function ObstacleElements({ x, y, size, color }) {
      
  return (
    <>
        <rect
            x={x}
            y={y}
            width={size}
            height={size}
            fill={color}
          />
    </>
  )
}
