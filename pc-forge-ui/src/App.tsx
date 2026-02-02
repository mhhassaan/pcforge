import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Guide from './pages/Guide';
import Compare from './pages/Compare';
import Components from './pages/Components';
import Gallery from './pages/Gallery';
import { BuildProvider } from './context/BuildContext';

function App() {
  return (
    <BuildProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="builder" element={<Builder />} />
            <Route path="components" element={<Components />} />
            <Route path="compare" element={<Compare />} />
            <Route path="guide" element={<Guide />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="login" element={<div className="p-8 text-white">Login Page (Coming Soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BuildProvider>
  );
}

export default App;