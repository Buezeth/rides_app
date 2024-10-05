import React, { useEffect, useRef, useState } from 'react'
import CarIcon from './CarIcon'
import { advanceCoord, getNextCoordIndex, getRotation, getTurnDistance, countTurns, getDirection } from '../Utils/Movement'
import { wait } from '../Utils/Wait';
import config from '../Utils/Config';

const { fetchInterval, refreshInterval, turnDuration} = config

// const fetchInterval = 1000;
// const refreshInterval = 33;


export default function Car({ actual, path, squareSize}) {
    const [position, setPosition] = useState(actual)
    const [rotationState, setRotationState] = useState(getRotation(path, 1))
    const [start_Index, setStart_Index] = useState(0)
    const [moveBusy, setMoveBusy] = useState(false)
    const prevNextRef = useRef(actual)
    let rotateBusy = false

    const [latestUpdateAt, setLatestUpdateAt] = useState(0)
    
    // Rotation function
    const rotate = async(section, i) => {
      
      rotateBusy = true
      
      let targetRotation = getRotation(section, i)

      const direction = getDirection(section, i)
      
      setRotationState(targetRotation)

      rotateBusy = false
    }

    // Move function
    const move = async (receivedAt, latestUpdateAt) => {

      while (moveBusy) {
        await wait(100);
        if (receivedAt !== latestUpdateAt) return;
      }
  
      setMoveBusy(true);

      let [currX, currY] = position
      
      // I modified start index, rember to set it to default if needed
      // const startIndex = getNextCoordIndex(curX, curY, path)
      const startIndex = start_Index
      const endIndex = path.findIndex(([x, y]) => {
        return x === actual[0] && y === actual[1]
      })
      setStart_Index(endIndex + 1)
      // console.log("startIndex: " + startIndex + " endIndex: " + endIndex)
      const section = path.slice(startIndex, endIndex + 1)
      const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1)
      
      // Rotation
      const turnCount = countTurns(section);
      const turnsDuration = turnCount * turnDuration;
      // steps before rotation
      // const steps = fetchInterval / refreshInterval
      // steps after rotation
      const steps = (fetchInterval - turnsDuration) / refreshInterval;
      const increment = distance / steps


      
      for (let i = 0; i < section.length; i++) {

        if (i > 0) {
          while (rotateBusy) {
            await wait(refreshInterval);
          }
          await rotate(section, i);
        }

        const [nextX, nextY] = section[i]
        
        setPosition([nextX, nextY])
        await wait(refreshInterval)

      }

      setMoveBusy(false)

    }


    useEffect(() => {
      if(prevNextRef.current === actual) return
      const receivedAt = Date.now()
      setLatestUpdateAt(receivedAt)
      move(receivedAt, latestUpdateAt)
      prevNextRef.current = actual
    }, [actual])


    const [x, y] = position

    

  return (
    <>
        <CarIcon x={x * squareSize - 20} y={y * squareSize - 20} rotation={rotationState} />
    </>
  )
}
