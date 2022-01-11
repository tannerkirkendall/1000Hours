import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3001/api/';

class DataService {
  login(user) {
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


}

export default new DataService();