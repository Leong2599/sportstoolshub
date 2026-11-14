import {useMemo, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {HomeHero, ToolGrid} from '../components/home';
import {buildCategories} from '../data/chrome';
import styles from './index.module.css';

const HOME_DESCRIPTION =
  'Comprehensive sports tools directory featuring fitness calculators, performance trackers, training resources and expert sports blog articles';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  const sections = useMemo(() => buildCategories(), []);

  return (
    <Layout title={siteConfig.tagline} description={HOME_DESCRIPTION}>
      <main className={styles.page}>
        <HomeHero />
        <ToolGrid sections={sections} />
      </main>
    </Layout>
  );
}
