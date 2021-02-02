import Api from "./Api";
import Debt from "./models/debt.model";
import generateOutput from "./generateOutput";
import PaymentPlan from "./models/payment-plan.model";
import Payment from "./models/payment.model";
import logOutput from "./logOutput";

async function main() {
	const api: Api = new Api();
	const debts: Debt[] = await api.fetchDebts();
	const paymentPlans: PaymentPlan[] = await api.fetchPaymentPlans();
	const payments: Payment[] = await api.fetchPayments();
	const output = generateOutput(debts, paymentPlans, payments);

	logOutput(output);
}

main();
