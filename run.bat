@echo off

:: Comment

:: Kyle Sherman
:: Updated 12/14/2018

:: Runs node.js script that clears all messages in a channel of Slack


echo Cleaning up the Random Channel...
echo.
node cleanRandom.js
cls

echo Cleaning up the General Channel...
echo.
node cleanGeneral.js
echo.

cls
echo Messages have been cleared
echo.
pause