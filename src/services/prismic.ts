import * as Prismatic from "@prismicio/client";

export function createClient(config = {}) {
  const client = Prismatic.createClient(process.env.PRISMIC_API_URL, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    ...config,
  });

  return client;
}
