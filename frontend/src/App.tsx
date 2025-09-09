import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/routeConfig";
import "./App.css";

function App() {
  return (
    <>
      <Suspense>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={React.createElement(element)}
            />
          ))}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
