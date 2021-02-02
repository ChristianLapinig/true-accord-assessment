# TrueAccord Take Home Assignment

This is my submission for TrueAccord's take home assignment. This README contains an overview of the problem along with my thought process.

## Problems

Imagine that you are writing an internal admin tool. Please complete the following tasks. Use the database schema and API documentation as a reference.

1. Consume the HTTP API endpoints described below to create a script that will output debts, one JSON object per line, to stdout. Each line should contain:

- All of the debt's fields returned by the API
- An additional boolean field, "is_in_payment_plan" set to true, if the debt is associated with a payment plan
- NOTE: You are not expected to create your own server backend. Although the data is mocked, use these endpoints as though it was real data.

2. Provide a test suite that validates the output being produced, along with any other operations performed internally.

3. Add a new field to the debts in the output: remaining_amount, containing the calculated amount remaining to be paid on the debt. Output the value as a JSON number.

4. Add a new field to the output: "next_payment_due_date", containing the ISO 8601 UTC date of when the next payment is due or null if there is no payment plan or if the debt has been paid off.

- The next payment date can be calculated by using the payment plan start_date, the installment frequency, and any preexisting payments

## Usage

### Step 1. Clone repository

`$ git clone https://github.com/ChristianLapinig/true-accord-assessment.git`

### Step 2. Install dependences

```
$ cd true-accord-assessment
$ yarn install
```

### Step 3. Run Script & Tests

```
$ yarn start
$ yarn test
```

## Thought Process

### Problem 1

- Each debt has an ID and each paymentplan has a `debt_id` field.
- Go through the payment plans data and find where the `id` of a debt matches the `debt_id` of a payment plan.
  - If there is a match, set `is_in_payment_plan` field in debt output to `true`. Otherwise, the field will be `false`. In this case, a debt not associated with a payment plan will be undefined, so set `is_in_payment_plan` to if searching for a payment plan is `undefined` or not.

1. Read debt and payment plan data from API endpoint.

2. Search the returned data from the endpoint for matching `debt.id` and `paymentPlan.debt_id`.

3. If a payment has been found, set `is_in_payment_plan` to `true`, else `false`.

### Problem 2

- Test if output depending on different data sets.
- Test createOutputObj to test if debts are associated with a payment plan, `next_payment_due_date` is null or not
  depending if `is_in_payment_plan || remaining_amount == 0`.
- Test util functions for generateOutput.
  - Unit test reducer callback function for correct sums.
  - Unit test getNextDueDate function for correct date format.

### Problem 3

- The each payment from the payments table assosicates it with a `payment_plan_id` and an `amount` which can be the `installment_amount` from the payment plan table, or any other amount.

- `debt.amount` might be more than `paymentPlan.amount`. The `remaining_amount` field can be calculated using `debt.amount - sum of matching payments`.

1. Find matching payments by searching through the payments plan data and searching for `payment.payment_plan_id == paymentPlan.id` using JavaScript/TypeScript `filter` function on arrays.

2. Sum up the matching payments using JavaScript/TypeScript `reduce` function on arrays.

3. Calculate `remaining_amount` by calculating `debt.amount - sum of matching payments`.

### Problem 4

- `next_payment_due_date` can be found using `start_date` and `installment_frequency` from the payment plans table, and `date` from the payments table and will have the format of YYYY-MM-DD.

- If the debt is not associated with a payment plan, or if the `remaining_amount` is 0, then set `next_payment_due_date` to null.

- If a payment has not been made on a payment plan yet, the next date will be the value of `paymentPlan.installment_freqency` added to `paymentPlan.start_date`. If a payment or payments have been made, we can take the date from the most recent payment and add `paymentPlan.installment_frequency` to that date.

- `installment_frequency` is a string value of either WEEKLY or BI_WEEKLY where WEEKLY = 7 days and BI_WEEKLY = 14 days.

1. If `is_in_payment_plan` or `remaining_amount` equals 0, set `next_payment_due_date` to null. Else, move on with the rest of the problem.

2. Check if there are any matching payments. If there are any, use the most recent payment. If none exist, use `paymentPlan.start_date`.

3. Set `next_payment_due_date` to the most recent payment or the start date plus `installment_frequency` converted to either 7 for WEEKLY or 14 for BI_WEEKLY.

## Tech Stack

1. TypeScript for the code.

2. Node.js to run the script.

3. `axios` package to make HTTP API calls.

4. `mocha` and `chai` to run test suite.
