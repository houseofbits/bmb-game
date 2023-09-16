#!/bin/bash
GREEN="\e[32m"
ENDCOLOR="\e[0m"

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Committing changes${ENDCOLOR}"
git add -A > /dev/null 2>&1
git commit -am"a" > /dev/null 2>&1

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Cleaning up /dist folder${ENDCOLOR}"
rm dist/* > /dev/null 2>&1
git add -A > /dev/null 2>&1
git commit -am"a" > /dev/null 2>&1

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Running npm build${ENDCOLOR}"
npm run prod > /dev/null 2>&1

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Cleaning up remote server${ENDCOLOR}"
ssh dizainsu@dizainsuninterjers.lv "rm bmb.dizainsuninterjers.lv/*" > /dev/null 2>&1

echo -e "${GREEN}--------------------------------------------------------${ENDCOLOR}"
echo -e "${GREEN}Copying files to remote server${ENDCOLOR}"
scp -r dist/* dizainsu@dizainsuninterjers.lv:bmb.dizainsuninterjers.lv/