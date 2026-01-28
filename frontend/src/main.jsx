import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import TimeAgo from "javascript-time-ago";
import es from "javascript-time-ago/locale/es.json";

TimeAgo.addDefaultLocale(es);
TimeAgo.addLocale(es);

createRoot(document.getElementById("root")).render(<App />);
