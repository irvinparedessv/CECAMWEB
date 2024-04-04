import React from 'react';
import AppRoutes from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
   <div className="container-fluid">
    <div className="row flex-nowrap">
      <AppRoutes />
    </div>
    </div>
  );
}

export default App;
