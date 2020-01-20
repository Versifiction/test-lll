import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "pigeon-maps";
import Marker from "pigeon-marker";
import Overlay from "pigeon-overlay";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [city, setCity] = useState();
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [maximumPrice, setMaximumPrice] = useState(0);
  const [longitude, setLongitude] = useState(2.4);
  const [latitude, setLatitude] = useState(47.0833);
  const [sideNavActive, setSideNavActive] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log("city ", city);
    console.log("longitude ", longitude);
    console.log("latitude ", latitude);
  }, [city, longitude, latitude]);

  async function getResults(e) {
    e.preventDefault();

    const info = {
      min: Number(minimumPrice),
      max: Number(maximumPrice)
    };

    console.log("info ", info);

    try {
      const data = await axios.post("http://localhost:5000/getinfos", info);
      console.log("data ", data);

      setResults(data.data);
      console.log("results ", data.data);
    } catch (e) {
      console.error(e);
    }
  }
  function resetFields() {
    setMinimumPrice(0);
    setMaximumPrice(0);
    setLongitude(2.4);
    setLatitude(47.0833);
    setCity();
    setResults([]);
  }

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexWrap: "nowrap",
        position: "relative",
        width: "100%",
        height: "100vh"
      }}
    >
      <Map center={[latitude, longitude]} zoom={6}>
        {city && (
          <Marker
            anchor={[latitude, longitude]}
            payload={1}
            onClick={({ event, anchor, payload }) => {}}
          />
        )}
      </Map>
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
            <div className="row">
              <div style={{ marginBottom: "50px" }}>
                Veuillez rentrer un prix minimum ou un prix maximum, et obtenez
                les 5 premiers résultats d'annonces Leboncoin correspondant à
                ces critères :
                <ul>
                  <li>catégorie Locations</li>
                  <li>en ïle-de-France</li>
                  <li>non meublé</li>
                  <li>
                    avec un prix compris entre{" "}
                    <span style={{ color: "#0CD0FC" }}>{minimumPrice}</span>
                    &nbsp;€ et&nbsp;
                    <span style={{ color: "#0CD0FC" }}>{maximumPrice}</span>
                    &nbsp;€
                  </li>
                </ul>
              </div>
              <form onSubmit={getResults} autoComplete="off" method="post">
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="minimum-price"
                      type="number"
                      name="minimumPrice"
                      placeholder="Entrez votre prix minimum"
                      value={minimumPrice}
                      onChange={e => setMinimumPrice(e.target.value)}
                      style={{ backgroundColor: "transparent !important" }}
                      required
                    />
                    <label htmlFor="email">Prix minimum</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="maximum-price"
                      type="number"
                      name="maximumPrice"
                      placeholder="Entrez votre prix maximum"
                      value={maximumPrice}
                      onChange={e => setMaximumPrice(e.target.value)}
                      style={{ backgroundColor: "transparent !important" }}
                      required
                    />
                    <label htmlFor="email">Prix maximum</label>
                  </div>
                </div>
                <div className="row">
                  <div className="col s12" style={{ textAlign: "center" }}>
                    <button
                      className="btn waves-effect waves-light"
                      type="submit"
                      name="action"
                    >
                      Rechercher
                      <i className="material-icons right">send</i>
                    </button>
                  </div>
                </div>
                {results.length > 0 && (
                  <div className="row">
                    <div
                      className="col s12"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <i
                        className="material-icons right"
                        style={{ cursor: "pointer" }}
                        onClick={resetFields}
                        title="Réinitialiser la recherche"
                      >
                        autorenew
                      </i>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </ul>
      {results.length > 0 && (
        <div
          id="results"
          style={{
            position: "absolute",
            bottom: "0",
            width: "calc(100% - 300px)",
            display: "flex",
            flexWrap: "wrap",
            backgroundColor: "#414141"
          }}
        >
          {results.slice(0, 5).map(result => (
            <div
              className="result"
              key={result.id}
              style={{
                color: "white",
                textAlign: "center",
                padding: "20px",
                width: "20%"
              }}
            >
              <a href={result.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={result.images[0]}
                  alt={`Annonce ${result.id}`}
                  title={`Annonce ${result.id}`}
                  style={{ height: "100px" }}
                />
                <p style={{ fontWeight: "bold", color: "white" }}>
                  {result.title}
                </p>
                <p style={{ color: "#bbb" }}>{result.location.city_label}</p>
              </a>
              <div
                style={{
                  color: "#0CD0FC",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onClick={e => {
                  setCity(result.location.city_label);
                  setLongitude(result.location.lng);
                  setLatitude(result.location.lat);
                  // getAnchor(e);
                }}
              >
                <p>Voir sur la carte</p>
                <i className="material-icons right">place</i>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
