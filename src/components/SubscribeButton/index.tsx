import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "../../services/api";
import { getStripe } from "../../services/stripe-js";
import styles from "./styles.module.scss";

export const SubscribeButton = () => {
  const { data: session } = useSession();

  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const res = await api.post("subscribe");

      const { sessionId } = res.data;

      const stripe = await getStripe();

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        console.error("Stripe not loaded");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};
