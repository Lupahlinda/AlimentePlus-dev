import Routes from './routes';
import './index.css';
import SkipLink from './components/SkipLink'; 
import './styles/global.css';

function App() {
  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-background">
        <main id="main-content" tabIndex="-1">
          <Routes />
        </main>
      </div>
    </>
  );
}

export default App;
