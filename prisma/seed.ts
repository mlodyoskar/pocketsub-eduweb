/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/db";
import {
  PAYMENT_STATUS,
  SUBSCRIPTION_BILLING_PERIOD,
  SUBSCRIPTION_CURRENCY,
} from "@prisma/client";
import { addMonths, endOfMonth, isBefore, startOfMonth } from "date-fns";

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function getRandomDateInCurrentMonth() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function nextPaymentMonthGenerator(
  billing_period: SUBSCRIPTION_BILLING_PERIOD,
) {
  switch (billing_period) {
    case SUBSCRIPTION_BILLING_PERIOD.YEARLY:
      return 12;
    default:
      return 1;
  }
}

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "przemek.lewtak@gmai.com",
    },
    update: {
      subscriptions: {
        create: [
          {
            name: "Google Cloud",
            category: "Infrastructure tools",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Google-Avatar.png",
            price: 5.2,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
          {
            name: "Disney+",
            category: "Entertainment",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Disney-Avatar.png",
            price: 8.99,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
          {
            name: "Medium",
            category: "Entertainment",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Medium-Avatar.png",
            price: 5.0,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
          {
            name: "Netflix",
            category: "Entertainment",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Netflix-Avatar.png",
            price: 12.99,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
          {
            name: "DigitalOcean",
            category: "Developer tools",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Zapier-Avatar.png",
            price: 15.99,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
        ],
      },
    },
    create: {
      id: "test123",
      email: "przemek.lewtak@gmai.com",
      name: "Przemek Lewtak",
      subscriptions: {
        create: [
          {
            name: "Google Cloud",
            category: "Infrastructure tools",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Google-Avatar.png",
            price: 5.2,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
          {
            name: "Disney+",
            category: "Entertainment",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Disney-Avatar.png",
            price: 8.99,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
          {
            name: "Medium",
            category: "Entertainment",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Medium-Avatar.png",
            price: 5.0,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
          {
            name: "Netflix",
            category: "Entertainment",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Netflix-Avatar.png",
            price: 12.99,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
          {
            name: "DigitalOcean",
            category: "Developer tools",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://dsc.cloud/88160a/Zapier-Avatar.png",
            price: 15.99,
            currency: SUBSCRIPTION_CURRENCY.GBP,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
        ],
      },
    },
    include: {
      subscriptions: true,
    },
  });

  const updateSubscriptions = await Promise.all(
    user.subscriptions.map(async (subscription) => {
      const due_date = getRandomDateInCurrentMonth();
      const status = isBefore(due_date, new Date())
        ? PAYMENT_STATUS.PAID
        : PAYMENT_STATUS.NOT_PAID;

      await prisma.payment.create({
        data: {
          amount: subscription.price,
          due_date,
          subscriptionId: subscription.id,
          status,
        },
      });
      return prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          next_payment_date:
            status === PAYMENT_STATUS.PAID
              ? addMonths(
                  due_date,
                  nextPaymentMonthGenerator(subscription.billing_period),
                )
              : due_date,
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
