import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PostDataContextProvider from './Context/PostDataContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PostDataContextProvider>
      <App />
    </PostDataContextProvider>
  </React.StrictMode>
);