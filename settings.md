#### Feature Overview
We will add a settings subsection to the existing profile page (`/profile`) that allows users to manage their app settings. The settings will include:
- **Mode** (Dark/System/Light)
- **Default Action** (Open reader/Concise summary/Detailed summary)
- **Search Language** (for searching new knowledge cards)
- **Data Export** (export summaries as markdown)
- **Subscription** (renamed to "Upgrade to Plus")
- **Account** (Delete Account with confirmation dialog)
- **Feature Request**, **Report a Bug**, and **FAQ** (modals/forms within the app)

Settings will be stored in Supabase, and the UI will follow the app’s existing theme with mobile responsiveness. The "Translate Summaries" and "Recall Review Email" settings will be excluded. Deleting an account will remove all user data and summaries after confirmation.

#### Implementation Plan

1. **Create a `user_settings` Table in Supabase**  
   - Define a new table in Supabase to store user settings, including fields for `mode`, `default_action`, and `search_language`.  
   - Each user will have a single row in this table, linked to their `user_id`.  
   - **Files Impacted**: None (this is a database change).  
   - **Configuration/Database Migrations**:  
     - Create a `user_settings` table with the following schema:  
       - `id` (uuid, primary key)  
       - `user_id` (uuid, foreign key to `users.id`)  
       - `mode` (text, values: 'dark', 'system', 'light', default: 'system')  
       - `default_action` (text, values: 'open_reader', 'concise_summary', 'detailed_summary', default: 'concise_summary')  
       - `search_language` (text, default: 'English')  
       - `created_at` (timestamp)  
       - `updated_at` (timestamp)  
     - Add Row Level Security (RLS) policies to ensure users can only access their own settings.  
     - Create a trigger to initialize a `user_settings` row when a new user is created (similar to existing user creation logic in `lib/auth.ts`).

2. **Update Supabase Client to Handle User Settings**  
   - Add functions to `lib/supabase.ts` to fetch and update user settings.  
   - Include a function to initialize settings for a new user if they don’t exist.  
   - **Files Impacted**:  
     - `lib/supabase.ts`  
       - Add `fetchUserSettings(userId: string)` to retrieve settings.  
       - Add `updateUserSettings(userId: string, updates: Partial<UserSettings>)` to update settings.  
       - Add `initializeUserSettings(userId: string)` to create default settings for a user.  
   - **Configuration/Database Migrations**: None (already handled in Step 1).

3. **Modify Auth Provider to Include User Settings**  
   - Update the `AuthProvider` to fetch and store user settings alongside user data.  
   - Extend the `User` type to include settings, and update the context to provide settings and a method to update them.  
   - Call `initializeUserSettings` when a new user is created.  
   - **Files Impacted**:  
     - `components/auth-provider.tsx`  
       - Update `User` type to include `settings: { mode: string, default_action: string, search_language: string }`.  
       - Modify `AuthProvider` to fetch settings using `fetchUserSettings` during initialization and after sign-in.  
       - Add `updateUserSettings` method to the context to allow components to update settings.  
       - Call `initializeUserSettings` in `createUser` flow.  
     - `lib/auth.ts`  
       - Update `createUser` to call `initializeUserSettings` after user creation.

4. **Create a Settings Component**  
   - Create a new `Settings` component to render the settings UI, including Mode, Default Action, Search Language, Data Export, Subscription, Account, and modals for Feature Request, Report a Bug, and FAQ.  
   - Use existing UI components (e.g., `Select`, `Button`, `AlertDialog`) to match the app’s theme.  
   - Ensure mobile responsiveness using Tailwind CSS classes.  
   - **Files Impacted**:  
     - `components/settings.tsx` (new file)  
       - Create a `Settings` component that:  
         - Renders a dropdown for Mode using `Select` (options: Dark, System, Light).  
         - Renders a dropdown for Default Action (options: Open reader, Concise summary, Detailed summary).  
         - Renders a dropdown for Search Language (starting with English; can be extended later).  
         - Renders an "Export" button to download summaries as markdown.  
         - Renders an "Upgrade to Plus" button (link to `/upgrade`).  
         - Renders a "Delete Account" button with a confirmation dialog using `AlertDialog`.  
         - Renders buttons for Feature Request, Report a Bug, and FAQ, each opening a modal (`Dialog`) with a form.  
       - Use `useAuth` to access and update settings.  
       - Implement mobile responsiveness with Tailwind classes (e.g., `w-full`, `sm:w-auto`, `flex-col sm:flex-row`).

5. **Integrate Settings Component into Profile Page**  
   - Update the profile page to include the `Settings` component as a subsection.  
   - Add a heading or separator to distinguish the settings section.  
   - **Files Impacted**:  
     - `app/profile/page.tsx`  
       - Import and render the `Settings` component below the existing profile content.  
       - Add a heading like "Settings" using Tailwind styling (e.g., `text-2xl font-bold mb-6`).  
       - Wrap the settings section in a `div` with responsive styling (e.g., `max-w-3xl mx-auto`).

6. **Implement Data Export Functionality**  
   - Add a server action to export user summaries as a markdown file.  
   - Fetch summaries from the `summaries` table and format them as markdown.  
   - **Files Impacted**:  
     - `actions/export-summaries.ts` (new file)  
       - Create an `exportSummaries` server action that:  
         - Takes `userId` as input.  
         - Fetches summaries using `fetchUserSummaries` from `lib/supabase.ts`.  
         - Formats summaries into markdown (e.g., `# Video Title\n\n**Summary:** Overall summary\n\n**Sections:**\n- Section 1...`).  
         - Returns the markdown content as a downloadable file.  
     - `components/settings.tsx`  
       - Update the "Export" button to call the `exportSummaries` action and trigger a download.

7. **Implement Account Deletion with Confirmation**  
   - Add a server action to delete the user’s account, including their data and summaries.  
   - Update the `Settings` component to handle the deletion flow with a confirmation dialog.  
   - **Files Impacted**:  
     - `actions/delete-account.ts` (new file)  
       - Create a `deleteAccount` server action that:  
         - Takes `userId` as input.  
         - Deletes all summaries for the user from the `summaries` table using `supabaseAdmin`.  
         - Deletes the user’s settings from the `user_settings` table.  
         - Deletes the user from the `users` table.  
         - Deletes the user from Supabase Auth using `supabaseAdmin.auth.admin.deleteUser`.  
         - Signs the user out using `supabase.auth.signOut`.  
     - `components/settings.tsx`  
       - Add an `AlertDialog` for the "Delete Account" button to confirm deletion.  
       - Call the `deleteAccount` action on confirmation and redirect to `/login`.

8. **Implement Modals for Feature Request, Report a Bug, and FAQ**  
   - Add modal forms in the `Settings` component for Feature Request, Report a Bug, and FAQ.  
   - For simplicity, these forms can log submissions to the console (future iterations can integrate with a backend service).  
   - **Files Impacted**:  
     - `components/settings.tsx`  
       - Add `Dialog` components for each of the three options.  
       - Include a simple form in each modal (e.g., textarea for Feature Request/Report a Bug, static content for FAQ).  
       - Log form submissions to the console for now.

#### Additional Notes
- **Mobile Responsiveness**: The `Settings` component will use Tailwind’s responsive classes to ensure a mobile-friendly layout (e.g., stack elements vertically on mobile, use full-width buttons).  
- **UI Theme**: The component will follow the app’s existing theme by using Radix UI components (`Select`, `Button`, `Dialog`) and Tailwind styles consistent with `app/globals.css`.  
- **Settings Impact**:  
  - **Mode**: Will toggle the app’s theme using `next-themes` (already integrated via `ThemeProvider` in `app/layout.tsx`).  
  - **Default Action**: Will determine the default view for summaries (future implementation can use this setting in `app/(dashboard)/history/page.tsx`).  
  - **Search Language**: Will set the language for searches (future implementation can use this in search functionality).  
