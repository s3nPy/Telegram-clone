import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:9000',
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use( config => {
  const token = localStorage.getItem('token')
  if( token ){
    config.headers['Authorization'] = token
  }
  return config
})

export default instance