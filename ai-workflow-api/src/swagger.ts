import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AI Workflow API',
            version: '1.0.0',
            description: 'AI-powered workflow automation API that generates next steps for any given task',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                Task: {
                    type: 'object',
                    required: ['task'],
                    properties: {
                        task: {
                            type: 'string',
                            description: 'The task description for which to generate the next step',
                            example: 'Set up customer onboarding process'
                        }
                    }
                },
                WorkflowStep: {
                    type: 'object',
                    properties: {
                        nextStep: {
                            type: 'string',
                            description: 'The next actionable step for the task',
                            example: 'Create customer information form'
                        },
                        rationale: {
                            type: 'string',
                            description: 'Brief explanation for why this is the next step',
                            example: 'First step to collect essential customer data'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message',
                            example: 'Invalid input: task is required'
                        },
                        code: {
                            type: 'string',
                            description: 'Error code',
                            example: 'BAD_INPUT'
                        },
                        status: {
                            type: 'number',
                            description: 'HTTP status code',
                            example: 400
                        }
                    }
                },
                Health: {
                    type: 'object',
                    properties: {
                        ok: {
                            type: 'boolean',
                            description: 'Health status',
                            example: true
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/*.ts'], // Path to the API docs
};

export const specs = swaggerJSDoc(options);
