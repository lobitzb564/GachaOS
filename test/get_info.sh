let counter=0
  top -bn 1 > test.txt
  echo $counter
  counter=$((counter+1))
  sensors -f | grep temp1 > temperature.txt
  sleep 1s
kill
