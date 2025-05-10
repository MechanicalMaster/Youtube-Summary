#### Implementation Plan

1. **Create a Supabase Table for Summaries**  
   - Define a new `summaries` table in Supabase to store video summaries. The table should include fields for `id` (primary key), `user_id` (foreign key referencing the `users` table), `video_id`, `video_title`, `summary_data` (JSON to store the `StructuredSummary`), and `created_at` (timestamp).  
   - Ensure proper permissions (RLS policies) so users can only read their own summaries.  
   **Files Impacted**:  
   - None in the codebase (this is a database schema change in Supabase).  
   **Configuration/Database Migrations**:  
   - Create the `summaries` table in Supabase with the following schema:
     ```sql
     CREATE TABLE summaries (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       user_id UUID REFERENCES users(id),
       video_id TEXT NOT NULL,
       video_title TEXT NOT NULL,
       summary_data JSONB NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```
   - Enable Row Level Security (RLS) and add a policy:
     ```sql
     ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
     CREATE POLICY user_summaries ON summaries
       USING (user_id = auth.uid())
       FOR SELECT TO authenticated;
     ```

2. **Update the Summarize Action to Save Summaries**  
   - Modify the `summarizeYouTubeVideo` action in `actions/summarize-video.ts` to save the summary to the `summaries` table after generating it. This should happen after the summary is successfully generated and credits are deducted.  
   - Pass the `userId` (already available in the function) to associate the summary with the user.  
   **Files Impacted**:  
   - `actions/summarize-video.ts` (modify `generateSummaryForUser` function).  
   **Steps**:  
   - After the `structuredSummary` is generated and credits are updated, add a Supabase insert operation to save the summary data into the `summaries` table. Include the `user_id`, `video_id`, `video_title`, and `summary_data`.

3. **Create a History Page Route**  
   - Add a new route `/history` to display the history tab. Create a new file `app/history/page.tsx` to render the page.  
   - Use a layout similar to the screenshot: a grid of tiles with a thumbnail, title, description, and date.  
   **Files Impacted**:  
   - `app/history/page.tsx` (new file).  
   **Steps**:  
   - Create a new `page.tsx` file in `app/history/`.  
   - Use a grid layout (e.g., CSS Grid or Flexbox) to display tiles, styled similarly to the screenshot.  
   - Fetch summaries from Supabase (see next step) and map them to tiles.

4. **Fetch Summaries from Supabase**  
   - Create a new utility function in `lib/supabase.ts` to fetch summaries for the logged-in user. This function should query the `summaries` table, filter by `user_id`, and support pagination (e.g., using `limit` and `offset`).  
   - Use the `useAuth` hook in the history page to get the current user’s ID and pass it to the fetch function.  
   **Files Impacted**:  
   - `lib/supabase.ts` (add `fetchUserSummaries` function).  
   - `app/history/page.tsx` (use the fetch function).  
   **Steps**:  
   - In `lib/supabase.ts`, add a `fetchUserSummaries` function that takes `userId`, `page`, and `limit` as parameters and returns paginated summaries.  
   - In `app/history/page.tsx`, call this function to fetch summaries and render them.

5. **Create a Tile Component for Summaries**  
   - Create a new component `SummaryTile` in `components/ui/summary-tile.tsx` to render each summary as a tile. The tile should display the video title, a truncated summary, the creation date, and a thumbnail (fetched from YouTube using the video ID, e.g., `https://img.youtube.com/vi/[videoId]/mqdefault.jpg`).  
   - Use the `Card` component from `components/ui/card.tsx` as a base for styling.  
   **Files Impacted**:  
   - `components/ui/summary-tile.tsx` (new file).  
   - `app/history/page.tsx` (use the `SummaryTile` component).  
   **Steps**:  
   - Create `SummaryTile` with props for `videoId`, `videoTitle`, `summary`, and `createdAt`.  
   - Use the `Card` component to style the tile, with an image for the thumbnail, text for the title and summary, and a formatted date.

6. **Add Navigation to the History Tab**  
   - Add a navigation link to the `/history` route in the app’s layout. The codebase uses `app/layout.tsx` as the root layout, which wraps pages with `ThemeProvider` and `AuthProvider`. Add a navigation menu (e.g., using `components/ui/navigation-menu.tsx`) to include a link to the history tab.  
   **Files Impacted**:  
   - `app/layout.tsx` (add navigation menu).  
   - `components/ui/navigation-menu.tsx` (use existing component for navigation).  
   **Steps**:  
   - In `app/layout.tsx`, add a `NavigationMenu` component with links to existing routes (`/dashboard`, `/profile`, etc.) and the new `/history` route.  
   - Style the navigation menu to match the app’s theme (using Tailwind CSS classes from `app/globals.css`).

7. **Create a Detailed Summary Page**  
   - Add a new dynamic route `/summary/[id]` to display the full details of a summary when a tile is clicked. Create a new file `app/summary/[id]/page.tsx`.  
   - Reuse the `Accordion` component from `components/video-summarizer-form.tsx` to display the summary sections.  
   **Files Impacted**:  
   - `app/summary/[id]/page.tsx` (new file).  
   - `lib/supabase.ts` (add a function to fetch a single summary by ID).  
   **Steps**:  
   - In `lib/supabase.ts`, add a `fetchSummaryById` function to fetch a single summary by its `id`.  
   - In `app/summary/[id]/page.tsx`, fetch the summary using the ID from the route params and render it using the `Accordion` component for sections.

8. **Add Pagination to the History Page**  
   - Add pagination controls to the history page using the `Pagination` component from `components/ui/pagination.tsx`.  
   - Update the `fetchUserSummaries` function to handle pagination parameters (e.g., `page` and `limit`).  
   **Files Impacted**:  
   - `app/history/page.tsx` (add pagination controls).  
   - `components/ui/pagination.tsx` (use existing component).  
   **Steps**:  
   - In `app/history/page.tsx`, add state for the current page and use the `Pagination` component to render page controls.  
   - Update the fetch call to pass the current page and limit, and handle the response to update the UI.

---

#### Configuration/Database Migrations

- **Supabase Table Creation**: As mentioned in Step 1, create the `summaries` table and set up RLS policies. This is a manual step in the Supabase dashboard or via SQL.
- **Environment Variables**: Ensure the Supabase URL and key are correctly set in `next.config.mjs` (already present in the codebase).
- **No Additional Configuration**: No other configuration changes are needed, as the app already uses Supabase and Next.js routing.

---

#### Notes on Architecture and Conventions

- The plan follows the existing architecture: server actions (`actions/summarize-video.ts`) for backend logic, Supabase for data storage, and React components for the UI.
- Styling uses Tailwind CSS, consistent with `app/globals.css` and other components.
- The `useAuth` hook is used to ensure user-specific data access, following the pattern in `components/video-summarizer-form.tsx`.
- Pagination is implemented using the existing `Pagination` component to maintain consistency with the UI library.

Let me know if you’d like to adjust any assumptions or add more details!