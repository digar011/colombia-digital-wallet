# =============================================================================
# Makefile -- Mi Colombia Digital (colombia-digital-wallet)
# Standardized development commands per Codexium standards.
# Cross-platform compatible: macOS, Linux, Windows (git-bash).
# =============================================================================

.DEFAULT_GOAL := help

# All targets are phony (not file-based)
.PHONY: help dev build start clean install test test-coverage typecheck lint lint-fix ci e2e e2e-install e2e-ui e2e-headed

# -----------------------------------------------------------------------------
# Help
# -----------------------------------------------------------------------------

help: ## Show this help message
	@echo ""
	@echo "  Mi Colombia Digital -- Available Commands"
	@echo "  =========================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""

# -----------------------------------------------------------------------------
# Development
# -----------------------------------------------------------------------------

dev: ## Start development server (Next.js on port 3000)
	npm run dev

build: ## Production build (Next.js)
	npm run build

start: ## Start production server
	npm run start

install: ## Install project dependencies
	npm install

clean: ## Remove build artifacts and caches
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf playwright-report
	rm -rf test-results
	@echo "Cleaned: .next/, node_modules/.cache/, playwright-report/, test-results/"

# -----------------------------------------------------------------------------
# Code Quality
# -----------------------------------------------------------------------------

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	npx next lint --fix

typecheck: ## Run TypeScript type checking (no emit)
	npx tsc --noEmit

# -----------------------------------------------------------------------------
# Testing
# -----------------------------------------------------------------------------

test: ## Run unit tests (placeholder -- Jest not yet configured)
	@echo "Unit tests are not yet configured. Set up Jest to enable this target."
	@echo "Run 'make e2e' for Playwright end-to-end tests."

test-coverage: ## Run unit tests with coverage report (placeholder)
	@echo "Unit tests with coverage are not yet configured."
	@echo "Set up Jest with --coverage to enable this target."

e2e: ## Run Playwright E2E tests (all browser projects)
	npm run test:e2e

e2e-install: ## Install Playwright browsers (first-time setup)
	npx playwright install --with-deps

e2e-ui: ## Run Playwright tests with interactive UI
	npm run test:e2e:ui

e2e-headed: ## Run Playwright tests with visible browser
	npm run test:e2e:headed

# -----------------------------------------------------------------------------
# CI Pipeline
# Mirrors .github/workflows/ci.yml: lint -> build -> e2e
# -----------------------------------------------------------------------------

ci: lint typecheck build ## Full CI pipeline: lint, typecheck, build
	@echo ""
	@echo "CI pipeline passed: lint, typecheck, build"
	@echo "Run 'make e2e' separately to include Playwright tests."
