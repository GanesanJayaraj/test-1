const express = require("express");
const dotENV = require("dotenv");
const fs = require("fs");

dotENV.config();

const app = express();

app.use(express.json());

const appPort = process.env.ENV_PORT || 3001;

let products = JSON.parse(fs.readFileSync("./data.json" , "utf-8"));

let allIds = []
products.forEach(prod => {
    allIds.push(prod.id);
});
allIds = allIds.sort((a,b)=>a-b);

// console.log(products , allIds);

app.use("/api/test" , (req, res , next)=>{
    // res.json({
    //     status: 200,
    //     message: "Test - 1 works"
    // });
    console.log("use test to next")
    next();
});
app.get("/api/test" , (req, res)=>{
    res.json({
        status: 200,
        message: "Test - get works"
    });
});

app.get("/api/test/products" , (req, res)=>{
    try {
        
        res.json({
            status: 200,
            message: products
        });

    } catch (error) {
        console.log(error);
    }
    
});


app.get("/api/test/products/:product_id" , (req, res)=>{
    try {
        const params = req.params.product_id;
        console.log(params);
        let findProd = products.find(prod=>prod.id == params);
        if (!(Object.keys(findProd).length > 0)) {
            throw Error("Product Not found");
        }
        res.json({
            status: 200,
            message: findProd
        });
        
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        });
    }
});


app.post("/api/test/products" , (req, res)=>{
    try {
        let allIds = []
        products.forEach(prod => {
            allIds.push(prod.id);
        });
        allIds = allIds.sort((a,b)=>a-b);
        const maxID = allIds[allIds.length-1];
        console.log(allIds, maxID);
        
        const payload = req.body;

        let modal = {
            "id": maxID+1,
            "title": payload.title,
            "price": payload.price,
            "description": payload.description,
            "category": payload.category,
            "image": payload.image,
            "rating": {
                "rate": payload.rating.rate,
                "count": payload.rating.count
            }
        };
        console.log(modal);
        products.push(modal);
        fs.writeFile("./data.json" , JSON.stringify(products) , (error)=>{
            if (error) {
                throw Error("Failed to write")
            }
            res.json({
                status: 200,
                message: "Success"
            });
        });
        
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        });
    }
});


app.put("/api/test/products/:product_id" , (req, res)=>{
    try {

        const params = req.params.product_id;
        const payload = req.body;

        const findProd = products.find(prod=>prod.id == params);

        // console.log(findProd);

        let modal = {
            ...findProd,
            ...payload
        };
        let ind = -1;
        for(let i=0;i<products.length;i++) {
            if(products[i].id == params) {
                ind = i;
                break;
            }
        }
        // console.log("PUT : " , modal, ind);
        // products = products.filter(prod=>prod.id != params);
        products.splice(ind , 1 , modal);
        fs.writeFile("./data.json" , JSON.stringify(products) , (error)=>{
            if (error) {
                throw Error("Failed to write")
            }
            res.json({
                status: 200,
                message: "Success"
            });
        });
        
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        });
    }
});



app.patch("/api/test/products/:product_id" , (req, res)=>{
    try {

        const params = req.params.product_id;
        const payload = req.body;

        const findProd = products.find(prod=>prod.id == params);

        // console.log(findProd);

        let modal = {
            ...findProd,
            ...payload
        };
        let ind = -1;
        for(let i=0;i<products.length;i++) {
            if(products[i].id == params) {
                ind = i;
                break;
            }
        }
        // console.log("PUT : " , modal, ind);
        // products = products.filter(prod=>prod.id != params);
        products.splice(ind , 1 , modal);
        fs.writeFile("./data.json" , JSON.stringify(products) , (error)=>{
            if (error) {
                throw Error("Failed to write")
            }
            res.json({
                status: 200,
                message: "Success"
            });
        });
        
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        });
    }
});



app.listen(appPort , () => {
    console.log(`Server running on ${appPort}`);
});