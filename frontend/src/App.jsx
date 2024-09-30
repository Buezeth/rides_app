import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from './components/Map'
import Car from './components/Car'
import records from './Utils/records'
import { wait } from './Utils/Wait'
import config from './Utils/Config'
import { getRequest } from './Utils/fetch'

const {gridCount, gridSize, squareSize, fetchInterval} = config


function App() {
  
 
  const [cars, setCars] = useState({
    cars: []
  })

  useEffect(()=>{
    const simulate = async () => {
      for( const record of records) {
        setCars({cars: [record]})
        await wait(fetchInterval)
      }
    }
  
    simulate()
    // getRequest()

  }, [])


  const carsData = cars.cars.map(({id, next, path}) => {
    return <Car key={id} next={next} squareSize={squareSize} path={path} />
  })

  return (
    <>
      <svg
              width={gridSize}
              height={gridSize}
              fill='white'
      >
        <Map gridSize={gridSize} squareSize={squareSize} />
        {carsData}
      </svg>
    </>
  )
}

export default App
