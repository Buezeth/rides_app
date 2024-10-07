import React, { useEffect, useRef, useState } from 'react'
import CarIcon from './CarIcon'
import { getRotation} from '../Utils/Movement'
import { wait } from '../Utils/Wait';
import config from '../../../_config/Config';

const { refreshInterval} = config



export default function Car({ actual, path, squareSize}) {
    const [position, setPosition] = useState(actual)
    const [rotationState, setRotationState] = useState(getRotation(path, 1))
    const [start_Index, setStart_Index] = useState(0)
    const [moveBusy, setMoveBusy] = useState(false)
    const prevNextRef = useRef(actual)
    let rotateBusy = false

    const [latestUpdatesAt, setLatestUpdatesAt] = useState()
    
    // Rotation function
    const rotate = async(section, i) => {
      
      rotateBusy = true
      
      let targetRotation = getRotation(section, i)
      
      setRotationState(targetRotation)

      rotateBusy = false
    }

    // Move function
    const move = async (receivedAt, latestUpdateAt) => {
        // await wait(00); 

      while (moveBusy) {
        await wait(100); 
        if (receivedAt !== latestUpdateAt) {
          // console.log("recievedAt not equal latestUpdate")
          return
        };
      }
  
      setMoveBusy(true);
      
      const startIndex = start_Index
      const endIndex = path.findIndex(([x, y]) => {
        return x === actual[0] && y === actual[1]
      })

      setStart_Index(endIndex + 1)
      const section = path.slice(startIndex, endIndex + 1)

  
      for (let i = 0; i < section.length; i++) {

        if (i > 0) {
          // while (rotateBusy) {
          //   await wait(refreshInterval);
          // }
          await rotate(section, i);
        }

        const [nextX, nextY] = section[i]
        
        setPosition([nextX, nextY])
        await wait(refreshInterval)

      }

      setMoveBusy(false)

    }


    useEffect(() => {
      // if(prevNextRef.current === actual) return
      const receivedAt = Date.now()
      setLatestUpdatesAt(receivedAt)
      move(receivedAt, latestUpdatesAt)
      prevNextRef.current = actual
    }, [actual])


    const [x, y] = position

    

  return (
    <>
        <CarIcon x={x * squareSize - 20} y={y * squareSize - 20} rotation={rotationState} />
    </>
  )
}
