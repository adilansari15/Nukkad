import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import {Routes, Route, Navigate} from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';


function App() {
  const {isLoaded, isSignedIn, } = useAuth();

  if (!isLoaded) return <p>Loading....</p>

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to="/auth" replace/>} />
          <Route path="/auth" element={!isSignedIn ? <AuthPage />: <Navigate to="/ChatPage" replace/>} />
        </Routes>
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;