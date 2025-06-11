@echo off
setlocal enabledelayedexpansion

for /f "usebackq tokens=1,2 delims==" %%A in ("../.env") do (
  set "key=%%A"
  set "val=%%B"
  if not "!key!"=="" (
    call supabase secrets set !key!="!val!"
  )
)
endlocal 