SHELL = bash

docs-release:
	@$(SHELL) $(CURDIR)/scripts/docs-release.sh "$(VERSION)"

.PHONY: docs-release
