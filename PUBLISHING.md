# Publishing POEM to NPM

This document describes the process for publishing `poem-os` to NPM.

## Prerequisites

### Initial NPM Account Setup

1. Create an NPM account at https://www.npmjs.com/signup (if you don't have one)
2. Verify your email address
3. Enable two-factor authentication (2FA) for security
4. Login to NPM from command line:
   ```bash
   npm login
   ```
5. Verify login:
   ```bash
   npm whoami
   ```

## Version Strategy

POEM follows [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

- **MAJOR** (1.0.0): Breaking changes or major milestones
- **MINOR** (0.1.0): New features, epic completions
- **PATCH** (0.1.1): Bug fixes, minor improvements

**Current Version**: `0.1.0` (pre-stable release)

**Version Guidelines**:
- `0.x.x` indicates pre-stable releases
- Increment MINOR for new epics or features
- Increment PATCH for bug fixes
- Bump to `1.0.0` when production-ready (after Epic 5+)

### Updating Version

Update version in `package.json`:
```bash
# For bug fixes
npm version patch

# For new features (epic completion)
npm version minor

# For breaking changes
npm version major
```

This automatically:
- Updates `package.json` version
- Creates a git commit
- Creates a git tag

## Pre-Publish Checklist

Before publishing, ensure all quality checks pass:

### 1. Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Fix any issues found
```

### 2. Tests

```bash
# Run all tests
npm run test

# Run unit tests specifically
npm run test:unit
```

All tests must pass before publishing.

### 3. Build Packages

```bash
# Build all workspace packages
npm run build
```

Ensure build completes without errors.

### 4. Secret Detection

```bash
# If secretlint is configured
npm run secretlint
```

Ensure no secrets or credentials are accidentally included.

### 5. Review Files for Publishing

Check what will be published:
```bash
npm pack --dry-run
```

Verify the output includes only intended files:
- `bin/`
- `packages/`
- `README.md`
- `LICENSE`
- `package.json`

### 6. Local Installation Test

Test package locally before publishing:

```bash
# Create local tarball
npm pack

# This creates: poem-os-0.1.0.tgz
# Install it in a test directory
mkdir /tmp/test-poem
cd /tmp/test-poem
npm install /path/to/poem-os-0.1.0.tgz

# Test the installer
npx poem-os install
```

Clean up after testing:
```bash
rm poem-os-0.1.0.tgz
```

## Publishing to NPM

### Manual Publishing (Current Phase)

Once all pre-publish checks pass:

```bash
# Ensure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Publish to NPM
npm publish
```

**Important**: The `npm publish` command:
- Reads version from `package.json`
- Uses `files` array to determine what to include
- Uploads package to NPM registry
- Makes package available via `npx poem-os`

### Post-Publish Verification

1. **Verify package is live**:
   ```bash
   npm view poem-os
   ```

2. **Test installation from NPM**:
   ```bash
   mkdir /tmp/verify-npm-install
   cd /tmp/verify-npm-install
   npx poem-os@latest install
   ```

3. **Verify all installation modes**:
   ```bash
   # Full install
   npx poem-os install

   # Core only
   npx poem-os install --core

   # App only
   npx poem-os install --app
   ```

4. **Check NPM package page**:
   - Visit https://www.npmjs.com/package/poem-os
   - Verify README displays correctly
   - Check that repository/bugs/homepage links work

## Rollback Instructions

If a published version has critical issues:

### Deprecate a Version

```bash
# Deprecate specific version
npm deprecate poem-os@0.1.0 "Critical bug - use 0.1.1 instead"
```

This doesn't remove the package, but warns users not to install it.

### Unpublish (Use with Caution)

**WARNING**: Unpublishing is irreversible and should be avoided.

```bash
# Unpublish specific version (only within 72 hours of publish)
npm unpublish poem-os@0.1.0

# Force unpublish (not recommended)
npm unpublish poem-os@0.1.0 --force
```

**NPM Policy**: You can only unpublish versions within 72 hours of publication. After that, you must deprecate instead.

### Publishing a Fix

If you need to rollback functionality:

1. Revert the problematic changes in git
2. Increment version (patch or minor)
3. Run pre-publish checklist
4. Publish new version
5. Deprecate the broken version

```bash
# Fix the code
git revert <bad-commit-hash>

# Bump version
npm version patch

# Publish fixed version
npm publish

# Deprecate broken version
npm deprecate poem-os@0.1.0 "Use 0.1.1 - fixes XYZ issue"
```

## Automated Publishing (Future Phase)

A GitHub Actions workflow template has been created at `.github/workflows/publish.yaml` for future use.

**Current Status**: Template created but not active (deferred to Epic 3 CI/CD phase)

**Workflow Features**:
- Manual trigger via GitHub Actions UI (`workflow_dispatch`)
- Automated trigger on git tags (`v*` pattern) - commented out for now
- Steps: Checkout → Setup Node → Install → Lint → Test → Build → Publish
- Creates GitHub releases automatically
- Uses NPM provenance for enhanced security

**To Activate**:
1. Generate NPM access token (Automation type) at https://www.npmjs.com/settings/<username>/tokens
2. Add `NPM_TOKEN` to GitHub repository secrets (Settings → Secrets and variables → Actions)
3. Test workflow using manual dispatch
4. Uncomment tag-based triggers when ready for full automation

**Manual Trigger Usage**:
1. Go to GitHub Actions tab in repository
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Enter version number (e.g., 0.1.0)
5. Click "Run workflow" button

See `.github/workflows/publish.yaml` for complete workflow configuration.

## Troubleshooting

### "You must be logged in to publish packages"

```bash
npm login
npm whoami  # Verify login
```

### "You do not have permission to publish"

- Ensure you're logged in with correct account
- Verify account has publishing rights
- Check package name isn't already taken (unlikely for scoped packages)

### "Version already published"

- Increment version: `npm version patch`
- Cannot republish same version number

### "Package contains blocked/sensitive content"

- Run `npm pack --dry-run` to review files
- Check `.npmignore` or `files` array in `package.json`
- Ensure `docs/`, `data/`, `.github/` are excluded

## Best Practices

1. **Always test locally before publishing** (`npm pack` and local install)
2. **Run full test suite** before every publish
3. **Keep CHANGELOG.md updated** with version changes
4. **Tag releases in git** matching NPM version
5. **Announce releases** in project communication channels
6. **Monitor NPM package page** for issues after publishing
7. **Respond quickly** to critical bugs (publish patches)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | TBD | Initial release - Epic 1 complete |

---

**Last Updated**: 2026-01-13
