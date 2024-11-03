import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import StudyGroups from './components/StudyGroups';
import Settings from './components/Settings';
import Notifications from './components/Notifications';
import Progress from './components/Progress';
import AcademicGoals from './components/AcademicGoals';
import Assignments from './components/Assignments';
import AuthPage from './components/AuthPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const isDevelopment = true;

  // if (isDevelopment) {
  //   return <>{children}</>;
  // }

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const App: React.FC = () => {
  const handleAuthSuccess = () => {
    window.location.href = '/';
  };

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={<AuthPage onAuthSuccess={handleAuthSuccess} />}
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <Navigation />
                  <main className="flex-1 p-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/groups" element={<StudyGroups />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route
                        path="/notifications"
                        element={<Notifications />}
                      />
                      <Route path="/progress" element={<Progress />} />
                      <Route path="/goals" element={<AcademicGoals />} />
                      <Route path="/assignments" element={<Assignments />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};
export default App;
