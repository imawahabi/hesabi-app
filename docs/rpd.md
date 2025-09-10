# Rapid Product Definition (RPD)

## 1. 🧑‍💻 User Persona

**Name:** hesabi

**Age:** 30

**Occupation:** Marketing Manager at a tech company in Kuwait City.

**Financial Profile:** hesabi is financially savvy but struggles to keep track of his various financial commitments. He has a car loan, a personal loan he took for his wedding, and several monthly bills, including his rent, phone bill, and utilities. He also has a couple of "buy now, pay later" installments for recent purchases. He is looking for a simple and intuitive app to help him manage his finances, so he can stay on top of his payments and avoid late fees.

**Goals:**
- To have a clear overview of all his financial commitments in one place.
- To receive timely reminders for upcoming payments.
- To track his progress in paying off his debts.
- To understand his spending habits better.

**Frustrations:**
- He often forgets the due dates for his various bills and installments.
- He finds it tedious to manually track his payments in a spreadsheet.
- He is not sure how much he is paying in interest for his loans.

## 2. 🗂️ Commitment Types (Expanded)

### 💳 Bank Loan

- **Fields:**
  - Loan Name (e.g., "Car Loan", "Personal Loan")
  - Bank Name (from a predefined list of banks in Kuwait)
  - Total Loan Amount
  - Interest Rate (with an option for fixed or variable rates)
  - Loan Term (in years or months)
  - Monthly Installment (can be calculated automatically based on the other fields)
  - Start Date and End Date
- **User Interactions:**
  - The user can view the amortization schedule to see how much of each payment goes towards principal and interest.
  - The app will show a progress bar to visualize the loan payoff progress.

### 👥 Personal Debt

- **Fields:**
  - Person's Name (from the contact list)
  - Debt Amount
  - Due Date (with an option for recurring payments)
  - Notes (for any additional details)
- **User Interactions:**
  - The user can easily add a new debt for an existing contact.
  - The app will send a notification to the user when a payment is due.
  - The user can mark a debt as "paid" and it will be moved to the history.

### 📱 Installments

- **Fields:**
  - Store/Company Name (e.g., "Eureka", "Xcite", "Zain")
  - Total Amount
  - Number of Installments
  - Monthly Payment
  - First Payment Date
- **User Interactions:**
  - The app will automatically create a recurring commitment for the specified number of months.
  - The user can see how many installments are left to pay.

### 🏢 Rent

- **Fields:**
  - Monthly Rent Amount
  - Due Date (e.g., "1st of every month")
- **User Interactions:**
  - The app will create a recurring commitment for the rent.
  - The user can easily mark the rent as "paid" each month.

### 🧾 Utilities

- **Fields:**
  - Utility Type (e.g., "Electricity & Water", "Internet")
  - Provider Name
  - Due Date
- **User Interactions:**
  - The user can enter the amount for each month's bill.
  - The app will show a history of the user's utility payments.

## 3. ✨ Feature Deep Dive: Reports

The "Reports" feature will provide users with valuable insights into their financial situation. It will include the following:

- **Monthly Summary:** A summary of the user's financial activity for the current month, including:
  - Total income
  - Total commitments
  - Total payments made
  - A breakdown of commitments by type (e.g., loans, installments, bills)
- **Cash Flow Analysis:** A chart showing the user's income and expenses over time. This will help the user to identify spending patterns and areas where they can save money.
- **Debt Payoff Progress:** A report showing the user's progress in paying off their debts. This will include:
  - A list of all debts, with the remaining balance for each.
  - A projection of when each debt will be paid off, based on the current payment schedule.
- **Export to PDF:** The user will be able to export their reports to PDF, so they can easily share them with a financial advisor or keep them for their records.