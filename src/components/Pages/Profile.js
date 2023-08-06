import { Fragment, useState, useRef, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import { useSelector } from "react-redux";

const Profile = () => {
  const token = useSelector((state) => state.auth.idToken);
  const fullNameInputRef = useRef();
  const profileUrlRef = useRef();
  const [fullName, setFullName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDvtlwqxzVKhuhWBcSJE6AmKab0x5J45eA",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Unable to get user details";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        setFullName(data.users[0].displayName);
        setProfileUrl(data.users[0].photoUrl);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [token]);

  const cancelHandler = () => {
    navigate("/home");
  };

  const navigateHandler = () => {
    navigate("/verification");
  };

  const updateHandler = (event) => {
    event.preventDefault();
    const enteredFullName = fullNameInputRef.current.value;
    const enteredProfileUrl = profileUrlRef.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDvtlwqxzVKhuhWBcSJE6AmKab0x5J45eA",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
          displayName: enteredFullName,
          photoUrl: enteredProfileUrl,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          setFullName(enteredFullName);
          setProfileUrl(enteredProfileUrl);
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Update Failed !";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const fullNameInputChangeHandler = () => {
    setFullName(fullNameInputRef.current.value);
  };

  const profileUrlInputChangeHandler = () => {
    setProfileUrl(profileUrlRef.current.value);
  };

  return (
    <Fragment>
      <Header />
      <Button
        variant="warning"
        style={{ marginLeft: "45%", marginTop: "5%", color: "white" }}
        onClick={navigateHandler}
      >
        Verify Account
      </Button>
      <Button
        variant="outline-danger"
        style={{
          marginLeft: "38%",
          backgroundColor: "transparent",
          color: "red",
        }}
        onClick={cancelHandler}
      >
        Cancel
      </Button>
      <Container
        className="my-5 d-flex justify-content-center"
        style={{
          backgroundColor: "pink",
          paddingTop: "15px",
          paddingBottom: "15px",
        }}
      >
        <Form onSubmit={updateHandler}>
          <h4
            style={{
              marginBottom: "15px",
              paddingBottom: "5px",
              backgroundColor: "white",
              textAlign: "center",
            }}
          >
            Update Profile
          </h4>
          <Form.Group controlId="formBasicFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter full name here"
              ref={fullNameInputRef}
              required
              onChange={fullNameInputChangeHandler}
              value={fullName}
            />
          </Form.Group>
          <Form.Group controlId="formBasicProfileURL">
            <Form.Label>Profile Photo URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="paste profile photo url here"
              ref={profileUrlRef}
              required
              onChange={profileUrlInputChangeHandler}
              value={profileUrl}
            />
          </Form.Group>
          <Button variant="success" type="submit" style={{ marginTop: "15px" }}>
            Update
          </Button>
        </Form>
      </Container>
    </Fragment>
  );
};
export default Profile;
