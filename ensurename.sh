boName="xxx"
if [ -z `grep $boName /root/.k5login` ];then
    echo $boName >> ttt
fi
