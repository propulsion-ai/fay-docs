import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className="hero__description">
          Production-grade deep research with live citations through one API or UI, 
          turning complex questions into ready-to-use, source-linked answers.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/api-key">
            Get Started - 5min ⏱️
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://fay.work"
            target="_blank"
            rel="noopener noreferrer">
            Sign Up at Fay.work 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Official documentation for Fay AI - The Deep Research Platform. Learn how to integrate production-grade deep research with live citations through our API.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.ctaSection}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset--2 text--center">
                <h2>Ready to Get Started?</h2>
                <p>
                  Join thousands of developers and researchers who are already using Fay 
                  to build intelligent applications with deep research capabilities.
                </p>
                <div className={styles.ctaButtons}>
                  <Link
                    className="button button--primary button--lg"
                    href="https://fay.work"
                    target="_blank"
                    rel="noopener noreferrer">
                    Create Your Account
                  </Link>
                  <Link
                    className="button button--outline button--lg"
                    to="/docs/api-key">
                    View Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
