import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const app = createRoot(document.getElementById('root'));

app.render(
  <StrictMode>
    <App id={"mainApp"} />
  </StrictMode>,
);

export default app;