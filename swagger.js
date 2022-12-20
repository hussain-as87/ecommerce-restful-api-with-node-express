import swagger from "swagger-autogen";

const swagGen = swagger();

swagGen("./swagger.json", [
    './server.js'
]);

