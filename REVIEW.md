# Code Review

Here are my notes from reviewing the backend and the frontend. I grouped the issues by category and, for each one, wrote what the problem is, why it matters, and how I'd fix it.

---

## Backend Review

### Bugs

#### 1. Activity module uses blocking file operations

**Problem:** The activity service uses `fs.readFileSync()` and `fs.writeFileSync()`.

**Why it matters:** Sync calls block the Node.js event loop. If a few users hit the activity endpoint together, the whole server waits on file I/O.

**Fix:** Use the async `jsonStore` helper that the tasks module already uses (it's built on `fs.promises`).

---

#### 2. Activity controller has no error handling

**Problem:** `get_activity` and `addActivity` don't catch errors.

**Why it matters:** A permission problem or a broken JSON file can crash the request or the whole app.

**Fix:** Wrap both functions with the `asyncHandler` middleware.

---

#### 3. Duplicate functions in activity service

**Problem:** `loadDataA()` and `loadDataB()` do the same thing: read `activity.json`.

**Why it matters:** If the loading logic changes, someone has to remember to update both.

**Fix:** Delete one and keep a single `loadActivityData()`.

---

#### 4. No validation in activity service

**Problem:** `createNewActivity` saves whatever data it receives.

**Why it matters:** Empty objects or missing fields get stored, and this can break the frontend later.

**Fix:** Check that required fields exist and have the correct types before saving.

---

#### 5. Timestamp-based IDs can collide

**Problem:** IDs are created with `String(Date.now())`.

**Why it matters:** Two requests in the same millisecond get the same ID, so IDs are not guaranteed to be unique.

**Fix:** Use `createId()` from `utils/id.js`, which generates UUIDs.

---

### Performance

#### 1. Every activity request reads and writes the whole file

**Problem:** Each fetch or create loads the full JSON file into memory.

**Why it matters:** With 10,000 logs, every request parses all 10,000 records. It gets slower as the data grows.

**Fix:** Add a simple in-memory cache that syncs to disk from time to time. Or accept it, since the task says to use JSON files only.

---

#### 2. Finding one task loads all tasks

**Problem:** `getTaskById` reads the whole `tasks.json` just to find one item.

**Why it matters:** It's O(n), so it slows down as tasks grow.

**Fix:** Fine for a JSON-file setup. If it becomes a problem, keep an in-memory `Map` for O(1) lookups.

---

#### 3. No pagination

**Problem:** `/tasks` and `/activity` return every record at once.

**Why it matters:** With 50,000 tasks the response is huge, and the frontend has to handle all of it.

**Fix:** Add pagination with query params like `?page=1&limit=50`.

---

### Security

#### 1. No rate limiting

**Problem:** Nothing limits how many requests a client can send.

**Why it matters:** Someone can easily overload the server (DoS).

**Fix:** Add `express-rate-limit` or similar.

---

#### 2. No input sanitization

**Problem:** Titles and activity data accept any string, even `<script>alert('xss')</script>`.

**Why it matters:** If this data is ever rendered as HTML without escaping, it becomes an XSS hole. Storing unsanitized data is risky even if the frontend escapes it today.

**Fix:** Strip or escape HTML tags and set max lengths for strings.

---

#### 3. Missing CORS configuration

**Problem:** The API doesn't set any CORS headers.

**Why it matters:** It works on localhost, but in production the browser will block requests from a frontend on another domain.

**Fix:** Add the `cors` middleware and allow only our frontend domain.

---

#### 4. No request size limit

**Problem:** `express.json()` has no size limit set.

**Why it matters:** Someone could send a huge payload and use up the server's memory.

**Fix:** Set a limit, for example `express.json({ limit: '10mb' })`.

---

#### 5. Error details may leak in production

**Problem:** The error handler logs full stack traces.

**Why it matters:** If someone can read the production logs, they can see file paths and details about our server structure.

**Fix:** Log full errors only in development. In production, use generic messages and send detailed logs to a secure logging service.

---

### Maintainability

#### 1. Bad naming in activity module

**Problem:** Names like `aSvc`, `c`, `fp`, `x`, `b`, `one` and `get_activity` are unclear and inconsistent.

**Why it matters:** It takes longer to understand the code, especially for new developers.

**Fix:** Use clear names like the tasks module does: `activityService`, `activityController`, `filePath`, `activities`, `body`, `newActivity`.

---

#### 2. Validation is scattered

**Problem:** Validation code is repeated in controllers and services, and each module does it a bit differently.

**Why it matters:** Changing a rule means searching many files, and it's easy to miss one.

**Fix:** Use a validation library like Joi or Zod and define each schema once.

---

#### 3. Inconsistent error handling

**Problem:** Tasks uses `asyncHandler` and `HttpError`. Activity uses neither.

**Why it matters:** Each module returns a different error shape, so the frontend can't rely on one format.

**Fix:** Use the same error handling in all modules.

---

#### 4. Activity service doesn't use jsonStore

**Problem:** It does raw file operations instead of using `jsonStore`.

**Why it matters:** If we move to Redis or a database later, we'd have to rewrite the activity service. Tasks would be much easier to migrate.

**Fix:** Use `readJsonArray` and `writeJsonArray` from `jsonStore`.

---

#### 5. No documentation comments

**Problem:** There are no JSDoc comments on the functions.

**Why it matters:** You have to read the whole implementation to know what a function takes and returns.

**Fix:** Add JSDoc to exported functions, with params and return types.

---

### Code Quality

#### 1. Inconsistent module structure

**Problem:** Tasks has clean separation between routes, controllers and services. Activity has the same layers but mixes their responsibilities.

**Why it matters:** Two different patterns make the codebase harder to navigate.

**Fix:** Refactor activity to follow the tasks structure.

---

#### 2. Magic strings

**Problem:** File paths, status values and other strings are hardcoded in many places.

**Why it matters:** Typos cause bugs, and changing a value means editing many files.

**Fix:** Move them to a constants file and import them.

---

#### 3. No type checking

**Problem:** The project is plain JavaScript, with no JSDoc types or TypeScript.

**Why it matters:** Type mistakes only show up at runtime.

**Fix:** Add JSDoc types, or move to TypeScript.

---

#### 4. Validation duplicated in controllers and services

**Problem:** Both layers check the same things, like whether `title` is a string.

**Why it matters:** It's repeated work and harder to maintain.

**Fix:** Validate once, ideally at the controller level or in a separate validation layer.

---

#### 5. No structured logging

**Problem:** The app only uses `console.error()`, and only for 500 errors.

**Why it matters:** When something breaks in production, we don't have enough information to trace it.

**Fix:** Use Winston or Pino and log request IDs, timings and important events.

---

## Frontend Review

### Bugs

#### 1. Activity page filters the same data twice

**Problem:** `applyFilterA` and `applyFilterB` are identical, and both run one after the other on the same data.

**Why it matters:** It wastes CPU and confuses anyone reading the code.

**Fix:** Delete one and filter only once.

---

#### 2. Two identical time formatting functions

**Problem:** `formatTimeA` and `formatTimeB` do the same thing, and both are used, so each activity item shows the timestamp twice.

**Why it matters:** Users see a duplicated time, and the code is cluttered.

**Fix:** Keep one function and show the time once per item.

---

#### 3. Pointless tick effect causes constant re-renders

**Problem:** A `setInterval` increases a counter every 1.4 seconds and triggers several `useEffect` hooks.

**Why it matters:** The component re-renders all the time for no visible reason. This wastes CPU and battery on mobile.

**Fix:** Remove the tick effect.

---

#### 4. `forcedList` state has no purpose

**Problem:** `forcedList` makes shallow copies of `shownActivity` depending on whether the tick counter is odd or even.

**Why it matters:** It causes extra re-renders and uses more memory for nothing.

**Fix:** Remove it and render `shownActivity` directly.

---

#### 5. Inconsistent API response shapes

**Problem:** The tasks API returns `{ data: [...] }`, but the activity API returns a bare array.

**Why it matters:** The frontend has to remember which API uses which format.

**Fix:** Make the activity route return `{ data: activities }`.

---

### Performance

#### 1. Too many cascading `useEffect` hooks

**Problem:** Several effects depend on each other, so one state change triggers another effect, then another state change, and so on.

**Why it matters:** The component renders many more times than needed, and the tick effect makes it worse.

**Fix:** Use one `useEffect` for fetching and `useMemo` to get the filtered list from the data and search query.

---

#### 2. No debounce on search

**Problem:** The filter runs on every keystroke.

**Why it matters:** With thousands of logs, typing can feel laggy.

**Fix:** Add a debounce of about 300ms.

---

#### 3. Data is fetched on the client

**Problem:** The activity page is a client component and fetches in `useEffect`, so the request only starts after the JavaScript loads.

**Why it matters:** Users see a loading state first, and we don't use Next.js server rendering.

**Fix:** Fetch the data in a server component.

---

### UX Issues

#### 1. No success feedback when updating tasks

**Problem:** When you toggle a task, the button only shows "Saving...".

**Why it matters:** Users can't tell if it worked and may click again.

**Fix:** Show a toast or a short success message.

---

#### 2. Search input has no clear button

**Problem:** You have to delete the text by hand.

**Why it matters:** It's annoying, especially on mobile.

**Fix:** Add an X button inside the input when it has text.

---

#### 3. Unclear empty states

**Problem:** "No tasks match this filter" shows both when there are no tasks at all and when the filter just has no results.

**Why it matters:** Users can't tell if the data is empty or the filter is too strict.

**Fix:** Show "No tasks yet" when empty and "No tasks match this filter" when filtered.

---

#### 4. Errors don't auto-dismiss or retry

**Problem:** An error stays on screen until the user clicks retry.

**Why it matters:** A short network problem forces the user to act manually.

**Fix:** Retry automatically after a few seconds, or add a dismiss button.

---

#### 5. No loading indicator when filtering

**Problem:** Filter results change instantly, with no loading state.

**Why it matters:** With large data, a delay can make the UI feel frozen.

**Fix:** Show a skeleton or spinner while filtering large datasets.

---

### React Best Practices

#### 1. Activity page should be a server component

**Problem:** It has `"use client"` at the top, even though most of it could render on the server.

**Why it matters:** We lose faster loads, better SEO and a smaller JavaScript bundle.

**Fix:** Fetch on the server and pass the data as props. Keep only the interactive parts, like the search input, as client components.

---

#### 2. `useTasks` does too much

**Problem:** One hook handles fetching, local state, filtering and updating.

**Why it matters:** It's hard to test and reuse. A page that only needs filtering still gets everything.

**Fix:** Split it into smaller hooks like `useFetchTasks` and `useTaskFilters`.

---

#### 3. No error boundaries

**Problem:** A rendering error crashes the whole app and shows a blank page.

**Why it matters:** One small bug breaks everything, and the user sees no message.

**Fix:** Add error boundaries around the main sections with a fallback UI.

---

#### 4. Inline styles everywhere

**Problem:** Components use `style={{ ... }}` for everything.

**Why it matters:** It's verbose, hard to theme or share, and doesn't support pseudo-classes or media queries.

**Fix:** Use CSS modules or Tailwind CSS.

---

#### 5. Missing component optimization

**Problem:** `TaskItem` re-renders whenever the list updates, even if its own task didn't change.

**Why it matters:** In long lists this causes unnecessary renders.

**Fix:** Wrap `TaskItem` in `React.memo`.

---

#### 6. API routes are unnecessary proxies

**Problem:** `/api/tasks` and `/api/activity` only forward requests to the backend.

**Why it matters:** They add an extra network hop and more latency without any benefit.

**Fix:** Add real logic to them (caching, auth, data transformation), or call the backend directly from server components.

---

### Code Quality

#### 1. TypeScript strict mode is probably off

**Problem:** From how the types are used, `strict` likely isn't enabled in `tsconfig.json`.

**Why it matters:** We miss checks for null/undefined and implicit `any`.

**Fix:** Set `"strict": true` and fix the errors that appear.

---

#### 2. No runtime validation of API responses

**Problem:** TypeScript types only exist at compile time, so API data isn't checked at runtime.

**Why it matters:** Unexpected data from the API can cause runtime errors, even though TypeScript says everything is fine.

**Fix:** Use Zod or io-ts to validate responses.

---

#### 3. Inconsistent null/undefined handling

**Problem:** The code mixes `|| ""`, `|| []`, `?.` and `item.field || "(no field)"`.

**Why it matters:** It's harder to read and maintain.

**Fix:** Pick one style, preferably optional chaining, and use it everywhere.

---

#### 4. No test files

**Problem:** I couldn't find any tests in the project, backend or frontend.

**Why it matters:** Refactoring is risky without tests, because we can't tell if something broke.

**Fix:** Added backend unit tests with Node's built-in test runner (`node:test`, no new dependencies). Frontend tests with React Testing Library are a next step.