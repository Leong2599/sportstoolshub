import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import {CalculatorKitDemo} from '../components/calculators/kit';

export default function CalculatorKitDemoPage(): ReactNode {
  return (
    <Layout
      title="Calculator kit demo"
      description="Internal demo harness for the Sports Tools Hub calculator kit."
    >
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="sth-tool-page sth-container sth-section">
        <CalculatorKitDemo />
      </main>
    </Layout>
  );
}
