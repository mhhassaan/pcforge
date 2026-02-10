import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Guide from './pages/Guide';
import Compare from './pages/Compare';
import Components from './pages/Components';
import Gallery from './pages/Gallery';
import GalleryBuildDetails from './pages/GalleryBuildDetails';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import MyBuilds from './pages/MyBuilds';
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
            <Route path="gallery/:id" element={<GalleryBuildDetails />} />
            <Route path="my-builds" element={<MyBuilds />} />
            <Route path="login" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BuildProvider>
  );
}

export default App;