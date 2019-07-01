const env = process.env.NODE_ENV || 'dev';

const config = () => {
    switch (env) {
        case 'dev':
            return {
                // Your connection string 
                bd_string: 'String is here',
                jwt_pass: 'sad2f31sad56f1asd5f6sa51f5sa6f5sa1fa8e9sadf21asd65f1saaA2SaA5a1ds32f1a',
                jwt_expires_in: '1d',
            }
        case 'hml':
            return {}
        case 'prod':
            return {}
    }
}

module.exports = config();
