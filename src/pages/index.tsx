import { GetStaticProps } from 'next';
import Head from 'next/head';
import { stripe } from '../services/stripe';
import { SubscribeButton } from '../components/SubscribeButton';


import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about <br />the <span>React</span> world.</h1>
          <p>
            Get acces to all the publications<br />
            <span>for {product.amount} month</span>

            <SubscribeButton priceId={product.priceId} />
          </p>
        </section>
        <img src="/images/avatar.svg" alt="coding" />
      </main>
    </>
  )
}

/** API CALL */
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IaulqDqVVv1XfpMUvpyBrS8', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
