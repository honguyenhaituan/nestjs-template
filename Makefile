PROTO_GEN_PATH = node/libs/microservice/src/proto

PROTOC_VERSION = 21.7
PROTOC_LINUX_ZIP = protoc-$(PROTOC_VERSION)-linux-x86_64.zip
PROTOC_OSX_ZIP = protoc-$(PROTOC_VERSION)-osx-x86_64.zip

install-protoc-linux:
	curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v$(PROTOC_VERSION)/$(PROTOC_LINUX_ZIP)
	sudo unzip -o $(PROTOC_LINUX_ZIP) -d /usr/local bin/protoc
	sudo unzip -o $(PROTOC_LINUX_ZIP) -d /usr/local 'include/*'
	sudo chmod -R o+rx /usr/local/include/google
	rm -f $(PROTOC_LINUX_ZIP)

install-protoc-osx:
	curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v$(PROTOC_VERSION)/$(PROTOC_OSX_ZIP)
	sudo unzip -o $(PROTOC_OSX_ZIP) -d /usr/local bin/protoc
	sudo unzip -o $(PROTOC_OSX_ZIP) -d /usr/local 'include/*'
	sudo chmod -R o+rx /usr/local/include/google
	rm -f $(PROTOC_OSX_ZIP)

install-dependencies:
	npm install

init-network:
	docker network inspect zps_network >/dev/null 2>&1 || \
        docker network create --driver bridge zps_network
remove-network:
	docker network rm zps_network || true

# start one service, ex: make start service=bff
start: init-network
	docker-compose --env-file .env.docker start $(service)

# stop one service, ex: make stop service=bff
stop:
	docker-compose --env-file .env.infra stop $(service)

# restart one service, ex: make restart service=bff
restart:
	docker-compose --env-file .env.infra restart $(service)

# start all infrastructures (mongodb, redis, kafka).
start-infra: init-network
	sh scripts/start-infra.sh

# stop all infrastructures
stop-infra:
	docker-compose --env-file .env.infra -f docker-compose.infra.yml down

# start all apps
start-apps: init-network
	docker-compose up -d

# stop all apps
stop-apps:
	docker-compose down -t 60

# start single service inside docker, eg  make start-service service=elasticsearch
start-service: init-network
	docker-compose up -d $(service)

# stop single service, eg  make start-service service=elasticsearch
stop-service:
	docker-compose stop $(service)

# start all components, including infra (mongodb, redis, kafka) & services.
start-local: init-network start-infra start-apps

# stop all components, including infra and services.
stop-local: stop-apps stop-infra remove-network

# start infrastructure, eg  make start-infra-component service=elasticsearch
start-infra-component: init-network
	docker-compose -f docker-compose.infra.yml --env-file .env.infra up -d $(service)

prepare-proto-dir:
	rm -rf $(PROTO_GEN_PATH) || true
	mkdir -p $(PROTO_GEN_PATH)

gen-proto: prepare-proto-dir
	env PROTO_TS_GEN_PATH=$(PROTO_GEN_PATH) sh scripts/gen-proto-ts.sh
