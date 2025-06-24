import React, {useEffect} from 'react';
import {useHistory} from '@docusaurus/router';

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    // Redirect to the docs introduction page
    history.replace('/docs/intro');
  }, [history]);

  return (
    <div style={{padding: '2rem', textAlign: 'center'}}>
      <p>Redirecting to documentation...</p>
    </div>
  );
} 