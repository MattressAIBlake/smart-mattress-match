import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initWebVitals } from "./utils/webVitals";

createRoot(document.getElementById("root")!).render(<App />);

// Initialize Web Vitals monitoring
if (typeof window !== 'undefined') {
  initWebVitals();
}
