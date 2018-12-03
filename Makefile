install:
	cd frontend/ && \
	npm install && \
	npm run build && \
	cp -r build/static ../backend && \
	cp build/index.html ../backend/templates/index.html && \
	cd ../ && \
	cd backend/ && \
	(test -d venv || $(PYTHON) -m venv venv) && \
	. venv/bin/activate && \
	pip3 install -Ur requirements.txt && \
	python manage.py migrate && \
	python manage.py loaddata sample_data && \
	python manage.py runserver 0.0.0.0:8000