import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.VUE_APP_API_HOST;

class DataService {
  login(user) {
    console.log(process.env.VUE_APP_API_HOST);
    return axios
      .post(API_URL + 'auth/login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'auth/register', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    });
  }

  getActivities(){
    return axios.get(API_URL + 'activities', { headers: authHeader() });
  }

  postActivity(data){
    return axios
      .post(API_URL + 'activities', data, { headers: authHeader() })
  }
}

export default new DataService();