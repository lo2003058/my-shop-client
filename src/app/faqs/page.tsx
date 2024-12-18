import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Items must be returned in their original condition and packaging. Some exclusions may apply.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 5-7 business days, while expedited shipping options are available for faster delivery.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to select countries. Shipping times and costs may vary based on the destination.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you will receive an email with a tracking number and a link to track your shipment.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and other payment methods depending on your region. Check our payment options during checkout for more details.",
  },
  {
    question: "Can I cancel or modify my order after placing it?",
    answer:
      "You can cancel or modify your order within 24 hours of placement. Please contact our customer support team for assistance.",
  },
  {
    question: "Do you offer gift wrapping services?",
    answer:
      "Yes, gift wrapping is available for an additional fee at checkout. You can also include a personalized message with your gift.",
  },
  {
    question: "What should I do if I receive a damaged item?",
    answer:
      "If you receive a damaged item, please contact our customer service team within 7 days of delivery with photos of the damage, and we will assist you with a replacement or refund.",
  },
  {
    question: "Do you have a loyalty program?",
    answer:
      "Yes, we offer a loyalty program where you can earn points for purchases, reviews, and referrals. Points can be redeemed for discounts on future orders.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can contact our customer support team via email, live chat, or by calling our toll-free number. Visit the Contact Us page for more details.",
  },
];

export default function FAQs() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="pt-6">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                    <span className="text-base/7 font-semibold">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <FontAwesomeIcon
                        icon={faPlus}
                        aria-hidden="true"
                        className="size-6 group-data-[open]:hidden"
                      />
                      <FontAwesomeIcon
                        icon={faMinus}
                        aria-hidden="true"
                        className="size-6 group-[&:not([data-open])]:hidden"
                      />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <p className="text-base/7 text-gray-600">{faq.answer}</p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
