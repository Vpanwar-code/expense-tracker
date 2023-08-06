import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/Auth/AuthForm";

import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLoggedIn);
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/forget" element={<Reset />} />
       
      </Routes>
    </Fragment>
  );
}
export default App;
