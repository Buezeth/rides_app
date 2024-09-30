import React, { useEffect, useRef, useState } from 'react'
import CarIcon from './CarIcon'
import { advanceCoord, getNextCoordIndex, getRotation, getTurnDistance, countTurns, getDirection } from '../Utils/Movement'
import { wait } from '../Utils/Wait';
import config from '../Utils/Config';

const { fetchInterval, refreshInterval, turnDuration} = config

// const fetchInterval = 1000;
// const refreshInterval = 33;


export default function Car({next, path, squareSize}) {
    const [position, setPosition] = useState(next)
    const [rotationState, setRotationState] = useState(getRotation(path, 1))
    const [start_Index, setStart_Index] = useState(0)
    const prevNextRef = useRef(next)
    let rotateBusy = false
    // console.log(rotationState)
    
    // Rotation function
    const rotate = async(section, i) => {
      rotateBusy = true
      
      let rotations = rotationState
      let targetRotation = getRotation(section, i)
      
      if(rotationState === targetRotation) return rotateBusy = false

      const { distClockwise, distCounterclockwise } = getTurnDistance(rotations, targetRotation)
      const isClockwise = distClockwise < distCounterclockwise


      const diff = Math.min(distClockwise, distCounterclockwise)
      const steps = turnDuration / refreshInterval
      const increment = diff / steps

      // while(rotationState !== targetRotation) {
      //   if(isClockwise) rotations += increment
      //   else rotations -= increment

      //   if (rotations > 360) rotations = 0
      //   else if (rotations < 0) rotations = 

      //   setRotationState(rotations)
      //   await wait(refreshInterval)
      // }

      const direction = getDirection(section, i)
      
      setRotationState(targetRotation)


      rotateBusy = false
    }

    // Move function
    const move = async () => {

      let [currX, currY] = position
      
      // I modified start index, rember to set it to default if needed
      // const startIndex = getNextCoordIndex(curX, curY, path)
      const startIndex = start_Index
      const endIndex = path.findIndex(([x, y]) => {
        return x === next[0] && y === next[1]
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
        // console.log("currX: " + currX + " currY: " + currY)

        // while(currX !== nextX) {
        //   // if (next !== prevNextRef) return
          
        //   currX = advanceCoord(nextX, currX, increment)
        //   setPosition([currX, position[1]])
        //   await wait(refreshInterval)
        // }
        
        // while(currY !== nextY) {
        //   // if (next !== prevNextRef) return
          
        //   currY = advanceCoord(nextY, currY, increment)
        //   setPosition([position[0], currY])
        //   await wait(refreshInterval)
        // }

        // currX = advanceCoord(nextX, currX, increment)
        // currY = advanceCoord(nextY, currY, increment)
        // await wait(refreshInterval)
        setPosition([nextX, nextY])
        await wait(refreshInterval)
        

      }

      // for(const sections of section) {
      //   // setPosition(paths)
      //   const [nextX, nextY] = sections
      //   currX = advanceCoord(nextX, currX, increment)
      //   currY = advanceCoord(nextY, currY, increment)
      //   await wait(refreshInterval)
      //   await wait(refreshInterval)
      //   setPosition([nextX, nextY])
      //   console.log(sections)
      //   await wait(refreshInterval)
      //   await wait(refreshInterval)
      // }
    }


    useEffect(() => {
      if(prevNextRef.current === next) return
      move()
      prevNextRef.current = next
    }, [next])


    const [x, y] = position

    

  return (
    <>
        <CarIcon x={x * squareSize - 20} y={y * squareSize - 20} rotation={rotationState} />
    </>
  )
}
