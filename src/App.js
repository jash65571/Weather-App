import React, { useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

const App = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    const login = useGoogleLogin({
        clientId: '1029185341354-jbnj6kpa6t3o3f3boduk4krbvjgea8no.apps.googleusercontent.com',
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
        },
        onError: (error) => {
            console.log('Login Failed:', error);
        }
    });

    const handleLogout = () => {
        googleLogout();
        setUser(null);
        setProfile(null);
        setWeatherData(null);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (user) {
                    const res = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    });
                    setProfile(res.data);
                }
            } catch (error) {
                console.log('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [user]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const apiKey = '1b7bb0c64563d61da297bdf67107bc89';
                const cities = ['New York', 'Los Angeles', 'Chicago'];
                const promises = cities.map(city =>
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
                );
                const responses = await Promise.all(promises);
                const weatherInfo = responses.map(res => ({
                    city: res.data.name,
                    temp: res.data.main.temp,
                    description: res.data.weather[0].description
                }));
                setWeatherData(weatherInfo);
            } catch (error) {
                console.log('Error fetching weather data:', error);
            }
        };

        if (user) {
            fetchWeatherData();
        }
    }, [user]);

    return (
      <div className="container">
      <h2>React Google Login with Weather</h2>
      <br />
      {profile ? (
        <div className="user-profile">
          {profile.picture ? (
            <img src={profile.picture} alt="user profile" onError={(e) => (e.target.style.display = 'none')} />
          ) : (
            <div className="no-profile-image">No profile image</div>
          )}
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <button className="login-button" onClick={handleLogout}>Log out</button>
          {weatherData && (
            <div className="weather-info">
              <h3>Weather Information</h3>
              {weatherData.map((info) => (
                <div key={info.city} className="weather-item">
                  <p>
                    <strong>{info.city}:</strong> {info.temp}°C, {info.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button className="login-button" onClick={login}>Sign in with Google 🚀</button>
      )}
    </div>
    );
};

export default App;
