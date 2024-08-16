import React from 'react';
import ProductForm from '../components/ProductForm';
import BarcodeScanner from '../components/BarcodeScanner.jsx';

const Home = () => {
  // const [camera, setCamera] = useState(false);
  // const [result, setResult] = useState(null);

  // const onDetected = result => {
  //   setResult(result);
  // };

  // return (
  //   <div className="App">
  //     <p>{result ? result : "Scanning..."}</p>
  //     <button onClick={() => setCamera(!camera)}>
  //       {camera ? "Stop" : "Start"}
  //     </button>
  //     <div className="container">
  //       {camera && <BarcodeScanner onDetected={onDetected} />}
  //     </div>
  //     {result}
  //   </div>
  // );

  return(
    <ProductForm />
  )
};

export default Home;