# Submission Tracker - Implementation Notes

## Approach
- Built the backend and frontend around the challenge workflow: list -> filter -> detail review.
- Extended backend filtering to support `status`, `brokerId`, `companySearch`, plus additional filters: `createdFrom`, `createdTo`, `hasDocuments`, and `hasNotes`.
- Optimized submission API query shape with relational loading for broker/company/owner and detail prefetching for contacts/documents/notes.
- Implemented a polished frontend experience across:
  - `/` landing page
  - `/submissions` list view with URL-synced filters and pagination
  - `/submissions/[id]` detail page with summary, contacts, documents, and notes
- Kept frontend filters synced to URL query params so links are shareable and state is preserved on refresh.

## Tradeoffs
- Prioritized product polish and end-to-end workflow completeness over adding more advanced backend features (auth/permissions, sorting APIs, etc.).
- Kept filtering and pagination behavior explicit and readable rather than abstracting too early into reusable UI primitives.
- Used targeted test coverage for critical page behaviors (list/detail rendering + key interactions) instead of broad snapshot-heavy tests.

## How To Run


### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_submissions
python manage.py runserver 0.0.0.0:8000
```

### Frontend
```bash
cd frontend
cp env.example .env.local
npm install
npm run dev
```

Open:
- List: `http://localhost:3000/submissions`
- Detail example: `http://localhost:3000/submissions/1`

## Demo Video (max 2 minutes)
- Screen capture link: [https://drive.google.com/file/d/14MxDmfaYqT4Xy5ht2hg3t7zkcvInreCl/view?usp=sharing]

## Stretch Goals Implemented
- Added richer filtering controls beyond core requirement (`createdFrom`, `createdTo`, `hasDocuments`, `hasNotes`).
- Added UI redesign and consistency pass across landing, list, and detail pages using Material UI patterns.
- Added Guthub workflows for frontend test enforcement on push.

## Automated Tests
Automated tests were added for frontend functional behavior (Jest + Testing Library):
- `frontend/app/tests/submission-list-page.test.tsx`
- `frontend/app/tests/submission-page.test.tsx`

Run tests:
```bash
cd frontend
npm test
```

## Deppoyment
- Deployment link: []

