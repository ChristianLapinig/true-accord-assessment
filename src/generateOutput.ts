import Debt from "./models/debt.model";
import PaymentPlan from "./models/payment-plan.model";
import Payment from "./models/payment.model";

/*
 * Generates output by adding the following fields to the debt objects
 * 1. is_in_payment_plan: boolean - Does the debt.id match paymentPlan.debt_id?
 * 2. remaining_amount: debt.amount - sum of matching payments
 * 3. next_payment_due_date: date - Date of next payment. Determined by paymentPlan.installment_frequency and remaining amount
 */

// Reducer callback to get sum of matching payments
export const sumPayments = (val: number, payment: Payment) => val + payment.amount;

// Util function to stringify date in UTC 8601 date form (YYYY-MM-DD)
export const stringifyDate = (paymentDate: Date): string => {
  const year = paymentDate.getUTCFullYear();
  let month = "" + (paymentDate.getUTCMonth() + 1);
  let date = "" + paymentDate.getUTCDate();

  if (month.length < 2) month = `0${month}`;
  if (date.length < 2) date = `0${date}`;

  return [year, month, date].join("-");
};

export const getNextDueDate = (matchingPayments: any[], paymentPlan: any) => {
  const mostRecentPayment = matchingPayments.length > 0 ? matchingPayments[matchingPayments.length - 1] : null;
  const lastDueDate: Date = mostRecentPayment ? new Date(mostRecentPayment.date) : new Date(paymentPlan.start_date);

  switch (paymentPlan.installment_frequency) {
    case "WEEKLY":
      lastDueDate.setDate(lastDueDate.getDate() + 7);
      break;
    case "BI_WEEKLY":
      lastDueDate.setDate(lastDueDate.getDate() + 14);
      break;
    default:
      break;
  }

  return stringifyDate(new Date(lastDueDate));
};

export const createOutputObj = (debt: Debt, paymentPlans: PaymentPlan[], payments: Payment[]) => {
  const paymentPlan = paymentPlans.find((paymentPlan: PaymentPlan) => debt.id === paymentPlan.debt_id);
  const is_in_payment_plan = paymentPlan !== undefined;
  const matchingPayments = payments.filter((payment: Payment) => payment.payment_plan_id === paymentPlan?.id);
  const remaining_amount = debt.amount - matchingPayments.reduce(sumPayments, 0);
  const next_payment_due_date =
    is_in_payment_plan && remaining_amount !== 0 ? getNextDueDate(matchingPayments, paymentPlan) : null;

  return {
    ...debt,
    is_in_payment_plan,
    next_payment_due_date,
    remaining_amount: parseFloat(remaining_amount.toFixed(2)),
  };
};

const generateOutput = (debts: Debt[] = [], paymentPlans: PaymentPlan[] = [], payments: Payment[]) => {
  return debts.map((debt: Debt) => createOutputObj(debt, paymentPlans, payments));
};

export default generateOutput;
