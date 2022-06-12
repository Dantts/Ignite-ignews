import { query as q } from "faunadb";

import { faunaClient } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export const saveSubscription = async (
  subscriptionId: string,
  customerId: string,
  createAction: boolean = false
) => {
  try {
    const userRef = await faunaClient.query(
      q.Select(
        "ref",
        q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
      )
    );

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionData = {
      id: subscription.id,
      userId: userRef,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
    };

    if (createAction) {
      await faunaClient.query(
        q.Create(q.Collection("subscriptions"), {
          data: subscriptionData,
        })
      );
    } else {
      await faunaClient.query(
        q.Replace(
          q.Select(
            "ref",
            q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
          ),
          { data: subscriptionData }
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
};
