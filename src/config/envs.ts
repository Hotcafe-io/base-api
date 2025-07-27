
const expectedEnvVars = [
    "MONGO_URL", 
    "PORT", 
    "JWT_SECRET"
];

export function loadEnvironments() {
    expectedEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable ${envVar} is not set.`);
        }
    });
}