#!/bin/bash
git add -A
git commit -am"a"
rm dist/*
git add -A
git commit -am"a"
npm run prod
ssh dizainsu@dizainsuninterjers.lv "rm bmb.dizainsuninterjers.lv/*"
scp -r dist/* dizainsu@dizainsuninterjers.lv:bmb.dizainsuninterjers.lv/