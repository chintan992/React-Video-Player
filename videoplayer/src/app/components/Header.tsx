// components/Header.tsx

import Link from 'next/link';
import Head from 'next/head';
import DarkModeToggle from './DarkModeToggle';

const Header: React.FC = () => {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <title>Lets Stream</title>
        <style>
          {`
            body {
              font-family: 'Roboto', sans-serif;
            }
            .header {
              display: flex;
              align-items: center;
              background-color: #4caf50;
              padding: 1rem;
              color: white;
            }
            .header a {
              margin-right: 1rem;
              text-decoration: none;
              color: white;
            }
            .header a:hover {
              text-decoration: underline;
            }
          `}
        </style>
      </Head>
      <div className="header">
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>
        <Link href="/support">Support</Link>
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default Header;
