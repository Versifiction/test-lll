import React, { useEffect, useState } from 'react';
import axios from "axios";
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import Overlay from 'pigeon-overlay'

import logo from './logo.svg';
import './App.css';

function App() {
  const [minimumPrice, setMinimumPrice] = useState(0)
  const [maximumPrice, setMaximumPrice] = useState(0)
  const [sideNavActive, setSideNavActive] = useState(true)
  const [results, setResults] = useState([])

  useEffect(() => {
    console.log("min ", minimumPrice)
    console.log("max ", maximumPrice)
    console.log("results ", results)
  }, [minimumPrice, maximumPrice, results])

  async function getResults(e) {
    e.preventDefault()

    const info = {
      min: minimumPrice,
      max: maximumPrice
    }

    console.log("info ", info)

    try {
      const data = await axios("http://localhost:5000/info", info)
      console.log("data ", data)

      setResults(data.data)
      console.log("results ", data.data)
    } catch (e) {
      console.error(e)
    }
  }

  function toggleSideNav() {
    setSideNavActive(!sideNavActive);
  }

  return (
    <div className="App" style={{ display: "flex", flexWrap: "nowrap"}}>
      <Map center={[47.0833, 2.4]} defaultCenter={[47.0833, 2.4]} zoom={6} width={1900} height={600}></Map>
      <ul
        id="slide-out"
        className="sidenav dark"
        style={{ transform: sideNavActive ? "translateX(0%)" : "" }}
        // onClick={toggleSideNav}
      >
        <div
          className="subnav"
          style={{ position: "relative", height: "100%" }}
        >
          <div className="container" style={{ paddingTop: "20px" }}>
          <div className="row"><form onSubmit={getResults}><div className="row">
          <div className="input-field col s12">
            <input
              id="minimum-price"
              type="number"
              name="minimum"
              placeholder="Entrez votre prix minimum"
              value={minimumPrice}
              onChange={(e) => setMinimumPrice(e.target.value)}
              style={{ backgroundColor: "transparent !important" }}
              required
            />
            <label htmlFor="email">Prix minimum</label>
          </div></div>
          <div className="row">
          <div className="input-field col s12">
            <input
              id="maximum-price"
              type="number"
              name="maximum"
              placeholder="Entrez votre prix maximum"
              value={maximumPrice}
              onChange={(e) => setMaximumPrice(e.target.value)}
              style={{ backgroundColor: "transparent !important" }}
              required
            />
            <label htmlFor="email">Prix maximum</label>
          </div></div>
          <div className="row">
          <div className="col s12" style={{ textAlign: "center"}}>
          <button className="btn waves-effect waves-light" type="submit" name="action">Rechercher
            <i className="material-icons right">send</i>
          </button>
          </div></div>
        </form>
        </div>
        </div>
       </div>
      </ul>
      {results.length > 0 && (
        <div id="results">
          {results.slice(0, 5).map(result => (
            <div className="result" key={result.id} style={{ display: "flex", flexGrow: "1", backgroundColor: "#414141"}}>
              {result.location.city_label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
