@echo off
echo ==================================================
echo Iniciando o Deploy - CNH Rapida (Sem Python)
echo ==================================================

echo.
echo [1/4] Adicionando alteracoes ao Git...
git add .

echo.
echo [2/4] Criando o commit...
set "msg="
set /p msg="Digite a mensagem do commit (ou aperte Enter para o padrao): "
if "%msg%"=="" set "msg=Atualizacao do site"
git commit -m "%msg%"

echo.
echo [3/4] Enviando para o GitHub...
git push origin main

echo.
echo ==================================================
echo [4/4] Conectando na VPS e atualizando o site...
echo ATENCAO: Se pedir a senha, digite: Kakasantos123@
echo ==================================================

ssh root@72.62.15.46 "cd Cnh_rapida && git pull origin main && docker compose up -d --build"

echo.
echo ==================================================
echo Deploy FINALIZADO com sucesso! 
echo ==================================================
pause
