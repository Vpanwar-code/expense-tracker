import { useState, useEffect, useCallback } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { expenseActions } from "../Store/ExpenseReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ExpenseForm = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);

  const titleChangeHandler = (event) => {
    setTitle(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setAmount(event.target.value);
  };

  const descChangeHandler = (event) => {
    setDesc(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (title.length > 0 && amount.length > 0 && desc.length > 0) {
      const expenseData = {
        title: title,
        amount: amount,
        desc: desc,
      };
      addExpenseHandler(expenseData);
    } else {
      toast.error("Please enter the input values", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
    setTitle("");
    setAmount("");
    setDesc("");
  };

  const userEmail = email || "";
  const emailId = userEmail.replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    fetch(
      `https://expense-tracker-app-012-default-rtdb.asia-southeast1.firebasedatabase.app/expenses${emailId}.json`,
      {
        method: "POST",
        body: JSON.stringify([]),
      }
    );
  }, [emailId]);

  const addExpenseHandler = async (expenseData) => {
    const response = await fetch(
      `https://expense-tracker-app-012-default-rtdb.asia-southeast1.firebasedatabase.app/expenses${emailId}.json`,
      {
        method: "POST",
        body: JSON.stringify(expenseData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }
    fetchExpenseHandler();
  };
  const fetchExpenseHandler = useCallback(async () => {
    const response = await fetch(
      `https://expense-tracker-app-012-default-rtdb.asia-southeast1.firebasedatabase.app/expenses${emailId}.json`
    );
    if (!response.ok) {
      console.log("Failed to fetch expenses");
    }
    const data = await response.json();
    let loadedExpenses = [];
    let loadedAmount = 0;
    for (const key in data) {
      loadedExpenses.push({
        id: key,
        title: data[key].title,
        amount: data[key].amount,
        desc: data[key].desc,
      });
      loadedAmount = loadedAmount + parseInt(data[key].amount);
    }
    dispatch(expenseActions.setExpenses(loadedExpenses));
    dispatch(expenseActions.setTotalAmount(loadedAmount));
  }, [addExpenseHandler]);
  useEffect(() => {
    fetchExpenseHandler();
  }, [fetchExpenseHandler]);

  return (
    <Container>
      <h3
        className="d-flex justify-content-center"
        style={{ marginTop: "15px", backgroundColor: "red", color: "white" }}
      >
        Expense Form
      </h3>
      <Form className="d-flex justify-content-center">
        <Form.Group style={{ marginRight: "15px" }}>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={titleChangeHandler}
            required
          />
        </Form.Group>
        <Form.Group style={{ marginRight: "15px" }}>
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={amountChangeHandler}
            required
          />
        </Form.Group>
        <Form.Group style={{ marginRight: "15px" }}>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            value={desc}
            onChange={descChangeHandler}
          />
        </Form.Group>
      </Form>
      <Button
        variant="primary"
        type="submit"
        onClick={submitHandler}
        style={{ marginLeft: "44%", marginTop: "15px", marginBottom: "15px" }}
      >
        Add Expense
      </Button>
    </Container>
  );
};

export default ExpenseForm;
