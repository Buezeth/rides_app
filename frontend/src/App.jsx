import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from './components/Map'
import Car from './components/Car'
import records from './Utils/records'
import { wait } from './Utils/Wait'
import config from '../../shared/Config.js'
import { getRequest } from './Utils/fetch'
import CustomerIcon from './components/CustomerIcon'
import DestIcon from './components/DestIcon.jsx'

const { gridSize, squareSize, fetchInterval, circleRefreshInterval } = config


function App() {
  
 
  const [cars, setCars] = useState({
    cars: []
  })

  const [previousUpdateAt, setPreviousUpdateAt] = useState(Date.now())
  const [refreshing, setRefreshing] = useState(false)
  const [ridesData, setRidesData] = useState()
  const [customers, setCustomers] = useState({ customer: []})

  const loadData = async() => {
    while (true) {
      const rides = await getRequest('drivers');
      setRidesData(rides)

      const timeout = 2000;
      const now = Date.now();
      // if ((now - previousUpdateAt) > timeout) {
      //   setPreviousUpdateAt(now)
      //   // setCars({cars: []})
      //   setRefreshing(true)

      //   await wait(circleRefreshInterval);
      //   // continue;
      // }

      setPreviousUpdateAt(now);

      const cars_db = [];
      for (const ride of rides) {
        const { driver_id, location } = ride;
        const path = JSON.parse(ride.path);
        const [x, y] = location.split(':');
        cars_db.push({
          id: driver_id,
          path: path,
          actual: [parseInt(x), parseInt(y)],
        });
      }

      setRefreshing(false)
      setCars({cars : cars_db})
      await wait(fetchInterval);
    }
  }

  const loadCustomers = async () => {
    while (true) {
      const customers_db = await getRequest('customers');
      // console.log(customers_db)
      setCustomers({ customer: customers_db });
      await wait(fetchInterval);
    }
  }

  useEffect(()=>{
    const simulate = async () => {
      loadData()
      loadCustomers()
    }
  
    simulate()

  }, [])


  const CarElement = cars.cars.map(({id, actual, path}) => {
    return <Car key={id} actual={actual} squareSize={squareSize} path={path} />
  })



  const customeElement = customers.customer.map(({id, name, location}) => {
    const [x, y] = location.split(":")
    return (
      <CustomerIcon
        key={`${x}:${y}`}
        x={x * squareSize - (squareSize / 2)}
        y={y * squareSize - (squareSize / 2)}
      />)
  })

  const destElems = customers.customer.map(({ destination }) => {
    const [x, y] = destination.split(':');
    return (
      <DestIcon
        key={`${x}:${y}`}
        x={x * squareSize - squareSize / +5}
        y={y * squareSize - squareSize / 2 - 8}
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
        {CarElement}
        {customeElement}
        {destElems}
      </svg>
    </>
  )
}

export default App
