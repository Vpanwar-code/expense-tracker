import { useState, useRef, Fragment } from "react";
import { Form, Container, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../Layout/Header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Verification = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const token = useSelector((state) => state.auth.idToken);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const verificationHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDvtlwqxzVKhuhWBcSJE6AmKab0x5J45eA",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: token,
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
            let errorMessage;
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
        if (data.email === enteredEmail) {
          toast.success("Verification link sent to entered email", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          navigate("/home");
        } else {
          toast.success("you entered wrong email", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          navigate("/home");
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const emailInputChangeHandler = () => {
    setEmail(emailInputRef.current.value);
  };
  const cancelHandler = () => {
    navigate("/home");
  };
  const backHandler = () => {
    navigate("/profile");
  };
  return (
    <Fragment>
      <Header />
      <Button
        variant="outline-info"
        style={{
          marginLeft: "5%",
          marginTop: "4%",
          backgroundColor: "transparent",
          color: "blue",
        }}
        onClick={backHandler}
      >
        Back
      </Button>
      <Button
        variant="outline-danger"
        style={{
          marginLeft: "80%",
          marginTop: "4%",
          backgroundColor: "transparent",
          color: "red",
        }}
        onClick={cancelHandler}
      >
        Cancel
      </Button>
      <Container className="d-flex justify-content-center my-5">
        <Card>
          <Card.Title style={{ textAlign: "center", marginTop: "15px" }}>
            Verify Your Account
          </Card.Title>
          <Card.Body>
            <Form onSubmit={verificationHandler}>
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
                  Verify
                </Button>
              ) : (
                <Button variant="success" style={{ marginTop: "15px" }}>
                  <Spinner animation="border" size="sm" /> Sending Link...
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
};
export default Verification;
