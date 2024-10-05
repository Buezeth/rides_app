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

  const [previousUpdateAt, setPreviousUpdateAt] = useState(Date.now())
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async() => {
    while (true) {
      // const rides = await api.get('/rides');
      const rides = await getRequest('rides');

      const timeout = 2000;
      const now = Date.now();
      if ((now - previousUpdateAt) > timeout) {
        setPreviousUpdateAt(now)
        setCars({cars: []})
        setRefreshing(true)

        await wait(fetchInterval);
        continue;
      }

      setPreviousUpdateAt(now);

      const cars_db = [];
      for (const ride of rides) {
        const { car_id, location } = ride;
        const path = JSON.parse(ride.path);
        const [x, y] = location.split(':');
        cars_db.push({
          id: car_id,
          path: path,
          actual: [parseInt(x), parseInt(y)],
        });
      }

      setRefreshing(false)
      setCars({cars : cars_db})
      await wait(fetchInterval);
    }
  }

  useEffect(()=>{
    const simulate = async () => {
      // for( const record of records) {
      //   setCars({cars: [record]})
      //   await wait(fetchInterval)
      // }

      await loadData()
    }
  
    simulate()
    // getRequest()

  }, [])


  const carsData = cars.cars.map(({id, actual, path}) => {
    return <Car key={id} actual={actual} squareSize={squareSize} path={path} />
  })

  const actualsColors = {car1: '#10b981', car2: '#6366f1', car3: '#f43f5e'};
    const actuals = cars.cars.map(({ id, actual }) => {
      return (
        <circle 
          key={`${actual[0]}:${actual[1]}`}
          r={squareSize / 2}
          cx={actual[0] * squareSize + (squareSize / 2)}
          cy={actual[1] * squareSize + (squareSize / 2)}
          fill={actualsColors[id]}
        />
      );
    });

  return (
    <>
      <svg
              width={gridSize}
              height={gridSize}
              fill='white'
      >
        <Map gridSize={gridSize} squareSize={squareSize} />
        {carsData}
        {actuals}
      </svg>
    </>
  )
}

export default App
