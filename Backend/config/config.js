/*
Here you can set your mail id and password by just replacing the static string 
or you can set that in environment variables
*/
module.exports = {
    mongourl: process.env === 'PRODUCTION' || process.env === 'STAGING' ? process.env.MONGOURL : "mongodb://127.0.0.1:27017/mean",
    port: process.env === 'PRODUCTION' || process.env === 'STAGING' ? process.env.PORT : 8080,
    jwtSecret: process.env === 'PRODUCTION' || process.env === 'STAGING' ? process.env.JWTSECRET : "your Jwt Secret",
    email: process.env === 'PRODUCTION' || process.env === 'STAGING' ? process.env.Email : "Your Email",
    password: process.env === 'PRODUCTION' || process.env === 'STAGING' ? process.env.Password : "Your Password"
};