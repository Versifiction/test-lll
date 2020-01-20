const express = require("express")
const app = express()
const leboncoin = require("leboncoin-api");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors())
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API du Test LLL de Marc Charpentier")
})

app.get("/info", (req, res) => {
    console.log("route info")
    console.log("body ", req.body)
    console.log("req ", req)

    var search = new leboncoin.Search()
    .setPage(1)
    .setQuery("renove")
    .setFilter(leboncoin.FILTERS.PARTICULIER)
    .setCategory("locations")
    .setRegion("ile_de_france")
    .addSearchExtra("price", {min: 1500, max: 2000}) // will add a range of price
    .addSearchExtra('furnished', ["1", "Non meublé"]);

    search.run().then(function (data) {
        // console.log(data.page); // the current page
        // console.log(data.nbResult); // the number of results for this search
        // console.log(data.results); // the array of results
        data.results[0].getDetails().then(function (details) {
            // console.log(details); // the item 0 with more data such as description, all images, author, ...
            res.send(data.results)
            // console.log("results ", data.results.splice(0, 1))
        }, function (err) {
            console.error(err);
        });
    }, function (err) {
        console.error(err);
    });
})

app.listen(5000, () => { console.log("Le serveur tourne sur le port 5000")})