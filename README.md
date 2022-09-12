# Ignite-ignews
**Ignite-ignews** created with <a href='https://nextjs.org/' target="_blank">NextJs</a>

This project is Rocketseat Ignite's third, fifth and sixth module for learning Nextjs.
The purpose of this project among these modules is to learn about the general features of Nextjs, linking Next with third-party services, creating unit tests and deploying the application through vercel.

Basically this project is a Blog with registration and login system, serving to view blog posts.

# Run project

Basically to run the project, you just need to use the command `npm install` or `yarn to install` to install the project dependencies.
With the dependencies installed, you just need to run `npm run dev` or `yarn dev` to start the project in the development environment.

**To install the project dependencies it is necessary to know which package manager is installed on your computer.

### Configuring external services

#### FaunaDB

To configure faunaDB it only takes two steps. The first step is to create a variable containing the fauna's security key, with the name `FAUNA_DB_KEY`. 

The second step is to create two collections, one with the name of `users` and the other with the name of `subscriptions`. With the collections created, you only need to create five indexes, two from the users collection and three from the subscription collection with the names: `user_by_email`, `user_by_stripe_customer_id`, `subscription_by_id`, `subscription_by_status` and `subscription_by_user_ref`.

#### Prismic

To configure faunaDB only two steps are needed. The first step is to create a variable containing the prismic security key named `PRISMIC_ACCESS_TOKEN` and the other containing the API link named `PRISMIC_API_URL`.

The second step is to create a template of the application's posts containing Uid, Title and Content.

#### Stripe

To configure Stripe only two steps are needed. The first step is to create all the environment variables, listed below, with their respective values.

* NEXT_PUBLIC_STRIPE_PUBLIC_KEY and STRIPE_API_KEY -> Both keys found in developer/API KEYS session.

* STRIPE_SUCCESS_URL and STRIPE_CANCEL_URL -> The first variable is the redirect link in case the payment is successful and the second in case something goes wrong.

* STRIPE_WEBHOOK_SECRET -> The value of this environment variable is found when the following command is run `stripe listen --forward-to localhost:3000/api/webhooks`, but it will only be possible to run it at the end of step two.

The second step is to install the stripe CLI. The CLI installation is necessary for stripe to be able to watch all payment events in the development environment, where to install it you just need to follow the stripe [documentation](https://stripe.com/docs/stripe-cli) according to your operating system.

#### OAuth Github

To configure Stripe only two steps are needed. The first step is to create the OAuth following the steps in the [github documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app). With OAuth created you just need to create the environment variables `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` found in the OAuth panel.

Finally, you need to create an environment variable containing a random hash with the name of: `NEXTAUTH_SECRET`.


# Packages
Dependencies used in the _project_

* [Axios](https://www.npmjs.com/package/axios) is a Promise based HTTP client for making requests.

* [Faunadb](https://fauna.com/) is a distributed document-relational database delivered as a cloud API.

* [Next-auth](https://next-auth.js.org/) is a complete open-source authentication solution for Next.js applications.

* [Prismic](https://prismic.io/) is a CMS platform that provides a CMS backend for websites.

* [Stripe](https://stripe.com/en-br) is a suite of APIs powering online payment processing and commerce solutions for internet businesses of all sizes.

# Presentation

![GifIgniteIgnews](https://user-images.githubusercontent.com/80539719/189555160-987a499d-ebfd-4917-b99f-d753f9a9aa59.gif)
