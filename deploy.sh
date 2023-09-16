#!/bin/bash
GREEN="\e[32m"
ENDCOLOR="\e[0m"

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Committing changes${ENDCOLOR}"
git add -A
git commit -am"a"

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Cleaning up /dist folder${ENDCOLOR}"
rm dist/*
git add -A
git commit -am"a"

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Running npm build${ENDCOLOR}"
npm run prod

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Cleaning up remote server${ENDCOLOR}"
ssh dizainsu@dizainsuninterjers.lv "rm bmb.dizainsuninterjers.lv/*"

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Copying files to remote server${ENDCOLOR}"
scp -r dist/* dizainsu@dizainsuninterjers.lv:bmb.dizainsuninterjers.lv/