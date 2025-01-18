.PHONY: dev-fe setup

help: # Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?# .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?# "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: # Install dependencies
	cd frontend && npm install

dev-fe: # Start application servers
	cd frontend && npm run dev & cd frontend && npm run mock:api