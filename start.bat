@echo off
echo Starting To-Do Application...

:: Start Backend
start cmd /k "cd backend && python -m pip install -r requirements.txt && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Start Frontend
start cmd /k "cd frontend && npm install && npm run dev"

echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:3000
echo.
echo Login to Momentum and start shipping focused work!
