#!/bin/bash

echo "Compiling .js files..."
echo coco -bc *.co 
coco -bc *.co 

echo "Publishing to the npm registry..."
npm publish
