import { Routes, Route } from 'react-router-dom'
import UserWrapper from './Routes/UserWrapper';
import AdminWrapper from './Routes/AdminWrapper'
function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<UserWrapper/>} />
        <Route path="admin/*" element={<AdminWrapper />} />
      </Routes>
    </>
  );
}

export default App;
