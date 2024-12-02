const config = {
    PORT : process.env.PORT,
    MONGO_URI : process.env.MONGO_URI,
    BUCKET_NAME : process.env.BUCKET_NAME,
    BUCKET_REGION : process.env.BUCKET_REGION,
    ACCESS_KEY : process.env.ACCESS_KEY,
    SECRET_ACCESS_KEY : process.env.SECRET_ACCESS_KEY,
    JSON_WEB_TOKEN_SECRET_KEY :  process.env.JSON_WEB_TOKEN_SECRET_KEY,
    EMAIL_SERVER_HOST : process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT : process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER : process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD : process.env.EMAIL_SERVER_PASSWORD,
    FROM_NAME:process.env.FROM_NAME,
    FROM_EMAIL:process.env.FROM_EMAIL,
    ADMIN_EMAIL:process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD:process.env.ADMIN_PASSWORD,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
}
export default config;