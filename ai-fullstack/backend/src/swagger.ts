import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Full-Stack Backend API',
      version: '1.0.0',
      description: 'AI-powered text completion API supporting multiple providers (OpenAI, Gemini, Mock)',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        CompletionRequest: {
          type: 'object',
          required: ['prompt'],
          properties: {
            prompt: {
              type: 'string',
              description: 'The text prompt to complete',
              example: 'Write a Python function that calculates fibonacci numbers'
            }
          }
        },
        CompletionResponse: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'AI-generated completion text',
              example: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Missing Gemini API key'
            },
            code: {
              type: 'string',
              description: 'Error code',
              example: 'NO_API_KEY'
            },
            status: {
              type: 'number',
              description: 'HTTP status code',
              example: 503
            }
          }
        }
      }
    }
  },
  apis: ['./src/*.ts'], // Path to the API docs
};

export const specs = swaggerJSDoc(options);