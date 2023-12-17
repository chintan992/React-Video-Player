// components/DarkModeToggle.tsx

import { useTheme } from 'next-themes';

const DarkModeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="dark-mode-toggle" onClick={toggleDarkMode}>
      {theme === 'light' ? '🌞' : '🌜'}
    </div>
  );
};

export default DarkModeToggle;
