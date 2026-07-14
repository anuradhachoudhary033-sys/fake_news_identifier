import { ShieldAlert } from 'lucide-react';

const Header = () => {
  return (
    <header className="app-header">
      <h1 className="app-title">
        <ShieldAlert size={42} color="#60a5fa" />
        TruthSeeker
      </h1>
      <p className="app-subtitle">
        Verify quotes and claims against credible news organizations in real-time.
      </p>
    </header>
  );
};

export default Header;
