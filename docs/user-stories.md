# MVP User Stories

## 🔑 Authentication

**User Story:** As a user, I want to create an account (sign up) so that I can start saving my commitments and incomes securely.

- **Acceptance Criteria:**
  - **Given** I am on the login screen, **when** I tap the 'Sign up with Google' button, **then** I should be redirected to the Google authentication screen.
  - **Given** I have successfully authenticated with Google, **when** I am redirected back to the app, **then** I should be logged in and taken to the main dashboard.

**User Story:** As a user, I want to log in with my account so that I can access my saved data from any device.

- **Acceptance Criteria:**
  - **Given** I am on the login screen, **when** I tap the 'Sign in with Google' button, **then** I should be redirected to the Google authentication screen.
  - **Given** I have successfully authenticated with Google, **when** I am redirected back to the app, **then** I should be logged in and taken to the main dashboard.

## 📒 Commitments

**User Story:** As a user, I want to add a new commitment (bank loan, company installment, personal debt, or saving) so that I can track my obligations.

- **Acceptance Criteria:**
  - **Given** I am on the dashboard, **when** I tap the 'Add Commitment' button, **then** I should be taken to a screen where I can choose the commitment type.
  - **Given** I have selected a commitment type, **when** I am on the 'Add Commitment' screen, **then** I should see the relevant fields for that commitment type.
  - **Given** I have filled in all the required fields, **when** I tap the 'Save' button, **then** the new commitment should be added to my list of commitments.

**User Story:** As a user, I want to see a list of all my active commitments so that I can quickly check what I owe.

- **Acceptance Criteria:**
  - **Given** I am on the dashboard, **then** I should see a list of all my active commitments.
  - **For** each commitment in the list, **I should see** the name of the commitment, the remaining amount, and the next payment date.

**User Story:** As a user, I want to view details of a specific commitment so that I can see payment history, remaining months, and total paid.

- **Acceptance Criteria:**
  - **Given** I am on the dashboard, **when** I tap on a commitment, **then** I should be taken to a screen with the details of that commitment.
  - **On** the commitment details screen, **I should see** the payment history, the number of remaining months, and the total amount paid.

## 💵 Payments

**User Story:** As a user, I want to add a payment to a commitment so that I can update how much I have paid so far.

- **Acceptance Criteria:**
  - **Given** I am on the commitment details screen, **when** I tap the 'Add Payment' button, **then** I should be taken to a screen where I can enter the payment amount and date.
  - **Given** I have entered the payment amount and date, **when** I tap the 'Save' button, **then** the payment should be added to the payment history for that commitment.

## 📈 Incomes

**User Story:** As a user, I want to add an income (salary or other source) so that I can compare my commitments against my earnings.

- **Acceptance Criteria:**
  - **Given** I am on the 'Incomes' screen, **when** I tap the 'Add Income' button, **then** I should be taken to a screen where I can enter the income source, amount, and date.
  - **Given** I have entered the income details, **when** I tap the 'Save' button, **then** the income should be added to my list of incomes.

## 📊 Dashboard & Analytics

**User Story:** As a user, I want to see a dashboard showing total commitments, total income, and remaining balance so that I have a financial overview.

- **Acceptance Criteria:**
  - **Given** I am on the dashboard, **then** I should see a summary of my total commitments, total income, and remaining balance for the current month.

**User Story:** As a user, I want to receive notifications before payment due dates so that I don’t miss any commitment.

- **Acceptance Criteria:**
  - **Given** I have a commitment with an upcoming due date, **then** I should receive a notification 3 days before the due date.