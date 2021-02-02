import axios from "axios";
import Debt from "./models/debt.model";
import PaymentPlan from "./models/payment-plan.model";
import Payment from "./models/payment.model";

class Api {
	async fetchDebts(): Promise<Debt[]> {
		try {
			const res = await axios.get("https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/debts");
			return res.data;
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	async fetchPaymentPlans(): Promise<PaymentPlan[]> {
		try {
			const res = await axios.get("https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payment_plans");
			return res.data;
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	async fetchPayments(): Promise<Payment[]> {
		try {
			const res = await axios.get("https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payments");
			return res.data;
		} catch (err) {
			console.error(err);
			return [];
		}
	}
}

export default Api;
