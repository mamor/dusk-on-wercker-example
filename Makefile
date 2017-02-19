ci-testing-all:
	docker-compose run --rm testing bash -i -c "gulp --gulpfile=/var/app/gulpfile.js ci:testing:all"
