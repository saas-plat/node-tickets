@ECHO off >nul
SET CUR_DIR=%~dp0
SET NODE_PATH=%CUR_DIR:~0,-1%
SET NODE_LAUNCH_SCRIPT=server.js
SET NODE_ENV=development
SET NODE_CLUSTERED=0
SET NODE_SERVE_STATIC=1
SET NODE_HOT_RELOAD=1
SET NODE_LOGGER_GRANULARLEVELS=1
SET TZ=UTC
SET NODE_CONFIG_DISABLE_FILE_WATCH=Y
SET NODE_LOGGER_LEVEL=notice
SET NODE_LOGGER_GRANULARLEVELS=0
SET NODE_LOGGER_PLUGIN=util
SET NODE_CONFIG_DIR="%NODE_PATH%\config"
SET NODE_LOG_DIR="%NODE_PATH%\logs"
REM create config dir and log files
mkdir %NODE_CONFIG_DIR% >nul 2>nul
mkdir %NODE_LOG_DIR% >nul 2>nul
IF NOT EXIST "%NODE_LOG_DIR%\forever.log" ECHO. 2>"%NODE_LOG_DIR%\forever.log"
IF NOT EXIST "%NODE_LOG_DIR%\out.log" ECHO. 2>"%NODE_LOG_DIR%\out.log"
IF NOT EXIST "%NODE_LOG_DIR%\err.log" ECHO. 2>"%NODE_LOG_DIR%\err.log"
REM ensure supervisor is installed
call supervisor -h >nul 2>nul
IF %errorlevel%==9009 ECHO ERROR: Please install supervisor with: "npm install supervisor -g"
REM ensure forever is installed
call forever -h >nul 2>nul
IF %errorlevel%==9009 ECHO ERROR: Please install forever with: "npm install forever -g"
REM stop forever
CALL forever stop %NODE_LAUNCH_SCRIPT% >nul 2>nul
REM Now that we know there is no old version running, let's start the processes
IF %NODE_HOT_RELOAD%==0 (
	SET NCMD=forever start
    SET NCMD=%NCMD% -a
    SET NCMD=%NCMD% -l %NODE_LOG_DIR%\forever.log
    SET NCMD=%NCMD% -o %NODE_LOG_DIR%\out.log
    SET NCMD=%NCMD% -e %NODE_LOG_DIR%\err.log
) ELSE (
	SET NCMD=supervisor -n exit -w .\core,.\views,%NODE_CONFIG_DIR%,%NODE_LAUNCH_SCRIPT%
)
SET NCMD=%NCMD% %NODE_LAUNCH_SCRIPT%
IF %NODE_HOT_RELOAD%==0 (
	ECHO "--------------- NOTE: --------------"
    ECHO "You can stop the application by running (in this folder):"
    ECHO "  > forever stop $NODE_LAUNCH_SCRIPT"
    ECHO "You can see all Forever-running node apps by issuing:"
    ECHO "  > forever list"
    ECHO "See more about Forever at: https://github.com/indexzero/forever"
    ECHO "------------------------------------"
)
CALL %NCMD%