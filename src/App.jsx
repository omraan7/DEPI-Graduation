/**
 * App.jsx — Root component
 * Simply renders the router. All layout and page logic
 * lives in router/index.jsx and its referenced files.
 */
import AppRouter from './router/index.jsx'

export default function App() {
  return <AppRouter />
}
