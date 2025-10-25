import { Route, Routes } from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/checkout" element={<div>Checkout Page</div>} />
    </Routes>
  );
}

export default App;
