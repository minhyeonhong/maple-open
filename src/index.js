import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import App from './App';
import GuildPage from './components/guild/GuildPage';

import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import CharacterPage from './components/character/CharacterPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/guild",
    element: <GuildPage />,
  },
  {
    path: "/character",
    element: <CharacterPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <Header />
    <RouterProvider router={router} />
    <Footer />
  </div>
);
