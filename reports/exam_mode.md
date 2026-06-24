# Exam Mode Implementation

## What's Done
- **Session Lifecycle**: The `exam.py` router implements a complete loop: `generate` -> `submit`. Exam sessions are managed via in-memory dictionaries.
- **PYQ Integration**: If a course has PYQ data, the exam generator will sample real past questions and mirror historical topic frequency, difficulty, and question style instead of relying purely on RAG documents.
- **LLM Grading**: The `submit` endpoint dynamically evaluates short and long subjective answers against expected answers using an LLM evaluator (`run_ask` with grading prompt).
- **Feedback Loop**: Exam results (correct/total by topic) are logged into `TopicStat`, feeding the "Readiness" metrics on the dashboard and adjusting future PYQ generation focus.

## What's Partial
- **Question Types**: Currently handles MCQ, True/False, Short Answer, and Long Answer. Support for complex types like drag-and-drop or code-execution is not implemented.
- **Partial Credit**: The LLM grader returns a strict boolean (`true` or `false`) for subjective answers. There is no partial credit logic implemented.

## What's Missing
- **Durable Sessions**: Since `_sessions` is an in-memory variable, if the server process restarts, all active exams in progress are permanently lost.
- **Proctoring/Timing Enforcement**: The backend trusts the `timeSpent` payload from the frontend upon submission; it does not explicitly validate timestamps to enforce strict exam time limits.
