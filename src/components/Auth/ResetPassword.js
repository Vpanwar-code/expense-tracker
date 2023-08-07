import { Fragment } from "react";
import { useState, useRef } from "react";
import { Form, Container, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reset = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const resetHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDvtlwqxzVKhuhWBcSJE6AmKab0x5J45eA",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          setEmail("");
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Password Reset Failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          });
        }
      })
      .then((data) => {
        toast.success("Password Link Sent", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        navigate("/auth");
      });
  };

  const emailInputChangeHandler = () => {
    setEmail(emailInputRef.current.value);
  };

  return (
    <Fragment>
      <Header />
      <Container className="d-flex justify-content-center my-5">
        <Card>
          <Card.Title style={{ textAlign: "center", marginTop: "15px" }}>
            Reset Password
          </Card.Title>
          <Card.Body>
            <Form onSubmit={resetHandler}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Enter your email here "
                  ref={emailInputRef}
                  required
                  style={{ width: "100%" }}
                  onChange={emailInputChangeHandler}
                  value={email}
                />
              </Form.Group>
              {!isLoading ? (
                <Button
                  variant="primary"
                  type="submit"
                  style={{ marginTop: "15px" }}
                >
                  Send Link
                </Button>
              ) : (
                <Button variant="success" style={{ marginTop: "15px" }}>
                  <Spinner animation="border" size="sm" /> Sending...
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
};
export default Reset;
