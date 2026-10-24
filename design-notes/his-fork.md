# HIS fork workflow

## Remotes and branches

- `upstream`: https://github.com/tusen-ai/naive-ui.git
- `origin`: the personal fork (configure its URL before pushing).
- `main`: upstream mirror, tracking `upstream/main`. Keep custom changes off this branch.
- `production`: HIS customizations and validated upstream merges.

Keep upstream Git history so future updates can be merged. Preserve the package
name and public exports unless a customization explicitly requires changing them.

## Configure the personal fork

After creating a fork on GitHub, configure its actual URL:

```sh
git remote add origin <personal-fork-url>
```

When ready to publish the custom branch:

```sh
git push -u origin production
```

## Merge upstream updates

Start with a clean working tree. Commit intentional local changes or explicitly
stash them before switching branches.

```sh
git fetch upstream --prune
git switch main
git merge --ff-only upstream/main
git switch production
git merge --no-ff --no-commit main
```

If Git reports conflicts, resolve them while preserving the intended HIS behavior,
then stage only the resolved files. Review upstream release notes and changes to
dependencies, public APIs, themes, and locales.

Validate the merge before committing:

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run test
pnpm run build:package
git diff --check
git diff --cached --check
```

After validation, commit the merge, then verify upstream ancestry:

```sh
git commit -m "chore: merge upstream main into production"
git merge-base --is-ancestor upstream/main HEAD
```

Push `production` to `origin` when publication is intended. If upstream is already
merged, Git reports that it is up to date and no merge commit is needed. To cancel
an in-progress merge, use `git merge --abort`.

## Customization checks

Keep custom patches focused. Update relevant component tests, demos, types, theme
variables, and locales together when behavior changes. Run the affected component
tests first, followed by the broader checks required for the change.
