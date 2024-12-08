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

const loadData = async(previousUpdateAtRef, setCars, setRefreshing) => {
  // while (true) {
  //   const rides = await getRequest('drivers');
  //   setRidesData(rides)

  //   const timeout = 2000;
  //   const now = Date.now();

  //   setPreviousUpdateAt(now);

  //   const cars_db = [];
  //   for (const ride of rides) {
  //     const { driver_id, location } = ride;
  //     const path = JSON.parse(ride.path);
  //     const [x, y] = location.split(':');
  //     if(path) {
  //       cars_db.push({
  //         id: driver_id,
  //         path: path,
  //         actual: [parseInt(x), parseInt(y)],
  //       });
  //     }
      
  //   }

  //   setCars({cars : cars_db})
  //   setRefreshing(false)
  //   await wait(fetchInterval);
  // }

  // Test

  while (true) {
    const drivers = await getRequest('drivers');

    const timeout = 2000;
    const now = Date.now();
    if (now - previousUpdateAtRef.current > timeout) {
      previousUpdateAtRef.current = now;
      setCars([]);
      setRefreshing(true);
      await wait(fetchInterval);
      continue;
    }
    previousUpdateAtRef.current = now;

    const cars = [];
    for (const driver of drivers) {
      const { driver_id, status, path_index, location } = driver;
      let path = [];
      if (driver.path) path = JSON.parse(driver.path);
      const [x, y] = location.split(':');
      cars.push({
        driverId: driver_id,
        status,
        actual: [parseInt(x), parseInt(y)],
        path,
        pathIndex: path_index,
      });
    }

    setCars({car: cars});
    // console.log(cars)
    setRefreshing(false);
    await wait(fetchInterval);
  }
}

// const loadCustomers = async (setCustomers) => {

//   while (true) {
//     let customers_db = await getRequest('customers');
//     customers_db = customers_db.filter((c) => {
//       if (!c.location) console.log('no location', c);
//       return c.location;
//     });
//     customers_db = customers_db.map((c) => {
//       const { location } = c;
//       const [x, y] = location.split(':');
//       return { ...c, location: [parseInt(x), parseInt(y)] };
//     });
//     setCustomers({ customer: customers_db });
//     await wait(fetchInterval);
//   }
// }


const loadCustomers = async (setCustomers) => {
  while (true) {
    let customers = await getRequest('customers');
    customers = customers.filter((c) => {
      if (!c.location) console.log('no location', c);
      return c.location;
    });
    customers = customers.map((c) => {
      const { location } = c;
      const [x, y] = location.split(':');
      return { ...c, location: [parseInt(x), parseInt(y)] };
    });
    setCustomers({customer: customers});
    await wait(fetchInterval);
  }
};




function App() {

  const [cars, setCars] = useState({car: []})
  const previousUpdateAtRef = useRef(Date.now())
  const [refreshing, setRefreshing] = useState(false)
  const [ridesData, setRidesData] = useState()
  const [customers, setCustomers] = useState({customer: []})


  useEffect(() => {
    previousUpdateAtRef.current = Date.now();

    loadData(previousUpdateAtRef, setCars, setRefreshing);
    loadCustomers(setCustomers);
  }, []);

  const CarElement = cars.car
  .map(({driverId, actual, path, status}) => {
    return (
    <Car  key={`car-${driverId}`}
    driverId={driverId}
    actual={actual}
    path={path}
    status={status}
    squareSize={squareSize}  />
  )
  })



  // const customeElement = customers.map(({id, name, location}) => {
  //   const [x, y] = location
  //   return (
  //     <CustomerIcon
  //       key={`${x}:${y}`}
  //       x={x * squareSize - (squareSize / 2)}
  //       y={y * squareSize - (squareSize / 2)}
  //     />)
  // })

  const seenCustomers = new Set();
  const customerElement = cars.car
    .filter(({ status }) => status === 'pickup')
    .map(({ path }) => {
      if (!path || path.length === 0) return null;

      const [x, y] = path[path.length - 1];
      seenCustomers.add(`${x}:${y}`);
      return (
        <CustomerIcon
          key={`c1-${x}:${y}`}
          x={x * squareSize - squareSize * 0.75}
          y={y * squareSize - squareSize * 0.75}
        />
      );
    });

  customers.customer.forEach(({ location }) => {
    const [x, y] = location;
    if (seenCustomers.has(`${x}:${y}`)) return;
    customerElement.push(
      <CustomerIcon
        key={`c2-${x}:${y}`}
        x={x * squareSize - squareSize / 2}
        y={y * squareSize - squareSize / 2}
      />
    );
  });

  // const destElems = customers.map(({ destination }) => {
  //   const [x, y] = destination.split(':');
  //   return (
  //     <DestIcon
  //       key={`${x}:${y}`}
  //       x={x * squareSize - squareSize / +5}
  //       y={y * squareSize - squareSize / 2 - 8}
  //     />
  //   );
  // });

  // const pathElems = cars.cars.map(({ path }) => {
  //   return path.map((coordPair) => {
  //     const [x, y] = coordPair;
  //     return (
  //       <circle
  //         key={`${x}:${y}`}
  //         width={squareSize / 4}
  //         height={squareSize / 4}
  //         r={squareSize / 6}
  //         cx={x * squareSize + squareSize / 2}
  //         cy={y * squareSize + squareSize / 2}
  //         fill={"gray"}
  //         stroke={"gray"}
  //       />
  //     );
  //   });
  // });
  
  const destElems = cars.car
    .filter(({ status }) => status === 'enroute')
    .map(({ driverId, path }) => {
      const [x, y] = path[path.length - 1];
      return (
        <DestIcon
          key={`d-${driverId}-${x}:${y}`}
          x={x * squareSize - 5}
          y={y * squareSize - 15}
        />
      );
    });


  const pathElems = cars.car.map(({ driverId, path, status }) => {
    let points = '';

    path.forEach(([x, y]) => {
      points += `${x * squareSize + squareSize / 4},${
        y * squareSize + squareSize / 4
      } `;
    });

    return (
      <polyline
        key={`path-${driverId}`}
        points={points}
        style={{
          fill: 'none',
          stroke: `${status === 'enroute' ? '#454545' : '#adaaaa'}`,
          strokeWidth: 4,
        }}
      />
    );
  });
  
  
  // useEffect(()=>{
  //   const simulate = async () => {
  //     loadData()
  //     loadCustomers()
  //   }
  
  //   simulate()
  
  // }, [])

  return (
    <div className={`map-refresh ${refreshing ? 'active' : ''}`}>
      <svg
              width={gridSize}
              height={gridSize}
              fill='white'
              viewBox={`0 0 ${gridSize} ${gridSize}`}
      >
        <Map gridSize={gridSize} squareSize={squareSize} />
        {pathElems}
        {CarElement}
        {customerElement}
        {destElems}
      </svg>
    </div>
  )
}

export default App
