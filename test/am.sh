let counter=0
for variable in {1..5}:
do 
  top -bn 1 >> test.txt
  echo $counter
  counter=$((counter+1))
  sleep 1s
done 
kill 
