const express = require('express')
const router = express.Router()
const axios = require("axios");

router.get('/', (req, res) => {
  let assets = []
  let minttxs = []
  let metadata = []
        axios({
            method: 'get',
            url : "https://cardano-mainnet.blockfrost.io/api/v0/accounts/stake1u9h75z58puw0pn0n3j50d0s4tufwqqnvhu8vjrl7hmvkk7crf3p50/addresses/assets",
            headers: {
                'project_id':  "mainnethRwgBGQxAvygomyBOy1ZxIY7xrZRBeOr"
            }
        })
        .then(function (response) {
            response.data.forEach(element => {
                if(element.unit.includes("02fef1496948465d0f11540757850ef96d564e244fa381173e3ccaa4")){
                    assets.push(element.unit)
                }
            })
        })
        .then( ()=>{
            assets.forEach(element => {
                axios({
                    method: 'get',
                    url : "https://cardano-mainnet.blockfrost.io/api/v0/assets/" + element + "/history",
                    headers: {
                        'project_id': "mainnethRwgBGQxAvygomyBOy1ZxIY7xrZRBeOr"
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
                                'project_id': "mainnethRwgBGQxAvygomyBOy1ZxIY7xrZRBeOr"
                            }
                        })
                        .then(function(response){
                            response.data.forEach(element =>{
                                metadata.push(element.json_metadata)
                            })
                        console.log(metadata)
                        res.send(metadata)
                        })
                    }) 
                })
        })       
    })
})

module.exports = router