
# WIP
MODULE_NAME=$1
MODULE_DIR= ./src/modules/$MODULE_NAME
mkdir $MODULE_DIR
touch ${MODULE_DIR}/index.ts
echo "export namespace $MODULE_NAME {}" > ${MODULE_DIR}/index.ts
echo "export * from ./$MODULE_NAME" > /index.ts
