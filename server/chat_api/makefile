.PHONY: help install run format lint

help: # Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?# .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?# "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: # Install dependencies
	poetry install

run: # Run server
	poetry run uvicorn app.main:app --reload

format: # Format application code
	poetry run black .

lint: # Lint application code
	poetry run flake8 app
