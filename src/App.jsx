import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import MainLayout from "./layouts/MainLayout";
import DefinedKiosks from "./pages/DefinedKiosks";
import KioskParameters from "./pages/KioskParameters";
import LoadingOverlay from "./components/LoadingOverlay";
import "./App.css";

function App() {
  const isLoading = useAppSelector((state) => state.loading.isLoading);

  return (
    <BrowserRouter>
      <LoadingOverlay isLoading={isLoading} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/tanimli-kiosklar" replace />} />
          <Route path="tanimli-kiosklar" element={<DefinedKiosks />} />
          <Route path="kiosk-parametreleri" element={<KioskParameters />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
