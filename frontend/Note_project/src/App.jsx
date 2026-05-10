import AppRoutes from "./routes/AppRoutes";
import AppFooter from "./components/AppFooter";
import "./index.css";

function App() {
  return (
    <div data-theme="forest" className="flex min-h-screen flex-col bg-base-200">
      <div className="flex-1">
        <AppRoutes />
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
