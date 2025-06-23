import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Deep Research Engine',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Our advanced AI-powered research engine goes beyond surface-level answers to provide 
        comprehensive, well-researched responses to complex questions with production-grade quality.
      </>
    ),
  },
  {
    title: 'Live Citations & Sources',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Every research result comes with live citations and source links, ensuring transparency 
        and allowing you to verify information and dive deeper into authoritative sources.
      </>
    ),
  },
  {
    title: 'Simple Integration',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Integrate Fay into your applications with a simple API or use our intuitive web interface. 
        Turn complex research into ready-to-use, source-linked answers in minutes.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
} 