const ip = '192.168.3.119';
const port = '8080';
const portOrTools = '5000';

const configService = {
    baseURL: `http://${ip}:${port}`,
    orToolURL: `http://${ip}:${portOrTools}`,
  };
  
  export default configService;
