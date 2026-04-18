# Software Requirements Specification (SRS)
## CardMatch India

Document Version: 1.0  
Date: April 18, 2026  
Prepared for: CardMatch India Academic Project

---

## 1. INTRODUCTION

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional and non-functional requirements for CardMatch India, a web-based credit card recommendation platform. The system is designed to help users discover suitable credit cards based on category-level spending behavior and monthly spend estimates. This document establishes a shared understanding of system behavior for developers, testers, project reviewers, and stakeholders.

The purpose of this SRS is to provide a complete, implementation-aligned requirement baseline for design, development, validation, deployment, and maintenance. It also acts as a reference artifact for academic review by documenting the system scope, constraints, user workflows, and quality expectations in a professional, structured format.

### 1.2 Scope
CardMatch India is an interactive web application that collects spending preferences and spend amounts from users, evaluates available cards using a scoring engine, and presents ranked recommendations with estimated annual savings. The platform supports comparison of shortlisted cards and provides direct outbound links for users to continue applications on official bank websites.

The product scope includes the following major capabilities:
1. Multi-step onboarding to capture spending categories and optional brand interests.
2. Monthly spending input by category, used in annual savings calculations.
3. Recommendation generation through a TypeScript scoring engine.
4. Results display with card details, estimated savings, fees, trade-offs, and benefits.
5. Apply Now redirection to external bank application pages.
6. Compare feature for side-by-side analysis of up to three cards.
7. Responsive user interface suitable for desktop and mobile users.

The scope excludes direct card application processing, identity verification, payment processing, and bank-side underwriting. CardMatch India is a recommendation and decision-support system, not a card issuance or approval platform.

### 1.3 Definitions, Acronyms, and Abbreviations
CardMatch India: The proposed web application for personalized credit card recommendations.  
SRS: Software Requirements Specification.  
UI: User Interface.  
API: Application Programming Interface.  
DB: Database.  
RLS: Row-Level Security (Supabase/PostgreSQL security policy model).  
SSR: Server-Side Rendering.  
CSR: Client-Side Rendering.  
Scoring Engine: Internal algorithmic module that computes recommendation scores and estimated savings.  
Primary Category: User's highest-priority spend category.  
Secondary Categories: Additional categories selected by user for recommendation refinement.  
Net Annual Savings: Estimated annual reward value minus annual fee.

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective
CardMatch India is a modular web system built on Next.js and TypeScript. The application combines:
1. A user-facing frontend for onboarding, results visualization, and comparison.
2. A recommendation logic layer that evaluates card data against user profile inputs.
3. A Supabase-backed data source for credit card records.

The system behaves as a decision-support layer between user intent and public bank information. It receives user preferences, transforms them into structured input, computes recommendation outcomes, and outputs ranked cards with explainable reasons.

From an architectural perspective, CardMatch India is an independent product but can be extended into a larger fintech ecosystem by introducing authentication, profile persistence, recommendation history, and API integrations with partner systems.

### 2.2 User Classes and Characteristics
#### 2.2.1 End Users (Primary User Class)
End users are individuals seeking a suitable credit card. They are expected to:
1. Select spending categories relevant to personal lifestyle.
2. Enter approximate monthly spending values.
3. Review ranked recommendations and compare selected cards.
4. Navigate to official bank links for final application.

Expected technical proficiency is basic to intermediate web literacy. Users may be mobile-first and may not understand advanced financial terminology, so clear wording and transparent presentation are required.

#### 2.2.2 Admin or Data Management Users (Secondary User Class)
Admin-level users maintain the card dataset and ensure recommendation quality. Their activities include:
1. Maintaining card records in Supabase data storage.
2. Verifying values such as annual fees, reward rates, and apply links.
3. Monitoring recommendation consistency and correcting stale data.

In the current scope, admin workflows may be handled outside the user-facing UI through controlled database operations.

### 2.3 Operating Environment
CardMatch India operates in the following environment:
1. Frontend runtime: Next.js (React + TypeScript) running in modern browsers.
2. Backend logic runtime: TypeScript scoring logic executed within the application layer.
3. Data platform: Supabase (PostgreSQL-backed), accessed via Supabase client.
4. Styling and presentation: Tailwind CSS.
5. Deployment target: Vercel.

Supported client platforms include current desktop and mobile browsers that support modern JavaScript, CSS, and responsive layouts. Stable internet connectivity is required for database fetches and external redirection.

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 User Onboarding
The onboarding module shall guide users through a multi-step flow that captures preference inputs required for recommendation generation.

FR-ONB-1: The system shall present selectable primary spending categories such as Shopping, Travel, Dining, Movies, Fuel, and Electronics.  
FR-ONB-2: The system shall permit selection of one or more categories and treat the first selected category as primary preference.  
FR-ONB-3: The system shall provide a secondary step for interest refinement (for example, brand preferences) to improve perceived personalization.  
FR-ONB-4: The system shall support progression controls between onboarding steps (Next and Back) and block progression when required selection criteria are not met.  
FR-ONB-5: The system shall construct result-page parameters from captured onboarding input.

Behavioral expectation: onboarding should remain clear, low-friction, and complete within a small number of interactions.

### 3.2 Spending Input System
The spending input feature captures monthly spending and transforms it into annualized values used by the recommendation engine.

FR-SPD-1: The system shall provide numeric monthly spending input fields for selected categories.  
FR-SPD-2: The system shall accept zero or blank input and safely interpret invalid or missing values as zero for scoring continuity.  
FR-SPD-3: The system shall convert monthly category values into annual spending during recommendation calculation.  
FR-SPD-4: The system shall carry spending values to the results flow without requiring user account creation.

Business rationale: spending input significantly improves recommendation relevance compared to static category-only matching.

### 3.3 Recommendation Engine Logic
The recommendation module converts user intent into ranked card outcomes.

FR-REC-1: The system shall fetch card records from the database before recommendation computation.  
FR-REC-2: The system shall normalize category identifiers to a stable internal format before comparison.  
FR-REC-3: The system shall evaluate reward rates for primary and secondary categories and compute a reward contribution estimate.  
FR-REC-4: The system shall include annualized user spending input in reward estimation.  
FR-REC-5: The system shall compute net annual savings as estimated reward benefit minus annual fee.  
FR-REC-6: The system shall sort recommendations in descending order of net annual savings.  
FR-REC-7: The system shall return a bounded top-N recommendation list for display (for example, top five cards).  
FR-REC-8: The system shall generate explanation text indicating why each card was recommended and summarize trade-off details.

Algorithm intent: prioritize explainable, financially interpretable ranking over opaque scoring.

### 3.4 Results Display
The results module renders recommendation outputs in a user-readable format.

FR-RES-1: The system shall display card name, bank, estimated savings, fee information, benefits, recommendation rationale, and trade-off summary.  
FR-RES-2: The system shall visually identify the highest-ranked recommendation as the top match.  
FR-RES-3: The system shall support empty-state handling when no recommendations satisfy matching criteria.  
FR-RES-4: The interface shall support responsive rendering across desktop and mobile viewports.  
FR-RES-5: The system shall present values consistently, including safe defaults when optional fields are missing.

### 3.5 Apply Link Redirection
CardMatch India supports outbound redirection for final user action.

FR-APL-1: The system shall display an Apply Now action when a valid apply link exists for a card.  
FR-APL-2: The system shall open the destination in a separate browser tab/window to preserve user session context in CardMatch India.  
FR-APL-3: The system shall include secure external-link handling attributes to reduce client-side exploitation risk.  
FR-APL-4: The system shall not process bank application forms internally.

### 3.6 Compare Cards Feature
The compare module supports side-by-side evaluation of shortlisted cards.

FR-CMP-1: The system shall allow users to add cards from results to a compare list.  
FR-CMP-2: The compare list shall enforce a maximum selection count of three cards.  
FR-CMP-3: The system shall persist compare selections temporarily in browser storage for continuity during navigation.  
FR-CMP-4: The compare page shall display feature rows (savings, fees, reward type, fee waiver, and derived helper fields) across selected cards.  
FR-CMP-5: The compare page shall support removing one card or clearing all selections.  
FR-CMP-6: The compare page shall support an empty-state message when no cards are selected.

---

## 4. USE CASES

### 4.1 Use Case UC-01: Generate Recommendations
Use Case Name: Generate Recommendations  
Primary Actor: End User  
Secondary Actor: Recommendation Engine  
Trigger: User requests recommendations after completing onboarding inputs.

Preconditions:
1. Application is reachable in browser.
2. Card dataset is available in database.
3. User has selected at least one spend category.

Main Success Scenario:
1. User opens onboarding page.
2. User selects one or more categories.
3. User optionally refines interests in secondary onboarding step.
4. User proceeds to recommendation action.
5. System constructs query/profile payload from selected inputs.
6. System fetches card data from Supabase.
7. System normalizes categories and validates spend values.
8. System runs scoring logic and computes net annual savings for matched cards.
9. System sorts cards by highest net savings.
10. System displays ranked recommendations with explanation and trade-off details.

Alternative Flows:
1. If data fetch fails, system returns no recommendations and renders safe empty state.
2. If no cards match selected categories, system renders no-results state.
3. If spending fields are blank, system defaults to zero and still computes category baseline savings.

Postconditions:
1. User sees ranked recommendation list.
2. Top card is visibly identified as best match.
3. User may continue to compare or apply actions.

Success Guarantee:
A recommendation screen is rendered without application crash, even in partial-data conditions.

### 4.2 Use Case UC-02: Enter Spending
Use Case Name: Enter Monthly Spending  
Primary Actor: End User  
Trigger: User chooses to input spending values in onboarding.

Preconditions:
1. User has selected at least one category.
2. Spending input controls are visible.

Main Success Scenario:
1. System displays category-wise numeric input fields.
2. User enters monthly amount for one or more categories.
3. System validates each entry as numeric and non-negative.
4. User leaves one or more fields blank.
5. System accepts blank fields and records them as zero-equivalent for calculation.
6. User proceeds to next step and then recommendation page.
7. System converts monthly values into annualized spending values during scoring.

Alternative Flows:
1. If user enters non-numeric content, parsing logic safely converts to zero.
2. If user enters very large values, system still processes them numerically and returns best effort ranking.

Postconditions:
1. Spending values are included in recommendation context.
2. Computed savings reflect user-entered values where provided.

### 4.3 Use Case UC-03: Compare Cards
Use Case Name: Compare Selected Cards  
Primary Actor: End User  
Trigger: User clicks Add to Compare in results list.

Preconditions:
1. Recommendation list is visible.
2. At least one card is available.

Main Success Scenario:
1. User clicks Add to Compare for a card.
2. System normalizes card payload into compare-safe shape.
3. System stores card in compare state.
4. User repeats add action for additional cards.
5. System enforces maximum of three cards.
6. User opens compare page.
7. System renders side-by-side table with selected cards and comparable feature rows.
8. User removes a card or clears all cards as needed.

Alternative Flows:
1. If user attempts to add a duplicate card, system ignores duplicate add.
2. If user attempts to exceed three cards, system blocks action and notifies limit.
3. If compare list is empty, system shows empty-state guidance.

Postconditions:
1. User obtains comparative understanding of selected options.
2. Compare state persists in current browser session storage pattern until cleared.

### 4.4 Use Case UC-04: Apply for Card
Use Case Name: Redirect to Bank Application  
Primary Actor: End User  
Secondary Actor: External Bank Website  
Trigger: User clicks Apply Now on recommendation card.

Preconditions:
1. Card record contains valid apply link.
2. Results list is visible.

Main Success Scenario:
1. User reviews recommended card details.
2. User clicks Apply Now.
3. System opens external bank URL in new tab/window.
4. User continues application flow on official bank platform.
5. Original CardMatch page remains open for additional comparison or review.

Alternative Flows:
1. If apply link is missing, Apply Now action is not rendered.
2. If external site fails to load, control remains with user browser behavior and CardMatch state is unaffected.

Postconditions:
1. User is redirected to bank-controlled application channel.
2. CardMatch India does not store or process bank application details.

---

## 5. DATA REQUIREMENTS

### 5.1 Data Source and Retrieval Model
CardMatch India stores card information in Supabase. The retrieval flow reads rows from a cards table and selects a data payload field. Each row maps to one card object used by the recommendation engine.

Data retrieval requirements:
1. The system shall read card records using authenticated Supabase client configuration.
2. The system shall handle empty or error response safely by returning an empty array.
3. The recommendation engine shall treat card arrays as the canonical computation input.

### 5.2 Card Data Structure
A card object should support at least the following fields for recommendation and display:
1. id: Unique identifier for each card record.
2. card_name: Display name of the card.
3. bank: Issuing bank name.
4. annual_fee: Annual fee amount used in net savings calculation.
5. apply_link: External URL for official application redirection.
6. other_benefits: List of user-facing benefit strings.
7. category_rewards: Array of category reward entries.
8. subcategory_rewards: Optional array for deeper reward mapping.

Category reward entry fields include:
1. category_id or category: Category key used for matching.
2. reward_rate: Percentage reward rate applied in savings computation.

Derived fields used in recommendation output include:
1. rank: Ranking position in result set.
2. netAnnualSavings: Numeric annual net benefit estimate.
3. displaySavings: Human-readable formatted savings string.
4. whyRecommended: Explanation statement based on matched rewards.
5. tradeoff: Fee or limitation summary.

### 5.3 Data Usage in Processing
The data processing pipeline uses raw card records in these stages:
1. Input normalization of selected categories and spending values.
2. Reward aggregation per card using category reward mapping.
3. Annual spending weighting based on monthly spend input and baseline multipliers.
4. Annual fee subtraction to calculate net annual savings.
5. Sorting and top-result extraction.
6. UI rendering for recommendation and compare modules.

### 5.4 Data Validation and Integrity Expectations
Data quality directly affects recommendation trust. The system expects:
1. Reward arrays to be valid arrays rather than object maps.
2. Numeric fields like annual_fee and reward_rate to be parseable.
3. Category identifiers to be normalizable to internal matching format.
4. apply_link values to be maintained as valid outbound URLs.

Where fields are missing or malformed, fallback-safe behavior shall preserve application continuity while reducing confidence of recommendation output.

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance
NFR-PERF-1: The system should render onboarding interactions with near-instant client response for selection and input actions.  
NFR-PERF-2: Recommendation generation should complete within acceptable web interaction latency for typical dataset sizes used in the project.  
NFR-PERF-3: Database query and rendering should avoid blocking user navigation excessively.  
NFR-PERF-4: Compare operations should be client-fast because selected-card volume is intentionally small.

### 6.2 Scalability
NFR-SCL-1: The architecture should support growth in card catalog size without fundamental redesign.  
NFR-SCL-2: Scoring logic should remain maintainable for extension into additional categories or weighted dimensions.  
NFR-SCL-3: Deployment on Vercel should support traffic bursts through platform-level scaling characteristics.  
NFR-SCL-4: Supabase schema and indexing strategy should be maintainable for moderate data expansion.

### 6.3 Security
NFR-SEC-1: Supabase credentials shall be managed via environment variables and not hardcoded in source.  
NFR-SEC-2: External links shall use safe browser attributes for outbound navigation.  
NFR-SEC-3: The system shall avoid collecting sensitive personal financial identifiers in current scope.  
NFR-SEC-4: Data operations shall comply with least-privilege database access principles where feasible.  
NFR-SEC-5: Client-side inputs shall be sanitized and safely parsed before calculation.

### 6.4 Usability
NFR-USE-1: The onboarding flow shall be understandable to first-time users without documentation.  
NFR-USE-2: Recommendation outputs shall include plain-language reasons and trade-offs.  
NFR-USE-3: UI labels and call-to-action text shall be clear and context-appropriate.  
NFR-USE-4: The system shall provide meaningful empty states and limit messages.  
NFR-USE-5: Responsive behavior shall preserve readability and actionability across screen sizes.

### 6.5 Compatibility
NFR-CMP-1: The application shall support latest mainstream desktop and mobile browsers.  
NFR-CMP-2: The system shall function in environments where JavaScript is enabled.  
NFR-CMP-3: The layout shall adapt to varied viewport dimensions without functional loss.  
NFR-CMP-4: The product shall remain compatible with Next.js deployment conventions on Vercel.

---

## 7. SYSTEM CONSTRAINTS

### 7.1 Technical Constraints
1. The system relies on Supabase availability for fresh card data retrieval.
2. Recommendation quality depends on correctness and completeness of category reward mappings.
3. Compare feature is intentionally capped at three cards for UI simplicity and user cognition.
4. In current implementation scope, recommendation computation runs within application logic and is not a separate microservice.
5. Missing environment variables for Supabase prevent successful application startup.

### 7.2 Business Constraints
1. CardMatch India does not issue cards and cannot guarantee approval outcomes.
2. Estimated savings are advisory projections, not financial guarantees.
3. Apply links must point to official bank channels; external site behavior is outside project control.
4. Data freshness depends on periodic maintenance by project owner or admin role.

### 7.3 Data Constraints
1. Inconsistent category naming can reduce match quality unless normalized correctly.
2. Incomplete records (for example, absent apply links or reward rates) may reduce recommendation coverage.
3. Dataset bias toward specific banks or card types can influence ranking diversity.
4. The current model uses category-level rewards and fee offsets; it does not model every real-world rule such as spend caps, exclusions, or dynamic offers unless explicitly encoded.

---

## 8. APPENDIX A: SYSTEM ARCHITECTURE DIAGRAM

Text-Based Architecture Diagram:

```
+---------------------------+
| Web Browser (Client)      |
| User onboarding and views |
+---------------------------+
              |
              v
+---------------------------+
| Next.js Frontend          |
| React + TypeScript + UI   |
+---------------------------+
              |
              v
+---------------------------+
| Scoring Engine Logic      |
| Category matching, rank   |
+---------------------------+
              |
              v
+---------------------------+
| Supabase Database         |
| PostgreSQL card dataset   |
+---------------------------+
```

Architecture Notes:
1. The browser hosts interactive onboarding, results, and compare flows.
2. Next.js orchestrates page routing, data loading, and client rendering.
3. The scoring engine transforms input plus card data into ranked recommendation objects.
4. Supabase stores source card records and serves as persistent backend data layer.

---

## 9. APPENDIX B: DATA FLOW DIAGRAM

Text-Based End-to-End Data Flow:

```
User selects categories
        |
        v
User enters monthly spending
        |
        v
System validates and normalizes input
        |
        v
System fetches card data from Supabase
        |
        v
Scoring engine applies reward and fee logic
        |
        v
System computes and sorts ranked recommendations
        |
        v
Results page displays cards, savings, and trade-offs
        |
        v
User clicks Apply Now -> Redirect to bank website
```

Flow Notes:
1. Validation and normalization are essential to prevent category mismatch and parse errors.
2. The scoring stage produces explainable artifacts, not only a raw numeric score.
3. Sorting and top-result capping improve readability and decision focus.
4. Final application interaction is delegated to the external bank domain.

---

## Additional Quality and Validation Considerations

### Test-Oriented Requirement Coverage
For practical verification during project review, each requirement group should map to test scenarios:
1. Onboarding tests for category selection and step navigation.
2. Spending input tests for blank, zero, and invalid numeric entries.
3. Engine tests for category normalization, fee subtraction, and ranking order.
4. Results tests for empty-state fallback and top-card labeling.
5. Compare tests for add, duplicate prevention, max-limit enforcement, remove, and clear-all.
6. Redirect tests for apply link rendering and external navigation behavior.

### Assumptions
1. Card dataset contains meaningful reward metadata across major spending categories.
2. Users provide approximate spending values, not audited financial records.
3. Network connectivity is available during recommendation generation.
4. Project scope prioritizes recommendation usefulness and clarity over complete financial product simulation.

### Future Enhancements (Out of Current Scope)
1. User authentication and profile-based recommendation history.
2. Saved comparisons and shareable recommendation reports.
3. Explainability panel with detailed score breakdown per category.
4. Offer expiry tracking and time-sensitive campaign integration.
5. Admin dashboard for direct card-data lifecycle management.

---

End of Document
