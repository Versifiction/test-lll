const express = require("express");
const app = express();
const leboncoin = require("leboncoin-api");
const cors = require("cors");
const bodyParser = require("body-parser");
const nominatim = require("nominatim");

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API du Test LLL de Marc Charpentier");
});

app.post("/getInfos", (req, res) => {
  console.log("/getInfos");
  console.log("body ", req.body);
  // console.log("req ", req)

  if (req.body.min || req.body.max) {
    var search = new leboncoin.Search()
      .setPage(1)
      .setQuery("renove")
      .setFilter(leboncoin.FILTERS.PARTICULIER)
      .setCategory("locations")
      .setRegion("ile_de_france")
      .addSearchExtra("price", { min: req.body.min, max: req.body.max }) // will add a range of price
      .addSearchExtra("furnished", ["1", "Non meublé"]);

    search.run().then(
      function(data) {
        // console.log(data.page); // the current page
        // console.log(data.nbResult); // the number of results for this search
        // console.log(data.results); // the array of results
        data.results[0].getDetails().then(
          function(details) {
            // console.log(details); // the item 0 with more data such as description, all images, author, ...
            res.send(data.results);
            //   console.log("results ", data.results.splice(0, 1));
          },
          function(err) {
            console.error(err);
          }
        );
      },
      function(err) {
        console.error(err);
      }
    );
  }
});

app.listen(5000, () => {
  console.log("Le serveur tourne sur le port 5000");
});
