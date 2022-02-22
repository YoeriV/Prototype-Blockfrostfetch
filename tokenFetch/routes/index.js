const express = require('express')
const router = express.Router()
const axios = require("axios");
require('dotenv').config();

const API = process.env.API_KEY;

function hex_to_ascii(str1)
 {
  var hex  = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
 }

router.get('/', (req, res) => {
  let assets = []
  let minttxs = []
  let assetnames = []
  let finalresponse = []
        axios({
            method: 'get',
            url : "https://cardano-mainnet.blockfrost.io/api/v0/accounts/stake1u9h75z58puw0pn0n3j50d0s4tufwqqnvhu8vjrl7hmvkk7crf3p50/addresses/assets",
            headers: {
                'project_id':  API
            }
        })
        .then(function (response) {
            response.data.forEach(element => {
                if(element.unit.includes("02fef1496948465d0f11540757850ef96d564e244fa381173e3ccaa4")){
                    assets.push(element.unit)
                    assetnames.push(hex_to_ascii(element.unit.split("02fef1496948465d0f11540757850ef96d564e244fa381173e3ccaa4")[1]))
                }
            })
            finalresponse.push(assetnames.length)
            assetnames.forEach(element => {
                finalresponse.push(element)
            });
        })
        .then( ()=>{
            assets.forEach(element => {
                axios({
                    method: 'get',
                    url : "https://cardano-mainnet.blockfrost.io/api/v0/assets/" + element + "/history",
                    headers: {
                        'project_id': API
                    }
                })
                .then(function(response){
                    response.data.forEach(element =>{
                        if(element.action == 'minted'){
                            minttxs.push(element.tx_hash)
                        }
                    })
        //res.send(minttxs)
                })
                .then( () => {
                    minttxs.forEach(element =>{
                        axios({
                            method: 'get',
                            url :  `https://cardano-mainnet.blockfrost.io/api/v0/txs/${element}/metadata` ,
                            headers: {
                                'project_id': API
                            }
                        })
                        .then(function(response){
                            response.data.forEach(element =>{
                                finalresponse.push(element.json_metadata)
                            })
                        console.log(finalresponse)
                        res.send(finalresponse)
                        })
                    }) 
                })
        })       
    })
})

module.exports = router