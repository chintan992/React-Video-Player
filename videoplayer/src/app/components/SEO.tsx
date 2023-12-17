// components/SEO.tsx

import { DefaultSeo } from 'next-seo';

const SEO: React.FC = () => {
  return (
    <DefaultSeo
      title="Lets Stream"
      description="Your site description goes here."
      openGraph={{
        type: 'website',
        locale: 'en_IE',
        url: 'https://your-site-url.com',
        site_name: 'Lets Stream',
      }}
    />
  );
};

export default SEO;
