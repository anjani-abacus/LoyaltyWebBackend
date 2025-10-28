import swaggerAutogen from "swagger-autogen";

const swaggerAutogenInstance = swaggerAutogen();

const doc = {
    info: {
        title: "Starkpaints API",
        description: "API documentation for Starkpaints",
    },
    host: "localhost:5000",
    schemes: ["http"],
};

const outputFile = "../../swagger-output.json"; 
const endpointsFiles = ["../../webs/loyalty/routes/index.js"]; 

swaggerAutogenInstance(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger JSON generated!");
});

