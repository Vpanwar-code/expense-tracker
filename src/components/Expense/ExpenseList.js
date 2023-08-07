import { useState, useEffect, useCallback } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { expenseActions } from "../Store/ExpenseReducer";
import { useDispatch, useSelector } from "react-redux";

const ExpenseList = () => {
  const email = useSelector((state) => state.auth.email);

  const dispatch = useDispatch();

  const [csvData, setCsvData] = useState("");

  const {
    expenses,
    totalAmount,
    showEditModal,
    expenseToEdit,
    showDeleteModal,
    expenseToDelete,
  } = useSelector((state) => state.expense);

  const handleEditModalClose = () => {
    dispatch(expenseActions.setShowEditModal(false));
    dispatch(expenseActions.setExpenseToEdit(null));
  };

  const handleEditModalShow = (expense) => {
    dispatch(expenseActions.setShowEditModal(true));
    dispatch(expenseActions.setExpenseToEdit(expense));
  };

  const handleDeleteModalClose = () => {
    dispatch(expenseActions.setShowDeleteModal(false));
    dispatch(expenseActions.setExpenseToDelete(null));
  };

  const handleDeleteModalShow = (expense) => {
    dispatch(expenseActions.setShowDeleteModal(true));
    dispatch(expenseActions.setExpenseToDelete(expense));
  };

  const userEmail = email || "";
  const emailId = userEmail.replace(/[^a-zA-Z0-9]/g, "");

  const handleFetchExpenses = useCallback(async () => {
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
  }, []);

  const handleEditExpense = async (event) => {
    event.preventDefault();
    const updatedExpense = {
      ...expenseToEdit,
      title: event.target.title.value,
      amount: event.target.amount.value,
      desc: event.target.desc.value,
    };
    const response = await fetch(
      `https://expense-tracker-app-012-default-rtdb.asia-southeast1.firebasedatabase.app/expenses${emailId}/${updatedExpense.id}.json`,
      {
        method: "PUT",
        body: JSON.stringify(updatedExpense),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.log("Failed to update expense");
    }
    dispatch(expenseActions.setExpenseToEdit(null));
    dispatch(expenseActions.setShowEditModal(false));
    handleFetchExpenses();
  };

  const handleDeleteExpense = async () => {
    const response = await fetch(
      `https://expense-tracker-app-012-default-rtdb.asia-southeast1.firebasedatabase.app/expenses${emailId}/${expenseToDelete.id}.json`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      console.log("Failed to delete expense");
    }
    dispatch(expenseActions.setExpenseToDelete(null));
    dispatch(expenseActions.setShowDeleteModal(false));
    handleFetchExpenses();
  };
  useEffect(() => {
    handleFetchExpenses();
  }, [handleFetchExpenses]);
  useEffect(() => {
    const csv = expenses.reduce((csvString, expense) => {
      return `${csvString}${expense.title},${expense.amount},${expense.desc}\n`;
    }, "Title,Amount,Description\n");
    const totalAmount = expenses.reduce((total, expense) => {
      return total + parseInt(expense.amount);
    }, 0);
    setCsvData(`${csv}Total,${totalAmount},\n`);
    //setCsvData(csv);
  }, [expenses]);
  return (
    <Container>
      <h3
        className="d-flex justify-content-center"
        style={{ marginTop: "15px", backgroundColor: "red", color: "white" }}
      >
        Expense Details
      </h3>
      <Table bordered hover className="justify-content-center">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.title}</td>
              <td>$ {expense.amount}</td>
              <td>{expense.desc}</td>
              <td>
                <Button
                  variant="success"
                  style={{ marginRight: "15px" }}
                  onClick={() => handleEditModalShow(expense)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteModalShow(expense)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h5>Total Expense Amount : {totalAmount}</h5>
      <Button
        className="ml-3"
        variant="dark"
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`}
        download="expenses.csv"
        style={{ marginLeft: "45%", marginBottom: "5%" }}
      >
        Download Expenses
      </Button>
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Form onSubmit={handleEditExpense}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                defaultValue={expenseToEdit ? expenseToEdit.title : ""}
              />
            </Form.Group>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                defaultValue={expenseToEdit ? expenseToEdit.amount : ""}
              />
            </Form.Group>
            <Form.Group controlId="desc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                defaultValue={expenseToEdit ? expenseToEdit.desc : ""}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditModalClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this expense?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteExpense}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default ExpenseList;
