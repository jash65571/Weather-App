import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './App.css'; 

ReactDOM.render(
    <GoogleOAuthProvider clientId="1029185341354-jbnj6kpa6t3o3f3boduk4krbvjgea8no.apps.googleusercontent.com">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>,
    document.getElementById('root')
);
