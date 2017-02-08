svn up
rm -rf tmp
npm run dist
rsync -rave 'ssh -i /Users/zhangxiaojie/zhangxiaojie.pem' --progress  -r tmp/ ec2-user@alibjtest001:/tmp/off-customer-frontend
