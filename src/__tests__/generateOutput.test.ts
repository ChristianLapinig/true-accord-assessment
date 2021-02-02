import { expect } from "chai";

import generateOutput, { sumPayments, stringifyDate, getNextDueDate, createOutputObj } from "../generateOutput";
import Payment from "../models/payment.model";
import PaymentPlan from "../models/payment-plan.model";
import Debt from "../models/debt.model";

describe("generateOutput ", function () {
  const paymentPlans: PaymentPlan[] = [
    {
      amount_to_pay: 100,
      debt_id: 0,
      id: 0,
      installment_amount: 25,
      installment_frequency: "WEEKLY",
      start_date: "2020-09-17",
    },
    {
      amount_to_pay: 2000,
      debt_id: 1,
      id: 1,
      installment_amount: 500,
      installment_frequency: "BI_WEEKLY",
      start_date: "2020-10-05",
    },
  ];
  const payments: Payment[] = [
    {
      payment_plan_id: 0,
      date: "2020-09-24",
      amount: 25,
    },
    {
      payment_plan_id: 0,
      date: "2020-10-01",
      amount: 25,
    },
    {
      payment_plan_id: 1,
      date: "2020-10-19",
      amount: 2000,
    },
  ];

  describe("sumPayments util function", function () {
    it("adds payment amount to sum", function () {
      const payment: Payment = {
        amount: 25,
        date: "2020-08-21",
        payment_plan_id: 0,
      };
      const expected = 50;
      const actual = sumPayments(25, payment);

      expect(actual).to.equal(expected);
    });
  });

  describe("stringifyDate util function", function () {
    it("stringifies date with single digit month and date", function () {
      const expected = "2020-08-09";
      const actual = stringifyDate(new Date("2020-08-09"));

      expect(actual).to.equal(expected);
    });

    it("stringifies date with double digit month and date", function () {
      const expected = "2020-12-24";
      const actual = stringifyDate(new Date("2020-12-24"));

      expect(actual).to.equal(expected);
    });
  });

  describe("getNextDueDate util function", function () {
    it("gets next payment due date when there are matching payments with WEEKLY installment frequency", function () {
      const matchingPayments = [
        {
          amount: 25,
          date: "2020-08-08",
          payment_plan_id: 0,
        },
        {
          amount: 25,
          date: "2020-08-15",
          payment_plan_id: 0,
        },
      ];
      const paymentPlan = {
        amount_to_pay: 100,
        debt_id: 0,
        id: 0,
        installment_amount: 25,
        installment_frequency: "WEEKLY",
        start_date: "2020-08-01",
      };
      const expected = "2020-08-22";
      const actual = getNextDueDate(matchingPayments, paymentPlan);

      expect(actual).to.equal(expected);
    });

    it("gets next payment due date when there are matching payments with BI_WEEKLY installment frequency", function () {
      const matchingPayments = [
        {
          amount: 25,
          date: "2020-10-01",
          payment_plan_id: 0,
        },
        {
          amount: 25,
          date: "2020-10-15",
          payment_plan_id: 0,
        },
      ];
      const paymentPlan = {
        amount_to_pay: 100,
        debt_id: 0,
        id: 0,
        installment_amount: 25,
        installment_frequency: "BI_WEEKLY",
        start_date: "2020-09-17",
      };
      const expected = "2020-10-29";
      const actual = getNextDueDate(matchingPayments, paymentPlan);

      expect(actual).to.equal(expected);
    });

    it("gets next payment due date using payment plan start date if a payment has not been made yet", function () {
      const paymentPlan = {
        amount_to_pay: 100,
        debt_id: 0,
        id: 0,
        installment_amount: 25,
        installment_frequency: "BI_WEEKLY",
        start_date: "2020-09-17",
      };
      const expected = "2020-10-01";
      const actual = getNextDueDate([], paymentPlan);

      expect(actual).to.equal(expected);
    });
  });

  describe("createOutputObj util function", function () {
    it("generates full output if debt is in a payment plan and still has a remaining balance", function () {
      const debt: Debt = {
        id: 0,
        amount: 150,
      };
      const expected = {
        amount: 150,
        id: 0,
        is_in_payment_plan: true,
        next_payment_due_date: "2020-10-08",
        remaining_amount: 100,
      };
      const actual = createOutputObj(debt, paymentPlans, payments);

      expect(actual).to.deep.equal(expected);
    });

    it("generates output where next_payment_due_date is null because the remaining_amount has been paid", function () {
      const debt: Debt = {
        id: 1,
        amount: 2000,
      };
      const expected = {
        amount: 2000,
        id: 1,
        is_in_payment_plan: true,
        next_payment_due_date: null,
        remaining_amount: 0,
      };
      const actual = createOutputObj(debt, paymentPlans, payments);

      expect(actual).to.deep.equal(expected);
    });

    it("generates output where is_in_payment_plan is false because there is no associated payment plan", function () {
      const debt: Debt = {
        id: 2,
        amount: 300,
      };
      const expected = {
        amount: 300,
        id: 2,
        is_in_payment_plan: false,
        next_payment_due_date: null,
        remaining_amount: 300,
      };
      const actual = createOutputObj(debt, paymentPlans, payments);

      expect(actual).to.deep.equal(expected);
    });
  });

  it("generates output array", function () {
    const debts: Debt[] = [
      {
        id: 0,
        amount: 150,
      },
      {
        id: 1,
        amount: 2000,
      },
      {
        id: 2,
        amount: 300,
      },
    ];
    const expected = [
      {
        amount: 150,
        id: 0,
        is_in_payment_plan: true,
        next_payment_due_date: "2020-10-08",
        remaining_amount: 100,
      },
      {
        amount: 2000,
        id: 1,
        is_in_payment_plan: true,
        next_payment_due_date: null,
        remaining_amount: 0,
      },
      {
        amount: 300,
        id: 2,
        is_in_payment_plan: false,
        next_payment_due_date: null,
        remaining_amount: 300,
      },
    ];
    const actual = generateOutput(debts, paymentPlans, payments);

    expect(actual).to.deep.equal(expected);
  });
});
