# Homepage Auto-Sync

Double-click `Start Auto Sync.command`, or run `npm run sync:start` in this folder.
It runs in the background; the terminal window can be closed. Start it again after
restarting the computer. It requires Node.js, Git, and the existing GitHub SSH key.

After 30 seconds without edits, auto-sync:

1. Compiles the CV PDF if `Chenglin_Li_CV_Overleaf.tex` changed (requires latexmk).
2. Checks compilation and types in `.auto-sync/build`, separate from local preview.
3. Commits project changes and pushes `main` to the `pages` remote.
4. Lets the existing GitHub Actions workflow publish the website.

All non-ignored project files are included, including new files and deletions.
Files ignored by Git, such as dependencies, build output, local logs, and `.env`
files, are excluded. Existing unpublished commits are also pushed when started.
Changes made during a build wait for the next quiet period.

GitHub deployment takes additional time after the push. You can follow it at
https://github.com/li-chenglin/li-chenglin.github.io/actions.
The existing GitHub build also runs the full lint checks before deploying.

To pause before experimenting, double-click `Stop Auto Sync.command` or run
`npm run sync:stop`. This cannot cancel an update already sent to GitHub.
Run `npm run sync:status` to check whether the watcher is running.
The log is `.auto-sync/sync.log`.

If a build or network request fails, changes remain local and auto-sync retries
after 60 seconds. It never force-pushes, resets, or merges. If the public remote
has diverged, resolve that Git difference before it can publish successfully.
Only the `main` branch and the configured public `pages` remote are published.

The computer must be awake and online. Sleep pauses syncing; it resumes on wake.
Moving the project folder requires stopping and restarting auto-sync.
