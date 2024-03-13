const dev = {
    REACT_APP_BACKEND_URL: "http://localhost:8000",
};

const prod = {
    REACT_APP_BACKEND_URL: "http://localhost:8000",
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default config;
