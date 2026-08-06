<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 📌 Project Rules & Documentation Protocol

## Feature Documentation Protocol (`FEATURES_DOCUMENTATION.md`)
Whenever building a new feature or updating/modifying an existing feature in this repository:
1. You **MUST** update `FEATURES_DOCUMENTATION.md` in the workspace root.
2. Document:
   - **Why It Was Implemented** (Business Rationale & Problem Solved)
   - **How It Works** (Technical Implementation & Endpoints)
   - **Security & Data Safeguards**
3. Update the **Revision Log** table at the bottom of `FEATURES_DOCUMENTATION.md` with the date, description, modified components, and author.
