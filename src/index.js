import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { ConfirmDialogProvider } from './context/ConfirmDialogContext';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SiteConfigProvider>
        <ConfirmDialogProvider>
          <App />
        </ConfirmDialogProvider>
      </SiteConfigProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

