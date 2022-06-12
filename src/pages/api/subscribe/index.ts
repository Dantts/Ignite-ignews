import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { faunaClient } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { session } = (await getSession({ req })) as any;
      console.log(session);

      if (session && session.user) {
        const user = await faunaClient.query<User>(
          q.Get(
            q.Match(q.Index("user_by_email"), q.Casefold(session.user.email))
          )
        );

        let customerId = user.data.stripe_customer_id;

        if (!customerId) {
          const customer = await stripe.customers.create({
            name: session.user.name || "",
            email: session.user.email || "",
          });

          await faunaClient.query(
            q.Update(q.Ref(q.Collection("users"), user.ref.id), {
              data: {
                stripe_customer_id: customer.id,
              },
            })
          );

          customerId = customer.id;
        }

        const checkoutSession = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          billing_address_collection: "required",
          line_items: [
            {
              price: "price_1L6lcFFYaXHTZjzTyebCNu1T",
              quantity: 1,
            },
          ],
          mode: "subscription",
          allow_promotion_codes: true,
          success_url: process.env.STRIPE_SUCCESS_URL || "",
          cancel_url: process.env.STRIPE_CANCEL_URL || "",
        });

        return res.status(200).json({ sessionId: checkoutSession.id });
      } else {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: err,
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
