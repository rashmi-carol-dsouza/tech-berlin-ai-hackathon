.PHONY: help dev-fe setup dev-mock

help: # Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?# .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?# "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: # Install dependencies
	cd web-app && npm install

dev-fe: # Start application servers
	cd web-app && npm run dev & cd web-app
	
dev-mock: # Start Mock API server
	cd web-app && npm run mock:api