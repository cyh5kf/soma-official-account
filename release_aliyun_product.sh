svn up
rm -rf tmp
npm run distaliyun
rsync -rave 'ssh -o ProxyCommand="/usr/bin/nc -X 5 -x 127.0.0.1:2333 %h %p" -p 58022 -i  /Users/zhangxiaojie/.ssh/id_rsa.pub' --progress  -r tmp/ zhangxiaojie@$(gethost aliserver011):/tmp/off-customer-frontend
