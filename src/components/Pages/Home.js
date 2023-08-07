import ExpenseForm from "../Expense/ExpenseForm";
import ExpenseList from "../Expense/ExpenseList";
import Header from "../Layout/Header";
import { themeActions } from "../Store/ThemeReducer";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
const Home = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentTheme = useSelector((state) => state.theme);
  const { totalAmount } = useSelector((state) => state.expense);
  return (
    <div style={{ backgroundColor: currentTheme.darkTheme ? "grey" : null }}>
      <Header />
      {isLoggedIn && totalAmount > 10000 && (
        <Button
          onClick={() => dispatch(themeActions.onThemeChange())}
          style={{ marginLeft: "81%", marginTop: "1%" }}
        >
          Active Premium
        </Button>
      )}
      <ExpenseForm />
      <ExpenseList />
    </div>
  );
};

export default Home;
