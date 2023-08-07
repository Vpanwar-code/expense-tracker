import { Fragment } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthReducer";

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(authActions.logout());
    toast.success("Successfully Logged Out", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
    navigate("/auth", { replace: true });
  };
  const location = useLocation();
  return (
    <Fragment>
      <Navbar bg="secondary" expand="sm" variant="secondary">
        <Container>
          <Nav className="flex-grow-3">
            <Nav.Item style={{ color: "white", fontSize: "25px" }}>
              Expense Tracker App
            </Nav.Item>
          </Nav>
        </Container>
        {isLoggedIn &&
          location.pathname !== "/auth" &&
          location.pathname !== "/" &&
          location.pathname !== "/forget" && (
            <Button
              variant="danger"
              style={{
                marginRight: "15px",
              }}
              onClick={logoutHandler}
            >
              Logout
            </Button>
          )}
      </Navbar>
      {location.pathname !== "/profile" &&
        location.pathname !== "/verification" &&
        location.pathname !== "/auth" &&
        location.pathname !== "/forget" &&
        location.pathname !== "/" && (
          <div
            style={{
              padding: "5px",
              textAlign: "center",
              backgroundColor: "yellow",
            }}
          >
            You can update your
            <NavLink to="/profile"> profile here</NavLink>
          </div>
        )}
    </Fragment>
  );
};

export default Header;
