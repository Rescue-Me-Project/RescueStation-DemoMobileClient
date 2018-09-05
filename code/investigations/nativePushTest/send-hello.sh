#!/bin/bash

if (($# == 4)); then

	curl_url="https://fcm.googleapis.com/fcm/send"

	payload="{\"to\":\"$2\",\"notification\":{\"title\":\"$3\",\"text\":\"$4\",\"sound\":\"default\",\"badge\":\"0\"},\"priority\":\"high\"}"

	curl -d $payload -H "Content-Type: application/json;" -H "Authorization: key=$1" $curl_url

	echo

else 

	echo "Usage: $0 Server_Key Device_App_Token Title Message"

fi

# curl -d '{"to":"f4uzSDYl_WI:APA91bGAztc-aHXGcZPgae6F3f47Sy891TbejJjcyD3RnUIsSPoYHp1RSpJmKoRLrh-8m-4kOZZaZALPEZ1F5yAQLz66EwHmoXUhkg-YdRCZVPqGYvvmo1tZhPHeCPHn4mmM6Ftuj_Cb","notification":{"title":"This' is a 'title","text":"This' is not a 'title.","sound":"default","badge":"0"},"priority":"high"}' -H 'Content-Type: application/json;' -H 'Authorization: key=AAAA2MBUecI:APA91bG4FOVHW4VDmlWud27Xh6hK5bGxcdfIl1cfGRETw-M24ElT1VvglHn3z3TSKUiGwzOquhDhE_1kgZHiBKFRF4SdH2bfKhU60OcRz8_yGAag6AJBqt4QSlkBRYInZhB7QksDKHa8' https://fcm.googleapis.com/fcm/send