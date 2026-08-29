import { RouterProvider } from "react-router";
import { customRouter } from "./router/router";

const App = () => {
  return (
    <RouterProvider router={customRouter} />
  );
};

export default App;