@echo off

rem Navigate to the backend directory
cd backend

rem Activate the virtual environment
call env\Scripts\activate

rem Navigate back to the root directory
cd ..

rem Navigate to the frontend directory
cd frontend

rem Start the frontend server
start npm start

rem Navigate back to the root directory
cd ..

rem Start the backend server
cd backend
python main.py
