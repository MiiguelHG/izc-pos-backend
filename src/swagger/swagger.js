import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IZC POS Backend API',
            version: '1.0.0',
            description: 'API documentation for IZC POS Backend',
            contact: {
                name: 'IZC Dev Team',
            }
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ]
    },
    apis: ['./src/swagger/*.yml'], // Path to the API docs
};

const specs = swaggerJsdoc(options);
export default specs;