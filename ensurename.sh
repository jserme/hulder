boName="bo.hu@XIAONEI.OPI.COM"
if [ -z `grep $boName /root/.k5login` ];then
    echo $boName >> ttt
fi
