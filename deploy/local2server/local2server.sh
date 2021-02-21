#!/bin/bash
. ./setenv.sh

echo "Project path: $PROJECT_PATH"
ssh -p "$SSH_PORT" "$UPLOAD_SERVER" "mkdir -p $PROJECT_PATH"

echo 'Preparing data ...'
cp "$ROOT_PATH/ecosystem.config.js.dist" "$ROOT_PATH/ecosystem.config.js"
sed -i "s/nguyenthotuan.me/$PROJECT_NAME/g" "$ROOT_PATH/ecosystem.config.js"
echo 'Upload file'
rsync -avzp "$PWD/$ROOT_PATH" --exclude-from="./exclude.txt" --exclude .git/ --exclude-from="$ROOT_PATH/.gitignore" -e ssh "$UPLOAD_SERVER":"$PROJECT_PATH"

echo 'Restart server'
ssh -p "$SSH_PORT" "$UPLOAD_SERVER" "cd $UPLOAD_PATH/$PROJECT_NAME && npm install && pm2 restart ecosystem.config.js --env production"
echo '***** Completed ! *****'