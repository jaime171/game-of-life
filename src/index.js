import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <div className="container center-align">
      <div className="row">
        <div className="col m1"></div>
        <div className="col s12 m10">
          <App />
        </div>
        <div className="col m1"></div>
      </div>

    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
