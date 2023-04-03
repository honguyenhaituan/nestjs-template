#!/bin/bash
PROTO_ROOT=./proto

# Path to this plugin, Note this must be an absolute path on Windows (see #15)
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts_proto"

protoc \
  --plugin="${PROTOC_GEN_TS_PATH}" \
  --ts_proto_out=${PROTO_TS_GEN_PATH} \
  --ts_proto_opt=env=node \
  --ts_proto_opt=outputEncodeMethods=true \
  --ts_proto_opt=outputPartialMethods=true \
  --ts_proto_opt=outputJsonMethods=true \
  --ts_proto_opt=nestJs=true \
  --ts_proto_opt=addGrpcMetadata=true \
  --ts_proto_opt=unrecognizedEnum=false \
  --ts_proto_opt=forceLong=string \
  --ts_proto_opt=useOptionals=messages \
  --ts_proto_opt=esModuleInterop=true \
  --proto_path=${PROTO_ROOT} \
  $(find ${PROTO_ROOT} -name "*.proto")

./node_modules/.bin/prettier --config ./.prettierrc --write ${PROTO_TS_GEN_PATH}
