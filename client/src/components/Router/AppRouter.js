import { Route, Routes, Navigate } from 'react-router-dom';
import { LOGIN_ROUTE, CHAT_MAIN_ROUTE } from "./../../utils/consts"
import { authRoutes, publicRoutes } from '../../router'


const AppRoutes = ({ isAuth }) => {

  return (
    isAuth ?
      <Routes>
        {authRoutes.map(route =>
          <Route
            element={route.element}
            path={route.path}
            exact={route.exact}
            key={route.path}
          />
        )}
        <Route path='*' element={<Navigate replace to={CHAT_MAIN_ROUTE} />} />
      </Routes>
      :
      <Routes>
        {publicRoutes.map(route =>
          <Route
            element={route.element}
            path={route.path}
            exact={route.exact}
            key={route.path}
          />
        )}
        <Route path='*' element={<Navigate replace to={LOGIN_ROUTE} />} />
      </Routes>
  )
}

export default AppRoutes;
