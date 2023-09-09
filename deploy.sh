#!/bin/bash
rm dist/*
git add -A
git commit -am"a"
npm run prod
scp -r dist/* dizainsu@dizainsuninterjers.lv:bmb.dizainsuninterjers.lv/