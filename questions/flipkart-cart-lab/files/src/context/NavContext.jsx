import { createContext, useContext, useState } from 'react';

// Stands in for react-router-dom, which the preview sandbox has no way to
// load (only React itself is vendored -- see public/preview/vendor). A
// "page" is just a name + params; App.jsx reads it to decide what to render.
const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [route, setRoute] = useState({ page: 'catalog', params: {} });
  const navigate = (page, params = {}) => setRoute({ page, params });
  return <NavContext.Provider value={{ ...route, navigate }}>{children}</NavContext.Provider>;
}

export const useNav = () => useContext(NavContext);
