// React
import React, { Suspense } from 'react';

import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom"

import * as serviceWorker from './serviceWorker';

// App
import MainAppTranslated from './components/MainApp';
import Loading from './components/Loading';

// Translation
// import i18n (needs to be bundled ;))
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import './utils/i18n';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <I18nextProvider i18n={i18next}>
          <MainAppTranslated />
        </I18nextProvider>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
